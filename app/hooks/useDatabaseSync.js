import { useState, useEffect } from 'react';

/**
 * Hook to handle database synchronization after blockchain operations
 */
const useDatabaseSync = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sync a minted NFT to the database
   * @param {string} tokenId - The token ID of the minted NFT
   * @param {string} txHash - Transaction hash of the mint operation
   */
  const syncMintedNFT = async (tokenId, txHash) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/nfts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId,
          txHash
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sync NFT to database');
      }

      const data = await response.json();
      return data.nft;
    } catch (err) {
      console.error('Error syncing minted NFT:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates NFT data in database after listing for sale
   * @param {string} tokenId - The token ID of the NFT
   * @param {string} marketItemId - ID in the marketplace
   * @param {string} price - Price in ETH
   */
  const syncListedNFT = async (tokenId, marketItemId, price, txHash) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/nfts/listing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId,
          marketItemId,
          price,
          txHash
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sync NFT listing');
      }

      const data = await response.json();
      return data.nft;
    } catch (err) {
      console.error('Error syncing listed NFT:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates NFT data in database after purchase
   * @param {string} tokenId - The token ID of the NFT
   * @param {string} buyer - The address of the buyer
   */
  const syncPurchasedNFT = async (tokenId, buyer, txHash) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/nfts/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId,
          buyer,
          txHash
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sync NFT purchase');
      }

      const data = await response.json();
      return data.nft;
    } catch (err) {
      console.error('Error syncing purchased NFT:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    syncMintedNFT,
    syncListedNFT,
    syncPurchasedNFT
  };
};

export default useDatabaseSync; 