// This is a standalone deployment script that doesn't rely on hardhat's ethers integration
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  // Connect to the local Ethereum node
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  
  // Use the first account as the deployer
  const accounts = await provider.listAccounts();
  const deployer = provider.getSigner(accounts[0]);
  const deployerAddress = await deployer.getAddress();
  
  console.log("Deploying contracts with account:", deployerAddress);
  
  // Load contract artifacts
  const NFTArtifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../artifacts/contracts/ViteBunnyNFT.sol/ViteBunnyNFT.json"),
      "utf8"
    )
  );
  
  const MarketplaceArtifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../artifacts/contracts/ViteBunnyMarketplace.sol/ViteBunnyMarketplace.json"),
      "utf8"
    )
  );
  
  // Deploy NFT contract
  console.log("Deploying ViteBunnyNFT...");
  const NFTFactory = new ethers.ContractFactory(
    NFTArtifact.abi,
    NFTArtifact.bytecode,
    deployer
  );
  
  const nftContract = await NFTFactory.deploy();
  await nftContract.deployed();
  console.log("ViteBunnyNFT deployed to:", nftContract.address);
  
  // Deploy Marketplace contract
  console.log("Deploying ViteBunnyMarketplace...");
  const MarketplaceFactory = new ethers.ContractFactory(
    MarketplaceArtifact.abi,
    MarketplaceArtifact.bytecode,
    deployer
  );
  
  const marketplaceContract = await MarketplaceFactory.deploy();
  await marketplaceContract.deployed();
  console.log("ViteBunnyMarketplace deployed to:", marketplaceContract.address);
  
  console.log("Contract Addresses to use in your frontend:");
  console.log("NFT_CONTRACT_ADDRESS=", nftContract.address);
  console.log("MARKETPLACE_ADDRESS=", marketplaceContract.address);
  
  // Mint some sample NFTs
  console.log("\nMinting sample NFTs for testing...");
  
  // Sample NFT data
  const sampleNFTs = [
    {
      recipient: deployerAddress,
      tokenURI: "https://bafybeihpjhkeuiq3k6nqa3fkgeigeri2qvj5b2xmxzh5xqrsiw3q7mpnuy.ipfs.nftstorage.link/1.json",
      collection: "Cosmic Bunnies"
    },
    {
      recipient: deployerAddress,
      tokenURI: "https://bafybeihpjhkeuiq3k6nqa3fkgeigeri2qvj5b2xmxzh5xqrsiw3q7mpnuy.ipfs.nftstorage.link/2.json",
      collection: "Digital Dreamscape"
    },
    {
      recipient: deployerAddress,
      tokenURI: "https://bafybeihpjhkeuiq3k6nqa3fkgeigeri2qvj5b2xmxzh5xqrsiw3q7mpnuy.ipfs.nftstorage.link/3.json",
      collection: "Pixel Pets"
    }
  ];
  
  for (let i = 0; i < sampleNFTs.length; i++) {
    const nft = sampleNFTs[i];
    console.log(`Minting NFT #${i+1} in collection ${nft.collection}...`);
    
    const tx = await nftContract.mintNFT(
      nft.recipient,
      nft.tokenURI,
      nft.collection
    );
    
    await tx.wait();
    console.log(`Minted NFT #${i+1} successfully`);
  }
  
  // Create a .env.local file with contract addresses
  const envContent = `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${nftContract.address}
NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceContract.address}
NEXT_PUBLIC_NETWORK_ID=1337`;
  
  fs.writeFileSync(path.join(__dirname, "../.env.local"), envContent);
  console.log("Created .env.local file with contract addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  }); 