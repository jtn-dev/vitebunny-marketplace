'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaEthereum, FaWallet, FaCheckCircle, FaTwitter, FaDiscord, FaGlobe, FaShareAlt } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import NFTCard from '../../components/NFTCard';
import { collections, nfts } from '../../utils/dummyData';
import { truncateAddress } from '../../utils/walletUtils';

export default function CollectionDetail() {
  const params = useParams();
  const { slug } = params;
  const { address } = useAccount();
  const [collection, setCollection] = useState(null);
  const [collectionNFTs, setCollectionNFTs] = useState([]);
  const [activeTab, setActiveTab] = useState('items');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Find the collection by slug
    const foundCollection = collections.find(c => c.slug === slug);
    setCollection(foundCollection);
    
    // Find NFTs in this collection
    if (foundCollection) {
      const filteredNFTs = nfts.filter(nft => nft.collection === foundCollection.name);
      setCollectionNFTs(filteredNFTs);
    }
  }, [slug]);
  
  if (!mounted || !collection) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-48 bg-card-bg rounded-xl w-full mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="h-32 w-32 bg-card-bg rounded-xl"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-card-bg rounded w-1/2"></div>
              <div className="h-6 bg-card-bg rounded w-1/3"></div>
              <div className="h-24 bg-card-bg rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const isOwner = address?.toLowerCase() === collection.owner.toLowerCase();
  
  return (
    <main className="w-full">
      {/* Banner Image */}
      <div className="w-full h-48 md:h-64 relative">
        <Image 
          src={collection.bannerImage}
          alt={`${collection.name} banner`}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Collection Avatar */}
          <div className="relative -mt-20 h-32 w-32 md:h-40 md:w-40 rounded-xl overflow-hidden border-4 border-background shadow-lg">
            <Image 
              src={collection.avatarImage}
              alt={`${collection.name} avatar`}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          
          {/* Collection Details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold">{collection.name}</h1>
              {collection.verified && (
                <FaCheckCircle className="text-green-500 h-5 w-5" />
              )}
            </div>
            
            <div className="flex items-center mt-2 text-foreground/70">
              <span className="mr-1">Created by</span>
              <Link href={`/user/${collection.owner}`} className="text-primary hover:underline">
                {truncateAddress(collection.owner)}
              </Link>
              {isOwner && (
                <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">You own this</span>
              )}
            </div>
            
            <p className="mt-4 text-foreground/80 max-w-3xl">
              {collection.description}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-6">
              <div>
                <p className="text-sm text-foreground/60">Floor Price</p>
                <div className="flex items-center mt-1">
                  <FaEthereum className="h-4 w-4 text-primary mr-1" />
                  <span className="font-bold text-lg">{collection.floorPrice}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-foreground/60">Volume Traded</p>
                <div className="flex items-center mt-1">
                  <FaEthereum className="h-4 w-4 text-primary mr-1" />
                  <span className="font-bold text-lg">{collection.volume}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-foreground/60">Items</p>
                <p className="font-bold text-lg mt-1">{collection.items}</p>
              </div>
              
              <div>
                <p className="text-sm text-foreground/60">Owners</p>
                <p className="font-bold text-lg mt-1">{Math.ceil(collection.items * 0.7)}</p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`https://twitter.com/share?url=${encodeURIComponent(`https://vitebunny.com/collections/${slug}`)}&text=${encodeURIComponent(`Check out the ${collection.name} collection on Vite Bunny!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-card-bg rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </Link>
              
              <Link
                href="#"
                className="p-2 bg-card-bg rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <FaDiscord className="h-5 w-5" />
              </Link>
              
              <Link
                href="#"
                className="p-2 bg-card-bg rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <FaGlobe className="h-5 w-5" />
              </Link>
              
              <button
                className="p-2 bg-card-bg rounded-full hover:bg-primary hover:text-white transition-colors ml-auto"
                onClick={() => navigator.clipboard.writeText(`https://vitebunny.com/collections/${slug}`)}
              >
                <FaShareAlt className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-10 border-b border-border">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('items')}
              className={`pb-3 px-4 font-medium text-sm ${
                activeTab === 'items' 
                  ? 'border-b-2 border-primary' 
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Items ({collectionNFTs.length})
            </button>
            
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-3 px-4 font-medium text-sm ${
                activeTab === 'activity' 
                  ? 'border-b-2 border-primary' 
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Activity
            </button>
            
            <button
              onClick={() => setActiveTab('owners')}
              className={`pb-3 px-4 font-medium text-sm ${
                activeTab === 'owners' 
                  ? 'border-b-2 border-primary' 
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Owners
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'items' && (
            <div>
              {collectionNFTs.length > 0 ? (
                <div className="nft-grid">
                  {collectionNFTs.map(nft => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-xl font-light text-text-muted">No NFTs in this collection yet</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card-bg flex items-center justify-center">
                <FaEthereum className="h-8 w-8 text-primary/40" />
              </div>
              <p className="text-xl font-light text-text-muted">No recent activity</p>
              <p className="text-text-light mt-2 text-sm">Recent trades and listings will appear here</p>
            </div>
          )}
          
          {activeTab === 'owners' && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card-bg flex items-center justify-center">
                <FaWallet className="h-8 w-8 text-primary/40" />
              </div>
              <p className="text-xl font-light text-text-muted">Owners information coming soon</p>
              <p className="text-text-light mt-2 text-sm">We&apos;re working on this feature</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 