'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS, signAndSendTransaction, createNFTPurchaseData } from '../utils/walletUtils';

const BuyNFTButton = ({ nft, marketItemId, onSuccess, onError }) => {
  const { isConnected } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Set up contract write hook
  const { writeContractAsync } = useWriteContract();

  // Transaction receipt tracking
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: Boolean(txHash),
  });

  const handleBuyClick = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsPending(true);

      // Prepare the purchase data
      const purchaseData = createNFTPurchaseData(marketItemId || nft.id);

      // Prepare the transaction
      const result = await signAndSendTransaction(async () => {
        return await writeContractAsync({
          address: MARKETPLACE_ADDRESS,
          abi: MARKETPLACE_ABI,
          functionName: 'createMarketSale',
          args: [purchaseData.itemId],
          value: parseEther(nft.price), // Price in ETH converted to wei
        });
      });

      if (result.success) {
        setTxHash(result.hash);
        onSuccess?.({ 
          txHash: result.hash, 
          nft 
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error buying NFT:', error);
      onError?.(error.message || 'Failed to purchase NFT');
    } finally {
      setIsPending(false);
    }
  };

  // Button states based on transaction status
  let buttonText = 'Buy Now';
  let buttonClass = 'bg-primary hover:bg-primary-dark text-white';
  
  if (isPending || isConfirming) {
    buttonText = isPending ? 'Waiting for approval...' : 'Confirming...';
    buttonClass = 'bg-gray-500 text-white cursor-not-allowed';
  } else if (isConfirmed) {
    buttonText = 'Purchase complete!';
    buttonClass = 'bg-green-500 text-white';
  }

  return (
    <button
      className={`w-full py-3 px-6 text-center font-medium text-sm uppercase tracking-wider transition-colors ${buttonClass}`}
      onClick={handleBuyClick}
      disabled={isPending || isConfirming || isConfirmed}
    >
      <span className="text-white font-semibold">{buttonText}</span>
    </button>
  );
};

export default BuyNFTButton; 