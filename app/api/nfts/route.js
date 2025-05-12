import { ethers } from 'ethers';
import { NFT_CONTRACT_ADDRESS, NFT_ABI, MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from '../../utils/walletUtils';
import connectToDatabase from '../../lib/mongodb';
import NFT from '../../models/NFT';
import Collection from '../../models/Collection';
import { nfts as dummyNfts } from '../../utils/dummyData'; // Import dummy data for fallback

// Function to create a provider based on environment
const getProvider = () => {
  // Use environment variables to determine RPC URL
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
  return new ethers.JsonRpcProvider(rpcUrl);
};

// Function to fetch NFT metadata from URI
async function fetchMetadata(tokenURI, tokenId) {
  try {
    console.log(`Fetching metadata for token #${tokenId || 'unknown'} from ${tokenURI}`);
    
    // Handle base64 encoded JSON
    if (tokenURI && tokenURI.startsWith('data:application/json;base64,')) {
      const base64Data = tokenURI.split(',')[1];
      const jsonString = Buffer.from(base64Data, 'base64').toString();
      console.log(`Decoded base64 metadata for token #${tokenId || 'unknown'}`);
      return JSON.parse(jsonString);
    }
    
    // Handle IPFS URIs
    if (tokenURI && tokenURI.startsWith('ipfs://')) {
      tokenURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    
    // If tokenURI is missing or empty, return default metadata
    if (!tokenURI || tokenURI.trim() === '') {
      console.warn(`Missing tokenURI for token #${tokenId || 'unknown'}, using default metadata`);
      return { 
        name: tokenId ? `Bunny NFT #${tokenId}` : 'Bunny NFT', 
        description: 'A unique Bunny NFT', 
        image: '',
        attributes: [
          { trait_type: 'Category', value: 'Art' }
        ]
      };
    }
    
    // Fetch from URL
    const response = await fetch(tokenURI);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
    }
    
    const metadata = await response.json();
    console.log(`Successfully fetched metadata for token #${tokenId || 'unknown'}: ${metadata.name || 'Unnamed'}`);
    
    // Ensure minimal metadata is present
    return {
      name: metadata.name || (tokenId ? `Bunny NFT #${tokenId}` : 'Bunny NFT'),
      description: metadata.description || 'A unique Bunny NFT',
      image: metadata.image || '',
      attributes: metadata.attributes || [
        { trait_type: 'Category', value: 'Art' }
      ]
    };
  } catch (error) {
    console.error(`Error fetching metadata for token #${tokenId || 'unknown'}:`, error);
    return { 
      name: tokenId ? `Bunny NFT #${tokenId}` : 'Bunny NFT', 
      description: 'Metadata unavailable', 
      image: '',
      attributes: [
        { trait_type: 'Category', value: 'Art' }
      ]
    };
  }
}

// Function to sync an NFT from blockchain to database
async function syncNFTToDatabase(tokenId, provider) {
  const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider);
  const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider);
  
  try {
    console.log(`Syncing NFT #${tokenId} to database...`);
    
    // Get NFT data from blockchain
    const owner = await nftContract.ownerOf(tokenId);
    const tokenURI = await nftContract.tokenURI(tokenId);
    const collectionName = await nftContract.getTokenCollection(tokenId);
    const creator = await nftContract.getTokenCreator(tokenId);
    const metadata = await fetchMetadata(tokenURI, tokenId);
    
    // Check if token is listed in marketplace
    const marketItems = await marketplaceContract.fetchMarketItems();
    const marketItem = marketItems.find(item => 
      item.nftContract.toLowerCase() === NFT_CONTRACT_ADDRESS.toLowerCase() && 
      item.tokenId.toString() === tokenId.toString()
    );
    
    // Add a default category if none exists
    if (!metadata.attributes?.some(attr => attr.trait_type.toLowerCase() === 'category')) {
      if (!metadata.attributes) {
        metadata.attributes = [];
      }
      
      // Assign a category based on collection name
      let category = 'Art'; // Default category
      if (collectionName) {
        if (collectionName.toLowerCase().includes('art')) category = 'Art';
        else if (collectionName.toLowerCase().includes('photo')) category = 'Photography';
        else if (collectionName.toLowerCase().includes('music')) category = 'Music';
        else if (collectionName.toLowerCase().includes('collect')) category = 'Collectibles';
        else if (collectionName.toLowerCase().includes('world')) category = 'Virtual Worlds';
        else if (collectionName.toLowerCase().includes('sport')) category = 'Sports';
        else if (collectionName.toLowerCase().includes('card')) category = 'Trading Cards';
        else if (collectionName.toLowerCase().includes('util')) category = 'Utility';
      }
      
      metadata.attributes.push({ trait_type: 'Category', value: category });
    }
    
    // Prepare NFT data
    const nftData = {
      tokenId: tokenId.toString(),
      name: metadata.name || `Bunny NFT #${tokenId}`,
      description: metadata.description || 'A unique Bunny NFT',
      image: metadata.image || '',
      collectionName: collectionName || 'Bunny Collection',
      creator,
      owner: marketItem ? MARKETPLACE_ADDRESS : owner,
      tokenURI,
      metadata,
      isListed: !!marketItem,
      price: marketItem ? ethers.formatEther(marketItem.price) : '0',
      marketItemId: marketItem ? marketItem.itemId.toString() : null,
      seller: marketItem ? marketItem.seller : null
    };
    
    console.log(`Prepared NFT data for #${tokenId}:`, {
      name: nftData.name,
      collectionName: nftData.collectionName,
      isListed: nftData.isListed
    });
    
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
    
    console.log(`Successfully synced NFT #${tokenId} to database`);
    return result;
  } catch (error) {
    console.error(`Error syncing NFT #${tokenId}:`, error);
    return null;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get('tokenId');
  const id = searchParams.get('id'); // Support looking up by legacy ID as well
  const address = searchParams.get('address');
  const collection = searchParams.get('collection');
  const listed = searchParams.get('listed');
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  
  console.log('API Request:', JSON.stringify({
    path: request.url,
    params: {
      tokenId, id, address, collection, listed, category, page, limit
    }
  }));
  
  try {
    try {
      await connectToDatabase();
      console.log('Successfully connected to MongoDB');
    } catch (dbError) {
      console.warn('MongoDB connection failed, using dummy data instead:', dbError.message);
      
      // If we were looking for a specific NFT by ID
      if (tokenId || id) {
        const searchId = tokenId || id;
        const dummyNft = dummyNfts.find(nft => nft.id === searchId || nft.tokenId === searchId);
        
        if (!dummyNft) {
          return Response.json({ error: 'NFT not found' }, { status: 404 });
        }
        
        return Response.json(dummyNft);
      }
      
      // For general NFT listings, filter based on query params
      let filteredNfts = [...dummyNfts];
      
      // IMPORTANT: Only filter by address if explicitly requested 
      if (address && address.trim() !== '') {
        filteredNfts = filteredNfts.filter(nft => 
          searchParams.get('type') === 'created' 
            ? nft.creator.toLowerCase() === address.toLowerCase()
            : nft.owner.toLowerCase() === address.toLowerCase()
        );
      }
      
      // Add debug logs
      console.log(`Filtering dummy NFTs. Original count: ${dummyNfts.length}`);
      console.log(`Address filter: ${address || 'not applied'}`);
      
      if (collection) {
        filteredNfts = filteredNfts.filter(nft => 
          nft.collectionName.toLowerCase() === collection.toLowerCase()
        );
      }
      
      // Filter by category if specified
      if (category) {
        filteredNfts = filteredNfts.filter(nft => {
          // Try to find category in attributes array
          const nftCategory = nft.attributes?.find(attr => 
            attr.trait_type.toLowerCase() === 'category')?.value;
            
          // Also check if collection name contains the category
          const collectionMatch = nft.collectionName?.toLowerCase().includes(category.toLowerCase());
          
          return (nftCategory && nftCategory.toLowerCase() === category.toLowerCase()) || collectionMatch;
        });
        
        console.log(`After category filter (${category}): ${filteredNfts.length} NFTs`);
      }
      
      // Only filter by listing status if explicitly requested
      if (listed === 'true') {
        filteredNfts = filteredNfts.filter(nft => nft.isListed);
      } else if (listed === 'false') {
        filteredNfts = filteredNfts.filter(nft => !nft.isListed);
      }
      
      console.log(`Filtered dummy NFTs count: ${filteredNfts.length}`);
      
      // Apply pagination to dummy data
      const paginatedNfts = filteredNfts.slice(skip, skip + limit);
      
      return Response.json({
        nfts: paginatedNfts,
        pagination: {
          total: filteredNfts.length,
          page,
          limit,
          pages: Math.ceil(filteredNfts.length / limit)
        },
        source: 'dummy' // Indicate this is from dummy data
      });
    }
    
    const provider = getProvider();
    
    // Fetch a specific token by tokenId
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
    
    // Fetch a specific token by legacy id (for backward compatibility)
    if (id) {
      // Try to get from database
      let nft = await NFT.findOne({ id: id.toString() });
      
      if (!nft) {
        return Response.json({ error: 'NFT not found' }, { status: 404 });
      }
      
      return Response.json(nft);
    }
    
    // Build query based on parameters
    const query = {};
    
    // IMPORTANT: Only filter by address if explicitly requested
    // This ensures ALL NFTs are returned by default, not just the connected user's NFTs
    if (address && address.trim() !== '') {
      // For owner or creator address
      if (searchParams.get('type') === 'created') {
        query.creator = address;
      } else {
        query.owner = address;
      }
    }
    
    if (collection) {
      query.collectionName = collection;
    }
    
    // Only filter by listing status if explicitly requested
    if (listed !== null && listed !== undefined) {
      query.isListed = listed === 'true';
    }
    
    console.log('MongoDB query:', JSON.stringify(query));
    
    // Get NFTs from database with pagination
    const nfts = await NFT.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    console.log(`Found ${nfts.length} NFTs in MongoDB`);
    
    // Enhance NFTs with categories if not already present
    const enhancedNfts = nfts.map(nft => {
      const nftObj = nft.toObject ? nft.toObject() : nft;
      
      // Add category if not present
      if (!nftObj.metadata?.attributes?.some(attr => 
          attr.trait_type.toLowerCase() === 'category')) {
        if (!nftObj.metadata) nftObj.metadata = {};
        if (!nftObj.metadata.attributes) nftObj.metadata.attributes = [];
        
        // Assign a category based on collection name
        let category = 'Art'; // Default category
        if (nftObj.collectionName) {
          if (nftObj.collectionName.toLowerCase().includes('art')) category = 'Art';
          else if (nftObj.collectionName.toLowerCase().includes('photo')) category = 'Photography';
          else if (nftObj.collectionName.toLowerCase().includes('music')) category = 'Music';
          else if (nftObj.collectionName.toLowerCase().includes('collect')) category = 'Collectibles';
          else if (nftObj.collectionName.toLowerCase().includes('world')) category = 'Virtual Worlds';
          else if (nftObj.collectionName.toLowerCase().includes('sport')) category = 'Sports';
          else if (nftObj.collectionName.toLowerCase().includes('card')) category = 'Trading Cards';
          else if (nftObj.collectionName.toLowerCase().includes('util')) category = 'Utility';
        }
        
        nftObj.metadata.attributes.push({ trait_type: 'Category', value: category });
      }
      
      return nftObj;
    });
    
    const total = await NFT.countDocuments(query);
    
    return Response.json({
      nfts: enhancedNfts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    
    // Fallback to dummy data on error
    try {
      console.warn('Using dummy data as fallback due to error');
      
      // If we were looking for a specific NFT by ID
      if (tokenId || id) {
        const searchId = tokenId || id;
        const dummyNft = dummyNfts.find(nft => nft.id === searchId || nft.tokenId === searchId);
        
        if (!dummyNft) {
          return Response.json({ error: 'NFT not found' }, { status: 404 });
        }
        
        return Response.json(dummyNft);
      }
      
      // For general NFT listings, filter based on query params
      let filteredNfts = [...dummyNfts];
      
      if (address) {
        filteredNfts = filteredNfts.filter(nft => 
          searchParams.get('type') === 'created' 
            ? nft.creator.toLowerCase() === address.toLowerCase()
            : nft.owner.toLowerCase() === address.toLowerCase()
        );
      }
      
      if (collection) {
        filteredNfts = filteredNfts.filter(nft => 
          nft.collectionName.toLowerCase() === collection.toLowerCase()
        );
      }
      
      // Only filter by listing status if explicitly requested
      if (listed === 'true') {
        filteredNfts = filteredNfts.filter(nft => nft.isListed);
      } else if (listed === 'false') {
        filteredNfts = filteredNfts.filter(nft => !nft.isListed);
      }
      
      // Apply pagination to dummy data
      const paginatedNfts = filteredNfts.slice(skip, skip + limit);
      
      return Response.json({
        nfts: paginatedNfts,
        pagination: {
          total: filteredNfts.length,
          page,
          limit,
          pages: Math.ceil(filteredNfts.length / limit)
        },
        source: 'dummy' // Indicate this is from dummy data
      });
    } catch (fallbackError) {
      console.error('Even fallback to dummy data failed:', fallbackError);
      return Response.json({ error: 'Failed to fetch NFTs' }, { status: 500 });
    }
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