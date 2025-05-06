// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ViteBunnyNFT.sol";

/**
 * @title ViteBunnyMarketplace
 * @dev NFT Marketplace for ViteBunny NFTs
 */
contract ViteBunnyMarketplace is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    // Market item represents a listing in the marketplace
    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        bool sold;
    }
    
    // Counter for market items
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    
    // Platform fee percentage (2.5%)
    uint256 public platformFeePercent = 250; // 250 = 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000; // For percentage calculation
    
    // Mapping from item ID to MarketItem
    mapping(uint256 => MarketItem) private _marketItems;
    
    // Events
    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );
    
    event MarketItemSold(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 price
    );
    
    constructor() Ownable() {}
    
    /**
     * @dev Creates a market item for an NFT listing
     * @param nftContract Address of the NFT contract
     * @param tokenId ID of the NFT
     * @param price Sale price of the NFT
     */
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        
        // Make sure NFT owner has approved marketplace to transfer the token
        require(
            IERC721(nftContract).getApproved(tokenId) == address(this) || 
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)),
            "NFT must be approved for marketplace"
        );
        
        // Make sure the seller is the owner of the NFT
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Only the NFT owner can create a listing"
        );

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
  
        _marketItems[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            msg.sender, // seller
            address(0), // no owner yet (marketplace holds it)
            price,
            false
        );
        
        // Transfer NFT to marketplace (escrow)
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price
        );
    }
    
    /**
     * @dev Creates a market sale by buying an NFT
     * @param itemId ID of the market item
     */
    function createMarketSale(uint256 itemId) public payable nonReentrant {
        MarketItem storage item = _marketItems[itemId];
        uint256 price = item.price;
        uint256 tokenId = item.tokenId;
        
        require(item.itemId > 0, "Item does not exist");
        require(!item.sold, "Item already sold");
        require(msg.value == price, "Please submit the asking price");
        
        // Calculate platform fee
        uint256 platformFee = (price * platformFeePercent) / FEE_DENOMINATOR;
        uint256 sellerProceeds = price - platformFee;
        
        // Mark as sold and update owner
        item.sold = true;
        item.owner = msg.sender;
        _itemsSold.increment();
        
        // Transfer NFT to buyer
        IERC721(item.nftContract).transferFrom(address(this), msg.sender, tokenId);
        
        // Transfer funds
        (bool feeSuccess, ) = payable(owner()).call{value: platformFee}("");
        require(feeSuccess, "Failed to send platform fee");
        
        (bool sellerSuccess, ) = payable(item.seller).call{value: sellerProceeds}("");
        require(sellerSuccess, "Failed to send proceeds to seller");
        
        emit MarketItemSold(
            itemId,
            item.nftContract,
            tokenId,
            item.seller,
            msg.sender,
            price
        );
    }
    
    /**
     * @dev Cancels a market listing and returns the NFT to the seller
     * @param itemId ID of the market item
     */
    function cancelMarketItem(uint256 itemId) public nonReentrant {
        MarketItem storage item = _marketItems[itemId];
        
        require(item.itemId > 0, "Item does not exist");
        require(!item.sold, "Item already sold");
        require(item.seller == msg.sender, "Only seller can cancel listing");
        
        // Transfer NFT back to seller
        IERC721(item.nftContract).transferFrom(address(this), msg.sender, item.tokenId);
        
        // Mark as sold to remove from active listings (can be improved with a different state)
        item.sold = true;
        item.owner = msg.sender;
        _itemsSold.increment();
    }
    
    /**
     * @dev Updates the platform fee percentage
     * @param newFeePercent New fee percentage (base 10000)
     */
    function updatePlatformFee(uint256 newFeePercent) public onlyOwner {
        require(newFeePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = newFeePercent;
    }
    
    /**
     * @dev Gets all unsold market items
     * @return Array of unsold market items
     */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = itemCount - _itemsSold.current();
        
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= itemCount; i++) {
            if (!_marketItems[i].sold) {
                items[currentIndex] = _marketItems[i];
                currentIndex++;
            }
        }
        
        return items;
    }
    
    /**
     * @dev Gets market items created by the caller
     * @return Array of market items created by the caller
     */
    function fetchMyCreatedItems() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        
        // Count items created by user
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (_marketItems[i].seller == msg.sender) {
                itemCount++;
            }
        }
        
        // Populate the array
        MarketItem[] memory items = new MarketItem[](itemCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (_marketItems[i].seller == msg.sender) {
                items[currentIndex] = _marketItems[i];
                currentIndex++;
            }
        }
        
        return items;
    }
    
    /**
     * @dev Gets market items owned by the caller
     * @return Array of market items owned by the caller
     */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        
        // Count items owned by user
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (_marketItems[i].owner == msg.sender) {
                itemCount++;
            }
        }
        
        // Populate the array
        MarketItem[] memory items = new MarketItem[](itemCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (_marketItems[i].owner == msg.sender) {
                items[currentIndex] = _marketItems[i];
                currentIndex++;
            }
        }
        
        return items;
    }
} 