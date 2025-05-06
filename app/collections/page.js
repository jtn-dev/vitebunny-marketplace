'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaCheck, FaEthereum, FaFilter, FaSort } from 'react-icons/fa';
import { useAccount } from 'wagmi';
import CollectionCard from '../components/CollectionCard';
import { collections } from '../utils/dummyData';
import Link from 'next/link';

export default function Collections() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, verified
  const [sortBy, setSortBy] = useState('volume'); // volume, floor, items
  const [showFilters, setShowFilters] = useState(false);
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Sort and filter collections
  const filteredCollections = collections
    .filter(collection => {
      // Apply search filter
      const matchesSearch = 
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply verification filter
      const matchesFilter = filter === 'all' || (filter === 'verified' && collection.verified);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Apply sorting
      switch(sortBy) {
        case 'volume':
          return parseFloat(b.volume) - parseFloat(a.volume);
        case 'floor':
          return parseFloat(b.floorPrice) - parseFloat(a.floorPrice);
        case 'items':
          return b.items - a.items;
        default:
          return 0;
      }
    });
  
  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-card-bg rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-card-bg rounded w-1/2 mb-8"></div>
          <div className="h-12 bg-card-bg rounded w-full mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card-bg rounded-xl h-72"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">NFT Collections</h1>
          <p className="text-foreground/70 mt-2">Explore popular collections from artists worldwide</p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-card-bg rounded-xl p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-foreground/40" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-3 w-full rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none font-medium"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center p-3 rounded-lg border border-border bg-background"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
              
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    filter === 'all' ? 'bg-primary text-white' : 'bg-background border border-border hover:bg-primary/10'
                  }`}
                >
                  All Collections
                </button>
                <button
                  onClick={() => setFilter('verified')}
                  className={`py-2 px-4 rounded-lg transition-colors flex items-center ${
                    filter === 'verified' ? 'bg-primary text-white' : 'bg-background border border-border hover:bg-primary/10'
                  }`}
                >
                  <FaCheck className="mr-1" /> Verified Only
                </button>
              </div>
              
              <div className="hidden md:block relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none py-2 pl-4 pr-10 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none font-medium"
                >
                  <option value="volume" className="font-medium">Highest Volume</option>
                  <option value="floor" className="font-medium">Highest Floor</option>
                  <option value="items" className="font-medium">Most Items</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaSort className="text-foreground/40" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border md:hidden">
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    filter === 'all' ? 'bg-primary text-white' : 'bg-background border border-border hover:bg-primary/10'
                  }`}
                >
                  All Collections
                </button>
                <button
                  onClick={() => setFilter('verified')}
                  className={`py-2 px-4 rounded-lg transition-colors flex items-center ${
                    filter === 'verified' ? 'bg-primary text-white' : 'bg-background border border-border hover:bg-primary/10'
                  }`}
                >
                  <FaCheck className="mr-1" /> Verified Only
                </button>
              </div>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full py-2 pl-4 pr-10 rounded-lg border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none font-medium"
                >
                  <option value="volume" className="font-medium">Highest Volume</option>
                  <option value="floor" className="font-medium">Highest Floor</option>
                  <option value="items" className="font-medium">Most Items</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaSort className="text-foreground/40" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Wallet Connection Notice */}
        {!isConnected && (
          <div className="bg-card-bg rounded-xl p-6 border border-border text-center">
            <p className="text-foreground/70 mb-4">Connect your wallet to track your collection holdings and purchase NFTs</p>
            <p className="text-foreground/50 text-sm">Use the wallet connect button in the navbar to get started</p>
          </div>
        )}
        
        {/* Collections Stats */}
        <div className="flex justify-between items-center py-2">
          <p className="text-foreground/70">
            Showing {filteredCollections.length} {filteredCollections.length === 1 ? 'collection' : 'collections'}
          </p>
          
          <div className="hidden md:flex items-center space-x-2 text-foreground/70">
            <span className="text-sm">Updated</span>
            <span className="bg-primary/10 text-primary text-xs py-1 px-2 rounded">Live</span>
          </div>
        </div>
        
        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.length > 0 ? (
            filteredCollections.map(collection => (
              <CollectionCard key={collection.id} collection={collection} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl font-medium text-foreground/60">No collections found</p>
              <p className="text-foreground/40 mt-2">Try adjusting your search criteria</p>
              
              {filter === 'verified' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 py-2 px-4 rounded-lg bg-primary text-white transition-colors hover:bg-primary/90"
                >
                  View All Collections
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Create Collection CTA */}
        <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 text-center">
          <h3 className="text-xl font-medium mb-2">Want to create your own collection?</h3>
          <p className="text-foreground/70 mb-4 max-w-md mx-auto">Launch your NFT collection on our marketplace and reach thousands of collectors</p>
          <Link 
            href="/create" 
            className="inline-block py-2 px-6 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Create Collection
          </Link>
        </div>
      </div>
    </div>
  );
} 