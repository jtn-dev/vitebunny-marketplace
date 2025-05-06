'use client';

import { useEffect } from 'react';

export function DatabaseProvider() {
  useEffect(() => {
    // Initialize the database connection and event listeners
    const initializeDatabase = async () => {
      try {
        const response = await fetch('/api/sync');
        if (!response.ok) {
          console.error('Failed to initialize backend services');
        }
      } catch (error) {
        console.error('Error initializing backend services:', error);
      }
    };

    // Initialize on component mount
    initializeDatabase();
  }, []);

  // This component doesn't render anything
  return null;
}

export default DatabaseProvider; 