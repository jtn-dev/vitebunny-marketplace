'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaEthereum } from 'react-icons/fa';
import { useState, useEffect } from 'react';

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

  // Generate image path based on NFT ID with fallback
  const imagePath = nft.image || `/images/nft${nft.id}.jpg`;
  const fallbackImage = '/images/placeholder.jpg';

  return (
    <Link href={`/nft/${nft.id}`} className="group block w-full">
      <div className="overflow-hidden bg-white border border-gray-100 transition-all duration-300 hover:shadow-md h-full w-full">
        <div className="relative">
          {/* NFT image */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
            <Image 
              src={imageError ? fallbackImage : imagePath}
              alt={`${nft.name} NFT artwork`}
              width={300}
              height={300}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImageError(true)}
              priority={nft.id <= 4} // Prioritize loading for first 4 NFTs
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
            <h3 className="text-sm font-medium text-gray-800 truncate">{nft.name}</h3>
            
            <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
              <FaEthereum className="h-2.5 w-2.5 text-black mr-1 flex-shrink-0" aria-hidden="true" />
              <span className="text-xs font-medium text-gray-800">{nft.price} ETH</span>
            </div>
          </div>
          
          {/* Collection name */}
          <p className="text-xs text-gray-500 mb-2 truncate">{nft.collection}</p>
          
          {/* Stats row */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            {/* Artist/Creator */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded-full mr-1.5 flex-shrink-0" aria-hidden="true"></div>
              <p className="text-xs text-gray-500 truncate">@{nft.creator || 'artist'}</p>
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