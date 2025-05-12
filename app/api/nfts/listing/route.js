import { ethers } from 'ethers';
import connectToDatabase from '../../../lib/mongodb';
import NFT from '../../../models/NFT';
import Collection from '../../../models/Collection';
import { handleMarketItemCreated } from '../../../lib/eventSync';

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.tokenId) {
      return Response.json({ error: 'Missing tokenId' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // First check if the NFT exists in the database
    const nft = await NFT.findOne({ tokenId: data.tokenId.toString() });
    
    if (!nft) {
      return Response.json({ 
        error: 'NFT not found in database' 
      }, { status: 404 });
    }
    
    // Update the NFT with listing information
    const updatedNft = await NFT.findOneAndUpdate(
      { tokenId: data.tokenId.toString() },
      { 
        isListed: true,
        price: data.price,
        marketItemId: data.marketItemId,
        seller: nft.owner,
        owner: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS, // NFT is now owned by marketplace
        updatedAt: new Date()
      },
      { new: true }
    );
    
    // Update collection floor price if needed
    await Collection.findOneAndUpdate(
      { 
        name: nft.collectionName,
        $or: [
          { floorPrice: { $gt: data.price } },
          { floorPrice: '0' }
        ]
      },
      { floorPrice: data.price, updatedAt: new Date() },
      { new: true }
    );
    
    return Response.json({
      message: 'NFT listing updated successfully',
      nft: updatedNft
    });
    
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 