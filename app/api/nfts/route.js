import { ethers } from 'ethers';
import { NFT_CONTRACT_ADDRESS, NFT_ABI, MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from '../../utils/walletUtils';
import connectToDatabase from '../../lib/mongodb';
import NFT from '../../models/NFT';
import Collection from '../../models/Collection';

// Function to create a provider based on environment
const getProvider = () => {
  // Use environment variables to determine RPC URL
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
  return new ethers.providers.JsonRpcProvider(rpcUrl);
};

// Function to fetch NFT metadata from URI
async function fetchMetadata(tokenURI) {
  try {
    // Handle base64 encoded JSON
    if (tokenURI.startsWith('data:application/json;base64,')) {
      const base64Data = tokenURI.split(',')[1];
      const jsonString = Buffer.from(base64Data, 'base64').toString();
      return JSON.parse(jsonString);
    }
    
    // Handle IPFS URIs
    if (tokenURI.startsWith('ipfs://')) {
      tokenURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    
    const response = await fetch(tokenURI);
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return { name: 'Unknown NFT', description: 'Metadata unavailable', image: '' };
  }
}

// Function to sync an NFT from blockchain to database
async function syncNFTToDatabase(tokenId, provider) {
  const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
  const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider);
  
  try {
    // Get NFT data from blockchain
    const owner = await nftContract.ownerOf(tokenId);
    const tokenURI = await nftContract.tokenURI(tokenId);
    const collectionName = await nftContract.getTokenCollection(tokenId);
    const creator = await nftContract.getTokenCreator(tokenId);
    const metadata = await fetchMetadata(tokenURI);
    
    // Check if token is listed in marketplace
    const marketItems = await marketplaceContract.fetchMarketItems();
    const marketItem = marketItems.find(item => 
      item.nftContract.toLowerCase() === NFT_CONTRACT_ADDRESS.toLowerCase() && 
      item.tokenId.toString() === tokenId.toString()
    );
    
    // Prepare NFT data
    const nftData = {
      tokenId: tokenId.toString(),
      name: metadata.name || `NFT #${tokenId}`,
      description: metadata.description || '',
      image: metadata.image || '',
      collection: collectionName,
      creator,
      owner: marketItem ? MARKETPLACE_ADDRESS : owner,
      tokenURI,
      metadata,
      isListed: !!marketItem,
      price: marketItem ? ethers.utils.formatEther(marketItem.price) : '0',
      marketItemId: marketItem ? marketItem.itemId.toString() : null,
      seller: marketItem ? marketItem.seller : null
    };
    
    // Update or create NFT in database
    await connectToDatabase();
    const result = await NFT.findOneAndUpdate(
      { tokenId: tokenId.toString() },
      nftData,
      { upsert: true, new: true }
    );
    
    // Update collection stats if needed
    const collectionExists = await Collection.findOne({ name: collectionName });
    if (!collectionExists && collectionName) {
      // Create a basic collection entry if it doesn't exist
      await Collection.create({
        name: collectionName,
        slug: collectionName.toLowerCase().replace(/\s+/g, '-'),
        description: `Collection of ${collectionName} NFTs`,
        creator: creator,
      });
    }
    
    return result;
  } catch (error) {
    console.error(`Error syncing NFT #${tokenId}:`, error);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get('tokenId');
  const address = searchParams.get('address');
  const collection = searchParams.get('collection');
  const listed = searchParams.get('listed');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  
  try {
    await connectToDatabase();
    const provider = getProvider();
    
    // Fetch a specific token
    if (tokenId) {
      // Try to get from database first
      let nft = await NFT.findOne({ tokenId: tokenId.toString() });
      
      // If not in database or forceSync flag is true, sync from blockchain
      if (!nft || searchParams.get('forceSync') === 'true') {
        nft = await syncNFTToDatabase(tokenId, provider);
        if (!nft) {
          return Response.json({ error: 'NFT not found' }, { status: 404 });
        }
      }
      
      return Response.json(nft);
    }
    
    // Build query based on parameters
    const query = {};
    
    if (address) {
      // For owner or creator address
      if (searchParams.get('type') === 'created') {
        query.creator = address;
      } else {
        query.owner = address;
      }
    }
    
    if (collection) {
      query.collection = collection;
    }
    
    if (listed === 'true') {
      query.isListed = true;
    }
    
    // Get NFTs from database with pagination
    const nfts = await NFT.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await NFT.countDocuments(query);
    
    return Response.json({
      nfts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // This endpoint is for syncing a newly minted NFT to the database
    if (!data.tokenId) {
      return Response.json({ error: 'Missing tokenId' }, { status: 400 });
    }
    
    const provider = getProvider();
    const nft = await syncNFTToDatabase(data.tokenId, provider);
    
    if (!nft) {
      return Response.json({ error: 'Failed to sync NFT' }, { status: 500 });
    }
    
    return Response.json({
      message: 'NFT synced successfully',
      nft
    });
    
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 