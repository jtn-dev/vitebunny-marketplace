# ViteBunny NFT Marketplace

A modern NFT marketplace built on Ethereum with a sleek UI, allowing users to create, buy, sell, and collect NFTs.

## Features

- **Create & Mint NFTs**: Easily mint new NFTs and add them to collections
- **Buy & Sell NFTs**: List your NFTs for sale or purchase NFTs from others
- **Browse Collections**: Explore curated collections of digital assets
- **Connect Wallet**: Seamless MetaMask integration
- **Blockchain Integration**: Built on Ethereum (Sepolia testnet for demo)
- **MongoDB Storage**: Hybrid on-chain/off-chain storage solution

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Authentication**: Web3 wallet authentication

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask wallet
- MongoDB connection (for full functionality)

### Installation

1. Clone the repository
```
git clone https://github.com/your-username/vitebunny-marketplace.git
cd vitebunny-marketplace
```

2. Install dependencies
```
npm install
```

3. Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_MARKETPLACE_ADDRESS=your_marketplace_address
NEXT_PUBLIC_NETWORK_ID=11155111 # Sepolia testnet
```

4. Run the development server
```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The project is currently deployed on Sepolia testnet with the following contract addresses:

- NFT Contract: `0x1dac5D6276B2912BBb33a04E981B67080e90c428`
- Marketplace Contract: `0x45A7B09126cb5Ff067960E3bB924D78800c219A0`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for secure contract templates
- Hardhat for the development environment
- Next.js team for the fantastic framework
