const hre = require("hardhat");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Function to read .env.local file directly
function readEnvLocal() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    content.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        envVars[key] = value;
      }
    });
    
    return envVars;
  } catch (error) {
    console.log("Could not read .env.local file:", error.message);
    return {};
  }
}

async function checkContractValidity(name, address) {
  try {
    if (!address) {
      throw new Error("Address is undefined");
    }
    
    // Try to connect to contract
    console.log(`Attempting to connect to ${name} at ${address}...`);
    
    // Try to get code at the address
    const provider = ethers.provider;
    
    // Fix checksum issues by first normalizing the address
    try {
      address = ethers.getAddress(address);
    } catch (err) {
      throw new Error("Invalid address format");
    }
    
    const code = await provider.getCode(address);
    
    if (code === '0x') {
      throw new Error("No contract deployed at this address");
    }
    
    console.log(`✅ Contract code exists at ${address}`);
    return true;
  } catch (error) {
    console.error(`❌ INVALID ${name} at ${address}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("Checking contract addresses on Sepolia testnet...");
  console.log("==============================================");
  
  // Read directly from .env.local
  const envVars = readEnvLocal();
  
  // Try the addresses from .env.local first
  let currentNftAddress = envVars.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
  let currentMarketAddress = envVars.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
  
  console.log("Current addresses in .env.local:");
  console.log("NFT Contract:", currentNftAddress);
  console.log("Marketplace Contract:", currentMarketAddress);
  console.log("\n");
  
  // Also try the addresses mentioned in conversation with checksums fixed
  const conversationNftAddress = "0x765e569925f7bdd16bdd08e0b314fb47b15c341f";
  const conversationMarketAddress = "0xaef132adc67848cbf74b79d4d33d09cd5dcb3a93";
  
  console.log("Addresses from previous conversation:");
  console.log("NFT Contract:", conversationNftAddress);
  console.log("Marketplace Contract:", conversationMarketAddress);
  console.log("\n");
  
  // Check current addresses
  console.log("Checking current addresses from .env.local:");
  const currentNftValid = await checkContractValidity("NFT Contract", currentNftAddress);
  const currentMarketValid = await checkContractValidity("Marketplace Contract", currentMarketAddress);
  
  console.log("\nChecking addresses from conversation:");
  const conversationNftValid = await checkContractValidity("NFT Contract", conversationNftAddress);
  const conversationMarketValid = await checkContractValidity("Marketplace Contract", conversationMarketAddress);
  
  console.log("\n==============================================");
  console.log("VERIFICATION RESULTS:");
  
  if (currentNftValid && currentMarketValid) {
    console.log("✅ Your current addresses in .env.local are VALID");
  } else {
    console.log("❌ Your current addresses in .env.local are NOT valid");
  }
  
  if (conversationNftValid && conversationMarketValid) {
    console.log("✅ The addresses from the conversation are VALID");
  } else {
    console.log("❌ The addresses from the conversation are NOT valid");
  }
  
  console.log("\nRECOMMENDATION:");
  if (currentNftValid && currentMarketValid) {
    console.log("Continue using your current addresses. They are working correctly.");
  } else if (conversationNftValid && conversationMarketValid) {
    console.log("Update your .env.local file with these addresses:");
    
    // Show properly checksummed addresses
    try {
      const checksummedNft = ethers.getAddress(conversationNftAddress);
      const checksummedMarket = ethers.getAddress(conversationMarketAddress);
      console.log(`NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${checksummedNft}`);
      console.log(`NEXT_PUBLIC_MARKETPLACE_ADDRESS=${checksummedMarket}`);
    } catch (e) {
      console.log(`NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${conversationNftAddress}`);
      console.log(`NEXT_PUBLIC_MARKETPLACE_ADDRESS=${conversationMarketAddress}`);
    }
  } else {
    console.log("Neither set of addresses is valid. You may need to redeploy your contracts.");
  }
}

main().catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
}); 