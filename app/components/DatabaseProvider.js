'use client';

import { useState, useEffect } from 'react';

/**
 * DatabaseProvider component that initializes database event listeners
 * This is used in the root layout to ensure blockchain events are synchronized to MongoDB
 */
export default function DatabaseProvider({ children }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize database event listeners on first render
    const initializeEventListeners = async () => {
      try {
        // Call the sync API to initialize event listeners
        const response = await fetch('/api/sync/init', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to initialize event listeners');
        }
        
        setIsInitialized(true);
        console.log('Database event listeners initialized successfully');
      } catch (err) {
        console.error('Error initializing database event listeners:', err);
        setError(err.message);
      }
    };

    initializeEventListeners();
  }, []);

  // Just render children, this is a background service
  return <>{children}</>;
} 