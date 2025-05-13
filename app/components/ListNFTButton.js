'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
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
  const [skipApproval, setSkipApproval] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Set up contract write hook
  const { writeContractAsync } = useWriteContract();

  // Check if NFT is already approved
  const tokenId = nft.tokenId || nft.id;
  const { data: approvedAddress } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'getApproved',
    args: [tokenId],
    enabled: Boolean(tokenId),
  });

  // Reset states when NFT changes
  useEffect(() => {
    setApprovalTxHash('');
    setTxHash('');
    setApprovalTimeout(false);
    setIsApproving(false);
    setIsPending(false);
    setSkipApproval(false);
    setRetryCount(0);
  }, [nft.tokenId, nft.id]);

  // Check if we can skip approval
  useEffect(() => {
    if (approvedAddress && MARKETPLACE_ADDRESS && 
        approvedAddress.toLowerCase() === MARKETPLACE_ADDRESS.toLowerCase()) {
      setSkipApproval(true);
      console.log("NFT already approved for marketplace, skipping approval step");
    } else {
      setSkipApproval(false);
    }
  }, [approvedAddress, MARKETPLACE_ADDRESS]);

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
      setApprovalTimeout(false);
      setRetryCount(0);
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

  // Implement timeout for approval transaction - more aggressive now (15 seconds instead of 30)
  useEffect(() => {
    let timer;
    if (isApproving && !isApprovalConfirming && !isApprovalConfirmed) {
      timer = setTimeout(() => {
        setApprovalTimeout(true);
        setIsApproving(false);
      }, 15000); // 15 seconds timeout
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
    console.log('=== CREATE MARKET LISTING STARTED ===');
    try {
      setIsPending(true);

      // Create the market item
      const listingData = createNFTListingData(
        NFT_CONTRACT_ADDRESS,
        tokenId,
        price
      );

      console.log('Creating market item with data:', {
        nftContract: listingData.nftContract,
        tokenId: listingData.tokenId,
        price: listingData.price.toString()
      });

      const listingResult = await signAndSendTransaction(async () => {
        console.log('Calling writeContractAsync for createMarketItem');
        return await writeContractAsync({
          address: MARKETPLACE_ADDRESS,
          abi: MARKETPLACE_ABI,
          functionName: 'createMarketItem',
          args: [listingData.nftContract, listingData.tokenId, listingData.price],
          gas: BigInt(350000), // Increase gas limit for listing
        });
      });

      console.log('Listing transaction result:', listingResult);
      
      if (listingResult.success) {
        setTxHash(listingResult.hash);
        // onSuccess will be called by useWaitForTransactionReceipt hook
      } else {
        throw new Error(listingResult.error || 'Failed to list NFT');
      }
    } catch (error) {
      console.error('=== LISTING ERROR ===', error);
      
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

  const handleApproveNFT = async () => {
    console.log('=== APPROVE NFT STARTED ===');
    try {
      setIsApproving(true);
      setApprovalTimeout(false);
      
      // Get the contract addresses, use window fallbacks if necessary
      const nftContractAddress = NFT_CONTRACT_ADDRESS || 
                               (typeof window !== 'undefined' ? window.NFT_CONTRACT_ADDRESS : null) || 
                               '0x1dac5D6276B2912BBb33a04E981B67080e90c428';
                               
      const marketplaceAddress = MARKETPLACE_ADDRESS || 
                               (typeof window !== 'undefined' ? window.MARKETPLACE_ADDRESS : null) || 
                               '0x45A7B09126cb5Ff067960E3bB924D78800c219A0';
      
      console.log('Approval request details:', {
        NFT_CONTRACT_ADDRESS: nftContractAddress,
        MARKETPLACE_ADDRESS: marketplaceAddress,
        tokenId,
        gas: '300000'
      });

      // First, let's validate we have all the required info
      if (!tokenId) {
        throw new Error('Missing token ID for approval');
      }
      
      if (!nftContractAddress) {
        throw new Error('Missing NFT contract address');
      }
      
      if (!marketplaceAddress) {
        throw new Error('Missing marketplace address');
      }
      
      // Try with a direct contract call without the signAndSendTransaction wrapper first
      console.log('Calling writeContractAsync directly for approval');
      try {
        const tx = await writeContractAsync({
          address: nftContractAddress,
          abi: NFT_ABI,
          functionName: 'approve',
          args: [marketplaceAddress, tokenId],
          gas: BigInt(300000), // Increase gas limit for approval
        });
        
        console.log('Direct approval transaction response:', tx);
        setApprovalTxHash(tx.hash);
        return true;
      } catch (directError) {
        console.error('Direct approval failed, trying with signAndSendTransaction wrapper:', directError);
        
        // Fall back to the signAndSendTransaction wrapper
        const approvalResult = await signAndSendTransaction(async () => {
          return await writeContractAsync({
            address: nftContractAddress,
            abi: NFT_ABI,
            functionName: 'approve',
            args: [marketplaceAddress, tokenId],
            gas: BigInt(300000), // Increase gas limit for approval
          });
        });

        console.log('Approval transaction result:', approvalResult);
        
        if (!approvalResult.success) {
          setIsApproving(false);
          throw new Error(approvalResult.error || 'Failed to approve NFT transfer');
        }

        // Set the approval hash so we can track it
        setApprovalTxHash(approvalResult.hash);
        console.log('Approval transaction sent:', approvalResult.hash);
      }
      
    } catch (error) {
      console.error('=== APPROVAL ERROR ===', error);
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
      return false;
    }
    
    return true;
  };

  const handleListClick = async () => {
    console.log('=== LIST BUTTON CLICKED ===');
    console.log('Button state:', {
      isConnected,
      showPriceInput,
      price,
      tokenId,
      skipApproval,
      NFT_CONTRACT_ADDRESS,
      MARKETPLACE_ADDRESS
    });
    
    if (!isConnected) {
      console.log('Not connected to wallet');
      alert('Please connect your wallet first');
      return;
    }

    if (!showPriceInput) {
      console.log('Showing price input');
      setShowPriceInput(true);
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      console.log('Invalid price:', price);
      alert('Please enter a valid price');
      return;
    }

    // Validate NFT token ID
    if (!tokenId) {
      console.log('Invalid tokenId:', tokenId);
      onError?.('Invalid NFT: missing token ID');
      return;
    }

    console.log('Proceeding with NFT listing process');
    console.log('Skip approval:', skipApproval);
    
    // If we can skip approval, go straight to listing
    if (skipApproval) {
      console.log('Skipping approval, going straight to listing');
      await createMarketListing();
      return;
    }

    // Otherwise, handle the approval flow
    console.log('Starting approval process');
    await handleApproveNFT();
  };

  // Reset function for when approval times out
  const handleApprovalReset = async () => {
    setIsApproving(false);
    setApprovalTimeout(false);
    setApprovalTxHash('');
    setRetryCount(prev => prev + 1);
    
    // If we've tried approving multiple times, try to list directly
    if (retryCount >= 2) {
      // Try to list directly, assuming approval might have happened but transaction tracking failed
      await createMarketListing();
    } else {
      // Try approval again
      await handleApproveNFT();
    }
  };

  // Button states based on transaction status
  let buttonText = 'List for Sale';
  let buttonClass = 'bg-primary hover:bg-primary/90 text-white font-medium';
  
  if (showPriceInput && !isPending && !isConfirming && !isConfirmed && !isSyncing && !isApproving) {
    buttonText = skipApproval ? 'Create Listing' : 'Approve & List';
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
      
      {retryCount > 0 && !approvalTimeout && !isApproving && !isPending && !isConfirming && (
        <div className="mt-2 text-xs text-red-500">
          Previous approval attempt failed. {retryCount >= 2 ? "Try refreshing the page if problems persist." : ""}
        </div>
      )}
    </div>
  );
};

export default ListNFTButton; 