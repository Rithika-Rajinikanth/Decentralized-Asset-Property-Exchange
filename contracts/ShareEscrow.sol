// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Define a custom interface that includes the decimals() function
interface IERC20WithDecimals is IERC20 {
    function decimals() external view returns (uint8);
}

contract ShareEscrow is Ownable {
    struct EscrowDeal {
        address seller;
        address buyer;
        address tokenContract; // Address of the PropertyShareToken contract (ERC20)
        uint256 propertyNFTId; // The ID of the parent NFT
        uint256 amountOfShares;
        uint256 pricePerShare; // Price per share in stablecoin units (e.g., USD cents)
        uint256 depositAmount; // Buyer's initial deposit in stablecoin units
        bool sellerApproved;
        bool buyerApproved;
        bool dealCompleted;
        bool dealCancelled;
    }

    uint256 public nextDealId;
    mapping(uint256 => EscrowDeal) public deals;

    event DealCreated(uint256 indexed dealId, address indexed seller, address indexed buyer, uint256 amountOfShares, uint256 totalPrice);
    event SellerApproved(uint256 indexed dealId);
    event BuyerApproved(uint256 indexed dealId);
    event DealExecuted(uint256 indexed dealId);
    event DealCancelled(uint256 indexed dealId);

    constructor() Ownable(msg.sender) {
        nextDealId = 1;
    }

    // Seller creates a deal, requiring approval for their PropertyShareToken transfer to the escrow
    // Seller must have approved this contract to spend their shares beforehand via ERC20 approve()
    function createDeal(
        address _buyer,
        address _tokenContract, // Address of the specific PropertyShareToken
        uint256 _propertyNFTId,
        uint256 _amountOfShares,
        uint256 _pricePerShare,
        uint256 _depositPercentage // e.g., 10 for 10%
    ) public {
        require(_amountOfShares > 0, "Amount of shares must be greater than zero");
        require(_pricePerShare > 0, "Price per share must be greater than zero");
        require(_depositPercentage <= 100, "Deposit percentage cannot exceed 100%");

        // Use the new interface to get decimals
        IERC20WithDecimals shareToken = IERC20WithDecimals(_tokenContract);
        uint256 tokenDecimals = shareToken.decimals(); // Get decimals here
        uint256 scaledAmountOfShares = _amountOfShares * (10 ** tokenDecimals);


        uint256 totalSharesValue = _amountOfShares * _pricePerShare; // Total value in stablecoin units
        uint256 depositRequired = (totalSharesValue * _depositPercentage) / 100;

        // Seller transfers shares to the escrow contract
        // This requires the seller to have called approve(_shareEscrowAddress, amount) on their PropertyShareToken beforehand
        require(shareToken.transferFrom(msg.sender, address(this), scaledAmountOfShares), "Share transfer to escrow failed. Check allowance.");

        deals[nextDealId] = EscrowDeal({
            seller: msg.sender,
            buyer: _buyer,
            tokenContract: _tokenContract,
            propertyNFTId: _propertyNFTId,
            amountOfShares: _amountOfShares,
            pricePerShare: _pricePerShare,
            depositAmount: depositRequired,
            sellerApproved: true, // Seller approves by creating the deal
            buyerApproved: false,
            dealCompleted: false,
            dealCancelled: false
        });

        emit DealCreated(nextDealId, msg.sender, _buyer, _amountOfShares, totalSharesValue);
        nextDealId++;
    }

    // Buyer approves deal and sends initial deposit in stablecoin (e.g., USDT/USDC)
    // Buyer must have approved the stablecoin transfer to this contract beforehand
    function buyerApproveAndDeposit(uint256 _dealId, address _stablecoinContract) public {
        EscrowDeal storage deal = deals[_dealId];
        require(msg.sender == deal.buyer, "Only buyer can approve and deposit");
        require(!deal.buyerApproved, "Deal already approved by buyer");
        require(!deal.dealCompleted && !deal.dealCancelled, "Deal already completed or cancelled");
        require(deal.depositAmount > 0, "No deposit required for this deal");

        IERC20 stablecoin = IERC20(_stablecoinContract); // IERC20 is fine for stablecoin, as its decimals are hardcoded in the constructor

        // Transfer `deal.depositAmount` from buyer to escrow.
        // Assuming stablecoin has standard 18 decimals, or its actual decimals are handled correctly on the client side
        // or by a consistent standard. If not, you'd need its decimals too.
        require(stablecoin.transferFrom(msg.sender, address(this), deal.depositAmount), "Deposit failed. Check stablecoin allowance.");

        deal.buyerApproved = true;
        emit BuyerApproved(_dealId);
    }

    // Both parties approved, final payment and share transfer
    // This function can be called by either seller or buyer (or a trusted third party) after both approvals
    function executeDeal(uint256 _dealId, address _stablecoinContract) public {
        EscrowDeal storage deal = deals[_dealId];
        require(deal.sellerApproved && deal.buyerApproved, "Both parties must approve the deal.");
        require(!deal.dealCompleted && !deal.dealCancelled, "Deal already completed or cancelled.");

        IERC20WithDecimals shareToken = IERC20WithDecimals(deal.tokenContract); // Use the interface with decimals
        IERC20 stablecoin = IERC20(_stablecoinContract);

        uint256 remainingPayment = (deal.amountOfShares * deal.pricePerShare) - deal.depositAmount;
        // require(remainingPayment >= 0, "Calculated remaining payment is negative."); // This check is implied by uint256

        // Buyer transfers remaining payment to seller
        // This requires the buyer to have *approved the seller* on the stablecoin contract
        if (remainingPayment > 0) {
            require(stablecoin.transferFrom(deal.buyer, deal.seller, remainingPayment), "Final payment from buyer to seller failed. Check allowance.");
        }

        // Release shares from escrow to buyer
        // Scale shares by decimals before transfer
        uint256 shareTokenDecimals = shareToken.decimals();
        require(shareToken.transfer(deal.buyer, deal.amountOfShares * (10 ** shareTokenDecimals)), "Shares release to buyer failed.");

        // Transfer deposit from escrow to seller (this assumes the deposit was collected by escrow)
        if (deal.depositAmount > 0) {
            require(stablecoin.transfer(deal.seller, deal.depositAmount), "Deposit transfer to seller failed.");
        }

        deal.dealCompleted = true;
        emit DealExecuted(_dealId);
    }

    // Cancellation logic (e.g., if one party cancels before full approval, or after a timeout)
    // This would need more robust logic for who can cancel when and refund conditions.
    // For simplicity, here it allows either party to cancel if not completed.
    function cancelDeal(uint256 _dealId, address _stablecoinContract) public {
        EscrowDeal storage deal = deals[_dealId];
        require(msg.sender == deal.seller || msg.sender == deal.buyer || msg.sender == owner(), "Only seller, buyer, or owner can cancel.");
        require(!deal.dealCompleted && !deal.dealCancelled, "Deal already completed or cancelled.");

        deal.dealCancelled = true;
        IERC20WithDecimals shareToken = IERC20WithDecimals(deal.tokenContract); // Use the interface with decimals
        IERC20 stablecoin = IERC20(_stablecoinContract);

        uint256 shareTokenDecimals = shareToken.decimals();

        // Refund shares to seller if they were deposited
        if (shareToken.balanceOf(address(this)) >= deal.amountOfShares * (10 ** shareTokenDecimals)) {
            require(shareToken.transfer(deal.seller, deal.amountOfShares * (10 ** shareTokenDecimals)), "Shares refund to seller failed.");
        }

        // Refund deposit to buyer if it was made
        if (deal.buyerApproved && deal.depositAmount > 0) {
            if (stablecoin.balanceOf(address(this)) >= deal.depositAmount) {
                require(stablecoin.transfer(deal.buyer, deal.depositAmount), "Deposit refund to buyer failed.");
            }
        }
        emit DealCancelled(_dealId);
    }
} 