import { ethers } from 'ethers';
import { 
  NFT_CONTRACT_ADDRESS, 
  NFT_ABI, 
  MARKETPLACE_ADDRESS, 
  MARKETPLACE_ABI 
} from '../utils/walletUtils';
import connectToDatabase from './mongodb';
import NFT from '../models/NFT';
import Collection from '../models/Collection';

// Create a provider based on environment
const getProvider = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
  return new ethers.JsonRpcProvider(rpcUrl);
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

// Function to update NFT data in database when a new NFT is minted
export async function handleNFTMinted(tokenId, creator, tokenURI, collection) {
  try {
    await connectToDatabase();
    
    // Fetch metadata
    const metadata = await fetchMetadata(tokenURI);
    
    // Create or update NFT in database
    const nft = new NFT({
      tokenId: tokenId.toString(),
      name: metadata.name || `NFT #${tokenId}`,
      description: metadata.description || '',
      image: metadata.image || '',
      collection,
      creator,
      owner: creator,
      tokenURI,
      metadata,
      isListed: false,
      price: '0'
    });
    
    await nft.save();
    
    // Update collection stats
    await Collection.findOneAndUpdate(
      { name: collection },
      { 
        $inc: { itemCount: 1 },
        $set: { updatedAt: new Date() }
      },
      { upsert: false }
    );
    
    return nft;
  } catch (error) {
    console.error('Error handling NFT minted event:', error);
    return null;
  }
}

// Function to update NFT when it's listed on the marketplace
export async function handleMarketItemCreated(itemId, nftContract, tokenId, seller, price) {
  try {
    await connectToDatabase();
    
    // Update NFT in database
    const nft = await NFT.findOneAndUpdate(
      { tokenId: tokenId.toString() },
      { 
        isListed: true,
        price: ethers.formatEther(price),
        marketItemId: itemId.toString(),
        seller,
        owner: MARKETPLACE_ADDRESS,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    // Update collection floor price if needed
    if (nft) {
      const priceEth = ethers.formatEther(price);
      await Collection.findOneAndUpdate(
        { name: nft.collectionName, floorPrice: { $gt: priceEth } },
        { floorPrice: priceEth, updatedAt: new Date() }
      );
    }
    
    return nft;
  } catch (error) {
    console.error('Error handling market item created event:', error);
    return null;
  }
}

// Function to update NFT when it's sold
export async function handleMarketItemSold(itemId, nftContract, tokenId, seller, buyer, price) {
  try {
    await connectToDatabase();
    
    // Update NFT in database
    const nft = await NFT.findOneAndUpdate(
      { tokenId: tokenId.toString() },
      { 
        isListed: false,
        price: '0',
        marketItemId: null,
        seller: null,
        owner: buyer,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    // Update collection volume
    if (nft) {
      const priceEth = ethers.formatEther(price);
      await Collection.findOneAndUpdate(
        { name: nft.collectionName },
        { 
          $inc: { volume: parseFloat(priceEth) || 0 },
          updatedAt: new Date() 
        }
      );
    }
    
    return nft;
  } catch (error) {
    console.error('Error handling market item sold event:', error);
    return null;
  }
}

// Listen to contract events and update database
export async function setupEventListeners() {
  const provider = getProvider();
  
  const nftContract = new ethers.Contract(
    NFT_CONTRACT_ADDRESS,
    NFT_ABI,
    provider
  );
  
  const marketplaceContract = new ethers.Contract(
    MARKETPLACE_ADDRESS,
    MARKETPLACE_ABI,
    provider
  );
  
  // Listen for NFT minted events
  nftContract.on('NFTMinted', async (tokenId, creator, tokenURI, collection) => {
    console.log(`NFT Minted: Token ID ${tokenId}, Creator: ${creator}`);
    await handleNFTMinted(tokenId, creator, tokenURI, collection);
  });
  
  // Listen for market item created events
  marketplaceContract.on('MarketItemCreated', async (itemId, nftContract, tokenId, seller, owner, price) => {
    console.log(`Market Item Created: Item ID ${itemId}, Token ID ${tokenId}`);
    await handleMarketItemCreated(itemId, nftContract, tokenId, seller, price);
  });
  
  // Listen for market item sold events
  marketplaceContract.on('MarketItemSold', async (itemId, nftContract, tokenId, seller, buyer, price) => {
    console.log(`Market Item Sold: Item ID ${itemId}, Token ID ${tokenId}`);
    await handleMarketItemSold(itemId, nftContract, tokenId, seller, buyer, price);
  });
  
  console.log('Event listeners set up successfully');
  
  return () => {
    // Clean up listeners when needed
    nftContract.removeAllListeners();
    marketplaceContract.removeAllListeners();
  };
} 