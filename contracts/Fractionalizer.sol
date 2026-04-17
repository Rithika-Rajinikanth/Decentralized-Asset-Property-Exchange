// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PropertyNFT.sol";
import "./PropertyShareToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Fractionalizer is Ownable {
    PropertyNFT public propertyNFT;

     // Maps tokenId => share token address
    mapping(uint256 => address) public fractionalized;

    event Fractionalized(uint256 indexed tokenId, address shareToken);

    constructor(address _propertyNFTAddress) Ownable(msg.sender) {
        require(_propertyNFTAddress != address(0), "Invalid address");
        propertyNFT = PropertyNFT(_propertyNFTAddress);
    }

    function fractionalize(uint256 tokenId, uint256 shareSupply) public onlyOwner {
        require(propertyNFT.ownerOf(tokenId) == msg.sender, "You must own the property NFT");
        PropertyShareToken shareToken = new PropertyShareToken(
            tokenId,
            msg.sender,
            shareSupply
        );
        
        fractionalized[tokenId] = address(shareToken);
        emit Fractionalized(tokenId, address(shareToken));
    }
    
    function getShareToken(uint256 tokenId) external view returns (address) {
        return fractionalized[tokenId];
    }
}
