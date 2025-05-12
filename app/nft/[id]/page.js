'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FaEthereum, FaHeart, FaShare, FaRegHeart, FaEye, FaHistory, FaTags, FaChevronDown, FaChevronUp, FaWallet } from 'react-icons/fa';
import Button from '../../components/Button';
import NFTCard from '../../components/NFTCard';
import BuyNFTButton from '../../components/BuyNFTButton';
import ListNFTButton from '../../components/ListNFTButton';
import { useAccount } from 'wagmi';
import { truncateAddress } from '../../utils/walletUtils';
import { nfts as dummyNfts } from '../../utils/dummyData'; // Import dummy data for fallback
import { getNFTImagePath } from '../../utils/imageUtils';

const getTruncatedAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function NFTDetail({ params }) {
  const { id } = params;
  const [nft, setNft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showAllAttributes, setShowAllAttributes] = useState(false);
  const [relatedNfts, setRelatedNfts] = useState([]);
  const { address } = useAccount();
  const [txStatus, setTxStatus] = useState(null);
  const [hasRefreshed, setHasRefreshed] = useState(false);
  const [usingDummyData, setUsingDummyData] = useState(false);
  
  // Fetch NFT data from our API
  const fetchNFT = async () => {
    try {
      setIsLoading(true);
      
      // First try using the ID as tokenId
      const response = await fetch(`/api/nfts?tokenId=${id}`);
      
      if (!response.ok) {
        console.warn(`NFT not found with tokenId=${id}, trying id=${id}`);
        // If not found as tokenId, try as legacy id 
        // This allows compatibility with older links
        const legacyResponse = await fetch(`/api/nfts?id=${id}`);
        
        if (!legacyResponse.ok) {
          throw new Error('Failed to fetch NFT');
        }
        
        const data = await legacyResponse.json();
        
        // Ensure the NFT has all required fields
        const safeNft = {
          ...data,
          name: data.name || `Bunny NFT #${data.tokenId || data.id || id}`,
          description: data.description || 'A unique Bunny NFT',
          collection: data.collection || 'Bunny Collection',
          image: data.image || '',
          price: data.price || '0',
          isListed: Boolean(data.isListed),
          metadata: data.metadata || {},
          // Ensure it has tokenId and id
          tokenId: data.tokenId || data.id || id,
          id: data.id || data.tokenId || id
        };
        
        setNft(safeNft);
        setLikeCount(safeNft.likes || 0);
        setUsingDummyData(data.source === 'dummy');
        
        console.log("Fetched NFT data:", safeNft);
        return safeNft;
      }
      
      const data = await response.json();
      
      // Ensure the NFT has all required fields
      const safeNft = {
        ...data,
        name: data.name || `Bunny NFT #${data.tokenId || data.id || id}`,
        description: data.description || 'A unique Bunny NFT',
        collection: data.collection || 'Bunny Collection',
        image: data.image || '',
        price: data.price || '0',
        isListed: Boolean(data.isListed),
        metadata: data.metadata || {},
        // Ensure it has tokenId and id
        tokenId: data.tokenId || data.id || id,
        id: data.id || data.tokenId || id
      };
      
      setNft(safeNft);
      setLikeCount(safeNft.likes || 0);
      setUsingDummyData(data.source === 'dummy');
      
      console.log("Fetched NFT data:", safeNft);
      return safeNft;
    } catch (error) {
      console.error('Error fetching NFT:', error);
      
      // Fallback to dummy data
      console.log('Falling back to dummy data');
      const dummyNft = dummyNfts.find(nft => nft.id === id || nft.tokenId === id);
      
      if (dummyNft) {
        // Ensure the dummy NFT has all required fields
        const safeDummyNft = {
          ...dummyNft,
          name: dummyNft.name || `Bunny NFT #${id}`,
          description: dummyNft.description || 'A unique Bunny NFT',
          collection: dummyNft.collection || 'Bunny Collection',
          tokenId: dummyNft.tokenId || dummyNft.id || id,
          id: dummyNft.id || dummyNft.tokenId || id,
          creator: dummyNft.creator || '0x000...',
          owner: dummyNft.owner || '0x000...',
          price: dummyNft.price || '0',
          isListed: Boolean(dummyNft.isListed),
          collectionName: dummyNft.collectionName || dummyNft.collection || 'Bunny Collection',
          likes: dummyNft.likes || 0,
        };
        
        setNft(safeDummyNft);
        setLikeCount(safeDummyNft.likes || 0);
        setUsingDummyData(true);
        return safeDummyNft;
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch related NFTs from the same collection
  const fetchRelatedNFTs = async (collectionName) => {
    try {
      const response = await fetch(`/api/nfts?collection=${encodeURIComponent(collectionName)}&limit=4`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch related NFTs');
      }
      
      const data = await response.json();
      
      let relatedItems = [];
      
      // Check if we got an array directly or inside a nfts property
      if (Array.isArray(data)) {
        relatedItems = data;
      } else if (data.nfts && Array.isArray(data.nfts)) {
        relatedItems = data.nfts;
      } else {
        console.warn('Unexpected response format for related NFTs');
        relatedItems = [];
      }
      
      // Filter out the current NFT and limit to 4
      const filtered = relatedItems
        .filter(item => (item.tokenId !== id && item.id !== id))
        .slice(0, 4);
      
      setRelatedNfts(filtered);
    } catch (error) {
      console.error('Error fetching related NFTs:', error);
      
      // Fallback to dummy data for related NFTs
      if (usingDummyData) {
        const filtered = dummyNfts
          .filter(item => item.collection === collectionName && item.id !== id)
          .slice(0, 4);
        
        setRelatedNfts(filtered);
      }
    }
  };
  
  useEffect(() => {
    const loadNFT = async () => {
      const nftData = await fetchNFT();
      
      if (nftData) {
        // Fetch related NFTs from the same collection
        await fetchRelatedNFTs(nftData.collection);
      }
    };
    
    loadNFT();
  }, [id]);
  
  // Refresh data after transactions
  useEffect(() => {
    // Only refresh once after a transaction is completed
    if (txStatus && txStatus.type === 'success' && !hasRefreshed) {
      const refreshData = async () => {
        await fetchNFT();
        setHasRefreshed(true);
      };
      
      // Wait a short time to allow blockchain indexing
      const timer = setTimeout(() => {
        refreshData();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [txStatus, hasRefreshed]);
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    
    // In a real app, you would save this to the database
  };
  
  const handlePurchaseSuccess = ({ txHash, nft: updatedNft }) => {
    setTxStatus({
      type: 'success',
      message: 'Purchase successful!',
      txHash
    });
    
    // If we got an updated NFT object from the DB, update state immediately
    if (updatedNft) {
      setNft(updatedNft);
    }
    
    setHasRefreshed(false);
  };

  const handlePurchaseError = (errorMessage) => {
    setTxStatus({
      type: 'error',
      message: errorMessage
    });
  };
  
  const handleListingSuccess = ({ txHash, price, nft: updatedNft }) => {
    setTxStatus({
      type: 'success',
      message: `NFT listed successfully for ${price} ETH!`,
      txHash
    });
    
    // If we got an updated NFT object from the DB, update state immediately
    if (updatedNft) {
      setNft(updatedNft);
    }
    
    setHasRefreshed(false);
  };
  
  // If NFT not found
  if (!isLoading && !nft) {
    return notFound();
  }
  
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-card-bg rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card-bg rounded-xl aspect-square"></div>
            <div className="space-y-4">
              <div className="h-10 bg-card-bg rounded w-3/4"></div>
              <div className="h-6 bg-card-bg rounded w-1/2"></div>
              <div className="h-24 bg-card-bg rounded w-full"></div>
              <div className="h-12 bg-card-bg rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm mb-8">
        <ol className="flex space-x-2">
          <li>
            <Link href="/" className="text-foreground/60 hover:text-primary">Home</Link>
          </li>
          <li className="text-foreground/60">/</li>
          <li>
            <Link href="/explore" className="text-foreground/60 hover:text-primary">Explore</Link>
          </li>
          <li className="text-foreground/60">/</li>
          <li>
            <Link href={`/collections/${(nft.collectionName || nft.collection).toLowerCase().replace(/\s+/g, '-')}`} className="text-foreground/60 hover:text-primary">
              {nft.collectionName || nft.collection}
            </Link>
          </li>
          <li className="text-foreground/60">/</li>
          <li className="text-foreground/80 font-medium">{nft.name}</li>
        </ol>
      </nav>
      
      {/* NFT Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - NFT image */}
        <div>
          <div className="rounded-xl overflow-hidden border border-border bg-card-bg shadow-lg">
            <div className="aspect-square relative overflow-hidden">
              <Image 
                src={getNFTImagePath(nft)}
                alt={nft.name} 
                width={800}
                height={800}
                className="w-full h-full object-cover" 
                priority
              />
            </div>
          </div>
        </div>
        
        {/* Right Column - NFT Information */}
        <div className="flex flex-col space-y-6">
          <div>
            <Link 
              href={`/collections/${(nft.collectionName || nft.collection).toLowerCase().replace(/\s+/g, '-')}`}
              className="text-primary hover:underline"
            >
              {nft.collectionName || nft.collection}
            </Link>
            <h1 className="text-3xl font-bold mt-1">{nft.name}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-foreground/60 text-sm">Owned by</p>
              <Link 
                href={`/user/${nft.owner}`} 
                className="text-foreground hover:text-primary"
              >
                {getTruncatedAddress(nft.owner)}
              </Link>
            </div>
            <div>
              <p className="text-foreground/60 text-sm">Created by</p>
              <Link 
                href={`/user/${nft.creator}`} 
                className="text-foreground hover:text-primary"
              >
                {getTruncatedAddress(nft.creator)}
              </Link>
            </div>
          </div>
          
          <div className="bg-card-bg rounded-xl p-6 border border-border">
            <p className="text-foreground/60 text-sm mb-2">Current Price</p>
            <div className="flex items-center space-x-2">
              <FaEthereum className="text-2xl" />
              <span className="text-3xl font-bold">{nft.isListed ? nft.price : 'Not for sale'}</span>
              {nft.isListed && <span className="text-foreground/60">ETH</span>}
            </div>
            
            <div className="grid grid-cols-1 gap-4 mt-6">
              {address?.toLowerCase() === nft.owner.toLowerCase() ? (
                <ListNFTButton 
                  nft={nft} 
                  onSuccess={handleListingSuccess}
                onError={(error) => {
                  setTxStatus({
                    type: 'error',
                    message: error
                  });
                  }} 
                />
              ) : nft.isListed ? (
                <BuyNFTButton 
                  nft={nft} 
                  onSuccess={handlePurchaseSuccess}
                  onError={handlePurchaseError}
                  className="w-full"
                />
              ) : (
                <Button disabled className="w-full bg-gray-500 cursor-not-allowed">
                  Not For Sale
                </Button>
              )}
            </div>
          </div>
          
          {/* Add transaction status message if available */}
          {txStatus && (
            <div className={`mt-4 p-3 rounded text-sm ${txStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {txStatus.message}
              {txStatus.txHash && (
                <div className="mt-1">
                  <a 
                    href={`https://etherscan.io/tx/${txStatus.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View on Etherscan
                  </a>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-card-bg rounded-xl p-6 border border-border">
            <h2 className="font-medium mb-4">Description</h2>
            <p className="text-foreground/80">{nft.description}</p>
          </div>
          
          {/* NFT Properties */}
          {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
          <div className="bg-card-bg rounded-xl p-6 border border-border">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowAllAttributes(!showAllAttributes)}
            >
              <h2 className="font-medium">Properties</h2>
              <button>
                {showAllAttributes ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
              {(showAllAttributes || nft.metadata.attributes.length <= 3) ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {nft.metadata.attributes.map((attr, index) => (
                  <div key={index} className="bg-background rounded-lg p-3 border border-border">
                    <p className="text-primary text-xs uppercase font-medium">{attr.trait_type}</p>
                    <p className="font-medium mt-1">{attr.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {nft.metadata.attributes.slice(0, 3).map((attr, index) => (
                  <div key={index} className="bg-background rounded-lg p-3 border border-border">
                    <p className="text-primary text-xs uppercase font-medium">{attr.trait_type}</p>
                    <p className="font-medium mt-1">{attr.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              onClick={toggleLike}
              className="flex items-center justify-center py-2 px-4 border border-border rounded-lg hover:bg-card-bg"
            >
              {isLiked ? <FaHeart className="text-red-500 mr-2" /> : <FaRegHeart className="mr-2" />}
              {likeCount}
            </button>
            <button className="flex items-center justify-center py-2 px-4 border border-border rounded-lg hover:bg-card-bg">
              <FaShare className="mr-2" />
              Share
            </button>
            <button className="flex items-center justify-center py-2 px-4 border border-border rounded-lg hover:bg-card-bg ml-auto">
              <FaEye className="mr-2" />
              View on Etherscan
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs Content - You could expand this with transaction history, etc. */}
      <div className="mt-12 border-t border-border pt-12">
        <div className="flex space-x-8 mb-8">
          <button className="border-b-2 border-primary font-medium pb-2">
            <FaHistory className="inline mr-2" />
            Activity
          </button>
          <button className="text-foreground/60 hover:text-foreground pb-2">
            <FaTags className="inline mr-2" />
            Offers
          </button>
        </div>
        
        <div className="bg-card-bg rounded-xl p-6 border border-border">
          <p className="text-center text-foreground/60 py-8">No activity found for this NFT</p>
        </div>
      </div>
      
      {/* Related NFTs */}
      {relatedNfts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">More from this collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedNfts.map(nft => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 