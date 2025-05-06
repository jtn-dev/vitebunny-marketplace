# Sepolia Testnet Deployment Guide

This guide will walk you through deploying the ViteBunny NFT Marketplace contracts to the Sepolia testnet.

## Prerequisites

1. **Alchemy Account**: Create an account on [Alchemy](https://www.alchemy.com/) to get an API key for Sepolia.
2. **Etherscan Account**: Create an account on [Etherscan](https://etherscan.io/) to get an API key for contract verification.
3. **MetaMask Wallet**: You need a wallet with some Sepolia ETH for deployment.
4. **Sepolia ETH**: Get some test ETH from a [Sepolia faucet](https://sepoliafaucet.com/).

## Setup

1. **Create `.env` file**: Copy the content from `env-template.txt` to a new `.env` file:

```bash
cp env-template.txt .env
```

2. **Edit `.env` file**: Fill in your details:

```
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY_WITHOUT_0x_PREFIX
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
```

To get your private key from MetaMask:
- Open MetaMask → Click on the three dots → Account details → Export private key
- **IMPORTANT**: Never share your private key or commit it to git!

## Deployment

1. **Install dependencies** (if not already done):

```bash
npm install
```

2. **Compile the contracts**:

```bash
npx hardhat compile
```

3. **Deploy to Sepolia**:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

This will:
- Deploy both the NFT and Marketplace contracts
- Mint 3 sample NFTs for testing
- Output the contract addresses and the platform owner address

4. **Save the contract addresses**: After deployment, you'll see output like:

```
NFT_CONTRACT_ADDRESS= 0x...
MARKETPLACE_ADDRESS= 0x...
Platform Owner (receives fees): 0x...
```

Copy these addresses for your frontend configuration.

## Contract Verification (Optional)

Verify your contracts on Etherscan:

```bash
npx hardhat verify --network sepolia YOUR_NFT_CONTRACT_ADDRESS
npx hardhat verify --network sepolia YOUR_MARKETPLACE_ADDRESS
```

## Update Frontend Configuration

Create or update `.env.local` in your project root:

```
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=YOUR_NFT_CONTRACT_ADDRESS
NEXT_PUBLIC_MARKETPLACE_ADDRESS=YOUR_MARKETPLACE_ADDRESS
NEXT_PUBLIC_NETWORK_ID=11155111
```

## Notes

- The platform owner (who receives fees) is the address that deployed the contracts.
- The current fee rate is 2.5% and can be updated by the owner up to a maximum of 10%.
- On testnet, transaction times may vary depending on network congestion.
- Always keep your private keys safe and never commit them to GitHub. 