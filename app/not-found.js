import Link from 'next/link';
import Button from './components/Button';
import { FaHome, FaSearch } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-6">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-foreground/70 text-lg max-w-lg mb-8">
        The NFT you're looking for may have been moved to another marketplace or doesn't exist.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Button leftIcon={<FaHome />}>
          <Link href="/">Return Home</Link>
        </Button>
        <Button variant="outline" leftIcon={<FaSearch />}>
          <Link href="/explore">Browse NFTs</Link>
        </Button>
      </div>
    </div>
  );
} 