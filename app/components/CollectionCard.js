'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaEthereum, FaCheckCircle } from 'react-icons/fa';

const CollectionCard = ({ collection }) => {
  return (
    <Link href={`/collections/${collection.slug}`} className="group">
      <div className="overflow-hidden rounded-xl bg-card-bg border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
        {/* Collection Banner Image */}
        <div className="relative h-32 w-full overflow-hidden">
          <Image 
            src={collection.bannerImage}
            alt={`${collection.name} banner`}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        {/* Collection Avatar */}
        <div className="relative px-4">
          <div className="absolute -top-10 h-20 w-20 rounded-xl overflow-hidden border-4 border-card-bg bg-card-bg">
            <Image 
              src={collection.avatarImage}
              alt={`${collection.name} avatar`}
              fill
              style={{ objectFit: 'cover' }}
            />
            {collection.verified && (
              <div className="absolute bottom-0 right-0 bg-card-bg p-0.5 rounded-full border-2 border-card-bg">
                <FaCheckCircle className="text-green-500 h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        
        {/* Collection Details */}
        <div className="p-4 pt-16 mt-2">
          <h3 className="font-bold text-lg flex items-center justify-center truncate">
            {collection.name}
            {collection.verified && (
              <FaCheckCircle className="text-green-500 ml-1 h-3 w-3 flex-shrink-0 md:hidden" />
            )}
          </h3>
          <div className="flex justify-between items-center mt-2">
            <div>
              <p className="text-sm text-foreground/60">Floor</p>
              <div className="flex items-center">
                <FaEthereum className="h-3 w-3 text-primary mr-1" />
                <span className="font-medium">{collection.floorPrice}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Volume</p>
              <div className="flex items-center">
                <FaEthereum className="h-3 w-3 text-primary mr-1" />
                <span className="font-medium">{collection.volume}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Items</p>
              <p className="font-medium">{collection.items}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard; 