// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../IncryptOracle.sol";

/**
 * @title CryptoPriceOracle
 * @dev Specialized oracle template for cryptocurrency price feeds
 * Optimized for 1-minute resolution updates from multiple exchanges
 */
contract CryptoPriceOracle {
    IncryptOracle public immutable oracle;
    address public immutable owner;
    
    struct CryptoFeed {
        bytes32 feedId;
        string symbol; // e.g., "BTC/USD"
        uint256 lastUpdateTime;
        uint256 updateInterval; // Minimum time between updates (e.g., 60 seconds)
        address[] validators;
    }
    
    mapping(string => CryptoFeed) public feeds;
    string[] public activeSymbols;
    
    event CryptoFeedCreated(string indexed symbol, bytes32 feedId);
    event CryptoFeedUpdated(string indexed symbol, uint256 price);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _oracle, address _owner) {
        oracle = IncryptOracle(_oracle);
        owner = _owner;
    }
    
    /**
     * @dev Create a crypto price feed with 1-minute update interval
     * @param symbol Trading pair symbol (e.g., "BTC/USD")
     * @param description Description of the feed
     * @param validationThreshold Number of validators required
     */
    function createPriceFeed(
        string memory symbol,
        string memory description,
        uint256 validationThreshold
    ) external onlyOwner returns (bytes32) {
        require(bytes(symbol).length > 0, "Symbol required");
        require(feeds[symbol].feedId == bytes32(0), "Feed already exists");
        
        // Create feed in oracle with crypto-specific description
        string memory fullDescription = string(abi.encodePacked(
            "Crypto Price: ",
            description,
            " - Updates every 60 seconds"
        ));
        
        bytes32 feedId = oracle.createDataFeed(
            symbol,
            fullDescription,
            validationThreshold
        );
        
        feeds[symbol] = CryptoFeed({
            feedId: feedId,
            symbol: symbol,
            lastUpdateTime: 0,
            updateInterval: 60, // 60 seconds = 1 minute
            validators: new address[](0)
        });
        
        activeSymbols.push(symbol);
        
        emit CryptoFeedCreated(symbol, feedId);
        return feedId;
    }
    
    /**
     * @dev Get current price for a symbol
     */
    function getPrice(string memory symbol) external view returns (
        uint256 price,
        uint256 timestamp,
        uint256 confidence
    ) {
        require(feeds[symbol].feedId != bytes32(0), "Feed not found");
        
        bytes32 feedId = feeds[symbol].feedId;
        (, , uint256 value, uint256 feedTimestamp, uint256 feedConfidence, bool isActive) = 
            oracle.getDataFeed(feedId);
        
        require(isActive, "Feed not active");
        
        return (value, feedTimestamp, feedConfidence);
    }
    
    /**
     * @dev Check if feed can be updated (rate limiting)
     */
    function canUpdate(string memory symbol) external view returns (bool) {
        CryptoFeed memory feed = feeds[symbol];
        if (feed.lastUpdateTime == 0) return true;
        
        return block.timestamp >= feed.lastUpdateTime + feed.updateInterval;
    }
    
    /**
     * @dev Get all active crypto feeds
     */
    function getActiveFeeds() external view returns (string[] memory) {
        return activeSymbols;
    }
}

