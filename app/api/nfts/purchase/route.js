import { ethers } from 'ethers';
import connectToDatabase from '../../../lib/mongodb';
import NFT from '../../../models/NFT';
import Collection from '../../../models/Collection';

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.tokenId || !data.buyer) {
      return Response.json({ 
        error: 'Missing required fields: tokenId and buyer are required' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // First check if the NFT exists in the database
    const nft = await NFT.findOne({ tokenId: data.tokenId.toString() });
    
    if (!nft) {
      return Response.json({ error: 'NFT not found in database' }, { status: 404 });
    }
    
    // Verify the NFT is currently listed for sale
    if (!nft.isListed) {
      return Response.json({ error: 'NFT is not listed for sale' }, { status: 400 });
    }
    
    // Calculate sale amount for collection volume tracking
    const saleAmount = nft.price || '0';
    
    // Update the NFT with new owner information
    const updatedNft = await NFT.findOneAndUpdate(
      { tokenId: data.tokenId.toString() },
      { 
        isListed: false,
        price: '0',
        marketItemId: null,
        seller: null,
        owner: data.buyer,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    // Update collection volume
    await Collection.findOneAndUpdate(
      { name: nft.collectionName },
      { 
        $inc: { volume: parseFloat(saleAmount) || 0 },
        updatedAt: new Date()
      }
    );
    
    // Track unique owners in the collection if needed
    // This would require more complex aggregation
    
    return Response.json({
      message: 'NFT purchase updated successfully',
      nft: updatedNft
    });
    
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 