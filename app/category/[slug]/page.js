'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categories, nfts } from '../../utils/dummyData';
import NFTCard from '../../components/NFTCard';

export default function CategoryPage({ params }) {
  const { slug } = params;
  const [category, setCategory] = useState(null);
  const [categoryNfts, setCategoryNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find the category by slug
    const foundCategory = categories.find(cat => 
      cat.id === slug || cat.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
    
    if (foundCategory) {
      setCategory(foundCategory);
      // Filter NFTs by category
      const filteredNfts = nfts.filter(nft => nft.category === foundCategory.id);
      setCategoryNfts(filteredNfts);
    }
    
    setIsLoading(false);
  }, [slug]);

  if (!isLoading && !category) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
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
          <li className="text-foreground/80 font-medium">
            {isLoading ? 'Loading...' : category.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      {!isLoading && (
        <>
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">{category.icon}</div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-foreground/70 mt-2">Browse all NFTs in the {category.name} category</p>
          </div>

          {/* NFT Grid */}
          {categoryNfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryNfts.map(nft => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card-bg rounded-xl border border-border">
              <p className="text-xl">No NFTs found in this category</p>
              <Link href="/explore" className="text-primary hover:underline mt-2 inline-block">
                Explore all NFTs
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
} 