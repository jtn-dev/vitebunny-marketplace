import { setupEventListeners } from '../../../lib/eventSync';
import connectToDatabase from '../../../lib/mongodb';

// Global variable to track if event listeners are set up
let listenersActive = false;

export async function POST() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Set up event listeners if not already active
    if (!listenersActive) {
      const cleanupListeners = await setupEventListeners();
      listenersActive = true;
      
      // Register cleanup function to global (in a real app, use a better approach)
      if (typeof global !== 'undefined') {
        global.cleanupEventListeners = cleanupListeners;
      }
    }
    
    return Response.json({
      success: true,
      message: 'Event listeners initialized successfully'
    });
    
  } catch (error) {
    console.error('Failed to initialize event listeners:', error);
    return Response.json({
      success: false,
      error: error.message || 'Failed to initialize event listeners'
    }, { status: 500 });
  }
} 