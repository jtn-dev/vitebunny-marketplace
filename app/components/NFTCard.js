'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaEthereum } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getNFTImagePath } from '../utils/imageUtils';
import { formatETH, truncateAddress } from '../utils/walletUtils';

const NFTCard = ({ nft }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setLikeCount(nft.likes || 0);
    setMounted(true);
  }, [nft.likes]);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent link navigation when clicking like button
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  // Get the NFT ID (use tokenId from MongoDB or fallback to id)
  const nftId = nft.tokenId || nft.id;

  // Generate image path based on NFT ID with fallback using utility function
  const imagePath = getNFTImagePath(nft);
  const fallbackImage = '/images/placeholder.jpg';

  // Check if user's browser has JS disabled and provide a fallback link
  const href = `/nft/${nftId}`;

  // Safely access properties with fallbacks
  const imageUrl = nft.image || '/images/placeholder.jpg';
  const name = nft.name || `NFT #${nft.tokenId || nft.id || '?'}`;
  const price = nft.price || '0';
  const isListed = Boolean(nft.isListed);
  const collectionName = nft.collectionName || nft.collection || 'Unknown Collection';

  return (
    <Link href={href} className="group block w-full">
      <div className="overflow-hidden bg-white border border-gray-100 transition-all duration-300 hover:shadow-md h-full w-full">
        <div className="relative">
          {/* NFT image */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
            <Image 
              src={imageError ? fallbackImage : imagePath}
              alt={name}
              width={300}
              height={300}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImageError(true)}
              priority={nftId <= 4} // Prioritize loading for first 4 NFTs
            />
            
            {/* Like Button */}
            {mounted && (
              <button
                onClick={toggleLike}
                className="absolute top-2 right-2 p-1.5 bg-white shadow-sm hover:bg-white transition-colors z-10 rounded-full"
                aria-label={isLiked ? 'Unlike NFT' : 'Like NFT'}
                aria-pressed={isLiked}
              >
                <FaHeart 
                  className={`h-3 w-3 ${isLiked ? 'text-red-500' : 'text-gray-400'}`} 
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        </div>
        
        {/* NFT Details */}
        <div className="p-3 bg-white">
          {/* Price and name row */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-800 truncate">{name}</h3>
            
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
              <FaEthereum className="h-2.5 w-2.5 text-black mr-1 flex-shrink-0" aria-hidden="true" />
              <span className="text-xs font-medium text-gray-800">{formatETH(price)}</span>
            </div>
          </div>
          
          {/* Collection name */}
          <p className="text-xs text-gray-500 mb-2 truncate">{collectionName}</p>
          
          {/* Stats row */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            {/* Artist/Creator */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded-full mr-1.5 flex-shrink-0" aria-hidden="true"></div>
              <p className="text-xs text-gray-500 truncate">@{truncateAddress(nft.creator)}</p>
            </div>
            
            {/* Likes */}
            <div className="flex items-center text-xs text-gray-500">
              <FaHeart className="h-2.5 w-2.5 mr-1" aria-hidden="true" />
              <span>{likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NFTCard; 