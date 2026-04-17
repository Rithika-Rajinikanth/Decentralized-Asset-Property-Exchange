// src/web3.js
import { ethers } from "ethers";

// --- Import ABIs (make sure these JSON files are in src/abis/) ---
import PropertyNFTABI from "./abis/PropertyNFT.json";
import StableCoinABI from "./abis/ERC20_Stablecoin.json";
import RealEstateABI from "./abis/RealEstate.json"; // Assuming your main contract that manages properties
import ShareTokenABI from "./abis/PropertyShareToken.json"; // Assuming your fractional share token
import EscrowABI from "./abis/ShareEscrow.json"; // Assuming your escrow contract
import LoanLienManagerABI from "./abis/LoanLienManager.json"; // Assuming your loan/lien contract
import FractionalizerABI from "./abis/Fractionalizer.json"; // Assuming your contract to fractionalize NFTs
 
// --- REPLACE WITH YOUR DEPLOYED CONTRACT ADDRESSES ON SEPOLIA ---
// You will get these from your Hardhat deployment output (e.g., in a deployment.json file)
export const NFT_ADDRESS = "0xE82D999F232501702132a8601E08FF1bc52A3e4a"; // Example: Your PropertyNFT address
export const STABLECOIN_ADDRESS = "0xe3d052c768Df13e8bdA07Fd1b35cA03Bf03015b2"; // Example: Your ERC20_Stablecoin address
export const REAL_ESTATE_ADDRESS = "0x9AA36c61E8853cb5BDeC68E6272aD24d7F517ee0"; // Replace with your RealEstate.sol address
export const SHARE_TOKEN_ADDRESS = "0x17c4AB4Eb32960D5b3E5De357f3775Bf017ba9c7"; // Replace with your PropertyShareToken.sol address
export const ESCROW_ADDRESS = "0x68a251fe214ADc9C107b5FC5db0A4BcdFDf49C40"; // Replace with your Escrow.sol address
export const LOAN_LIEN_MANAGER_ADDRESS = "0x025647DbbcF3ABcfD15242CDeb345f344c3bC416"; // Replace with your LoanLienManager.sol address
export const FRACTIONALIZER_ADDRESS = "0x13a5F0Ca341F82201EB85b9ce5f36D3f8Ef09fEE"; // Replace with your Fractionalizer.sol address

// Helper to get a provider and signer (connected wallet)
export const getProviderSigner = async () => {
  if (!window.ethereum) {
    alert("MetaMask is not installed. Please install it to use this DApp.");
    throw new Error("MetaMask not found");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
};

// Function to get instances of all your deployed contracts
export const getContracts = async () => {
  const { provider, signer } = await getProviderSigner();

  // Contract instances
  const propertyNFT = new ethers.Contract(NFT_ADDRESS, PropertyNFTABI.abi, signer);
  const stablecoinContract = new ethers.Contract(STABLECOIN_ADDRESS, StableCoinABI.abi, signer);
  const realEstateContract = new ethers.Contract(REAL_ESTATE_ADDRESS, RealEstateABI.abi, signer);
  const shareTokenContract = new ethers.Contract(SHARE_TOKEN_ADDRESS, ShareTokenABI.abi, signer);
  const escrowContract = new ethers.Contract(ESCROW_ADDRESS, EscrowABI.abi, signer);
  const loanLienManagerContract = new ethers.Contract(LOAN_LIEN_MANAGER_ADDRESS, LoanLienManagerABI.abi, signer);
  const fractionalizerContract = new ethers.Contract(FRACTIONALIZER_ADDRESS, FractionalizerABI.abi, signer);

  return {
    provider,
    signer,
    propertyNFT,
    stablecoinContract,
    realEstateContract,
    shareTokenContract,
    escrowContract,
    loanLienManagerContract,
    fractionalizerContract,
  };
};

// Function to connect MetaMask (can be called from App.jsx or a header component)
export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
  } catch (err) {
    console.error("Wallet connection failed:", err);
    return null;
  }
};


// Optional: Listener for account changes
export const onAccountsChanged = (callback) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      callback(accounts[0] || null);
    });
  }
};



export async function getSignerAddress() {
  if (!window.ethereum) return null;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  try {
    return await signer.getAddress();
  } catch {
    return null;
  }
}
