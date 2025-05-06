# ViteBunny NFT Marketplace Setup Instructions

## Environment Configuration
Create a `.env.local` file in the root directory with the following content:

```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/vitebunny
# Alternatively, use MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/vitebunny

# Blockchain Configuration
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Smart Contract Addresses (replace with your deployed contract addresses)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

## Database Setup

### Option 1: Local MongoDB Installation
1. Install MongoDB on your local machine: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. The database will be automatically created when the application connects

### Option 2: MongoDB Atlas (Cloud)
1. Create a free MongoDB Atlas account: https://www.mongodb.com/cloud/atlas/register
2. Create a new cluster
3. Set up database access (username/password)
4. Whitelist your IP address
5. Get your connection string and update the `MONGODB_URI` in `.env.local`

## Running the Application
1. Install dependencies (if not already done):
   ```
   npm install
   ```

2. Start the application:
   ```
   npm run dev
   ```

3. Initialize blockchain synchronization:
   - Visit http://localhost:3000/api/sync?fullSync=true in your browser
   - This will start synchronizing NFT data from the blockchain to the database

4. Start using the application at http://localhost:3000

## Monitoring
- Check the console logs for "Connected to MongoDB" message to verify database connection
- The DatabaseProvider component will automatically initialize event listeners for real-time synchronization

## Troubleshooting
- If you encounter connection issues, verify your MongoDB is running
- For MongoDB Atlas, ensure your IP is whitelisted
- Verify your contract addresses match the deployed contracts in `.env.local` 