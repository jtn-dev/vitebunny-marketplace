'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { 
  NFT_ABI, 
  MARKETPLACE_ABI, 
  NFT_CONTRACT_ADDRESS, 
  MARKETPLACE_ADDRESS, 
  signAndSendTransaction, 
  createNFTListingData 
} from '../utils/walletUtils';

const ListNFTButton = ({ nft, onSuccess, onError }) => {
  const { isConnected, address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [price, setPrice] = useState('');
  const [showPriceInput, setShowPriceInput] = useState(false);

  // Set up contract write hook
  const { writeContractAsync } = useWriteContract();

  // Transaction receipt tracking
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: Boolean(txHash),
  });

  const handleInputChange = (e) => {
    // Only allow numbers and decimals
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setPrice(value);
  };

  const handleListClick = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!showPriceInput) {
      setShowPriceInput(true);
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      // First, approve the marketplace to transfer the NFT
      setIsApproving(true);
      
      const approvalResult = await signAndSendTransaction(async () => {
        return await writeContractAsync({
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_ABI,
          functionName: 'approve',
          args: [MARKETPLACE_ADDRESS, nft.id],
        });
      });

      if (!approvalResult.success) {
        throw new Error(approvalResult.error || 'Failed to approve NFT transfer');
      }

      setIsApproving(false);
      setIsPending(true);

      // After approval, create the market item
      const listingData = createNFTListingData(
        NFT_CONTRACT_ADDRESS,
        nft.id,
        price
      );

      const listingResult = await signAndSendTransaction(async () => {
        return await writeContractAsync({
          address: MARKETPLACE_ADDRESS,
          abi: MARKETPLACE_ABI,
          functionName: 'createMarketItem',
          args: [listingData.nftContract, listingData.tokenId, listingData.price],
        });
      });

      if (listingResult.success) {
        setTxHash(listingResult.hash);
        onSuccess?.({ 
          txHash: listingResult.hash, 
          nft,
          price 
        });
      } else {
        throw new Error(listingResult.error || 'Failed to list NFT');
      }
    } catch (error) {
      console.error('Error listing NFT:', error);
      onError?.(error.message || 'Failed to list NFT');
    } finally {
      setIsPending(false);
      setIsApproving(false);
    }
  };

  // Button states based on transaction status
  let buttonText = 'List for Sale';
  let buttonClass = 'bg-primary hover:bg-primary/90 text-white font-medium';
  
  if (isApproving) {
    buttonText = 'Approving...';
    buttonClass = 'bg-yellow-500 text-white cursor-wait';
  } else if (isPending || isConfirming) {
    buttonText = isPending ? 'Listing...' : 'Confirming...';
    buttonClass = 'bg-gray-500 text-white cursor-not-allowed';
  } else if (isConfirmed) {
    buttonText = 'Listed Successfully!';
    buttonClass = 'bg-green-500 text-white';
  } else if (showPriceInput) {
    buttonText = 'Confirm Listing';
  }

  // Don't show button if the user doesn't own the NFT
  if (address && nft.owner && address.toLowerCase() !== nft.owner.toLowerCase()) {
    return null;
  }

  return (
    <div className="w-full">
      {showPriceInput && !isConfirmed && (
        <div className="mb-3">
          <div className="relative">
            <input
              type="text"
              value={price}
              onChange={handleInputChange}
              placeholder="Price in ETH"
              className="w-full pl-8 pr-4 py-3 bg-card-bg border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={isApproving || isPending || isConfirming}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-foreground/60">Ξ</span>
            </div>
          </div>
        </div>
      )}
      
      <button
        className={`w-full py-3 px-6 text-center font-medium text-sm uppercase tracking-wider transition-colors ${buttonClass}`}
        onClick={handleListClick}
        disabled={isApproving || isPending || isConfirming || isConfirmed}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ListNFTButton; 