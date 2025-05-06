import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Logo and name in the first column */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-3 mb-3 logo-container">
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
            </div>
            <p className="text-xs text-text-muted mt-2">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>

          {/* About in the second column */}
          <div className="text-center md:text-left">
            <h3 className="text-xs uppercase tracking-wider mb-3">About</h3>
            <p className="text-sm text-text-muted">
              A curated NFT marketplace for sophisticated digital collectors and creators.
            </p>
          </div>

          {/* Social media handles in the third column */}
          <div className="text-center md:text-right">
            <h3 className="text-xs uppercase tracking-wider mb-3">Connect</h3>
            <div className="flex justify-center md:justify-end space-x-5">
              <a href="https://github.com/jtn-dev" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-foreground transition-colors">
                <FaGithub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://www.instagram.com/jd_jatin_?igsh=bGg0eW14ajNtZGcx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-foreground transition-colors">
                <FaInstagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 