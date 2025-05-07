const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ViteBunny NFT Marketplace", function () {
  let ViteBunnyNFT;
  let viteBunnyNFT;
  let ViteBunnyMarketplace;
  let viteBunnyMarketplace;
  let owner;
  let creator;
  let buyer;

  beforeEach(async function () {
    // Get signers
    [owner, creator, buyer] = await ethers.getSigners();

    // Deploy NFT contract
    ViteBunnyNFT = await ethers.getContractFactory("ViteBunnyNFT");
    viteBunnyNFT = await ViteBunnyNFT.deploy();
    await viteBunnyNFT.waitForDeployment();

    // Deploy Marketplace contract
    ViteBunnyMarketplace = await ethers.getContractFactory("ViteBunnyMarketplace");
    viteBunnyMarketplace = await ViteBunnyMarketplace.deploy();
    await viteBunnyMarketplace.waitForDeployment();
  });

  describe("NFT Minting", function () {
    it("Should mint an NFT and set the correct collection and creator", async function () {
      // Mint NFT
      const tx = await viteBunnyNFT.connect(creator).mintNFT(
        creator.address,
        "ipfs://test/metadata.json",
        "Cosmic Bunnies"
      );
      
      // Get the tokenId from the event
      const receipt = await tx.wait();
      const event = receipt.logs.filter(
        (log) => log.fragment && log.fragment.name === "NFTMinted"
      )[0];
      
      const tokenId = event.args[0];
      
      // Check token owner, collection and creator
      expect(await viteBunnyNFT.ownerOf(tokenId)).to.equal(creator.address);
      expect(await viteBunnyNFT.getTokenCollection(tokenId)).to.equal("Cosmic Bunnies");
      expect(await viteBunnyNFT.getTokenCreator(tokenId)).to.equal(creator.address);
    });
  });

  describe("Marketplace Listings", function () {
    let tokenId;

    beforeEach(async function () {
      // Mint an NFT first
      const tx = await viteBunnyNFT.connect(creator).mintNFT(
        creator.address,
        "ipfs://test/metadata.json",
        "Cosmic Bunnies"
      );
      
      // Get the tokenId from the event
      const receipt = await tx.wait();
      const event = receipt.logs.filter(
        (log) => log.fragment && log.fragment.name === "NFTMinted"
      )[0];
      
      tokenId = event.args[0];
    });

    it("Should create a marketplace listing", async function () {
      // Approve the marketplace to transfer the NFT
      await viteBunnyNFT.connect(creator).approve(await viteBunnyMarketplace.getAddress(), tokenId);
      
      // List the NFT
      const listingPrice = ethers.parseEther("1.0");
      await viteBunnyMarketplace.connect(creator).createMarketItem(
        await viteBunnyNFT.getAddress(),
        tokenId,
        listingPrice
      );
      
      // Get all market items
      const items = await viteBunnyMarketplace.fetchMarketItems();
      
      // Check the listing details
      expect(items.length).to.equal(1);
      expect(items[0].tokenId).to.equal(tokenId);
      expect(items[0].seller).to.equal(creator.address);
      expect(items[0].owner).to.equal("0x0000000000000000000000000000000000000000"); // Zero address when listed
      expect(items[0].price).to.equal(listingPrice);
      expect(items[0].sold).to.equal(false);
      
      // Check that the NFT was transferred to the marketplace
      expect(await viteBunnyNFT.ownerOf(tokenId)).to.equal(await viteBunnyMarketplace.getAddress());
    });

    it("Should allow buying a listed NFT", async function () {
      // Approve and list the NFT
      await viteBunnyNFT.connect(creator).approve(await viteBunnyMarketplace.getAddress(), tokenId);
      
      const listingPrice = ethers.parseEther("1.0");
      await viteBunnyMarketplace.connect(creator).createMarketItem(
        await viteBunnyNFT.getAddress(),
        tokenId,
        listingPrice
      );
      
      // Get the marketplace item ID
      const items = await viteBunnyMarketplace.fetchMarketItems();
      const itemId = items[0].itemId;
      
      // Check creator and owner balances before sale
      const creatorBalanceBefore = await ethers.provider.getBalance(creator.address);
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      
      // Buyer purchases the NFT
      await viteBunnyMarketplace.connect(buyer).createMarketSale(itemId, { value: listingPrice });
      
      // Check NFT ownership after purchase
      expect(await viteBunnyNFT.ownerOf(tokenId)).to.equal(buyer.address);
      
      // Check that the item is marked as sold
      const myNFTs = await viteBunnyMarketplace.connect(buyer).fetchMyNFTs();
      expect(myNFTs.length).to.equal(1);
      expect(myNFTs[0].itemId).to.equal(itemId);
      expect(myNFTs[0].sold).to.equal(true);
      
      // Check that the creator received payment (minus platform fee)
      const platformFee = listingPrice * BigInt(250) / BigInt(10000); // 2.5%
      const creatorBalanceAfter = await ethers.provider.getBalance(creator.address);
      expect(creatorBalanceAfter - creatorBalanceBefore).to.equal(listingPrice - platformFee);
      
      // Check that the owner received the platform fee
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(platformFee);
    });

    it("Should allow cancelling a listing", async function () {
      // Approve and list the NFT
      await viteBunnyNFT.connect(creator).approve(await viteBunnyMarketplace.getAddress(), tokenId);
      
      const listingPrice = ethers.parseEther("1.0");
      await viteBunnyMarketplace.connect(creator).createMarketItem(
        await viteBunnyNFT.getAddress(),
        tokenId,
        listingPrice
      );
      
      // Get the marketplace item ID
      const items = await viteBunnyMarketplace.fetchMarketItems();
      const itemId = items[0].itemId;
      
      // Cancel the listing
      await viteBunnyMarketplace.connect(creator).cancelMarketItem(itemId);
      
      // Check that the NFT was returned to the creator
      expect(await viteBunnyNFT.ownerOf(tokenId)).to.equal(creator.address);
      
      // Check that there are no active listings
      const activeItems = await viteBunnyMarketplace.fetchMarketItems();
      expect(activeItems.length).to.equal(0);
    });
  });
}); 