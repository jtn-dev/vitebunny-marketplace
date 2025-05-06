import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitebunny';

// Global variable to maintain db connection across requests
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(mongoose => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch(error => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase; 