# ViteBunny Smart Contracts

This directory contains the smart contracts for the ViteBunny NFT Marketplace.

## Overview

The ViteBunny marketplace consists of two main contracts:

1. **ViteBunnyNFT.sol** - An ERC-721 NFT contract that handles token minting and storage.
2. **ViteBunnyMarketplace.sol** - A marketplace contract that handles listing, buying, and selling of NFTs.

## Setup

### Prerequisites

- Node.js (v14+)
- npm
- An Ethereum wallet with testnet or mainnet ETH

### Installation

1. Install Hardhat and OpenZeppelin dependencies:
   ```
   npm install --save-dev hardhat @openzeppelin/contracts
   ```

2. Create a `.env` file in the project root with the following variables:
   ```
   SEPOLIA_URL=YOUR_RPC_ENDPOINT
   PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY
   ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
   ```

## Deployment

### Local Deployment (Testing)

1. Start a local Hardhat node:
   ```
   npx hardhat node
   ```

2. Deploy the contracts to the local node:
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```

### Testnet Deployment

Deploy to Sepolia testnet:
```
npx hardhat run scripts/deploy.js --network sepolia
```

### Mainnet Deployment

Deploy to Ethereum mainnet (proceed with caution):
```
npx hardhat run scripts/deploy.js --network mainnet
```

## After Deployment

After deployment, you'll get contract addresses for both the NFT contract and the Marketplace contract. Update your frontend with these addresses:

1. In `.env` file:
   ```
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=YOUR_NFT_CONTRACT_ADDRESS
   NEXT_PUBLIC_MARKETPLACE_ADDRESS=YOUR_MARKETPLACE_ADDRESS
   ```

## Contract Verification

You can verify your contracts on Etherscan:

```
npx hardhat verify --network sepolia YOUR_NFT_CONTRACT_ADDRESS "DEPLOYER_ADDRESS"
npx hardhat verify --network sepolia YOUR_MARKETPLACE_ADDRESS "DEPLOYER_ADDRESS"
```

## Contract Interaction

### ViteBunnyNFT Contract

- **mintNFT(address recipient, string memory tokenURI, string memory collection)** - Mint a new NFT.
- **getTokenCollection(uint256 tokenId)** - Get the collection name of a token.
- **getTokenCreator(uint256 tokenId)** - Get the creator's address of a token.

### ViteBunnyMarketplace Contract

- **createMarketItem(address nftContract, uint256 tokenId, uint256 price)** - List an NFT for sale.
- **createMarketSale(uint256 itemId)** - Buy an NFT (send the price as ETH with the transaction).
- **cancelMarketItem(uint256 itemId)** - Cancel a listing.
- **fetchMarketItems()** - Get all unsold listings.
- **fetchMyCreatedItems()** - Get listings created by the caller.
- **fetchMyNFTs()** - Get NFTs owned by the caller.

## Security Considerations

1. The marketplace uses an escrow model - NFTs are transferred to the marketplace contract when listed.
2. The marketplace charges a platform fee (2.5% by default).
3. The owner can update the platform fee (capped at 10%).
4. All functions that modify state are protected against reentrancy attacks.

## Testing

Run tests with:
```
npx hardhat test
```

## License

These contracts are MIT licensed. 