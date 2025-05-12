const mongoose = require('mongoose');
const { nfts, collections } = require('./app/utils/dummyData');

// MongoDB Schema definitions matching your existing models
const NFTSchema = new mongoose.Schema({
  id: String,
  tokenId: String,
  name: String,
  description: String,
  image: String,
  collectionName: String,
  price: String,
  likes: Number,
  owner: String,
  creator: String,
  isListed: Boolean,
  metadata: {
    attributes: Array
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CollectionSchema = new mongoose.Schema({
  id: String,
  name: String,
  slug: String,
  description: String,
  avatarImage: String,
  bannerImage: String,
  owner: String,
  floorPrice: String,
  volume: String,
  items: Number,
  verified: Boolean,
  featured: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

async function populateDatabase() {
  try {
    // Connect to MongoDB directly (outside of Next.js API routes)
    console.log('Connecting to MongoDB...');
    
    // Use your MongoDB connection string from .env.local
    // If you need to use a different connection string for this script, replace it here
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitebunny';
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create or get models
    const NFT = mongoose.models.NFT || mongoose.model('NFT', NFTSchema);
    const Collection = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
    
    // Clear existing data
    console.log('Clearing existing data...');
    await NFT.deleteMany({});
    await Collection.deleteMany({});
    
    // Prepare NFTs data
    const enhancedNfts = nfts.map(nft => ({
      ...nft,
      tokenId: nft.id,
      collectionName: nft.collection,
      metadata: {
        attributes: nft.attributes || []
      }
    }));
    
    // Insert Collections first
    console.log(`Inserting ${collections.length} Collections...`);
    await Collection.insertMany(collections);
    console.log(`Collections inserted successfully`);
    
    // Insert NFTs
    console.log(`Inserting ${enhancedNfts.length} NFTs...`);
    await NFT.insertMany(enhancedNfts);
    console.log(`NFTs inserted successfully`);
    
    console.log('Database population completed successfully');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Check if running directly (not imported)
if (require.main === module) {
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  // Run the population script
  populateDatabase().catch(console.error);
}

module.exports = populateDatabase; 