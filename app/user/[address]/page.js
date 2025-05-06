import Link from 'next/link';
import { notFound } from 'next/navigation';
import NFTCard from '../../components/NFTCard';

// This is a server component - note we don't need 'use client'
async function getUserData(address) {
  // In a real app, you would fetch from an API
  // For demo, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user
  return {
    address,
    username: `User_${address.slice(0, 6)}`,
    avatarUrl: 'https://source.unsplash.com/random/100x100/?avatar',
    bio: 'NFT enthusiast and digital art collector',
    joinedDate: 'April 2023',
    followers: 245,
    following: 112,
  };
}

// Example of correctly getting params as a parameter with async
export default async function UserProfile({ params }) {
  // Correct way to extract params in a server component
  const { address } = params;
  
  const userData = await getUserData(address);
  
  if (!userData) {
    return notFound();
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* User Profile Header */}
      <div className="bg-card-bg rounded-xl p-8 border border-border">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-primary bg-primary flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {userData.username.charAt(0)}
            </span>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            <p className="text-foreground/60 mt-1 break-all">{userData.address}</p>
            <p className="mt-3 max-w-2xl">{userData.bio}</p>
            
            <div className="flex justify-center md:justify-start space-x-6 mt-4">
              <div>
                <span className="font-bold">{userData.followers}</span>
                <span className="text-foreground/60 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold">{userData.following}</span>
                <span className="text-foreground/60 ml-1">Following</span>
              </div>
              <div>
                <span className="text-foreground/60">Joined</span>
                <span className="ml-1">{userData.joinedDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="px-4 py-2 rounded-lg bg-primary text-white">
              Follow
            </button>
            <button className="px-4 py-2 rounded-lg border border-border bg-card">
              Share
            </button>
          </div>
        </div>
      </div>
      
      {/* User's NFTs would be displayed here */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">NFTs owned by {userData.username}</h2>
        <div className="text-center py-12 bg-card-bg rounded-xl border border-border">
          <p className="text-xl">No NFTs found for this user</p>
          <Link href="/explore" className="text-primary hover:underline mt-2 inline-block">
            Explore NFTs to buy
          </Link>
        </div>
      </div>
    </div>
  );
} 