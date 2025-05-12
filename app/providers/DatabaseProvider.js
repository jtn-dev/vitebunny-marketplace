'use client';

import { useState, useEffect } from 'react';

/**
 * DatabaseProvider component that initializes database and event listeners
 * This ensures real-time synchronization between blockchain and MongoDB
 */
function DatabaseProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize the database connection and event listeners
    const initializeDatabase = async () => {
      try {
        // First initialize event listeners
        const listenerResponse = await fetch('/api/sync/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!listenerResponse.ok) {
          throw new Error('Failed to initialize event listeners');
        }
        
        // Then check if we need a full sync
        const syncResponse = await fetch('/api/sync');
        if (!syncResponse.ok) {
          throw new Error('Failed to initialize database sync');
        }
        
        setIsInitialized(true);
        console.log('Database services initialized successfully');
      } catch (error) {
        console.error('Error initializing backend services:', error);
        setError(error.message);
      }
    };

    // Initialize on component mount
    initializeDatabase();
    
    // This provider doesn't need cleanup as the event listeners
    // are managed by the server
  }, []);

  // This provider doesn't actually render anything visible
  // It just initializes services in the background
  return children || null;
}

export default DatabaseProvider; 