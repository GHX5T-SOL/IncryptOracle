// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title IncryptOracle
 * @dev Decentralized oracle for prediction market data feeds
 * Based on SoraOracle with enhancements for prediction markets
 */
contract IncryptOracle is Ownable, ReentrancyGuard, Pausable {
    struct DataFeed {
        string name;
        string description;
        uint256 value;
        uint256 timestamp;
        uint256 confidence;
        bool isActive;
        address[] validators;
        uint256 validationThreshold;
    }
    
    enum ValidatorType {
        Human,
        AI
    }
    
    struct ValidationSubmission {
        uint256 value;
        uint256 timestamp;
        bool submitted;
        string dataSource;
        ValidatorType validatorType;
        string aiMetadata; // JSON string with AI confidence, model used, sources discovered
    }
    
    struct Validator {
        address validatorAddress;
        uint256 stake;
        uint256 reputation;
        bool isActive;
        uint256 validationsCount;
        uint256 successfulValidations;
        ValidatorType validatorType;
    }
    
    mapping(bytes32 => DataFeed) public dataFeeds;
    mapping(bytes32 => mapping(address => ValidationSubmission)) public validations;
    mapping(address => Validator) public validators;
    mapping(address => uint256) public validatorSlashCount; // Track number of slashes
    mapping(address => uint256) public validatorLastSlashTime; // Cooldown period
    mapping(bytes32 => uint256) public optimisticResolutionTime; // Timestamp of optimistic resolution
    mapping(bytes32 => address) public disputeRaisedBy; // Who raised the dispute
    mapping(bytes32 => uint256) public disputeProposedValue; // Proposed value in dispute
    
    bytes32[] public activeFeedIds;
    address[] public activeValidators;
    
    uint256 public constant MIN_VALIDATORS = 3;
    uint256 public constant MAX_VALIDATORS = 21;
    uint256 public constant MIN_STAKE = 1000 * 10**18; // 1000 IO tokens
    uint256 public constant VALIDATION_WINDOW = 1 hours;
    uint256 public constant MAX_CONFIDENCE = 10000; // 100.00%
    uint256 public constant SLASH_THRESHOLD = 5000; // Accuracy threshold for slashing (< 50%)
    uint256 public constant SLASH_PERCENTAGE = 10; // 10% of stake per slash
    uint256 public constant MAX_SLASHES = 3; // Max slashes before removal
    uint256 public constant DISPUTE_WINDOW = 4 hours; // 4 hour dispute window (vs UMA's 24-48h)
    uint256 public constant OPTIMISTIC_RESOLUTION_THRESHOLD = 50; // 50% of validators for optimistic resolution
    
    event DataFeedCreated(bytes32 indexed feedId, string name, string description);
    event DataFeedUpdated(bytes32 indexed feedId, uint256 value, uint256 confidence);
    event ValidatorRegistered(address indexed validator, uint256 stake, ValidatorType validatorType);
    event ValidatorRemoved(address indexed validator);
    event ValidationSubmitted(bytes32 indexed feedId, address indexed validator, uint256 value, ValidatorType validatorType);
    event AIValidationSubmitted(bytes32 indexed feedId, address indexed validator, uint256 value, string aiMetadata);
    event DataFeedResolved(bytes32 indexed feedId, uint256 finalValue, uint256 confidence);
    event ValidatorSlashed(address indexed validator, uint256 slashedAmount, string reason);
    event OptimisticResolution(bytes32 indexed feedId, uint256 value, uint256 timestamp);
    event DisputeRaised(bytes32 indexed feedId, address indexed disputer, uint256 proposedValue);
    event DisputeResolved(bytes32 indexed feedId, bool upheld);
    
    modifier onlyValidator() {
        require(validators[msg.sender].isActive, "Not an active validator");
        _;
    }
    
    modifier validFeedId(bytes32 feedId) {
        require(dataFeeds[feedId].isActive, "Invalid or inactive feed");
        _;
    }
    
    constructor(address initialOwner) {
        _transferOwnership(initialOwner);
    }
    
    /**
     * @dev Create a new data feed
     */
    function createDataFeed(
        string memory name,
        string memory description,
        uint256 validationThreshold
    ) external onlyOwner returns (bytes32) {
        require(validationThreshold >= MIN_VALIDATORS, "Threshold too low");
        require(validationThreshold <= activeValidators.length, "Threshold too high");
        
        bytes32 feedId = keccak256(abi.encodePacked(name, description, block.timestamp));
        
        dataFeeds[feedId] = DataFeed({
            name: name,
            description: description,
            value: 0,
            timestamp: 0,
            confidence: 0,
            isActive: true,
            validators: new address[](0),
            validationThreshold: validationThreshold
        });
        
        activeFeedIds.push(feedId);
        
        emit DataFeedCreated(feedId, name, description);
        return feedId;
    }
    
    /**
     * @dev Register as a validator (human validator)
     */
    function registerValidator(uint256 stakeAmount) external nonReentrant whenNotPaused {
        _registerValidator(stakeAmount, ValidatorType.Human);
    }
    
    /**
     * @dev Register as an AI validator (owner only, for security)
     */
    function registerAIValidator(address validatorAddress, uint256 stakeAmount) external onlyOwner nonReentrant whenNotPaused {
        require(stakeAmount >= MIN_STAKE, "Insufficient stake");
        require(!validators[validatorAddress].isActive, "Already registered");
        require(activeValidators.length < MAX_VALIDATORS, "Max validators reached");
        
        validators[validatorAddress] = Validator({
            validatorAddress: validatorAddress,
            stake: stakeAmount,
            reputation: 1200, // AI validators start with higher reputation
            isActive: true,
            validationsCount: 0,
            successfulValidations: 0,
            validatorType: ValidatorType.AI
        });
        
        activeValidators.push(validatorAddress);
        
        emit ValidatorRegistered(validatorAddress, stakeAmount, ValidatorType.AI);
    }
    
    /**
     * @dev Internal function to register a validator
     */
    function _registerValidator(uint256 stakeAmount, ValidatorType validatorType) internal {
        require(stakeAmount >= MIN_STAKE, "Insufficient stake");
        require(!validators[msg.sender].isActive, "Already registered");
        require(activeValidators.length < MAX_VALIDATORS, "Max validators reached");
        
        // Transfer stake (assuming IO token integration)
        // IERC20(ioToken).transferFrom(msg.sender, address(this), stakeAmount);
        
        validators[msg.sender] = Validator({
            validatorAddress: msg.sender,
            stake: stakeAmount,
            reputation: validatorType == ValidatorType.AI ? 1200 : 1000, // AI starts higher
            isActive: true,
            validationsCount: 0,
            successfulValidations: 0,
            validatorType: validatorType
        });
        
        activeValidators.push(msg.sender);
        
        emit ValidatorRegistered(msg.sender, stakeAmount, validatorType);
    }
    
    /**
     * @dev Submit validation for a data feed (human validator)
     */
    function submitValidation(
        bytes32 feedId,
        uint256 value,
        string memory dataSource
    ) external onlyValidator validFeedId(feedId) nonReentrant whenNotPaused {
        _submitValidation(feedId, value, dataSource, ValidatorType.Human, "");
    }
    
    /**
     * @dev Submit validation for a data feed (AI validator with metadata)
     */
    function submitAIValidation(
        bytes32 feedId,
        uint256 value,
        string memory dataSource,
        string memory aiMetadata
    ) external onlyValidator validFeedId(feedId) nonReentrant whenNotPaused {
        require(validators[msg.sender].validatorType == ValidatorType.AI, "Only AI validators can use this function");
        _submitValidation(feedId, value, dataSource, ValidatorType.AI, aiMetadata);
        emit AIValidationSubmitted(feedId, msg.sender, value, aiMetadata);
    }
    
    /**
     * @dev Internal function to submit validation
     */
    function _submitValidation(
        bytes32 feedId,
        uint256 value,
        string memory dataSource,
        ValidatorType validatorType,
        string memory aiMetadata
    ) internal {
        require(!validations[feedId][msg.sender].submitted, "Already submitted");
        // Allow validation if feed timestamp is 0 (new feed) or within validation window
        DataFeed storage feed = dataFeeds[feedId];
        require(feed.timestamp == 0 || block.timestamp <= feed.timestamp + VALIDATION_WINDOW, "Validation window closed");
        
        validations[feedId][msg.sender] = ValidationSubmission({
            value: value,
            timestamp: block.timestamp,
            submitted: true,
            dataSource: dataSource,
            validatorType: validatorType,
            aiMetadata: aiMetadata
        });
        
        validators[msg.sender].validationsCount++;
        
        // Gas optimization: Track validators who submitted for this feed
        
        // Check if validator already in feed's validators array
        bool alreadyAdded = false;
        for (uint256 i = 0; i < feed.validators.length; i++) {
            if (feed.validators[i] == msg.sender) {
                alreadyAdded = true;
                break;
            }
        }
        
        if (!alreadyAdded) {
            feed.validators.push(msg.sender);
        }
        
        emit ValidationSubmitted(feedId, msg.sender, value, validatorType);
        
        // Check if we have enough validations to resolve
        _tryResolveDataFeed(feedId);
    }
    
    /**
     * @dev Try to resolve a data feed if enough validations are received
     * Implements optimistic resolution: if >=50% validators agree, resolve immediately
     * Disputes can be raised within 4 hours (vs UMA's 24-48h)
     */
    function _tryResolveDataFeed(bytes32 feedId) internal {
        DataFeed storage feed = dataFeeds[feedId];
        uint256 submittedCount = 0;
        uint256[] memory values = new uint256[](activeValidators.length);
        uint256[] memory reputations = new uint256[](activeValidators.length);
        
        // Count submissions and gather values
        for (uint256 i = 0; i < activeValidators.length; i++) {
            address validator = activeValidators[i];
            if (validations[feedId][validator].submitted) {
                values[submittedCount] = validations[feedId][validator].value;
                reputations[submittedCount] = validators[validator].reputation;
                submittedCount++;
            }
        }
        
        // If we have enough validations, resolve the feed
        if (submittedCount >= feed.validationThreshold) {
            (uint256 consensusValue, uint256 confidence) = _calculateConsensus(values, reputations, submittedCount);
            
            feed.value = consensusValue;
            feed.timestamp = block.timestamp;
            feed.confidence = confidence;
            
            // Update validator reputations
            _updateValidatorReputations(feedId, consensusValue, submittedCount);
            
            emit DataFeedUpdated(feedId, consensusValue, confidence);
            emit DataFeedResolved(feedId, consensusValue, confidence);
        } 
        // Optimistic resolution: if >=50% of active validators agree, resolve optimistically
        else if (submittedCount >= (activeValidators.length * OPTIMISTIC_RESOLUTION_THRESHOLD / 100)) {
            (uint256 consensusValue, uint256 confidence) = _calculateConsensus(values, reputations, submittedCount);
            
            // Set optimistic resolution
            feed.value = consensusValue;
            feed.timestamp = block.timestamp;
            feed.confidence = confidence;
            optimisticResolutionTime[feedId] = block.timestamp;
            
            // Update validator reputations
            _updateValidatorReputations(feedId, consensusValue, submittedCount);
            
            emit DataFeedUpdated(feedId, consensusValue, confidence);
            emit OptimisticResolution(feedId, consensusValue, block.timestamp);
            emit DataFeedResolved(feedId, consensusValue, confidence);
        }
    }
    
    /**
     * @dev Raise a dispute against an optimistic resolution
     * Can only be raised within DISPUTE_WINDOW (4 hours) of resolution
     */
    function raiseDispute(bytes32 feedId, uint256 proposedValue) external onlyValidator validFeedId(feedId) {
        DataFeed storage feed = dataFeeds[feedId];
        require(optimisticResolutionTime[feedId] > 0, "Not an optimistic resolution");
        require(block.timestamp <= optimisticResolutionTime[feedId] + DISPUTE_WINDOW, "Dispute window closed");
        require(disputeRaisedBy[feedId] == address(0), "Dispute already raised");
        
        disputeRaisedBy[feedId] = msg.sender;
        disputeProposedValue[feedId] = proposedValue;
        
        emit DisputeRaised(feedId, msg.sender, proposedValue);
        
        // Recalculate consensus with all validators including disputed value
        _recalculateWithDispute(feedId, proposedValue);
    }
    
    /**
     * @dev Recalculate consensus including disputed value
     */
    function _recalculateWithDispute(bytes32 feedId, uint256 disputedValue) internal {
        DataFeed storage feed = dataFeeds[feedId];
        uint256 submittedCount = 0;
        uint256[] memory values = new uint256[](activeValidators.length + 1);
        uint256[] memory reputations = new uint256[](activeValidators.length + 1);
        
        // Collect all validations
        for (uint256 i = 0; i < activeValidators.length; i++) {
            if (validations[feedId][activeValidators[i]].submitted) {
                values[submittedCount] = validations[feedId][activeValidators[i]].value;
                reputations[submittedCount] = validators[activeValidators[i]].reputation;
                submittedCount++;
            }
        }
        
        // Add disputed value with disputer's reputation
        if (disputeRaisedBy[feedId] != address(0)) {
            values[submittedCount] = disputedValue;
            reputations[submittedCount] = validators[disputeRaisedBy[feedId]].reputation;
            submittedCount++;
        }
        
        // Recalculate consensus
        uint256 oldValue = feed.value;
        (uint256 consensusValue, uint256 confidence) = _calculateConsensus(values, reputations, submittedCount);
        
        // Update feed with new consensus
        feed.value = consensusValue;
        feed.timestamp = block.timestamp;
        feed.confidence = confidence;
        
        // Check if dispute was valid (if new consensus differs significantly)
        uint256 diff = consensusValue > oldValue ? consensusValue - oldValue : oldValue - consensusValue;
        uint256 percentDiff = oldValue > 0 ? (diff * 10000) / oldValue : 0;
        bool disputeUpheld = percentDiff > 500; // >5% difference
        
        if (!disputeUpheld && disputeRaisedBy[feedId] != address(0)) {
            // Penalize false dispute (slash small amount)
            Validator storage disputer = validators[disputeRaisedBy[feedId]];
            if (disputer.stake > 0) {
                uint256 penalty = disputer.stake / 100; // 1% penalty
                disputer.stake -= penalty;
            }
        }
        
        emit DisputeResolved(feedId, disputeUpheld);
        emit DataFeedUpdated(feedId, consensusValue, confidence);
    }
    
    /**
     * @dev Check if a feed has an active dispute window
     */
    function isDisputeWindowOpen(bytes32 feedId) external view returns (bool) {
        uint256 resolutionTime = optimisticResolutionTime[feedId];
        if (resolutionTime == 0) return false;
        return block.timestamp <= resolutionTime + DISPUTE_WINDOW && disputeRaisedBy[feedId] == address(0);
    }
    
    /**
     * @dev Calculate consensus value using reputation-weighted algorithm
     */
    function _calculateConsensus(
        uint256[] memory values,
        uint256[] memory reputations,
        uint256 count
    ) internal pure returns (uint256 consensusValue, uint256 confidence) {
        if (count == 0) return (0, 0);
        
        uint256 totalWeight = 0;
        uint256 weightedSum = 0;
        
        // Calculate weighted average
        for (uint256 i = 0; i < count; i++) {
            totalWeight += reputations[i];
            weightedSum += values[i] * reputations[i];
        }
        
        // Safety check: prevent division by zero
        require(totalWeight > 0, "Total weight must be greater than 0");
        
        consensusValue = weightedSum / totalWeight;
        
        // Calculate confidence based on variance
        uint256 variance = 0;
        for (uint256 i = 0; i < count; i++) {
            uint256 diff = values[i] > consensusValue ? values[i] - consensusValue : consensusValue - values[i];
            variance += (diff * diff * reputations[i]) / totalWeight;
        }
        
        // Convert variance to confidence (inverse relationship)
        // Safety check: prevent division by zero if consensusValue is 0
        if (consensusValue == 0) {
            // If consensus is 0, check if all values are 0 or there's high variance
            bool allZero = true;
            for (uint256 i = 0; i < count; i++) {
                if (values[i] != 0) {
                    allZero = false;
                    break;
                }
            }
            confidence = allZero ? MAX_CONFIDENCE : MAX_CONFIDENCE / 2; // 50% confidence if mixed
        } else {
            confidence = variance == 0 ? MAX_CONFIDENCE : MAX_CONFIDENCE - (variance * MAX_CONFIDENCE / consensusValue);
            if (confidence > MAX_CONFIDENCE) confidence = MAX_CONFIDENCE;
        }
    }
    
    /**
     * @dev Update validator reputations based on validation accuracy
     * Optimized: Only processes validators who submitted (stored separately)
     */
    function _updateValidatorReputations(bytes32 feedId, uint256 consensusValue, uint256 count) internal {
        // Gas optimization: Store validators who submitted in feed's validators array
        DataFeed storage feed = dataFeeds[feedId];
        
        // Use feed's validators array (only contains validators who submitted for this feed)
        for (uint256 i = 0; i < feed.validators.length; i++) {
            address validator = feed.validators[i];
            if (validations[feedId][validator].submitted) {
                uint256 submittedValue = validations[feedId][validator].value;
                uint256 accuracy = _calculateAccuracy(submittedValue, consensusValue);
                
                // Update reputation (simple model - can be enhanced)
                if (accuracy > 9000) { // >90% accuracy
                    validators[validator].reputation += 10;
                    validators[validator].successfulValidations++;
                } else if (accuracy > 7000) { // >70% accuracy
                    validators[validator].reputation += 5;
                } else if (accuracy < SLASH_THRESHOLD) { // <50% accuracy - poor performance
                    // Reduce reputation
                    validators[validator].reputation = validators[validator].reputation > 5 ? validators[validator].reputation - 5 : 1;
                    
                    // Slash validator if accuracy is too low and cooldown has passed
                    _slashValidatorIfNeeded(validator, accuracy);
                }
            }
        }
    }
    
    /**
     * @dev Slash validator if accuracy is too low
     */
    function _slashValidatorIfNeeded(address validator, uint256 accuracy) internal {
        // Check cooldown period (1 hour) to prevent rapid slashing
        if (validatorLastSlashTime[validator] > 0 && 
            block.timestamp - validatorLastSlashTime[validator] < 1 hours) {
            return; // Cooldown active
        }
        
        // Slash if accuracy is below threshold
        if (accuracy < SLASH_THRESHOLD && validators[validator].stake > 0) {
            uint256 slashAmount = (validators[validator].stake * SLASH_PERCENTAGE) / 100;
            
            // Ensure we don't slash below minimum stake
            if (validators[validator].stake - slashAmount < MIN_STAKE) {
                slashAmount = validators[validator].stake > MIN_STAKE 
                    ? validators[validator].stake - MIN_STAKE 
                    : 0;
            }
            
            if (slashAmount > 0) {
                validators[validator].stake -= slashAmount;
                validatorSlashCount[validator]++;
                validatorLastSlashTime[validator] = block.timestamp;
                
                emit ValidatorSlashed(validator, slashAmount, "Low validation accuracy");
                
                // Remove validator if slashed too many times
                if (validatorSlashCount[validator] >= MAX_SLASHES) {
                    validators[validator].isActive = false;
                    emit ValidatorRemoved(validator);
                }
            }
        }
    }
    
    /**
     * @dev Calculate validation accuracy
     */
    function _calculateAccuracy(uint256 submitted, uint256 consensus) internal pure returns (uint256) {
        if (consensus == 0) return submitted == 0 ? MAX_CONFIDENCE : 0;
        
        uint256 diff = submitted > consensus ? submitted - consensus : consensus - submitted;
        uint256 percentDiff = (diff * MAX_CONFIDENCE) / consensus;
        
        return percentDiff > MAX_CONFIDENCE ? 0 : MAX_CONFIDENCE - percentDiff;
    }
    
    /**
     * @dev Get data feed information
     */
    function getDataFeed(bytes32 feedId) external view returns (
        string memory name,
        string memory description,
        uint256 value,
        uint256 timestamp,
        uint256 confidence,
        bool isActive
    ) {
        DataFeed memory feed = dataFeeds[feedId];
        return (feed.name, feed.description, feed.value, feed.timestamp, feed.confidence, feed.isActive);
    }
    
    /**
     * @dev Get all active feed IDs
     */
    function getActiveFeedIds() external view returns (bytes32[] memory) {
        return activeFeedIds;
    }
    
    /**
     * @dev Get validator information
     */
    function getValidator(address validatorAddress) external view returns (
        uint256 stake,
        uint256 reputation,
        bool isActive,
        uint256 validationsCount,
        uint256 successfulValidations,
        ValidatorType validatorType
    ) {
        Validator memory validator = validators[validatorAddress];
        return (validator.stake, validator.reputation, validator.isActive, validator.validationsCount, validator.successfulValidations, validator.validatorType);
    }
    
    /**
     * @dev Get validation submission details including AI metadata
     */
    function getValidationSubmission(bytes32 feedId, address validator) external view returns (
        uint256 value,
        uint256 timestamp,
        bool submitted,
        string memory dataSource,
        ValidatorType validatorType,
        string memory aiMetadata
    ) {
        ValidationSubmission memory submission = validations[feedId][validator];
        return (
            submission.value,
            submission.timestamp,
            submission.submitted,
            submission.dataSource,
            submission.validatorType,
            submission.aiMetadata
        );
    }
    
    /**
     * @dev Get count of AI validators
     */
    function getAIValidatorCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < activeValidators.length; i++) {
            if (validators[activeValidators[i]].validatorType == ValidatorType.AI) {
                count++;
            }
        }
        return count;
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
    
    function deactivateDataFeed(bytes32 feedId) external onlyOwner {
        dataFeeds[feedId].isActive = false;
    }
    
    function removeValidator(address validator) external onlyOwner {
        validators[validator].isActive = false;
        emit ValidatorRemoved(validator);
    }
    
    /**
     * @dev Get slash count for a validator
     */
    function getValidatorSlashCount(address validator) external view returns (uint256) {
        return validatorSlashCount[validator];
    }
    
    /**
     * @dev Manual slash validator (owner only, for emergencies)
     */
    function slashValidator(
        address validator,
        uint256 slashAmount,
        string memory reason
    ) external onlyOwner {
        require(validators[validator].isActive, "Validator not active");
        require(slashAmount > 0, "Slash amount must be greater than 0");
        require(validators[validator].stake >= slashAmount, "Insufficient stake to slash");
        
        // Ensure minimum stake remains
        require(validators[validator].stake - slashAmount >= MIN_STAKE || slashAmount == validators[validator].stake, 
            "Cannot slash below minimum stake");
        
        validators[validator].stake -= slashAmount;
        validatorSlashCount[validator]++;
        validatorLastSlashTime[validator] = block.timestamp;
        
        emit ValidatorSlashed(validator, slashAmount, reason);
        
        // Remove if below minimum stake
        if (validators[validator].stake < MIN_STAKE) {
            validators[validator].isActive = false;
            emit ValidatorRemoved(validator);
        }
    }
}
