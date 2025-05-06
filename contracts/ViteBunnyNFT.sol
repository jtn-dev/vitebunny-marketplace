// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ViteBunnyNFT
 * @dev ERC721 token for Vite Bunny NFT marketplace
 */
contract ViteBunnyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to its collection
    mapping(uint256 => string) private _tokenCollections;

    // Mapping from token ID to creator address
    mapping(uint256 => address) private _creators;
    
    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string tokenURI, string collection);
    
    constructor() 
        ERC721("ViteBunnyNFT", "VBNFT") 
        Ownable()
    {}
    
    /**
     * @dev Mints a new NFT token and sets its metadata
     * @param recipient The address that will own the minted NFT
     * @param uri The token URI with metadata
     * @param collection The collection name this NFT belongs to
     * @return The ID of the newly minted NFT
     */
    function mintNFT(address recipient, string memory uri, string memory collection) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, uri);
        
        // Set collection and creator info
        _tokenCollections[newTokenId] = collection;
        _creators[newTokenId] = _msgSender();
        
        emit NFTMinted(newTokenId, _msgSender(), uri, collection);
        
        return newTokenId;
    }
    
    /**
     * @dev Get the collection name of a token
     * @param tokenId The ID of the token
     * @return The collection name
     */
    function getTokenCollection(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "ViteBunnyNFT: Collection query for nonexistent token");
        return _tokenCollections[tokenId];
    }
    
    /**
     * @dev Get the creator of a token
     * @param tokenId The ID of the token
     * @return The creator's address
     */
    function getTokenCreator(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "ViteBunnyNFT: Creator query for nonexistent token");
        return _creators[tokenId];
    }

    /**
     * @dev Check if a token exists
     * @param tokenId The ID of the token
     * @return Whether the token exists
     */
    function _exists(uint256 tokenId) internal view virtual override returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @dev Override the _burn function to clear token collections and creators
     */
    function _burn(uint256 tokenId) internal override(ERC721URIStorage) {
        super._burn(tokenId);
        
        if (bytes(_tokenCollections[tokenId]).length > 0) {
            delete _tokenCollections[tokenId];
        }
        
        if (_creators[tokenId] != address(0)) {
            delete _creators[tokenId];
        }
    }
} 