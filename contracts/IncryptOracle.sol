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
    
    struct ValidationSubmission {
        uint256 value;
        uint256 timestamp;
        bool submitted;
        string dataSource;
    }
    
    struct Validator {
        address validatorAddress;
        uint256 stake;
        uint256 reputation;
        bool isActive;
        uint256 validationsCount;
        uint256 successfulValidations;
    }
    
    mapping(bytes32 => DataFeed) public dataFeeds;
    mapping(bytes32 => mapping(address => ValidationSubmission)) public validations;
    mapping(address => Validator) public validators;
    
    bytes32[] public activeFeedIds;
    address[] public activeValidators;
    
    uint256 public constant MIN_VALIDATORS = 3;
    uint256 public constant MAX_VALIDATORS = 21;
    uint256 public constant MIN_STAKE = 1000 * 10**18; // 1000 IO tokens
    uint256 public constant VALIDATION_WINDOW = 1 hours;
    uint256 public constant MAX_CONFIDENCE = 10000; // 100.00%
    
    event DataFeedCreated(bytes32 indexed feedId, string name, string description);
    event DataFeedUpdated(bytes32 indexed feedId, uint256 value, uint256 confidence);
    event ValidatorRegistered(address indexed validator, uint256 stake);
    event ValidatorRemoved(address indexed validator);
    event ValidationSubmitted(bytes32 indexed feedId, address indexed validator, uint256 value);
    event DataFeedResolved(bytes32 indexed feedId, uint256 finalValue, uint256 confidence);
    
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
     * @dev Register as a validator
     */
    function registerValidator(uint256 stakeAmount) external nonReentrant whenNotPaused {
        require(stakeAmount >= MIN_STAKE, "Insufficient stake");
        require(!validators[msg.sender].isActive, "Already registered");
        require(activeValidators.length < MAX_VALIDATORS, "Max validators reached");
        
        // Transfer stake (assuming IO token integration)
        // IERC20(ioToken).transferFrom(msg.sender, address(this), stakeAmount);
        
        validators[msg.sender] = Validator({
            validatorAddress: msg.sender,
            stake: stakeAmount,
            reputation: 1000, // Starting reputation
            isActive: true,
            validationsCount: 0,
            successfulValidations: 0
        });
        
        activeValidators.push(msg.sender);
        
        emit ValidatorRegistered(msg.sender, stakeAmount);
    }
    
    /**
     * @dev Submit validation for a data feed
     */
    function submitValidation(
        bytes32 feedId,
        uint256 value,
        string memory dataSource
    ) external onlyValidator validFeedId(feedId) nonReentrant whenNotPaused {
        require(!validations[feedId][msg.sender].submitted, "Already submitted");
        require(block.timestamp <= dataFeeds[feedId].timestamp + VALIDATION_WINDOW, "Validation window closed");
        
        validations[feedId][msg.sender] = ValidationSubmission({
            value: value,
            timestamp: block.timestamp,
            submitted: true,
            dataSource: dataSource
        });
        
        validators[msg.sender].validationsCount++;
        
        emit ValidationSubmitted(feedId, msg.sender, value);
        
        // Check if we have enough validations to resolve
        _tryResolveDataFeed(feedId);
    }
    
    /**
     * @dev Try to resolve a data feed if enough validations are received
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
        
        consensusValue = weightedSum / totalWeight;
        
        // Calculate confidence based on variance
        uint256 variance = 0;
        for (uint256 i = 0; i < count; i++) {
            uint256 diff = values[i] > consensusValue ? values[i] - consensusValue : consensusValue - values[i];
            variance += (diff * diff * reputations[i]) / totalWeight;
        }
        
        // Convert variance to confidence (inverse relationship)
        confidence = variance == 0 ? MAX_CONFIDENCE : MAX_CONFIDENCE - (variance * MAX_CONFIDENCE / consensusValue);
        if (confidence > MAX_CONFIDENCE) confidence = MAX_CONFIDENCE;
    }
    
    /**
     * @dev Update validator reputations based on validation accuracy
     */
    function _updateValidatorReputations(bytes32 feedId, uint256 consensusValue, uint256 count) internal {
        for (uint256 i = 0; i < activeValidators.length; i++) {
            address validator = activeValidators[i];
            if (validations[feedId][validator].submitted) {
                uint256 submittedValue = validations[feedId][validator].value;
                uint256 accuracy = _calculateAccuracy(submittedValue, consensusValue);
                
                // Update reputation (simple model - can be enhanced)
                if (accuracy > 9000) { // >90% accuracy
                    validators[validator].reputation += 10;
                    validators[validator].successfulValidations++;
                } else if (accuracy > 7000) { // >70% accuracy
                    validators[validator].reputation += 5;
                } else if (accuracy < 5000) { // <50% accuracy
                    validators[validator].reputation = validators[validator].reputation > 5 ? validators[validator].reputation - 5 : 1;
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
        uint256 successfulValidations
    ) {
        Validator memory validator = validators[validatorAddress];
        return (validator.stake, validator.reputation, validator.isActive, validator.validationsCount, validator.successfulValidations);
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
}
