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

// Use environment variables, window properties, or fallback to the known deployed addresses
const FALLBACK_NFT_ADDRESS = '0x1dac5D6276B2912BBb33a04E981B67080e90c428';
const FALLBACK_MARKETPLACE_ADDRESS = '0x45A7B09126cb5Ff067960E3bB924D78800c219A0';

export const NFT_CONTRACT_ADDRESS = 
  (typeof window !== 'undefined' && window.NFT_CONTRACT_ADDRESS) || 
  process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
  FALLBACK_NFT_ADDRESS;

export const MARKETPLACE_ADDRESS = 
  (typeof window !== 'undefined' && window.MARKETPLACE_ADDRESS) || 
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ||
  FALLBACK_MARKETPLACE_ADDRESS;

// Add checks to ensure environment variables are loaded
if (!NFT_CONTRACT_ADDRESS || NFT_CONTRACT_ADDRESS === 'undefined' || NFT_CONTRACT_ADDRESS === 'null') {
  console.warn("WARNING: Using fallback NFT contract address:", FALLBACK_NFT_ADDRESS);
  
  // Set window property for client-side usage
  if (typeof window !== 'undefined') {
    window.NFT_CONTRACT_ADDRESS = FALLBACK_NFT_ADDRESS;
  }
}

if (!MARKETPLACE_ADDRESS || MARKETPLACE_ADDRESS === 'undefined' || MARKETPLACE_ADDRESS === 'null') {
  console.warn("WARNING: Using fallback marketplace address:", FALLBACK_MARKETPLACE_ADDRESS);
  
  // Set window property for client-side usage
  if (typeof window !== 'undefined') {
    window.MARKETPLACE_ADDRESS = FALLBACK_MARKETPLACE_ADDRESS;
  }
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
  console.log('=== SIGN AND SEND TRANSACTION STARTED ===');
  
  // Validate contract addresses
  if (!NFT_CONTRACT_ADDRESS || NFT_CONTRACT_ADDRESS === 'undefined' || NFT_CONTRACT_ADDRESS === 'null') {
    console.error('CRITICAL ERROR: NFT_CONTRACT_ADDRESS is not defined correctly.');
    console.error('Current value:', NFT_CONTRACT_ADDRESS);
    console.error('This is likely an environment variable issue. Check your .env.local file and Vercel configuration.');
    
    // Use the known Sepolia testnet addresses as fallbacks
    const FALLBACK_NFT_ADDRESS = '0x765e569925f7BDd16bdD08E0b314FB47b15C341f';
    console.warn(`Using fallback NFT address: ${FALLBACK_NFT_ADDRESS}`);
    
    // This is for debugging only - in production, you should fix the environment variables
    window.NFT_CONTRACT_ADDRESS = FALLBACK_NFT_ADDRESS;
  }
  
  if (!MARKETPLACE_ADDRESS || MARKETPLACE_ADDRESS === 'undefined' || MARKETPLACE_ADDRESS === 'null') {
    console.error('CRITICAL ERROR: MARKETPLACE_ADDRESS is not defined correctly.');
    console.error('Current value:', MARKETPLACE_ADDRESS);
    console.error('This is likely an environment variable issue. Check your .env.local file and Vercel configuration.');
    
    // Use the known Sepolia testnet addresses as fallbacks
    const FALLBACK_MARKETPLACE_ADDRESS = '0xaEf132Adc67848Cbf74B79D4D33D09cD5dCB3a93';
    console.warn(`Using fallback marketplace address: ${FALLBACK_MARKETPLACE_ADDRESS}`);
    
    // This is for debugging only - in production, you should fix the environment variables
    window.MARKETPLACE_ADDRESS = FALLBACK_MARKETPLACE_ADDRESS;
  }
  
  try {
    console.log('Preparing to send transaction...');
    
    console.log('Contract addresses:', {
      NFT_CONTRACT_ADDRESS: NFT_CONTRACT_ADDRESS || window.NFT_CONTRACT_ADDRESS,
      MARKETPLACE_ADDRESS: MARKETPLACE_ADDRESS || window.MARKETPLACE_ADDRESS
    });
    
    // Call the write function with a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Transaction request timed out after 30 seconds')), 30000);
    });
    
    const tx = await Promise.race([
      writeAsync(),
      timeoutPromise
    ]);
    
    console.log('Transaction sent successfully:', tx);
    return {
      success: true,
      hash: tx.hash,
      data: tx
    };
  } catch (error) {
    console.error('=== TRANSACTION ERROR ===');
    console.error('Original error:', error);
    
    // Extract more meaningful error from different error formats
    let errorMessage = 'Transaction failed';
    
    if (error.message) {
      errorMessage = error.message;
      console.error('Error message:', error.message);
    }
    
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    // Check for connection issues
    if (errorMessage.includes('timed out') || errorMessage.includes('timeout') || 
        errorMessage.includes('network') || errorMessage.includes('connection')) {
      console.error('Network connectivity issue detected. Please check your internet connection and wallet connection.');
      errorMessage = 'Network connection issue. Please try again or refresh the page.';
    }
    // Handle common error cases
    else if (errorMessage.includes('insufficient funds')) {
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
    
    console.error('Formatted error message:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
      originalError: error
    };
  }
}; 