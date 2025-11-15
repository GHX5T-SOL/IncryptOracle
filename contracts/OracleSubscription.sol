// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IOToken.sol";

/**
 * @title OracleSubscription
 * @dev Subscription service for oracle API access
 * Generates revenue through subscription tiers with rate limiting
 */
contract OracleSubscription is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    enum SubscriptionTier {
        Free,
        Basic,
        Premium
    }
    
    struct Subscription {
        SubscriptionTier tier;
        uint256 startTime;
        uint256 endTime;
        uint256 monthlyRate;
        uint256 requestsUsed;
        uint256 requestsLimit;
        bool isActive;
    }
    
    struct TierConfig {
        uint256 monthlyRate; // Monthly subscription cost in IO tokens
        uint256 requestsPerMonth; // Rate limit
        uint256 requestCost; // Per-request cost if exceeded
    }
    
    mapping(address => Subscription) public subscriptions;
    mapping(SubscriptionTier => TierConfig) public tierConfigs;
    
    IERC20 public immutable ioToken;
    address public feeCollector;
    
    // Free tier: 1000 requests/month, no cost
    // Basic tier: 10000 requests/month, 100 IO/month
    // Premium tier: unlimited requests, 1000 IO/month
    
    event SubscriptionCreated(address indexed subscriber, SubscriptionTier tier, uint256 duration);
    event SubscriptionRenewed(address indexed subscriber, uint256 newEndTime);
    event SubscriptionCancelled(address indexed subscriber);
    event RequestMade(address indexed subscriber, bytes32 feedId);
    event TierConfigUpdated(SubscriptionTier tier, uint256 monthlyRate, uint256 requestsPerMonth);
    
    modifier validSubscription(address subscriber) {
        require(subscriptions[subscriber].isActive, "No active subscription");
        require(block.timestamp <= subscriptions[subscriber].endTime, "Subscription expired");
        _;
    }
    
    constructor(address _ioToken, address _feeCollector, address initialOwner) {
        ioToken = IERC20(_ioToken);
        feeCollector = _feeCollector;
        _transferOwnership(initialOwner);
        
        // Set default tier configurations
        tierConfigs[SubscriptionTier.Free] = TierConfig({
            monthlyRate: 0,
            requestsPerMonth: 1000,
            requestCost: 0
        });
        
        tierConfigs[SubscriptionTier.Basic] = TierConfig({
            monthlyRate: 100 * 10**18, // 100 IO tokens
            requestsPerMonth: 10000,
            requestCost: 1 * 10**18 // 1 IO per additional request
        });
        
        tierConfigs[SubscriptionTier.Premium] = TierConfig({
            monthlyRate: 1000 * 10**18, // 1000 IO tokens
            requestsPerMonth: type(uint256).max, // Unlimited
            requestCost: 0
        });
    }
    
    /**
     * @dev Subscribe to a tier
     * @param tier Subscription tier
     * @param months Number of months to subscribe
     */
    function subscribe(
        SubscriptionTier tier,
        uint256 months
    ) external nonReentrant returns (bool) {
        require(months > 0 && months <= 12, "Invalid duration");
        require(tier != SubscriptionTier.Free || subscriptions[msg.sender].tier == SubscriptionTier.Free, 
            "Free tier must be created via freeSubscribe");
        
        TierConfig memory config = tierConfigs[tier];
        require(config.monthlyRate > 0, "Invalid tier");
        
        uint256 totalCost = config.monthlyRate * months;
        
        // Collect payment
        if (totalCost > 0) {
            ioToken.safeTransferFrom(msg.sender, feeCollector, totalCost);
        }
        
        // Create or renew subscription
        Subscription storage sub = subscriptions[msg.sender];
        
        uint256 currentTime = block.timestamp;
        if (sub.isActive && currentTime <= sub.endTime) {
            // Renew existing subscription
            sub.endTime += months * 30 days;
            emit SubscriptionRenewed(msg.sender, sub.endTime);
        } else {
            // New subscription
            sub.tier = tier;
            sub.startTime = currentTime;
            sub.endTime = currentTime + (months * 30 days);
            sub.monthlyRate = config.monthlyRate;
            sub.requestsUsed = 0;
            sub.requestsLimit = config.requestsPerMonth;
            sub.isActive = true;
            emit SubscriptionCreated(msg.sender, tier, months);
        }
        
        return true;
    }
    
    /**
     * @dev Create free tier subscription (no cost)
     */
    function freeSubscribe() external {
        require(!subscriptions[msg.sender].isActive || subscriptions[msg.sender].endTime < block.timestamp,
            "Active subscription exists");
        
        TierConfig memory config = tierConfigs[SubscriptionTier.Free];
        
        subscriptions[msg.sender] = Subscription({
            tier: SubscriptionTier.Free,
            startTime: block.timestamp,
            endTime: block.timestamp + 30 days,
            monthlyRate: 0,
            requestsUsed: 0,
            requestsLimit: config.requestsPerMonth,
            isActive: true
        });
        
        emit SubscriptionCreated(msg.sender, SubscriptionTier.Free, 1);
    }
    
    /**
     * @dev Cancel subscription
     */
    function cancelSubscription() external {
        require(subscriptions[msg.sender].isActive, "No active subscription");
        subscriptions[msg.sender].isActive = false;
        emit SubscriptionCancelled(msg.sender);
    }
    
    /**
     * @dev Record API request (called by oracle)
     * @param subscriber Address making the request
     * @param feedId Feed being accessed
     */
    function recordRequest(
        address subscriber,
        bytes32 feedId
    ) external returns (bool) {
        require(msg.sender == owner(), "Only owner can record requests");
        require(subscriptions[subscriber].isActive, "No active subscription");
        require(block.timestamp <= subscriptions[subscriber].endTime, "Subscription expired");
        
        Subscription storage sub = subscriptions[subscriber];
        
        // Reset request counter if new month
        uint256 monthStart = (sub.startTime / (30 days)) * (30 days);
        uint256 currentMonth = (block.timestamp / (30 days)) * (30 days);
        
        if (currentMonth > monthStart) {
            sub.requestsUsed = 0;
            sub.startTime = block.timestamp;
        }
        
        // Check rate limit
        if (sub.requestsUsed >= sub.requestsLimit && sub.tier != SubscriptionTier.Premium) {
            // Charge for additional request
            TierConfig memory config = tierConfigs[sub.tier];
            if (config.requestCost > 0) {
                ioToken.safeTransferFrom(subscriber, feeCollector, config.requestCost);
            } else {
                revert("Rate limit exceeded");
            }
        }
        
        sub.requestsUsed++;
        emit RequestMade(subscriber, feedId);
        
        return true;
    }
    
    /**
     * @dev Check if subscriber can make a request
     */
    function canMakeRequest(address subscriber) external view returns (bool) {
        Subscription memory sub = subscriptions[subscriber];
        
        if (!sub.isActive || block.timestamp > sub.endTime) {
            return false;
        }
        
        // Reset check for new month
        uint256 monthStart = (sub.startTime / (30 days)) * (30 days);
        uint256 currentMonth = (block.timestamp / (30 days)) * (30 days);
        
        if (currentMonth > monthStart) {
            return true; // New month, reset limit
        }
        
        // Check if within limit
        if (sub.tier == SubscriptionTier.Premium) {
            return true; // Unlimited
        }
        
        return sub.requestsUsed < sub.requestsLimit;
    }
    
    /**
     * @dev Get subscription info for a user
     */
    function getSubscription(address subscriber) external view returns (
        SubscriptionTier tier,
        uint256 startTime,
        uint256 endTime,
        uint256 requestsUsed,
        uint256 requestsLimit,
        bool isActive
    ) {
        Subscription memory sub = subscriptions[subscriber];
        return (
            sub.tier,
            sub.startTime,
            sub.endTime,
            sub.requestsUsed,
            sub.requestsLimit,
            sub.isActive && block.timestamp <= sub.endTime
        );
    }
    
    /**
     * @dev Update tier configuration (owner only)
     */
    function updateTierConfig(
        SubscriptionTier tier,
        uint256 monthlyRate,
        uint256 requestsPerMonth,
        uint256 requestCost
    ) external onlyOwner {
        tierConfigs[tier] = TierConfig({
            monthlyRate: monthlyRate,
            requestsPerMonth: requestsPerMonth,
            requestCost: requestCost
        });
        
        emit TierConfigUpdated(tier, monthlyRate, requestsPerMonth);
    }
    
    /**
     * @dev Update fee collector address
     */
    function setFeeCollector(address _feeCollector) external onlyOwner {
        require(_feeCollector != address(0), "Invalid address");
        feeCollector = _feeCollector;
    }
}

