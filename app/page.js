'use client';

import Link from "next/link";
import { FaEthereum, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import NFTCard from "./components/NFTCard";
import CollectionCard from "./components/CollectionCard";
import Button from "./components/Button";
import { nfts, collections, categories } from "./utils/dummyData";

export default function Home() {
  const [featuredCollections, setFeaturedCollections] = useState([]);
  const [trendingNFTs, setTrendingNFTs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Filter featured collections
    const featured = collections.filter(collection => collection.featured);
    setFeaturedCollections(featured.slice(0, 3));
    
    // Get trending NFTs based on likes
    const trending = [...nfts].sort((a, b) => b.likes - a.likes);
    setTrendingNFTs(trending.slice(0, 4));
    setIsLoaded(true);
  }, []);
  
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-gradient mb-12">
        <div className="hero-content">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
            Discover, Collect & Sell
            <span className="text-primary"> Extraordinary </span>
            NFTs
          </h1>
          <p className="text-text-muted text-lg mb-8 max-w-2xl mx-auto">
            Vite Bunny is the world's first and largest NFT marketplace for crypto collectibles and non-fungible tokens.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button size="lg" variant="primary" className="px-8">
              <Link href="/explore">Explore</Link>
            </Button>
            <Button size="lg" variant="secondary" className="px-8">
              <Link href="/create" className="font-semibold">Create NFT</Link>
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <p className="text-3xl font-light">200K+</p>
              <p className="text-text-muted">Collectibles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-light">10K+</p>
              <p className="text-text-muted">Artists</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-light">423K+</p>
              <p className="text-text-muted">Community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container mx-auto">
          <h2 className="section-title text-3xl font-light">Browse by Category</h2>
          <p className="text-text-muted mb-12 text-center">Explore the NFTs in the most featured categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 w-full max-w-5xl mx-auto">
            {categories.map(category => (
              <Link 
                key={category.id} 
                href={`/category/${category.id}`}
                className="flex flex-col items-center bg-card-bg rounded-xl p-4 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <p className="font-light">{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {isLoaded && featuredCollections.length > 0 && (
        <section className="section">
          <div className="container mx-auto">
            <h2 className="section-title text-3xl font-light">Featured Collections</h2>
            <p className="text-text-muted mb-12 text-center">The NFTs everyone's talking about</p>
            <div className="collection-grid">
              {featuredCollections.map(collection => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/collections" className="text-primary inline-flex items-center">
                View All Collections <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trending NFTs */}
      {isLoaded && trendingNFTs.length > 0 && (
        <section className="section bg-card-bg py-16">
          <div className="container mx-auto">
            <h2 className="section-title text-3xl font-light">Trending NFTs</h2>
            <p className="text-text-muted mb-12 text-center">The hottest NFTs on the marketplace</p>
            <div className="nft-grid">
              {trendingNFTs.map(nft => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/explore" className="text-primary inline-flex items-center">
                View All NFTs <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section py-20">
        <div className="container mx-auto">
          <div className="bg-card-bg rounded p-10 md:p-16 max-w-4xl mx-auto w-full text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6">Create and Sell Your NFTs</h2>
            <p className="text-text-muted text-lg mb-8 max-w-lg mx-auto">
              Join thousands of artists and collectors who are already using Vite Bunny to create and sell their digital art.
            </p>
            <Button size="lg" variant="primary" className="px-8 btn-center">
              <Link href="/create" className="text-white">Start Creating</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
