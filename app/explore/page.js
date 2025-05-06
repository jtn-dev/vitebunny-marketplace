'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaSortAmountDown } from 'react-icons/fa';
import NFTCard from '../components/NFTCard';
import { nfts, categories } from '../utils/dummyData';

export default function Explore() {
  const [displayedNfts, setDisplayedNfts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // latest, price-asc, price-desc, likes

  useEffect(() => {
    let filtered = [...nfts];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        nft.collection.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      // In a real app, each NFT would have category data
      // This is just a simplified example
      filtered = filtered.filter(nft => nft.id % categories.length + 1 === parseInt(selectedCategory));
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'latest':
        // Assuming id is related to creation time (higher = newer)
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'price-asc':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'likes':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }
    
    setDisplayedNfts(filtered);
  }, [searchTerm, selectedCategory, sortBy]);
  
  return (
    <main className="w-full max-w-[1400px] mx-auto px-2 sm:px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl mb-2">Explore NFTs</h1>
        <p className="text-text-muted text-sm">Browse and discover amazing NFTs from artists around the world</p>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {/* Search Bar */}
        <div className="md:max-w-xs w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400 h-3 w-3" />
            </div>
            <input
              type="text"
              className="pl-8 pr-3 py-2 w-full border border-border focus:outline-none text-sm text-black"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Sorting Options */}
        <div className="relative w-full md:w-40 ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full py-2 px-3 pr-8 border border-border focus:outline-none bg-white text-sm text-black"
          >
            <option value="latest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="likes">Most Popular</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <FaSortAmountDown className="text-gray-400 h-3 w-3" />
          </div>
        </div>
      </div>
      
      {/* Category Filter - Scrollable on mobile */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="filter-bar inline-flex flex-nowrap min-w-full md:flex-wrap md:min-w-0">
          <button 
            className={`filter-item whitespace-nowrap ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            <span className={selectedCategory === '' ? 'text-white font-medium' : 'font-medium'}>All</span>
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-item whitespace-nowrap ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className={selectedCategory === category.id ? 'text-white font-medium' : 'font-medium'}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* NFT Grid */}
      {displayedNfts.length > 0 ? (
        <div className="nft-grid">
          {displayedNfts.map(nft => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-xl font-light text-text-muted">No NFTs found</p>
          <p className="text-text-light mt-2 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </main>
  );
} 