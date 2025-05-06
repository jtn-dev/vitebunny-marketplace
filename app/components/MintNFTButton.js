'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { 
  NFT_ABI, 
  NFT_CONTRACT_ADDRESS, 
  signAndSendTransaction 
} from '../utils/walletUtils';

const MintNFTButton = ({ name, description, image, collection, onSuccess, onError }) => {
  const { isConnected, address } = useAccount();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Set up contract write hook
  const { writeContractAsync } = useWriteContract();

  // Transaction receipt tracking
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: Boolean(txHash),
  });

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
        onSuccess?.({ 
          txHash: result.hash,
          name,
          collection
        });
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
  
  if (isPending || isConfirming) {
    buttonText = isPending ? 'Minting...' : 'Confirming...';
    buttonClass = 'bg-gray-500 text-white cursor-not-allowed';
  } else if (isConfirmed) {
    buttonText = 'Minted Successfully!';
    buttonClass = 'bg-green-500 text-white';
  }

  return (
    <button
      className={`w-full py-3 px-6 text-center font-medium text-sm uppercase tracking-wider transition-colors ${buttonClass}`}
      onClick={handleMintClick}
      disabled={isPending || isConfirming || isConfirmed}
    >
      <span className="text-white">{buttonText}</span>
    </button>
  );
};

export default MintNFTButton; 