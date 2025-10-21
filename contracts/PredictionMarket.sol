// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./IncryptOracle.sol";

/**
 * @title PredictionMarket
 * @dev Decentralized prediction market using automated market maker (AMM) model
 * Integrates with IncryptOracle for outcome resolution
 */
contract PredictionMarket is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    enum MarketState {
        Active,
        Resolved,
        Cancelled,
        Disputed
    }
    
    enum Outcome {
        No,  // 0
        Yes  // 1
    }
    
    struct Market {
        string question;
        string description;
        string category;
        uint256 endTime;
        uint256 resolutionTime;
        bytes32 oracleDataFeedId;
        MarketState state;
        Outcome winningOutcome;
        uint256 totalLiquidity;
        uint256[2] outcomeShares; // [No shares, Yes shares]
        uint256[2] outcomePools; // [No pool, Yes pool]
        address creator;
        uint256 creationTime;
        uint256 fee; // Basis points (e.g., 200 = 2%)
        bool resolved;
    }
    
    struct Position {
        uint256[2] shares; // [No shares, Yes shares]
        uint256 totalInvested;
        bool claimed;
    }
    
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) public positions;
    mapping(address => uint256[]) public userMarkets;
    
    uint256 public marketCounter;
    uint256 public constant BASE_FEE = 200; // 2%
    uint256 public constant MAX_FEE = 1000; // 10%
    uint256 public constant MIN_LIQUIDITY = 1000 * 10**18; // 1000 IO tokens
    uint256 public constant RESOLUTION_BUFFER = 1 hours;
    
    IERC20 public immutable ioToken;
    IncryptOracle public immutable oracle;
    address public feeCollector;
    
    event MarketCreated(
        uint256 indexed marketId,
        address indexed creator,
        string question,
        uint256 endTime,
        bytes32 oracleDataFeedId
    );
    
    event SharesPurchased(
        uint256 indexed marketId,
        address indexed buyer,
        Outcome outcome,
        uint256 shares,
        uint256 cost
    );
    
    event SharesSold(
        uint256 indexed marketId,
        address indexed seller,
        Outcome outcome,
        uint256 shares,
        uint256 payout
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        Outcome winningOutcome,
        uint256 totalPayout
    );
    
    event LiquidityAdded(
        uint256 indexed marketId,
        address indexed provider,
        uint256 amount
    );
    
    event WinningsClamed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );
    
    modifier validMarket(uint256 marketId) {
        require(marketId < marketCounter, "Invalid market ID");
        _;
    }
    
    modifier marketActive(uint256 marketId) {
        require(markets[marketId].state == MarketState.Active, "Market not active");
        require(block.timestamp < markets[marketId].endTime, "Market ended");
        _;
    }
    
    constructor(
        address _ioToken,
        address _oracle,
        address _feeCollector,
        address initialOwner
    ) {
        ioToken = IERC20(_ioToken);
        oracle = IncryptOracle(_oracle);
        feeCollector = _feeCollector;
        _transferOwnership(initialOwner);
    }
    
    /**
     * @dev Create a new prediction market
     */
    function createMarket(
        string memory question,
        string memory description,
        string memory category,
        uint256 duration,
        bytes32 oracleDataFeedId,
        uint256 initialLiquidity
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(initialLiquidity >= MIN_LIQUIDITY, "Insufficient initial liquidity");
        require(duration >= 1 hours && duration <= 365 days, "Invalid duration");
        require(bytes(question).length > 0, "Empty question");
        
        // Verify oracle data feed exists
        (, , , , , bool isActive) = oracle.getDataFeed(oracleDataFeedId);
        require(isActive, "Invalid oracle data feed");
        
        uint256 marketId = marketCounter++;
        uint256 endTime = block.timestamp + duration;
        
        markets[marketId] = Market({
            question: question,
            description: description,
            category: category,
            endTime: endTime,
            resolutionTime: endTime + RESOLUTION_BUFFER,
            oracleDataFeedId: oracleDataFeedId,
            state: MarketState.Active,
            winningOutcome: Outcome.No, // Default, will be set on resolution
            totalLiquidity: initialLiquidity,
            outcomeShares: [initialLiquidity / 2, initialLiquidity / 2],
            outcomePools: [initialLiquidity / 2, initialLiquidity / 2],
            creator: msg.sender,
            creationTime: block.timestamp,
            fee: BASE_FEE,
            resolved: false
        });
        
        userMarkets[msg.sender].push(marketId);
        
        // Transfer initial liquidity
        ioToken.safeTransferFrom(msg.sender, address(this), initialLiquidity);
        
        emit MarketCreated(marketId, msg.sender, question, endTime, oracleDataFeedId);
        emit LiquidityAdded(marketId, msg.sender, initialLiquidity);
        
        return marketId;
    }
    
    /**
     * @dev Buy shares for a specific outcome
     */
    function buyShares(
        uint256 marketId,
        Outcome outcome,
        uint256 amount
    ) external validMarket(marketId) marketActive(marketId) nonReentrant returns (uint256 shares) {
        require(amount > 0, "Amount must be greater than 0");
        
        Market storage market = markets[marketId];
        uint256 cost = calculateCost(marketId, outcome, amount);
        
        // Transfer payment
        ioToken.safeTransferFrom(msg.sender, address(this), cost);
        
        // Calculate fee
        uint256 fee = (cost * market.fee) / 10000;
        uint256 netCost = cost - fee;
        
        // Update pools and shares
        uint256 outcomeIndex = uint256(outcome);
        shares = (netCost * market.outcomeShares[outcomeIndex]) / market.outcomePools[outcomeIndex];
        
        market.outcomePools[outcomeIndex] += netCost;
        market.outcomeShares[outcomeIndex] += shares;
        market.totalLiquidity += netCost;
        
        // Update user position
        Position storage position = positions[marketId][msg.sender];
        position.shares[outcomeIndex] += shares;
        position.totalInvested += cost;
        
        // Add to user markets if first time
        if (position.totalInvested == cost) {
            userMarkets[msg.sender].push(marketId);
        }
        
        // Transfer fee to collector
        if (fee > 0) {
            ioToken.safeTransfer(feeCollector, fee);
        }
        
        emit SharesPurchased(marketId, msg.sender, outcome, shares, cost);
    }
    
    /**
     * @dev Sell shares for a specific outcome
     */
    function sellShares(
        uint256 marketId,
        Outcome outcome,
        uint256 shares
    ) external validMarket(marketId) marketActive(marketId) nonReentrant returns (uint256 payout) {
        require(shares > 0, "Shares must be greater than 0");
        
        Position storage position = positions[marketId][msg.sender];
        uint256 outcomeIndex = uint256(outcome);
        require(position.shares[outcomeIndex] >= shares, "Insufficient shares");
        
        Market storage market = markets[marketId];
        payout = (shares * market.outcomePools[outcomeIndex]) / market.outcomeShares[outcomeIndex];
        
        // Calculate fee
        uint256 fee = (payout * market.fee) / 10000;
        uint256 netPayout = payout - fee;
        
        // Update pools and shares
        market.outcomePools[outcomeIndex] -= payout;
        market.outcomeShares[outcomeIndex] -= shares;
        market.totalLiquidity -= payout;
        
        // Update user position
        position.shares[outcomeIndex] -= shares;
        
        // Transfer payout to user
        ioToken.safeTransfer(msg.sender, netPayout);
        
        // Transfer fee to collector
        if (fee > 0) {
            ioToken.safeTransfer(feeCollector, fee);
        }
        
        emit SharesSold(marketId, msg.sender, outcome, shares, netPayout);
    }
    
    /**
     * @dev Resolve market using oracle data
     */
    function resolveMarket(uint256 marketId) external validMarket(marketId) nonReentrant {
        Market storage market = markets[marketId];
        require(market.state == MarketState.Active, "Market not active");
        require(block.timestamp >= market.resolutionTime, "Resolution time not reached");
        
        // Get data from oracle
        (, , uint256 value, uint256 timestamp, uint256 confidence, bool isActive) = oracle.getDataFeed(market.oracleDataFeedId);
        require(isActive, "Oracle data feed not active");
        require(timestamp >= market.endTime, "Oracle data not available yet");
        require(confidence >= 7000, "Oracle confidence too low"); // Require >70% confidence
        
        // Determine winning outcome (assuming binary outcome where >0.5 = Yes, <=0.5 = No)
        Outcome winningOutcome = value > 5000 ? Outcome.Yes : Outcome.No; // Assuming 10000 = 1.0
        
        market.winningOutcome = winningOutcome;
        market.state = MarketState.Resolved;
        market.resolved = true;
        
        emit MarketResolved(marketId, winningOutcome, market.totalLiquidity);
    }
    
    /**
     * @dev Claim winnings after market resolution
     */
    function claimWinnings(uint256 marketId) external validMarket(marketId) nonReentrant returns (uint256 payout) {
        Market storage market = markets[marketId];
        require(market.state == MarketState.Resolved, "Market not resolved");
        
        Position storage position = positions[marketId][msg.sender];
        require(!position.claimed, "Already claimed");
        require(position.totalInvested > 0, "No position in market");
        
        uint256 winningOutcomeIndex = uint256(market.winningOutcome);
        uint256 winningShares = position.shares[winningOutcomeIndex];
        
        if (winningShares > 0) {
            payout = (winningShares * market.totalLiquidity) / market.outcomeShares[winningOutcomeIndex];
            ioToken.safeTransfer(msg.sender, payout);
        }
        
        position.claimed = true;
        
        emit WinningsClamed(marketId, msg.sender, payout);
    }
    
    /**
     * @dev Calculate cost for buying shares
     */
    function calculateCost(uint256 marketId, Outcome outcome, uint256 amount) public view validMarket(marketId) returns (uint256) {
        Market storage market = markets[marketId];
        uint256 outcomeIndex = uint256(outcome);
        
        // Simple constant product formula for AMM
        uint256 k = market.outcomePools[0] * market.outcomePools[1];
        uint256 newPool = market.outcomePools[outcomeIndex] + amount;
        uint256 otherIndex = 1 - outcomeIndex;
        uint256 newOtherPool = k / newPool;
        
        return market.outcomePools[otherIndex] - newOtherPool;
    }
    
    /**
     * @dev Get current market odds
     */
    function getOdds(uint256 marketId) external view validMarket(marketId) returns (uint256 noOdds, uint256 yesOdds) {
        Market storage market = markets[marketId];
        uint256 totalPool = market.outcomePools[0] + market.outcomePools[1];
        
        if (totalPool > 0) {
            noOdds = (market.outcomePools[1] * 10000) / totalPool;
            yesOdds = (market.outcomePools[0] * 10000) / totalPool;
        }
    }
    
    /**
     * @dev Get user position in a market
     */
    function getUserPosition(uint256 marketId, address user) external view returns (
        uint256 noShares,
        uint256 yesShares,
        uint256 totalInvested,
        bool claimed
    ) {
        Position storage position = positions[marketId][user];
        return (position.shares[0], position.shares[1], position.totalInvested, position.claimed);
    }
    
    /**
     * @dev Get user's markets
     */
    function getUserMarkets(address user) external view returns (uint256[] memory) {
        return userMarkets[user];
    }
    
    /**
     * @dev Get market details
     */
    function getMarket(uint256 marketId) external view validMarket(marketId) returns (
        string memory question,
        string memory description,
        string memory category,
        uint256 endTime,
        MarketState state,
        uint256[2] memory outcomePools,
        address creator,
        uint256 totalLiquidity
    ) {
        Market storage market = markets[marketId];
        return (
            market.question,
            market.description,
            market.category,
            market.endTime,
            market.state,
            market.outcomePools,
            market.creator,
            market.totalLiquidity
        );
    }
    
    /**
     * @dev Emergency functions
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function updateFeeCollector(address _feeCollector) external onlyOwner {
        feeCollector = _feeCollector;
    }
    
    function cancelMarket(uint256 marketId) external onlyOwner validMarket(marketId) {
        markets[marketId].state = MarketState.Cancelled;
    }
}
