// Load Hardhat plugins and environment variables
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "", // Access URL from environment variable or leave blank to fail
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // Wallet private key
      chainId: 11155111,
    }
  }
};
