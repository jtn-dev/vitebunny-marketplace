'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Get account information using wagmi hooks
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
    watch: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Format ETH balance to display with 4 decimal places
  const formatBalance = (balance) => {
    if (!balance) return '0.0000';
    return parseFloat(formatEther(balance)).toFixed(4);
  };

  // CustomConnectButton component to match our UI style
  const CustomConnectButton = () => (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted: rainbowKitMounted,
      }) => {
        const ready = mounted && rainbowKitMounted;
        
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!ready || !account || !chain) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex items-center px-5 py-1.5 border border-foreground text-foreground text-xs uppercase tracking-widest hover:bg-foreground hover:text-white transition-colors"
                  >
                    Connect Wallet
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center px-3 py-1 bg-card-bg border border-border rounded-sm text-xs"
                  >
                    {chain.name}
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex items-center px-4 py-1.5 border border-green-400 text-green-500 hover:bg-green-500 hover:text-white text-xs uppercase tracking-widest transition-colors"
                  >
                    <span className="mr-2">
                      {balanceData ? formatBalance(balanceData.value) : '0.0000'} ETH
                    </span>
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );

  // Don't render wallet-related UI during server-side rendering
  if (!mounted) {
    return (
      <nav className="bg-background border-b border-border py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center space-x-3 logo-container">
                <div className="relative h-8 w-8">
                  <Image 
                    src="/vitebunnylogo.avif" 
                    alt="Vite Bunny Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
                <span className="text-lg uppercase tracking-widest">Vite Bunny</span>
              </Link>
            </div>
            
            {/* Desktop Navigation Placeholders */}
            <div className="hidden md:flex md:items-center md:space-x-10">
              <Link href="/explore" className="text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
                Explore
              </Link>
              <Link href="/collections" className="text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
                Collections
              </Link>
              <Link href="/create" className="text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
                Create
              </Link>
              <div className="px-5 py-1.5 border border-foreground text-foreground text-xs uppercase tracking-widest hover:bg-foreground hover:text-white transition-colors">
                Connect Wallet
              </div>
            </div>
            
            {/* Mobile menu button placeholder */}
            <div className="flex md:hidden items-center">
              <button className="inline-flex items-center justify-center p-2 text-foreground">
                <span className="sr-only">Open main menu</span>
                <FaBars className="block h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-background border-b border-border py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-3 logo-container">
              <div className="relative h-8 w-8">
                <Image 
                  src="/vitebunnylogo.avif" 
                  alt="Vite Bunny Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </div>
              <span className="text-lg uppercase tracking-widest">Vite Bunny</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-10">
            <Link href="/explore" className="text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
              Explore
            </Link>
            <Link href="/collections" className="text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
              Collections
            </Link>
            <Link href="/create" className="text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
              Create
            </Link>
            {isConnected && (
              <Link href="/my-nfts" className="text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
                My NFTs
              </Link>
            )}
            <CustomConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 text-foreground hover:text-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <FaTimes className="block h-5 w-5" /> : <FaBars className="block h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-2 space-y-3 px-4 sm:px-6 lg:px-8 border-t border-border bg-card-bg">
          <Link href="/explore" className="block py-2 text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
            Explore
          </Link>
          <Link href="/collections" className="block py-2 text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
            Collections
          </Link>
          <Link href="/create" className="block py-2 text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
            Create
          </Link>
          {isConnected && (
            <Link href="/my-nfts" className="block py-2 text-foreground text-sm uppercase tracking-wide hover:text-primary transition-colors">
              My NFTs
            </Link>
          )}
          <div className="mt-2">
            <CustomConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 