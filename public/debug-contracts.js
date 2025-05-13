// This file is used to debug contract connectivity issues
// Include it in your HTML with <script src="/debug-contracts.js"></script>

(function() {
  console.log('====== NFT CONTRACT DEBUG TOOL ======');
  
  // Known correct addresses from .env.local
  const EXPECTED_NFT_ADDRESS = '0x1dac5D6276B2912BBb33a04E981B67080e90c428';
  const EXPECTED_MARKETPLACE_ADDRESS = '0x45A7B09126cb5Ff067960E3bB924D78800c219A0';
  
  // Extract environment variables
  const nftAddress = window.ENV_NFT_CONTRACT_ADDRESS || 
                     window.NFT_CONTRACT_ADDRESS || 
                     window.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
                     
  const marketplaceAddress = window.ENV_MARKETPLACE_ADDRESS || 
                            window.MARKETPLACE_ADDRESS || 
                            window.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
  
  // Log contract addresses                    
  console.log('NFT Contract Address:', nftAddress);
  console.log('Marketplace Address:', marketplaceAddress);
  
  // Check for common issues
  if (!nftAddress || nftAddress === 'undefined') {
    console.error('ERROR: NFT_CONTRACT_ADDRESS is missing or undefined');
    console.log('Using fallback address:', EXPECTED_NFT_ADDRESS);
    window.NFT_CONTRACT_ADDRESS = EXPECTED_NFT_ADDRESS;
  } else if (nftAddress !== EXPECTED_NFT_ADDRESS) {
    console.warn('WARNING: NFT contract address does not match expected value');
    console.log('Current:', nftAddress);
    console.log('Expected:', EXPECTED_NFT_ADDRESS);
  }
  
  if (!marketplaceAddress || marketplaceAddress === 'undefined') {
    console.error('ERROR: MARKETPLACE_ADDRESS is missing or undefined');
    console.log('Using fallback address:', EXPECTED_MARKETPLACE_ADDRESS);
    window.MARKETPLACE_ADDRESS = EXPECTED_MARKETPLACE_ADDRESS;
  } else if (marketplaceAddress !== EXPECTED_MARKETPLACE_ADDRESS) {
    console.warn('WARNING: Marketplace address does not match expected value');
    console.log('Current:', marketplaceAddress);
    console.log('Expected:', EXPECTED_MARKETPLACE_ADDRESS);
  }
  
  // Check if user has MetaMask or other wallet
  const hasEthereum = typeof window.ethereum !== 'undefined';
  console.log('Ethereum provider detected:', hasEthereum);
  
  if (hasEthereum) {
    // Get the current network
    window.ethereum.request({ method: 'eth_chainId' })
      .then(chainId => {
        console.log('Connected to chain ID:', chainId);
        // Convert to decimal
        const decimalChainId = parseInt(chainId, 16);
        console.log('Chain ID (decimal):', decimalChainId);
        
        // Check if on Sepolia testnet (chain ID 11155111)
        if (decimalChainId === 11155111) {
          console.log('Connected to Sepolia testnet ✅');
        } else {
          console.warn('Not connected to Sepolia testnet. Current network may not be compatible with contracts.');
        }
      })
      .catch(err => {
        console.error('Error getting chain ID:', err);
      });
      
    // Get user accounts
    window.ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts.length > 0) {
          console.log('Connected account:', accounts[0]);
        } else {
          console.warn('No accounts connected. User needs to connect wallet.');
        }
      })
      .catch(err => {
        console.error('Error getting accounts:', err);
      });
  }
  
  // Log next.js environment
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_RPC_URL:', process.env.NEXT_PUBLIC_RPC_URL);
  
  console.log('===================================');
})(); 