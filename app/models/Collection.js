import mongoose from 'mongoose';

// Define schema for NFT collections
const CollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    creator: {
      type: String,
      required: true,
      index: true,
    },
    avatarImage: {
      type: String,
      default: '',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    itemCount: {
      type: Number,
      default: 0,
    },
    ownerCount: {
      type: Number,
      default: 0,
    },
    floorPrice: {
      type: String,
      default: '0',
    },
    volume: {
      type: String,
      default: '0',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create indexes for common queries
CollectionSchema.index({ name: 'text', description: 'text' });
CollectionSchema.index({ creator: 1 });
CollectionSchema.index({ featured: 1 });
CollectionSchema.index({ verified: 1 });
CollectionSchema.index({ volume: -1 });
CollectionSchema.index({ floorPrice: -1 });
CollectionSchema.index({ itemCount: -1 });

// Prevent duplicate errors when models are reloaded in development
const Collection = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);

export default Collection; 