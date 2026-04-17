// dape-project/smart_contracts/contracts/PropertyShareToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; // <--- ADD THIS LINE!


// Represents fractional shares of a specific property NFT
contract PropertyShareToken is ERC20 {
    using Strings for uint256; // To convert tokenId to string if needed for URI generation

    uint256 public propertyNFTId;

    // Added minter address to control initial supply distribution
    constructor(uint256 _propertyNFTId, address _minter, uint256 _totalShares)
        ERC20(
            string(abi.encodePacked("DAPE Property #", _propertyNFTId.toString(), " Shares")), // Using toString for string conversion
            string(abi.encodePacked("DAPE_S", _propertyNFTId.toString()))
        )
    {
        propertyNFTId = _propertyNFTId;
        // Mint all shares to the designated minter (e.g., the PropertyNFT deployer or property owner)
        _mint(_minter, _totalShares * (10 ** decimals()));
    }
}