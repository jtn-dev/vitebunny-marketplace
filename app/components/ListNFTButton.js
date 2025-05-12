'use client';

import { useState, useEffect } from 'react';
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
import useDatabaseSync from '../hooks/useDatabaseSync';
import { keccak256, stringToBytes, hexToNumber } from 'viem';

const ListNFTButton = ({ nft, onSuccess, onError }) => {
  const { isConnected, address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approvalTxHash, setApprovalTxHash] = useState('');
  const [txHash, setTxHash] = useState('');
  const [price, setPrice] = useState('');
  const [showPriceInput, setShowPriceInput] = useState(false);
  const { syncListedNFT, isLoading: isSyncing } = useDatabaseSync();
  const [approvalTimeout, setApprovalTimeout] = useState(false);

  // Set up contract write hook
  const { writeContractAsync } = useWriteContract();

  // Helper function to extract market item ID from logs
  const extractMarketItemIdFromLogs = (logs) => {
    try {
      // Find the MarketItemCreated event
      const eventSignature = "MarketItemCreated(uint256,address,uint256,address,address,uint256)";
      // Use viem's keccak256 and stringToBytes
      const eventHash = keccak256(stringToBytes(eventSignature));
      
      const eventLog = logs.find(log => log.topics[0] === eventHash);
      
      if (eventLog) {
        // The first indexed parameter is the itemId (topic[1])
        // Use viem's hexToNumber to parse the hex value
        return hexToNumber(eventLog.topics[1]); 
      }
      return null;
    } catch (error) {
      console.error('Error extracting market item ID from logs:', error);
      return null;
    }
  };

  // Transaction receipt tracking for approval
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approvalTxHash,
    enabled: Boolean(approvalTxHash),
    onSuccess: async (data) => {
      console.log('Approval transaction confirmed:', data);
      setIsApproving(false);
      // Now proceed with listing the NFT
      await createMarketListing();
    },
    onError: (error) => {
      console.error('Approval transaction failed:', error);
      setIsApproving(false);
      setApprovalTimeout(false);
      onError?.('Approval transaction failed: ' + error.message);
    }
  });

  // Transaction receipt tracking for listing
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: Boolean(txHash),
    onSuccess: async (data) => {
      try {
        // Extract market item ID from transaction logs
        const marketItemId = extractMarketItemIdFromLogs(data.logs);
        
        if (marketItemId !== null) {
          // Sync listing data to MongoDB
          const syncedNft = await syncListedNFT(nft.tokenId, marketItemId, price, txHash);
          
          onSuccess?.({ 
            txHash: txHash, 
            nft: syncedNft || nft,
            price,
            marketItemId
          });
        } else {
          console.error('Failed to extract marketItemId from transaction logs.');
          // Still call success, but without marketItemId if extraction failed
          onSuccess?.({ txHash: txHash, nft, price });
        }
      } catch (error) {
        console.error('Error syncing listed NFT to database:', error);
        // Still consider the transaction successful even if DB sync failed
        onSuccess?.({ txHash: txHash, nft, price });
      }
    }
  });

  // Implement timeout for approval transaction
  useEffect(() => {
    let timer;
    if (isApproving && !isApprovalConfirming && !isApprovalConfirmed) {
      timer = setTimeout(() => {
        setApprovalTimeout(true);
      }, 30000); // 30 seconds timeout
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isApproving, isApprovalConfirming, isApprovalConfirmed]);

  // Reset approval timeout if transaction is confirmed or being confirmed
  useEffect(() => {
    if (isApprovalConfirming || isApprovalConfirmed) {
      setApprovalTimeout(false);
    }
  }, [isApprovalConfirming, isApprovalConfirmed]);

  // Function to create market listing after approval
  const createMarketListing = async () => {
    try {
      setIsPending(true);

      // Create the market item
      const listingData = createNFTListingData(
        NFT_CONTRACT_ADDRESS,
        nft.tokenId,
        price
      );

      console.log('Creating market item with data:', {
        nftContract: listingData.nftContract,
        tokenId: listingData.tokenId,
        price: listingData.price.toString()
      });

      const listingResult = await signAndSendTransaction(async () => {
        return await writeContractAsync({
          address: MARKETPLACE_ADDRESS,
          abi: MARKETPLACE_ABI,
          functionName: 'createMarketItem',
          args: [listingData.nftContract, listingData.tokenId, listingData.price],
          gas: BigInt(350000), // Increase gas limit for listing
        });
      });

      if (listingResult.success) {
        setTxHash(listingResult.hash);
        // onSuccess will be called by useWaitForTransactionReceipt hook
      } else {
        throw new Error(listingResult.error || 'Failed to list NFT');
      }
    } catch (error) {
      console.error('Error listing NFT:', error);
      
      // Show more meaningful error message to user
      let errorMessage = 'Failed to list NFT';
      
      if (error.message) {
        if (error.message.includes('NFT must be approved')) {
          errorMessage = 'Marketplace approval failed - please try again';
        } else if (error.message.includes('Only the NFT owner')) {
          errorMessage = 'You must be the owner of this NFT to list it';
        } else if (error.message.includes('Price must be at least')) {
          errorMessage = 'Price must be greater than zero';
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'You rejected the transaction';
        } else {
          // Use the error message but clean it up
          errorMessage = error.message.replace(/^Error: /, '');
        }
      }
      
      onError?.(errorMessage);
    } finally {
      setIsPending(false);
    }
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

    // Validate NFT token ID
    const tokenId = nft.tokenId || nft.id;
    if (!tokenId) {
      onError?.('Invalid NFT: missing token ID');
      return;
    }

    try {
      // First, approve the marketplace to transfer the NFT
      setIsApproving(true);
      setApprovalTimeout(false);
      
      const approvalResult = await signAndSendTransaction(async () => {
        return await writeContractAsync({
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_ABI,
          functionName: 'approve',
          args: [MARKETPLACE_ADDRESS, tokenId],
          gas: BigInt(250000), // Add gas limit for approval
        });
      });

      if (!approvalResult.success) {
        setIsApproving(false);
        throw new Error(approvalResult.error || 'Failed to approve NFT transfer');
      }

      // Set the approval hash so we can track it
      setApprovalTxHash(approvalResult.hash);
      console.log('Approval transaction sent:', approvalResult.hash);
      
      // Note: We don't call createMarketListing here anymore
      // It will be called by the approval transaction receipt hook
    } catch (error) {
      console.error('Error approving NFT transfer:', error);
      setIsApproving(false);
      
      // Show more meaningful error message to user
      let errorMessage = 'Failed to approve NFT transfer';
      
      if (error.message) {
        if (error.message.includes('user rejected')) {
          errorMessage = 'You rejected the approval transaction';
        } else {
          // Use the error message but clean it up
          errorMessage = error.message.replace(/^Error: /, '');
        }
      }
      
      onError?.(errorMessage);
    }
  };

  // Reset function for when approval times out
  const handleApprovalReset = () => {
    setIsApproving(false);
    setApprovalTimeout(false);
    setApprovalTxHash('');
  };

  // Button states based on transaction status
  let buttonText = 'List for Sale';
  let buttonClass = 'bg-primary hover:bg-primary/90 text-white font-medium';
  
  if (showPriceInput && !isPending && !isConfirming && !isConfirmed && !isSyncing && !isApproving) {
    buttonText = 'Create Listing';
  } else if (approvalTimeout) {
    buttonText = 'Approval Timed Out - Retry';
    buttonClass = 'bg-red-500 text-white';
  } else if (isApproving || isApprovalConfirming) {
    buttonText = 'Approving...';
    buttonClass = 'bg-yellow-500 text-white cursor-wait';
  } else if (isPending) {
    buttonText = 'Listing...';
    buttonClass = 'bg-yellow-500 text-white cursor-wait';
  } else if (isConfirming) {
    buttonText = 'Confirming...';
    buttonClass = 'bg-yellow-600 text-white cursor-wait';
  } else if (isSyncing) {
    buttonText = 'Syncing...';
    buttonClass = 'bg-yellow-600 text-white cursor-wait';
  } else if (isConfirmed) {
    buttonText = 'Listed Successfully!';
    buttonClass = 'bg-green-500 text-white';
  }

  // Don't show button if the user doesn't own the NFT
  if (address && nft.owner && address.toLowerCase() !== nft.owner.toLowerCase()) {
    return null;
  }

  return (
    <div className="w-full">
      {showPriceInput && !isPending && !isConfirming && !isConfirmed && !isSyncing && !isApproving && !approvalTimeout ? (
        <div className="mb-4 flex gap-2">
          <input
            type="number"
            step="0.001"
            min="0"
            placeholder="Price in ETH"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 focus:border-primary focus:ring-primary text-black"
            disabled={isPending || isConfirming || isConfirmed || isSyncing || isApproving}
          />
        </div>
      ) : null}
      
      {approvalTimeout ? (
        <button
          className={`w-full py-3 px-6 text-center font-medium text-sm uppercase tracking-wider transition-colors ${buttonClass}`}
          onClick={handleApprovalReset}
        >
          <span className="text-white">{buttonText}</span>
        </button>
      ) : (
        <button
          className={`w-full py-3 px-6 text-center font-medium text-sm uppercase tracking-wider transition-colors ${buttonClass}`}
          onClick={handleListClick}
          disabled={isPending || isConfirming || isConfirmed || isSyncing || (isApproving && !approvalTimeout)}
        >
          <span className="text-white">{buttonText}</span>
        </button>
      )}
    </div>
  );
};

export default ListNFTButton; 