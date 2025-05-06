import connectToDatabase from '../../lib/mongodb';

export async function GET() {
  try {
    const connection = await connectToDatabase();
    return Response.json({ 
      status: 'success', 
      message: 'Connected to MongoDB successfully',
      dbName: connection.connection.name
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return Response.json({ 
      status: 'error', 
      message: 'Failed to connect to MongoDB',
      error: error.message 
    }, { status: 500 });
  }
} 