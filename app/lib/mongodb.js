import mongoose from 'mongoose';

// Use environment variable with a fallback for development
// NOTE: In production, always use environment variables, not hardcoded credentials
const MONGODB_URI = process.env.MONGODB_URI;

// Global variable to maintain db connection across requests
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  // If no MongoDB URI is provided, throw a helpful error
  if (!MONGODB_URI) {
    console.warn('MongoDB connection string missing - using fallback data');
    throw new Error(
      'Please define the MONGODB_URI environment variable'
    );
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      connectTimeoutMS: 10000, // Give up initial connection after 10s
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch(error => {
        console.error('MongoDB connection error:', error);
        
        // Provide a more specific error message
        if (error.name === 'MongooseServerSelectionError') {
          if (error.message.includes('IP')) {
            console.error('Your IP address may not be whitelisted in MongoDB Atlas');
          }
        }
        
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset the promise so we can retry
    throw error;
  }
}

export default connectToDatabase; 