// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Added for stablecoin refund in cancelDeal
import "@openzeppelin/contracts/access/Ownable.sol";

// Contract to manage digital liens on PropertyNFTs
contract LoanLienManager is Ownable {
    // Address of the deployed PropertyNFT contract
    address public propertyNFTContract;

    // Mapping from property NFT ID to the active lien details
    mapping(uint256 => Lien) public activeLiens;

    struct Lien {
        address borrower;         // The owner of the NFT (borrower)
        address lender;           // The bank/lender's address (could be a contract address)
        uint256 loanAmount;       // Total loan amount
        uint256 outstandingBalance; // Current outstanding balance
        uint256 timestampGranted; // When the lien was granted
        bool isActive;            // Is the lien currently active
        bytes32 externalLoanIdHash; // Hash of bank's internal loan ID for reconciliation
    }

    event LienGranted(uint256 indexed propertyId, address indexed borrower, address indexed lender, uint256 loanAmount);
    event LienReleased(uint256 indexed propertyId, address indexed borrower, uint256 finalBalance);
    event LoanPaymentReceived(uint256 indexed propertyId, uint256 amountPaid, uint256 newBalance);

    constructor(address _propertyNFTContract) Ownable(msg.sender) {
        require(_propertyNFTContract != address(0), "Property NFT contract address cannot be zero");
        propertyNFTContract = _propertyNFTContract;
    }

    // Function callable by an authorized entity (e.g., a DAPE backend service or the bank's smart contract)
    // to record a lien after a loan is approved by the bank.
    // The NFT itself isn't transferred, but a claim is recorded.
    function grantLien(
        uint256 _propertyId,
        address _borrower,
        address _lender, // The bank's address/proxy
        uint256 _loanAmount,
        bytes32 _externalLoanIdHash // Hash of the bank's loan ID
    ) public onlyOwner { // Only DAPE's authorized backend can call this
        require(!activeLiens[_propertyId].isActive, "Lien already active on this property");
        // Ensure the borrower actually owns the Property NFT
        require(IERC721(propertyNFTContract).ownerOf(_propertyId) == _borrower, "Borrower must own the property NFT");

        activeLiens[_propertyId] = Lien({
            borrower: _borrower,
            lender: _lender,
            loanAmount: _loanAmount,
            outstandingBalance: _loanAmount,
            timestampGranted: block.timestamp,
            isActive: true,
            externalLoanIdHash: _externalLoanIdHash
        });

        emit LienGranted(_propertyId, _borrower, _lender, _loanAmount);
    }

    // Function to record a payment (can be called by DAPE backend after receiving fiat payment from bank)
    // _stablecoinContract is not needed here as payment is assumed to be fiat off-chain.
    // This function only updates the on-chain outstanding balance for the lien record.
    function recordPayment(uint256 _propertyId, uint256 _amountPaid) public onlyOwner {
        Lien storage lien = activeLiens[_propertyId];
        require(lien.isActive, "No active lien on this property");
        require(lien.outstandingBalance >= _amountPaid, "Amount paid exceeds outstanding balance");

        lien.outstandingBalance -= _amountPaid;
        emit LoanPaymentReceived(_propertyId, _amountPaid, lien.outstandingBalance);

        if (lien.outstandingBalance == 0) {
            releaseLien(_propertyId);
        }
    }

    // Function to release a lien once the loan is fully repaid (or in case of legal settlement)
    function releaseLien(uint256 _propertyId) public onlyOwner { // Or add a specific role for lender
        Lien storage lien = activeLiens[_propertyId];
        require(lien.isActive, "No active lien to release on this property");
        require(lien.outstandingBalance == 0, "Loan not fully repaid to release lien");

        lien.isActive = false;
        // Optionally, delete activeLiens[_propertyId] to save gas for future operations on this ID
        // delete activeLiens[_propertyId]; // Commented out to retain historical data if needed, but saves gas
        emit LienReleased(_propertyId, lien.borrower, 0);
    }
}