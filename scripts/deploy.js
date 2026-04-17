const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy PropertyNFT contract (no constructor args)
  const propertyNFT = await ethers.deployContract("PropertyNFT");
  await propertyNFT.waitForDeployment();
  const propertyNFTAddress = await propertyNFT.getAddress();
  console.log("PropertyNFT deployed at:", propertyNFTAddress);

  // Deploy Stablecoin contract (no constructor args)
  const stablecoin = await ethers.deployContract("ERC20_Stablecoin");
  await stablecoin.waitForDeployment();
  const stablecoinAddress = await stablecoin.getAddress();
  console.log("Stablecoin deployed at:", stablecoinAddress);

  // Deploy RealEstate contract (no constructor args)
  const realEstate = await ethers.deployContract("RealEstate");
  await realEstate.waitForDeployment();
  const realEstateAddress = await realEstate.getAddress();
  console.log("RealEstate deployed at:", realEstateAddress);

  // Deploy LoanLienManager with PropertyNFT address
  const loanLienManager = await ethers.deployContract("LoanLienManager", [propertyNFTAddress]);
  await loanLienManager.waitForDeployment();
  const loanLienManagerAddress = await loanLienManager.getAddress();
  console.log("LoanLienManager deployed at:", loanLienManagerAddress);

  // Deploy ShareEscrow (no constructor args)
  const shareEscrow = await ethers.deployContract("ShareEscrow");
  await shareEscrow.waitForDeployment();
  const shareEscrowAddress = await shareEscrow.getAddress();
  console.log("ShareEscrow deployed at:", shareEscrowAddress);

  // Deploy Fractionalizer with PropertyNFT address
  const fractionalizer = await ethers.deployContract("Fractionalizer", [propertyNFTAddress]);
  await fractionalizer.waitForDeployment();
  const fractionalizerAddress = await fractionalizer.getAddress();
  console.log("Fractionalizer deployed at:", fractionalizerAddress);

  // OPTIONAL: Deploy PropertyShareToken manually (for testing only)
  // !!! You must specify valid constructor args: tokenId, minter address, total shares !!!
  // Comment out or remove in production; fractionalizer deploys this dynamically
  
  const propertyNFTId = 1; // Example token ID
  const minter = deployer.address; // Usually owner or deployer
  const totalShares = 100; // Example total shares

  const propertyShareToken = await ethers.deployContract("PropertyShareToken", [propertyNFTId, minter, totalShares]);
  await propertyShareToken.waitForDeployment();
  const propertyShareTokenAddress = await propertyShareToken.getAddress();
  console.log("PropertyShareToken deployed at:", propertyShareTokenAddress);
  

  // Print summary
  console.log("\n---- Deployment Summary ----");
  console.log("PropertyNFT:", propertyNFTAddress);
  console.log("Stablecoin:", stablecoinAddress);
  console.log("RealEstate:", realEstateAddress);
  console.log("LoanLienManager:", loanLienManagerAddress);
  console.log("ShareEscrow:", shareEscrowAddress);
  console.log("Fractionalizer:", fractionalizerAddress);
  // console.log("PropertyShareToken (manual):", propertyShareTokenAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  });
