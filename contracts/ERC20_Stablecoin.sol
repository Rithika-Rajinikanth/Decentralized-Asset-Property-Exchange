// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // For minting functionality controlled by owner

contract ERC20_Stablecoin is ERC20, Ownable {
    constructor() ERC20("DAPE Stablecoin", "DSD") Ownable(msg.sender) {
        // Mint an initial supply to the deployer (owner)
        // You can adjust this initial supply as needed
        _mint(msg.sender, 1000000 * (10 ** decimals())); // 1,000,000 tokens
    }

    // Function to mint new tokens, only callable by the contract owner
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}