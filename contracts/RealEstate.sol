// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RealEstate {
    // --- Enums and Structs ---
    enum Status { Listed, UnderContract, Sold, Delisted }

    struct Property {
        uint id;
        address seller;
        address buyer;
        Status status;
        string location;
        string description;
        uint256 price;
    }

    // --- State Variables ---
    uint public propertyCounter;
    mapping(uint => Property) public properties;
    mapping(uint => uint256) public escrow; // Stores payments held in escrow
    mapping(address => bool) public isVerified; // KYC verification status
    address public kycProvider; // Address of the KYC provider

    // --- Events ---
    event PropertyListed(uint indexed id, address indexed seller, string location, uint256 price);
    event OfferInitiated(uint indexed propertyId, address indexed buyer);
    event PaymentDeposited(uint indexed propertyId, address indexed buyer, uint256 amount);
    event SaleFinalized(uint indexed propertyId, address indexed seller, address indexed buyer);
    event IdentityVerified(address indexed user, bool status);

    // --- Modifiers ---
    modifier onlyKYCProvider() {
        require(msg.sender == kycProvider, "Only KYC provider can perform this action");
        _;
    }

    // --- Constructor ---
    constructor() {
        kycProvider = msg.sender;
    }

    // --- KYC Functionality ---
    function setKycProvider(address _newKycProvider) external onlyKYCProvider {
        require(_newKycProvider != address(0), "New KYC provider cannot be zero address");
        kycProvider = _newKycProvider;
    }

    function verifyIdentity(address user) external onlyKYCProvider {
        require(user != address(0), "Cannot verify zero address");
        isVerified[user] = true;
        emit IdentityVerified(user, true);
    }

    function unverifyIdentity(address user) external onlyKYCProvider {
        require(user != address(0), "Cannot unverify zero address");
        isVerified[user] = false;
        emit IdentityVerified(user, false);
    }

    // --- Property Listing ---
    function listProperty(string memory location, string memory description, uint256 price) external {
        require(isVerified[msg.sender], "Seller must be KYC verified");
        require(price > 0, "Price must be greater than zero");

        propertyCounter++;
        properties[propertyCounter] = Property({
            id: propertyCounter,
            seller: msg.sender,
            buyer: address(0),
            status: Status.Listed,
            location: location,
            description: description,
            price: price
        });

        emit PropertyListed(propertyCounter, msg.sender, location, price);
    }

    // --- Buyer Interaction ---
    function initiateOffer(uint propertyId) external {
        require(isVerified[msg.sender], "Buyer must be KYC verified");
        Property storage prop = properties[propertyId];
        require(prop.id != 0, "Property does not exist");
        require(prop.status == Status.Listed, "Property not available for offer");
        require(msg.sender != prop.seller, "Seller cannot make offer on own property");

        prop.buyer = msg.sender;
        prop.status = Status.UnderContract;
        emit OfferInitiated(propertyId, msg.sender);
    }

    // Buyer sends payment *full price* in ETH
    function depositPayment(uint propertyId) external payable {
        Property storage prop = properties[propertyId];
        require(prop.id != 0, "Property does not exist");
        require(prop.status == Status.UnderContract, "Property is not under contract");
        require(msg.sender == prop.buyer, "Only buyer can deposit payment");
        require(msg.value == prop.price, "Payment must be full price");

        escrow[propertyId] = msg.value;
        emit PaymentDeposited(propertyId, msg.sender, msg.value);
    }

    // Seller finalizes sale and receives escrowed payment
    function finalizeSale(uint propertyId) external {
        Property storage prop = properties[propertyId];
        require(prop.id != 0, "Property does not exist");
        require(prop.status == Status.UnderContract, "Sale not ready");
        require(msg.sender == prop.seller, "Only seller can finalize sale");
        require(escrow[propertyId] == prop.price, "Payment not fully deposited in escrow");

        prop.status = Status.Sold;

        // Transfer ether safely
        uint256 amount = escrow[propertyId];
        escrow[propertyId] = 0;
        (bool success, ) = payable(prop.seller).call{value: amount}("");
        require(success, "Failed to send funds to seller");

        emit SaleFinalized(propertyId, prop.seller, prop.buyer);
    }

    // Seller can delist the property if it's still listed
    function delistProperty(uint propertyId) external {
        Property storage prop = properties[propertyId];
        require(prop.id != 0, "Property does not exist");
        require(msg.sender == prop.seller, "Only seller can delist");
        require(prop.status == Status.Listed, "Cannot delist after contract or sale");

        prop.status = Status.Delisted;
    }

    // Emergency withdrawal by KYC provider of contract's balance (fallback)
    function withdraw() external onlyKYCProvider {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        (bool success, ) = payable(kycProvider).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    // --- Fallback and Receive to accept ETH directly ---
    receive() external payable {}
}
