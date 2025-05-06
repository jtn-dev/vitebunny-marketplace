// Simple deploy script for Sepolia using ethers directly
const ethers = require('ethers');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Load the contract artifacts
const ViteBunnyNFT = require('../artifacts/contracts/ViteBunnyNFT.sol/ViteBunnyNFT.json');
const ViteBunnyMarketplace = require('../artifacts/contracts/ViteBunnyMarketplace.sol/ViteBunnyMarketplace.json');

async function main() {
  // Get environment variables
  const SEPOLIA_URL = process.env.SEPOLIA_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!SEPOLIA_URL || !PRIVATE_KEY) {
    console.error('Please set SEPOLIA_URL and PRIVATE_KEY in your .env file');
    process.exit(1);
  }

  // Connect to Sepolia network
  const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const deployer = wallet.address;

  console.log('Deploying contracts with account:', deployer);
  console.log('Network: Sepolia');
  
  // Get network details for confirmation
  const network = await provider.getNetwork();
  console.log(`Connected to chain ID: ${network.chainId}`);
  
  // Get balance to make sure we have enough ETH
  const balance = await provider.getBalance(deployer);
  console.log('Account balance:', ethers.utils.formatEther(balance));
  
  if (balance.lt(ethers.utils.parseEther('0.01'))) {
    console.warn('WARNING: Low balance, you might not have enough ETH for deployment');
  }

  try {
    // Deploy ViteBunnyNFT
    console.log('Deploying ViteBunnyNFT...');
    const nftFactory = new ethers.ContractFactory(
      ViteBunnyNFT.abi,
      ViteBunnyNFT.bytecode,
      wallet
    );
    const nftContract = await nftFactory.deploy();
    await nftContract.deployed();
    const nftAddress = nftContract.address;
    console.log('ViteBunnyNFT deployed to:', nftAddress);

    // Deploy ViteBunnyMarketplace
    console.log('Deploying ViteBunnyMarketplace...');
    const marketplaceFactory = new ethers.ContractFactory(
      ViteBunnyMarketplace.abi,
      ViteBunnyMarketplace.bytecode,
      wallet
    );
    const marketplaceContract = await marketplaceFactory.deploy();
    await marketplaceContract.deployed();
    const marketplaceAddress = marketplaceContract.address;
    console.log('ViteBunnyMarketplace deployed to:', marketplaceAddress);

    console.log('\nContract Addresses to use in your frontend:');
    console.log('NFT_CONTRACT_ADDRESS=', nftAddress);
    console.log('MARKETPLACE_ADDRESS=', marketplaceAddress);

    // Create a .env.local file with the deployed addresses
    const envContent = `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${nftAddress}
NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceAddress}
NEXT_PUBLIC_NETWORK_ID=11155111`;

    fs.writeFileSync(path.join(__dirname, '../.env.local'), envContent);
    console.log('\nCreated .env.local file with contract addresses');

    // Mint sample NFTs
    console.log('\nMinting sample NFTs for testing...');
    
    const sampleNFTs = [
      {
        tokenURI: "https://bafybeihpjhkeuiq3k6nqa3fkgeigeri2qvj5b2xmxzh5xqrsiw3q7mpnuy.ipfs.nftstorage.link/1.json",
        collection: "Cosmic Bunnies"
      },
      {
        tokenURI: "https://bafybeihpjhkeuiq3k6nqa3fkgeigeri2qvj5b2xmxzh5xqrsiw3q7mpnuy.ipfs.nftstorage.link/2.json",
        collection: "Digital Dreamscape"
      },
      {
        tokenURI: "https://bafybeihpjhkeuiq3k6nqa3fkgeigeri2qvj5b2xmxzh5xqrsiw3q7mpnuy.ipfs.nftstorage.link/3.json",
        collection: "Pixel Pets"
      }
    ];

    for (let i = 0; i < sampleNFTs.length; i++) {
      const nft = sampleNFTs[i];
      console.log(`Minting NFT #${i+1} in collection ${nft.collection}...`);
      
      const tx = await nftContract.mintNFT(
        deployer,
        nft.tokenURI,
        nft.collection
      );
      
      await tx.wait();
      console.log(`Minted NFT #${i+1} successfully. Tx hash: ${tx.hash}`);
    }

    // Check platform owner
    const marketplaceOwner = await marketplaceContract.owner();
    console.log('\nPlatform Owner (receives fees):', marketplaceOwner);

    console.log('\nDeployment completed successfully!');
    
    console.log('\nNext steps:');
    console.log('1. Verify contracts on Etherscan (if desired):');
    console.log(`   npx hardhat verify --network sepolia ${nftAddress}`);
    console.log(`   npx hardhat verify --network sepolia ${marketplaceAddress}`);
    console.log('2. Update your frontend with the new contract addresses');
    console.log('3. Test your application on Sepolia testnet');

  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 