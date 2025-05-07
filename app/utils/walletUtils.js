import { parseEther } from 'viem';

// ViteBunnyNFT ABI (main functions)
export const NFT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "initialOwner", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "tokenURI", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "collection", "type": "string" }
    ],
    "name": "NFTMinted",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "getTokenCollection",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "getTokenCreator",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "ownerOf",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "string", "name": "tokenURI", "type": "string" },
      { "internalType": "string", "name": "collection", "type": "string" }
    ],
    "name": "mintNFT",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "tokenURI",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ViteBunnyMarketplace ABI (main functions)
export const MARKETPLACE_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "initialOwner", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "itemId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "nftContract", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "seller", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "MarketItemCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "itemId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "nftContract", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "seller", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "MarketItemSold",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "itemId", "type": "uint256" }
    ],
    "name": "cancelMarketItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "nftContract", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "createMarketItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "itemId", "type": "uint256" }
    ],
    "name": "createMarketSale",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fetchMarketItems",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "itemId", "type": "uint256" },
          { "internalType": "address", "name": "nftContract", "type": "address" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
          { "internalType": "address", "name": "seller", "type": "address" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "uint256", "name": "price", "type": "uint256" },
          { "internalType": "bool", "name": "sold", "type": "bool" }
        ],
        "internalType": "struct ViteBunnyMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fetchMyCreatedItems",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "itemId", "type": "uint256" },
          { "internalType": "address", "name": "nftContract", "type": "address" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
          { "internalType": "address", "name": "seller", "type": "address" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "uint256", "name": "price", "type": "uint256" },
          { "internalType": "bool", "name": "sold", "type": "bool" }
        ],
        "internalType": "struct ViteBunnyMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fetchMyNFTs",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "itemId", "type": "uint256" },
          { "internalType": "address", "name": "nftContract", "type": "address" },
          { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
          { "internalType": "address", "name": "seller", "type": "address" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "uint256", "name": "price", "type": "uint256" },
          { "internalType": "bool", "name": "sold", "type": "bool" }
        ],
        "internalType": "struct ViteBunnyMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract addresses (replace with your deployed contract addresses)
// For local development, you can use a .env file with:
// NFT_CONTRACT_ADDRESS=your_deployed_address
// MARKETPLACE_ADDRESS=your_deployed_address
export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

/**
 * Helper function to format ETH with 4 decimal places
 */
export const formatETH = (value) => {
  if (!value) return '0.0000';
  return parseFloat(value).toFixed(4);
};

/**
 * Truncate Ethereum address for display
 */
export const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Creates the listing data needed to sell an NFT
 * @param {string} nftContract Contract address of the NFT
 * @param {number} tokenId ID of the NFT
 * @param {string} priceInEth Price in ETH as string
 * @returns Listing data for use in createMarketItem
 */
export const createNFTListingData = (nftContract, tokenId, priceInEth) => {
  // Convert ETH to wei
  const priceInWei = parseEther(priceInEth);
  
  return {
    nftContract,
    tokenId,
    price: priceInWei
  };
};

/**
 * Helper to create NFT purchase data
 * @param {number} itemId ID of the market item
 * @returns Purchase data for use in createMarketSale
 */
export const createNFTPurchaseData = (itemId) => {
  return {
    itemId
  };
};

/**
 * Sign and send a transaction with error handling
 */
export const signAndSendTransaction = async (writeAsync) => {
  try {
    const tx = await writeAsync();
    return {
      success: true,
      hash: tx.hash,
      data: tx
    };
  } catch (error) {
    console.error('Transaction error:', error);
    return {
      success: false,
      error: error.message || 'Transaction failed'
    };
  }
}; 