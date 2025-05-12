'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaSortAmountDown, FaExclamationTriangle } from 'react-icons/fa';
import NFTCard from '../components/NFTCard';
import { categories } from '../utils/dummyData';

export default function Explore() {
  const [displayedNfts, setDisplayedNfts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // latest, price-asc, price-desc, likes
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [usingDummyData, setUsingDummyData] = useState(false);

  // Fetch NFTs from API
  const fetchNFTs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Construct query parameters based on filters
      let queryParams = new URLSearchParams();
      
      // Add category filter if selected
      if (selectedCategory && selectedCategory !== '') {
        // Find the category name from the ID
        const category = categories.find(cat => cat.id === selectedCategory);
        if (category) {
          // Send the actual category name, not the ID
          queryParams.append('category', category.name);
        } else {
          // Fallback to the ID if category not found
          queryParams.append('category', selectedCategory);
        }
      }
      
      // Get limit and sorting
      queryParams.append('limit', '50'); // Increase limit to ensure we get more NFTs
      
      // Different sort parameters
      if (sortBy === 'price-asc') {
        queryParams.append('sort', 'price');
        queryParams.append('order', 'asc');
      } else if (sortBy === 'price-desc') {
        queryParams.append('sort', 'price');
        queryParams.append('order', 'desc');
      } else if (sortBy === 'likes') {
        queryParams.append('sort', 'likes');
        queryParams.append('order', 'desc');
      } else {
        // Default sorting by latest
        queryParams.append('sort', 'createdAt');
        queryParams.append('order', 'desc');
      }
      
      // IMPORTANT: Do NOT add any address filtering here - we want ALL NFTs
      console.log("Fetching NFTs with query:", queryParams.toString());
      
      // Get NFTs from database
      const response = await fetch(`/api/nfts?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs');
      }
      
      const data = await response.json();
      console.log("Received NFT data:", data);
      
      // Check if we're using dummy data
      setUsingDummyData(data.source === 'dummy');
      
      // Get the NFTs array
      let nftsArray = [];
      if (Array.isArray(data)) {
        nftsArray = data;
      } else if (data.nfts && Array.isArray(data.nfts)) {
        nftsArray = data.nfts;
      } else {
        throw new Error('Unexpected response format');
      }
      
      // Apply client-side search filtering if needed
      let filteredNfts = nftsArray;
      
      if (searchTerm) {
        filteredNfts = filteredNfts.filter(nft => 
          nft.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (nft.collectionName || nft.collection)?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Make sure NFT fields are never undefined/null to prevent display issues
      const safeNfts = filteredNfts.map(nft => ({
        ...nft,
        name: nft.name || (nft.tokenId ? `Bunny NFT #${nft.tokenId}` : 'Bunny NFT'),
        description: nft.description || 'A unique Bunny NFT',
        collectionName: nft.collectionName || nft.collection || 'Bunny Collection',
        collection: nft.collectionName || nft.collection || 'Bunny Collection', // For backward compatibility
        price: nft.price || '0',
        isListed: Boolean(nft.isListed),
        metadata: nft.metadata || {},
        tokenId: nft.tokenId || nft.id || '0',
        // Ensure it has an ID for React key prop
        id: nft.id || nft.tokenId || Math.random().toString(36).substring(2)
      }));
      
      console.log(`Found ${safeNfts.length} NFTs after filtering`);
      setDisplayedNfts(safeNfts);
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to load NFTs. Please try again later.');
      
      // Increment retry count for backend errors
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [selectedCategory, sortBy]);
  
  // Retry logic
  useEffect(() => {
    if (retryCount > 0 && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`Retry attempt ${retryCount}...`);
        fetchNFTs();
      }, retryCount * 2000); // Exponential backoff
      
      return () => clearTimeout(timer);
    }
  }, [retryCount]);
  
  // Apply search filter client-side for immediate feedback
  useEffect(() => {
    if (!isLoading && !error) {
      fetchNFTs();
    }
  }, [searchTerm]);
  
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
      
      {/* Loading State */}
      {isLoading && (
        <div className="py-16 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-24"></div>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <FaExclamationTriangle className="text-red-500 h-8 w-8 mx-auto mb-4" />
            <p className="text-lg font-medium text-red-800 mb-2">Failed to load NFTs</p>
            <p className="text-sm text-red-600 mb-4">
              The database connection is currently unavailable. We&apos;ll show demo data instead or you can try again.
            </p>
            <button 
              onClick={fetchNFTs}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* NFT Grid */}
      {!isLoading && !error && (
        <>
          {displayedNfts.length > 0 ? (
            <div className="nft-grid">
              {displayedNfts.map(nft => (
                <NFTCard key={nft.tokenId || nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-xl font-light text-text-muted">No NFTs found</p>
              <p className="text-text-light mt-2 text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </main>
  );
} 