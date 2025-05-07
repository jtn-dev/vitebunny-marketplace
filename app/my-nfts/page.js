'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaEthereum } from 'react-icons/fa';
import Button from '../components/Button';
import { nfts } from '../utils/dummyData';
import ListNFTButton from '../components/ListNFTButton';

export default function MyNFTs() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [myNFTs, setMyNFTs] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showListModal, setShowListModal] = useState(false);
  const [listingStatus, setListingStatus] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    // In a real app, this would be an API call to fetch user's NFTs
    // For this demo, we're filtering the dummy data
    if (address) {
      const userNFTs = nfts.filter(
        nft => nft.owner.toLowerCase() === address.toLowerCase()
      );
      setMyNFTs(userNFTs);
    }
  }, [address]);

  const handleSellClick = (nft) => {
    setSelectedNFT(nft);
    setShowListModal(true);
  };

  const handleListingSuccess = ({ txHash, nft, price }) => {
    setListingStatus({
      type: 'success',
      message: `Successfully listed ${nft.name} for ${price} ETH`,
      txHash
    });
    
    // Close the modal after a delay
    setTimeout(() => {
      setShowListModal(false);
      // Refresh NFTs (in a real app, this would fetch the updated list)
    }, 3000);
  };

  const handleListingError = (error) => {
    setListingStatus({
      type: 'error',
      message: error
    });
  };

  // Don't render during SSR to avoid hydration errors
  if (!mounted) {
    return null;
  }

  // Redirect to login if not connected
  if (mounted && !isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold mb-4">My NFTs</h1>
          <p className="text-foreground/70 mb-6">Connect your wallet to view and manage your NFTs</p>
          <Link href="/" className="text-primary hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/" className="text-foreground/60 hover:text-primary inline-flex items-center">
          <FaArrowLeft className="mr-2" /> Back to home
        </Link>
        <h1 className="text-3xl font-bold mt-4">My NFTs</h1>
        <p className="text-foreground/70 mt-2">View and manage your NFT collection</p>
      </div>

      {myNFTs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myNFTs.map(nft => (
            <div key={nft.id} className="bg-card-bg rounded-xl overflow-hidden border border-border hover:border-primary transition-colors">
              <Link href={`/nft/${nft.id}`} className="block">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={nft.image} 
                    alt={nft.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
                <div className="p-4">
                  <p className="text-foreground/60 text-sm">{nft.collection}</p>
                  <h3 className="font-medium text-lg mt-1">{nft.name}</h3>
                  
                  <div className="flex items-center mt-3">
                    <FaEthereum className="text-primary mr-1" />
                    <span className="font-medium">{nft.price} ETH</span>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <Button 
                  variant="primary" 
                  isFullWidth
                  onClick={() => handleSellClick(nft)}
                >
                  Sell NFT
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card-bg rounded-xl border border-border">
          <h2 className="text-xl font-medium mb-2">No NFTs Found</h2>
          <p className="text-foreground/60 mb-6">You don&apos;t have any NFTs in your wallet yet</p>
          <Link href="/explore" className="text-primary inline-flex items-center hover:underline">
            Explore NFTs to buy
          </Link>
        </div>
      )}

      {/* Listing Modal */}
      {showListModal && selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card-bg rounded-xl p-6 max-w-md w-full border border-border">
            <h2 className="text-xl font-bold mb-4">List {selectedNFT.name} for Sale</h2>
            
            <div className="flex items-center mb-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden mr-4">
                <img 
                  src={selectedNFT.image} 
                  alt={selectedNFT.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="text-foreground/60 text-sm">{selectedNFT.collection}</p>
                <h3 className="font-medium">{selectedNFT.name}</h3>
              </div>
            </div>
            
            {listingStatus && (
              <div 
                className={`mb-4 p-3 rounded-lg ${
                  listingStatus.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                <p>{listingStatus.message}</p>
                {listingStatus.txHash && (
                  <a 
                    href={`https://etherscan.io/tx/${listingStatus.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                  >
                    View transaction
                  </a>
                )}
              </div>
            )}

            <ListNFTButton 
              nft={selectedNFT} 
              onSuccess={handleListingSuccess}
              onError={handleListingError}
            />
            
            <button 
              className="w-full mt-4 py-2 text-foreground/60 hover:text-foreground"
              onClick={() => {
                setShowListModal(false);
                setListingStatus(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 