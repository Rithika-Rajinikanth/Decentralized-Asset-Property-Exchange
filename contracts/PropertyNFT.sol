// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // Needed by PropertyShareToken
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PropertyShareToken.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; // For toString conversion if needed

// Represents a unique property as an NFT
contract PropertyNFT is ERC721, Ownable {
    using Strings for uint256; // Convert tokenId to string

    uint256 private _tokenIdCounter;

    // Mapping from property NFT ID to its associated fractional share token contract address
    mapping(uint256 => address) public propertyShares;

    // Mapping from property NFT ID to its IPFS hash for metadata
    mapping(uint256 => string) private _ipfsHashes;

    event PropertyTokenized(uint256 indexed propertyId, string ipfsHash, address shareTokenAddress);

    constructor() ERC721("DAPEProperty", "DAPE_P") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    // Function to tokenize a new property
    function tokenizeProperty(string memory _ipfsHashOfMetadata, uint256 _totalShares)
        public
        onlyOwner
        returns (uint256 newPropertyId)
    {
        _tokenIdCounter++;  
        newPropertyId = _tokenIdCounter;
        _safeMint(msg.sender, newPropertyId);

        _ipfsHashes[newPropertyId] = _ipfsHashOfMetadata;

        // Deploy ERC20 shares for fractional ownership
        PropertyShareToken shares = new PropertyShareToken(newPropertyId, msg.sender, _totalShares);
        propertyShares[newPropertyId] = address(shares);

        emit PropertyTokenized(newPropertyId, _ipfsHashOfMetadata, address(shares));
        return newPropertyId;
    }

    // Public getter for total minted tokens count (needed by frontend)
    function getTokenCount() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // Get the ERC20 share token contract address for a property NFT
    function getPropertyShareToken(uint256 _propertyId) public view returns (address) {
        return propertyShares[_propertyId];
    }

    // Return the IPFS URI metadata for a token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        string memory ipfsHash = _ipfsHashes[tokenId];
        require(bytes(ipfsHash).length > 0, "ERC721Metadata: IPFS hash not set for token");
        return string(abi.encodePacked("ipfs://", ipfsHash));
    }
}
