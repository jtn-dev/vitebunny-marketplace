const hre = require("hardhat");
const { ethers } = require("hardhat");
const { network } = require("hardhat");

async function main() {
  // Get the default signer from hardhat config
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Network:", network.name);

  // Deploy ViteBunnyNFT contract
  const ViteBunnyNFT = await ethers.getContractFactory("ViteBunnyNFT");
  // Deploy with no arguments based on the contract constructor
  const viteBunnyNFT = await ViteBunnyNFT.deploy();
  const nftContractAddress = await viteBunnyNFT.getAddress();
  
  console.log("ViteBunnyNFT deployed to:", nftContractAddress);

  // Deploy ViteBunnyMarketplace contract
  const ViteBunnyMarketplace = await ethers.getContractFactory("ViteBunnyMarketplace");
  // Deploy with no arguments based on the contract constructor
  const viteBunnyMarketplace = await ViteBunnyMarketplace.deploy();
  const marketplaceContractAddress = await viteBunnyMarketplace.getAddress();
  
  console.log("ViteBunnyMarketplace deployed to:", marketplaceContractAddress);

  console.log("Contract Addresses to use in your frontend:");
  console.log("NFT_CONTRACT_ADDRESS=", nftContractAddress);
  console.log("MARKETPLACE_ADDRESS=", marketplaceContractAddress);

  // Mint some sample NFTs for testing if on a test network
  if (network.name !== "mainnet") {
    console.log("\nMinting sample NFTs for testing...");
    
    // Sample NFT data
    const sampleNFTs = [
      {
        recipient: deployer.address,
        tokenURI: "https://bafybeihpjhkeuiq3k6nqa3fkgeigeri2qvj5b2xmxzh5xqrsiw3q7mpnuy.ipfs.nftstorage.link/1.json",
        collection: "Cosmic Bunnies"
      },
      {
        recipient: deployer.address,
        tokenURI: "https://bafybeihpjhkeuiq3k6nqa3fkgeigeri2qvj5b2xmxzh5xqrsiw3q7mpnuy.ipfs.nftstorage.link/2.json",
        collection: "Digital Dreamscape"
      },
      {
        recipient: deployer.address,
        tokenURI: "https://bafybeihpjhkeuiq3k6nqa3fkgeigeri2qvj5b2xmxzh5xqrsiw3q7mpnuy.ipfs.nftstorage.link/3.json",
        collection: "Pixel Pets"
      }
    ];
    
    for (let i = 0; i < sampleNFTs.length; i++) {
      const nft = sampleNFTs[i];
      console.log(`Minting NFT #${i+1} in collection ${nft.collection}...`);
      
      const tx = await viteBunnyNFT.mintNFT(
        nft.recipient,
        nft.tokenURI,
        nft.collection
      );
      
      await tx.wait();
      console.log(`Minted NFT #${i+1} successfully`);
    }

    // Print the owner address of the marketplace (platform owner)
    const marketplaceOwner = await viteBunnyMarketplace.owner();
    console.log("Platform Owner (receives fees):", marketplaceOwner);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 