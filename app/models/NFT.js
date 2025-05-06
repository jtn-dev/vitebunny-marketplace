import mongoose from 'mongoose';

// Define schema for NFT
const NFTSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    collection: {
      type: String,
      required: true,
      index: true,
    },
    creator: {
      type: String,
      required: true,
      index: true,
    },
    owner: {
      type: String,
      required: true,
      index: true,
    },
    tokenURI: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isListed: {
      type: Boolean,
      default: false,
      index: true,
    },
    price: {
      type: String,
      default: '0',
    },
    marketItemId: {
      type: String,
      default: null,
    },
    seller: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create indexes for common queries
NFTSchema.index({ tokenId: 1 });
NFTSchema.index({ collection: 1 });
NFTSchema.index({ creator: 1 });
NFTSchema.index({ owner: 1 });
NFTSchema.index({ isListed: 1 });
NFTSchema.index({ price: 1 });
NFTSchema.index({ createdAt: -1 });
NFTSchema.index({ likes: -1 });

// Prevent duplicate errors when models are reloaded in development
const NFT = mongoose.models.NFT || mongoose.model('NFT', NFTSchema);

export default NFT; 