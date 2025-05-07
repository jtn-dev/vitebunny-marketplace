import { ethers } from 'ethers';
import { NFT_CONTRACT_ADDRESS, NFT_ABI } from '../../utils/walletUtils';
import connectToDatabase from '../../lib/mongodb';
import Collection from '../../models/Collection';
import NFT from '../../models/NFT';

// Function to create a provider based on environment
const getProvider = () => {
  // Use environment variables to determine RPC URL
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';
  return new ethers.JsonRpcProvider(rpcUrl);
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const creator = searchParams.get('creator');
  const featured = searchParams.get('featured');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;
  
  try {
    await connectToDatabase();
    
    // Query for a specific collection by slug
    if (slug) {
      const collection = await Collection.findOne({ slug });
      if (!collection) {
        return Response.json({ error: 'Collection not found' }, { status: 404 });
      }
      
      // Get the NFTs in this collection
      const nfts = await NFT.find({ collection: collection.name })
        .sort({ createdAt: -1 })
        .limit(20);
      
      return Response.json({ collection, nfts });
    }
    
    // Query for collections by creator
    if (creator) {
      const collections = await Collection.find({ creator })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Collection.countDocuments({ creator });
      
      return Response.json({
        collections,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    }
    
    // Query for featured collections
    if (featured) {
      const collections = await Collection.find({ featured: true })
        .sort({ volume: -1 })
        .limit(limit);
      
      return Response.json({ collections });
    }
    
    // Get all collections with pagination
    const query = {};
    const collections = await Collection.find(query)
      .sort({ volume: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Collection.countDocuments(query);
    
    return Response.json({
      collections,
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
    
    // Validate required fields
    if (!data.name || !data.slug || !data.creator) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Check if collection with this slug already exists
    const existing = await Collection.findOne({ slug: data.slug });
    if (existing) {
      return Response.json({ error: 'Collection with this slug already exists' }, { status: 409 });
    }
    
    // Create new collection
    const collection = new Collection({
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      creator: data.creator,
      avatarImage: data.avatarImage || '',
      bannerImage: data.bannerImage || '',
      categories: data.categories || [],
    });
    
    await collection.save();
    
    return Response.json({ 
      message: 'Collection created successfully',
      collection
    }, { status: 201 });
    
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 