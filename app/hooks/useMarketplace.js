'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  useAccount, 
  useReadContract, 
  useContractEvent
} from 'wagmi';
import { 
  MARKETPLACE_ABI, 
  MARKETPLACE_ADDRESS, 
  NFT_CONTRACT_ADDRESS, 
  NFT_ABI 
} from '../utils/walletUtils';

/**
 * Custom hook to interact with the ViteBunny marketplace contract
 */
export const useMarketplace = () => {
  const { address, isConnected } = useAccount();
  const [marketItems, setMarketItems] = useState([]);
  const [myListedItems, setMyListedItems] = useState([]);
  const [myPurchasedItems, setMyPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get all unsold market items
  const { data: fetchedMarketItems, refetch: refetchMarketItems } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'fetchMarketItems',
    enabled: !!MARKETPLACE_ADDRESS,
  });

  // Get items created by the user
  const { data: fetchedMyListedItems, refetch: refetchMyListedItems } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'fetchMyCreatedItems',
    enabled: !!MARKETPLACE_ADDRESS && isConnected,
  });

  // Get items owned by the user
  const { data: fetchedMyPurchasedItems, refetch: refetchMyPurchasedItems } = useReadContract({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'fetchMyNFTs',
    enabled: !!MARKETPLACE_ADDRESS && isConnected,
  });

  // Listen to MarketItemCreated events
  useContractEvent({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    eventName: 'MarketItemCreated',
    listener: (log) => {
      refetchMarketItems();
      if (isConnected) {
        refetchMyListedItems();
      }
    },
  });

  // Listen to MarketItemSold events
  useContractEvent({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    eventName: 'MarketItemSold',
    listener: (log) => {
      refetchMarketItems();
      if (isConnected) {
        refetchMyListedItems();
        refetchMyPurchasedItems();
      }
    },
  });

  // Fetch NFT metadata for a specific token
  const fetchNFTMetadata = useCallback(async (tokenId) => {
    try {
      const { data: tokenURI } = await useReadContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'tokenURI',
        args: [tokenId],
      });

      if (!tokenURI) return null;

      // Handle data URIs directly
      if (tokenURI.startsWith('data:application/json;base64,')) {
        const json = atob(tokenURI.split(',')[1]);
        return JSON.parse(json);
      }

      // Otherwise fetch from URL (IPFS, HTTP, etc.)
      const response = await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'));
      return await response.json();
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      return null;
    }
  }, []);

  // Enrich market items with metadata
  const enrichMarketItems = useCallback(async (items) => {
    if (!items || items.length === 0) return [];

    return Promise.all(
      items.map(async (item) => {
        // Format the market item data
        const formattedItem = {
          itemId: Number(item.itemId),
          tokenId: Number(item.tokenId),
          seller: item.seller,
          owner: item.owner,
          price: item.price.toString(),
          sold: item.sold,
          nftContract: item.nftContract
        };

        try {
          // Get token collection
          const { data: collection } = await useReadContract({
            address: NFT_CONTRACT_ADDRESS,
            abi: NFT_ABI,
            functionName: 'getTokenCollection',
            args: [formattedItem.tokenId],
          });

          // Get token creator
          const { data: creator } = await useReadContract({
            address: NFT_CONTRACT_ADDRESS,
            abi: NFT_ABI,
            functionName: 'getTokenCreator',
            args: [formattedItem.tokenId],
          });

          // Get token metadata
          const metadata = await fetchNFTMetadata(formattedItem.tokenId);

          return {
            ...formattedItem,
            name: metadata?.name || `NFT #${formattedItem.tokenId}`,
            description: metadata?.description || '',
            image: metadata?.image || '',
            collection,
            creator
          };
        } catch (error) {
          console.error('Error enriching market item:', error);
          return formattedItem;
        }
      })
    );
  }, [fetchNFTMetadata]);

  // Process market items whenever they change
  useEffect(() => {
    const processMarketItems = async () => {
      setLoading(true);
      try {
        if (fetchedMarketItems) {
          const enriched = await enrichMarketItems(fetchedMarketItems);
          setMarketItems(enriched);
        }

        if (fetchedMyListedItems) {
          const enriched = await enrichMarketItems(fetchedMyListedItems);
          setMyListedItems(enriched);
        }

        if (fetchedMyPurchasedItems) {
          const enriched = await enrichMarketItems(fetchedMyPurchasedItems);
          setMyPurchasedItems(enriched);
        }
      } catch (error) {
        console.error('Error processing market items:', error);
      } finally {
        setLoading(false);
      }
    };

    processMarketItems();
  }, [fetchedMarketItems, fetchedMyListedItems, fetchedMyPurchasedItems, enrichMarketItems]);

  // Refetch all data when account changes
  useEffect(() => {
    if (isConnected) {
      refetchMarketItems();
      refetchMyListedItems();
      refetchMyPurchasedItems();
    }
  }, [isConnected, address, refetchMarketItems, refetchMyListedItems, refetchMyPurchasedItems]);

  return {
    marketItems,
    myListedItems,
    myPurchasedItems,
    loading,
    refetchMarketItems,
    refetchMyListedItems,
    refetchMyPurchasedItems
  };
}; 