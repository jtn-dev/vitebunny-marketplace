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
export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
export const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

// Add checks to ensure environment variables are loaded
if (!NFT_CONTRACT_ADDRESS || !MARKETPLACE_ADDRESS) {
  console.error("ERROR: Contract addresses are missing. Make sure NEXT_PUBLIC_NFT_CONTRACT_ADDRESS and NEXT_PUBLIC_MARKETPLACE_ADDRESS are set in your .env.local file.");
  // Optionally, throw an error to prevent the app from running with missing addresses
  // throw new Error("Missing contract addresses in environment variables.");
}

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
 * Sign and send a transaction with improved error handling
 */
export const signAndSendTransaction = async (writeAsync) => {
  try {
    console.log('Preparing to send transaction...');
    const tx = await writeAsync();
    console.log('Transaction sent:', tx);
    return {
      success: true,
      hash: tx.hash,
      data: tx
    };
  } catch (error) {
    console.error('Transaction error:', error);
    
    // Extract more meaningful error from different error formats
    let errorMessage = 'Transaction failed';
    
    if (error.message) {
      errorMessage = error.message;
    }
    
    // Handle common error cases
    if (errorMessage.includes('insufficient funds')) {
      errorMessage = 'Insufficient ETH balance to complete this transaction';
    } else if (errorMessage.includes('user rejected')) {
      errorMessage = 'Transaction was rejected in wallet';
    } else if (errorMessage.includes('gas required exceeds allowance')) {
      errorMessage = 'Transaction would exceed gas limits. Try again with a higher gas limit.';
    } else if (errorMessage.includes('execution reverted')) {
      // Try to extract revert reason if available
      const reasonMatch = errorMessage.match(/reason="([^"]+)"/);
      errorMessage = reasonMatch 
        ? `Transaction reverted: ${reasonMatch[1]}` 
        : 'Transaction reverted by the smart contract';
    } else if (errorMessage.includes('intrinsic gas too low')) {
      errorMessage = 'Gas estimation failed. The transaction may be invalid or the network could be congested.';
    } else if (errorMessage.includes('nonce too high')) {
      errorMessage = 'Your wallet has pending transactions. Please try again after they complete.';
    } else if (errorMessage.includes('nonce too low')) {
      errorMessage = 'Transaction nonce is too low. Please refresh your page and try again.';
    } else if (errorMessage.includes('replacement fee too low')) {
      errorMessage = 'Gas price too low to replace an existing transaction. Please increase gas price.';
    } else if (errorMessage.includes('cannot estimate gas')) {
      errorMessage = 'Cannot estimate gas for this transaction. It may be invalid or require a different approach.';
    }
    
    return {
      success: false,
      error: errorMessage,
      originalError: error
    };
  }
}; 