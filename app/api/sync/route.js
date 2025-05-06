import { ethers } from 'ethers';
import { 
  NFT_CONTRACT_ADDRESS, 
  NFT_ABI, 
  MARKETPLACE_ADDRESS, 
  MARKETPLACE_ABI 
} from '../../utils/walletUtils';
import connectToDatabase from '../../lib/mongodb';
import { setupEventListeners } from '../../lib/eventSync';
import NFT from '../../models/NFT';

// Global variable to track if event listeners are set up
let listenersActive = false;

// Function to sync all existing NFTs
async function syncAllNFTs() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'
    );
    
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      provider
    );

    // Get total supply (if your contract supports it)
    let totalSupply;
    try {
      totalSupply = await nftContract.totalSupply();
    } catch (error) {
      // If totalSupply is not available, use events to estimate
      const filter = nftContract.filters.NFTMinted();
      const events = await nftContract.queryFilter(filter);
      totalSupply = events.length;
    }

    // Fetch details for each token
    for (let i = 1; i <= totalSupply; i++) {
      try {
        // Check if token exists by trying to get its owner
        await nftContract.ownerOf(i);
        
        // Call the API route for this token to sync it
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/nfts?tokenId=${i}&forceSync=true`);
        
        if (response.ok) {
          console.log(`Synced NFT #${i}`);
        } else {
          console.error(`Failed to sync NFT #${i}`);
        }
      } catch (error) {
        // Token doesn't exist or other error, skip it
        console.log(`Skipping token #${i}: ${error.message}`);
      }
    }

    return totalSupply;
  } catch (error) {
    console.error('Error syncing all NFTs:', error);
    throw error;
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Setup event listeners if not already active
    if (!listenersActive) {
      const cleanupListeners = setupEventListeners();
      listenersActive = true;
      console.log('Event listeners initialized');
    }
    
    // Check if full sync is requested
    const { searchParams } = new URL(request.url);
    const fullSync = searchParams.get('fullSync') === 'true';
    
    if (fullSync) {
      // Start async sync process (don't await to return response quickly)
      syncAllNFTs().catch(console.error);
      
      return Response.json({
        message: 'Full sync process initiated. This may take some time.',
        listenersActive
      });
    }
    
    return Response.json({
      message: 'Event listeners status',
      listenersActive
    });
    
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 