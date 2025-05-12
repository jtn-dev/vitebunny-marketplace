'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS, signAndSendTransaction, createNFTPurchaseData } from '../utils/walletUtils';
import useDatabaseSync from '../hooks/useDatabaseSync';

const BuyNFTButton = ({ nft, marketItemId, onSuccess, onError, className = '' }) => {
  const { isConnected, address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState('');
  const { syncPurchasedNFT, isLoading: isSyncing } = useDatabaseSync();
  const [transactionTimeout, setTransactionTimeout] = useState(false);

  // Set up contract write hook
  const { writeContractAsync } = useWriteContract();

  // Transaction receipt tracking
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: Boolean(txHash),
    onSuccess: async (data) => {
      try {
        // After successful purchase, update the ownership in the database
        const syncedNft = await syncPurchasedNFT(nft.tokenId, address, txHash);
        
        onSuccess?.({ 
          txHash: txHash, 
          nft: syncedNft || nft
        });
      } catch (error) {
        console.error('Error syncing purchased NFT to database:', error);
        // Still consider transaction successful even if DB sync failed
        onSuccess?.({ txHash: txHash, nft });
      }
    }
  });

  // Implement timeout for transaction
  useEffect(() => {
    let timer;
    if (isPending && !isConfirming && !isConfirmed) {
      timer = setTimeout(() => {
        setTransactionTimeout(true);
        setIsPending(false);
      }, 30000); // 30 seconds timeout
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPending, isConfirming, isConfirmed]);

  // Reset timeout if transaction is confirmed or being confirmed
  useEffect(() => {
    if (isConfirming || isConfirmed) {
      setTransactionTimeout(false);
    }
  }, [isConfirming, isConfirmed]);

  const handleBuyClick = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsPending(true);
      setTransactionTimeout(false);

      // Correctly identify which ID to use - marketItemId or nft.marketItemId
      const itemId = marketItemId || nft.marketItemId || nft.id;
      if (!itemId) {
        throw new Error('Invalid market item ID');
      }
      
      console.log('Buying NFT with item ID:', itemId);
      console.log('NFT data:', nft);
      
      if (!nft.price) {
        throw new Error('NFT price is missing');
      }

      // Convert price to string to ensure it's properly formatted
      const priceString = typeof nft.price === 'string' ? nft.price : nft.price.toString();
      const priceValue = parseEther(priceString);

      console.log('Price in ETH:', priceString);
      console.log('Price in Wei:', priceValue);

      // Prepare the purchase data
      const purchaseData = createNFTPurchaseData(itemId);

      // Prepare the transaction
      const result = await signAndSendTransaction(async () => {
        const txRequest = {
          address: MARKETPLACE_ADDRESS,
          abi: MARKETPLACE_ABI,
          functionName: 'createMarketSale',
          args: [purchaseData.itemId],
          value: priceValue,
          // Add gas configuration
          gas: BigInt(300000), // Increase gas limit
        };
        console.log('Transaction request:', txRequest);
        return await writeContractAsync(txRequest);
      });

      if (result.success) {
        setTxHash(result.hash);
        // onSuccess will be called by the useWaitForTransactionReceipt hook
      } else {
        console.error('Transaction failed with error:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error buying NFT:', error);
      setIsPending(false);
      
      // Show more meaningful error message to user
      let errorMessage = 'Failed to purchase NFT';
      
      if (error.message) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'You don\'t have enough ETH to complete this purchase';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction rejected in wallet';
        } else if (error.message.includes('Item does not exist')) {
          errorMessage = 'This NFT listing no longer exists';
        } else if (error.message.includes('Item already sold')) {
          errorMessage = 'This NFT has already been sold';
        } else if (error.message.includes('asking price')) {
          errorMessage = 'Please submit the exact asking price';
        } else {
          // Use the error message but clean it up
          errorMessage = error.message.replace(/^Error: /, '');
        }
      }
      
      onError?.(errorMessage);
    }
  };

  // Reset function for when transaction times out
  const handleTransactionReset = () => {
    setTransactionTimeout(false);
    setIsPending(false);
    setTxHash('');
  };

  // Button states based on transaction status
  let buttonText = 'Buy Now';
  let buttonClass = 'bg-primary hover:bg-primary-dark text-white';
  
  if (transactionTimeout) {
    buttonText = 'Transaction Timed Out - Retry';
    buttonClass = 'bg-red-500 text-white';
  } else if (isPending) {
    buttonText = 'Processing...';
    buttonClass = 'bg-yellow-500 text-white cursor-wait';
  } else if (isConfirming) {
    buttonText = 'Confirming...';
    buttonClass = 'bg-yellow-600 text-white cursor-wait';
  } else if (isSyncing) {
    buttonText = 'Updating...';
    buttonClass = 'bg-yellow-600 text-white cursor-wait';
  } else if (isConfirmed) {
    buttonText = 'Purchase Complete!';
    buttonClass = 'bg-green-500 text-white';
  }

  return (
    <>
      {transactionTimeout ? (
        <button
          className={`py-3 px-6 text-center font-medium text-sm uppercase tracking-wider transition-colors ${buttonClass} ${className}`}
          onClick={handleTransactionReset}
        >
          {buttonText}
        </button>
      ) : (
        <button
          className={`py-3 px-6 text-center font-medium text-sm uppercase tracking-wider transition-colors ${buttonClass} ${className}`}
          onClick={handleBuyClick}
          disabled={isPending || isConfirming || isConfirmed || isSyncing}
        >
          {buttonText}
        </button>
      )}
    </>
  );
};

export default BuyNFTButton; 