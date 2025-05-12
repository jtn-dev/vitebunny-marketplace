'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  NFT_ABI, 
  NFT_CONTRACT_ADDRESS, 
  signAndSendTransaction 
} from '../utils/walletUtils';
import useDatabaseSync from '../hooks/useDatabaseSync';

const MintNFTButton = ({ name, description, image, collection, onSuccess, onError }) => {
  const { isConnected, address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState('');
  const { syncMintedNFT, isLoading: isSyncing } = useDatabaseSync();

  // Set up contract write hook
  const { writeContractAsync } = useWriteContract();

  // Transaction receipt tracking
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: Boolean(txHash),
    onSuccess: async (data) => {
      try {
        // Get token ID from transaction receipt logs
        const tokenId = extractTokenIdFromLogs(data.logs);
        if (tokenId) {
          // Sync the NFT to MongoDB
          const syncedNft = await syncMintedNFT(tokenId, txHash);
          if (syncedNft) {
            onSuccess?.({ 
              txHash: txHash,
              tokenId: tokenId,
              name,
              collection,
              nft: syncedNft
            });
          }
        } else {
          onSuccess?.({ txHash: txHash, name, collection });
        }
      } catch (error) {
        console.error('Error syncing minted NFT to database:', error);
        // Still consider the transaction successful even if DB sync failed
        onSuccess?.({ txHash: txHash, name, collection });
      }
    }
  });

  // Function to extract token ID from transaction logs
  const extractTokenIdFromLogs = (logs) => {
    try {
      // This is a simplified example - you'd need to decode the logs
      // based on your contract's event structure
      if (logs && logs.length > 0) {
        // Assuming the first log contains the NFTMinted event with tokenId as the first indexed parameter
        return logs[0].topics?.[1] ? parseInt(logs[0].topics[1], 16).toString() : null;
      }
      return null;
    } catch (error) {
      console.error('Error extracting token ID from logs:', error);
      return null;
    }
  };

  const generateMetadataURI = () => {
    // In a real application, you would upload this to IPFS
    // For simplicity, we're creating a mock URI with the data
    const metadata = {
      name,
      description,
      image, // This would normally be an IPFS URL
      attributes: []
    };

    // Creating a fake URI - in production, use IPFS or other decentralized storage
    return `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
  };

  const handleMintClick = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!name || !image || !collection) {
      alert('Missing required fields for minting');
      return;
    }

    try {
      setIsPending(true);

      // Generate metadata URI
      const tokenURI = generateMetadataURI();

      // Mint the NFT
      const result = await signAndSendTransaction(async () => {
        return await writeContractAsync({
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_ABI,
          functionName: 'mintNFT',
          args: [address, tokenURI, collection],
        });
      });

      if (result.success) {
        setTxHash(result.hash);
        // onSuccess callback will be called by useWaitForTransactionReceipt hook
      } else {
        throw new Error(result.error || 'Failed to mint NFT');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      onError?.(error.message || 'Failed to mint NFT');
    } finally {
      setIsPending(false);
    }
  };

  // Button states based on transaction status
  let buttonText = 'Mint NFT';
  let buttonClass = 'bg-primary hover:bg-primary/90 text-white font-medium';
  
  if (isPending || isConfirming || isSyncing) {
    buttonText = isPending ? 'Minting...' : isConfirming ? 'Confirming...' : 'Syncing...';
    buttonClass = 'bg-gray-500 text-white cursor-not-allowed';
  } else if (isConfirmed) {
    buttonText = 'Minted Successfully!';
    buttonClass = 'bg-green-500 text-white';
  }

  return (
    <button
      className={`w-full py-3 px-6 text-center font-medium text-sm uppercase tracking-wider transition-colors ${buttonClass}`}
      onClick={handleMintClick}
      disabled={isPending || isConfirming || isConfirmed || isSyncing}
    >
      <span className="text-white">{buttonText}</span>
    </button>
  );
};

export default MintNFTButton; 