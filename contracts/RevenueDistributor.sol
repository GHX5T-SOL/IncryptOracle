// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title RevenueDistributor
 * @dev Handles automated revenue distribution for the Incrypt Oracle ecosystem
 * Features:
 * - 50/50 split between token holders and treasury
 * - Proportional distribution to token holders
 * - Staking rewards mechanism
 * - Automated collection from fee-generating contracts
 */
contract RevenueDistributor is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    struct StakingInfo {
        uint256 stakedAmount;
        uint256 stakingTimestamp;
        uint256 lastClaimTimestamp;
        uint256 totalClaimed;
        uint256 pendingRewards;
    }
    
    struct DistributionRound {
        uint256 totalRevenue;
        uint256 holderShare;
        uint256 treasuryShare;
        uint256 timestamp;
        uint256 totalStaked;
        uint256 rewardPerToken;
        bool distributed;
    }
    
    IERC20 public immutable ioToken;
    address public treasury;
    
    mapping(address => StakingInfo) public stakingInfo;
    mapping(uint256 => DistributionRound) public distributionRounds;
    mapping(address => bool) public authorizedCollectors;
    
    address[] public stakers;
    uint256 public totalStaked;
    uint256 public totalRevenueCollected;
    uint256 public totalDistributed;
    uint256 public currentRound;
    
    uint256 public constant HOLDER_SHARE_PERCENTAGE = 5000; // 50%
    uint256 public constant TREASURY_SHARE_PERCENTAGE = 5000; // 50%
    uint256 public constant MIN_STAKING_PERIOD = 7 days;
    uint256 public constant DISTRIBUTION_INTERVAL = 7 days;
    
    uint256 public lastDistributionTime;
    uint256 public minimumDistributionAmount = 1000 * 10**18; // 1000 IO tokens
    
    event RevenueCollected(address indexed source, uint256 amount);
    event RevenueDistributed(uint256 indexed round, uint256 holderShare, uint256 treasuryShare);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event CollectorAuthorized(address indexed collector, bool authorized);
    
    modifier onlyAuthorizedCollector() {
        require(authorizedCollectors[msg.sender] || msg.sender == owner(), "Not authorized collector");
        _;
    }
    
    constructor(
        address _ioToken,
        address _treasury,
        address initialOwner
    ) {
        ioToken = IERC20(_ioToken);
        treasury = _treasury;
        lastDistributionTime = block.timestamp;
        _transferOwnership(initialOwner);
    }
    
    /**
     * @dev Stake IO tokens to earn revenue sharing rewards
     */
    function stakeTokens(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        
        StakingInfo storage userStaking = stakingInfo[msg.sender];
        
        // Claim pending rewards before updating stake
        if (userStaking.stakedAmount > 0) {
            _claimRewards(msg.sender);
        }
        
        // Transfer tokens from user
        ioToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update staking info
        if (userStaking.stakedAmount == 0) {
            stakers.push(msg.sender);
            userStaking.stakingTimestamp = block.timestamp;
            userStaking.lastClaimTimestamp = block.timestamp;
        }
        
        userStaking.stakedAmount += amount;
        totalStaked += amount;
        
        emit TokensStaked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake IO tokens
     */
    function unstakeTokens(uint256 amount) external nonReentrant {
        StakingInfo storage userStaking = stakingInfo[msg.sender];
        require(userStaking.stakedAmount >= amount, "Insufficient staked tokens");
        require(
            block.timestamp >= userStaking.stakingTimestamp + MIN_STAKING_PERIOD,
            "Minimum staking period not met"
        );
        
        // Claim pending rewards before unstaking
        _claimRewards(msg.sender);
        
        // Update staking info
        userStaking.stakedAmount -= amount;
        totalStaked -= amount;
        
        // Remove from stakers array if no tokens left
        if (userStaking.stakedAmount == 0) {
            _removeFromStakers(msg.sender);
        }
        
        // Transfer tokens back to user
        ioToken.safeTransfer(msg.sender, amount);
        
        emit TokensUnstaked(msg.sender, amount);
    }
    
    /**
     * @dev Claim accumulated rewards
     */
    function claimRewards() external nonReentrant returns (uint256 rewards) {
        rewards = _claimRewards(msg.sender);
        require(rewards > 0, "No rewards to claim");
    }
    
    /**
     * @dev Internal function to claim rewards
     */
    function _claimRewards(address user) internal returns (uint256 rewards) {
        StakingInfo storage userStaking = stakingInfo[user];
        if (userStaking.stakedAmount == 0) return 0;
        
        // Calculate rewards from all completed distribution rounds since last claim
        for (uint256 i = 0; i <= currentRound; i++) {
            DistributionRound storage round = distributionRounds[i];
            if (round.distributed && round.timestamp > userStaking.lastClaimTimestamp) {
                uint256 userReward = (userStaking.stakedAmount * round.rewardPerToken) / 1e18;
                rewards += userReward;
            }
        }
        
        if (rewards > 0) {
            userStaking.totalClaimed += rewards;
            userStaking.lastClaimTimestamp = block.timestamp;
            
            // Transfer rewards to user
            ioToken.safeTransfer(user, rewards);
            
            emit RewardsClaimed(user, rewards);
        }
    }
    
    /**
     * @dev Collect revenue from fee-generating contracts
     */
    function collectRevenue(uint256 amount) external onlyAuthorizedCollector nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer revenue to this contract
        ioToken.safeTransferFrom(msg.sender, address(this), amount);
        
        totalRevenueCollected += amount;
        
        emit RevenueCollected(msg.sender, amount);
        
        // Trigger distribution if conditions are met
        if (_shouldDistribute()) {
            _distributeRevenue();
        }
    }
    
    /**
     * @dev Manual revenue distribution
     */
    function distributeRevenue() external nonReentrant {
        require(_shouldDistribute(), "Distribution conditions not met");
        _distributeRevenue();
    }
    
    /**
     * @dev Internal function to distribute revenue
     */
    function _distributeRevenue() internal {
        uint256 pendingRevenue = _getPendingRevenue();
        require(pendingRevenue >= minimumDistributionAmount, "Insufficient pending revenue");
        
        currentRound++;
        
        uint256 holderShare = (pendingRevenue * HOLDER_SHARE_PERCENTAGE) / 10000;
        uint256 treasuryShare = pendingRevenue - holderShare;
        
        // Calculate reward per token for stakers
        uint256 rewardPerToken = totalStaked > 0 ? (holderShare * 1e18) / totalStaked : 0;
        
        // Store distribution round info
        distributionRounds[currentRound] = DistributionRound({
            totalRevenue: pendingRevenue,
            holderShare: holderShare,
            treasuryShare: treasuryShare,
            timestamp: block.timestamp,
            totalStaked: totalStaked,
            rewardPerToken: rewardPerToken,
            distributed: true
        });
        
        // Transfer treasury share
        if (treasuryShare > 0) {
            ioToken.safeTransfer(treasury, treasuryShare);
        }
        
        totalDistributed += pendingRevenue;
        lastDistributionTime = block.timestamp;
        
        emit RevenueDistributed(currentRound, holderShare, treasuryShare);
    }
    
    /**
     * @dev Check if distribution should occur
     */
    function _shouldDistribute() internal view returns (bool) {
        return (
            block.timestamp >= lastDistributionTime + DISTRIBUTION_INTERVAL &&
            _getPendingRevenue() >= minimumDistributionAmount
        );
    }
    
    /**
     * @dev Get pending revenue for distribution
     */
    function _getPendingRevenue() internal view returns (uint256) {
        return totalRevenueCollected - totalDistributed;
    }
    
    /**
     * @dev Remove address from stakers array
     */
    function _removeFromStakers(address user) internal {
        for (uint256 i = 0; i < stakers.length; i++) {
            if (stakers[i] == user) {
                stakers[i] = stakers[stakers.length - 1];
                stakers.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Get user's pending rewards
     */
    function getPendingRewards(address user) external view returns (uint256 rewards) {
        StakingInfo storage userStaking = stakingInfo[user];
        if (userStaking.stakedAmount == 0) return 0;
        
        for (uint256 i = 0; i <= currentRound; i++) {
            DistributionRound storage round = distributionRounds[i];
            if (round.distributed && round.timestamp > userStaking.lastClaimTimestamp) {
                uint256 userReward = (userStaking.stakedAmount * round.rewardPerToken) / 1e18;
                rewards += userReward;
            }
        }
    }
    
    /**
     * @dev Get current staking APY (annualized percentage yield)
     */
    function getCurrentAPY() external view returns (uint256) {
        if (totalStaked == 0) return 0;
        
        // Calculate based on recent revenue
        uint256 weeklyRevenue = _getPendingRevenue();
        uint256 annualizedRevenue = weeklyRevenue * 52;
        uint256 holderShare = (annualizedRevenue * HOLDER_SHARE_PERCENTAGE) / 10000;
        
        return (holderShare * 10000) / totalStaked; // Return in basis points
    }
    
    /**
     * @dev Get user staking info
     */
    function getUserStakingInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 stakingTimestamp,
        uint256 totalClaimed,
        uint256 pendingRewards
    ) {
        StakingInfo storage userStaking = stakingInfo[user];
        return (
            userStaking.stakedAmount,
            userStaking.stakingTimestamp,
            userStaking.totalClaimed,
            this.getPendingRewards(user)
        );
    }
    
    /**
     * @dev Get all stakers
     */
    function getAllStakers() external view returns (address[] memory) {
        return stakers;
    }
    
    /**
     * @dev Admin functions
     */
    function updateTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury address");
        address oldTreasury = treasury;
        treasury = _treasury;
        emit TreasuryUpdated(oldTreasury, _treasury);
    }
    
    function authorizeCollector(address collector, bool authorized) external onlyOwner {
        authorizedCollectors[collector] = authorized;
        emit CollectorAuthorized(collector, authorized);
    }
    
    function updateMinimumDistributionAmount(uint256 _amount) external onlyOwner {
        minimumDistributionAmount = _amount;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency function to recover stuck tokens
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(token != address(ioToken) || amount <= ioToken.balanceOf(address(this)) - totalStaked, "Cannot withdraw staked tokens");
        IERC20(token).safeTransfer(owner(), amount);
    }
}
