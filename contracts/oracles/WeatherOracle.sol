// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../IncryptOracle.sol";

/**
 * @title WeatherOracle
 * @dev Specialized oracle template for weather events
 * Tracks temperature, precipitation, extreme weather events
 */
contract WeatherOracle {
    IncryptOracle public immutable oracle;
    address public immutable owner;
    
    enum WeatherMetric {
        Temperature,      // Celsius * 100 (e.g., 2500 = 25.00°C)
        Precipitation,    // mm * 100 (e.g., 500 = 5.00mm)
        WindSpeed,        // km/h * 100 (e.g., 1500 = 15.00 km/h)
        Humidity,         // Percentage * 100 (e.g., 6500 = 65.00%)
        ExtremeEvent      // Binary: 0 = none, 1 = extreme event occurred
    }
    
    struct WeatherFeed {
        bytes32 feedId;
        string location; // e.g., "New York, NY"
        WeatherMetric metric;
        uint256 measurementTime;
        uint256 updateInterval; // Minimum time between updates
    }
    
    mapping(string => mapping(WeatherMetric => WeatherFeed)) public feeds;
    string[] public activeLocations;
    
    event WeatherFeedCreated(string indexed location, WeatherMetric metric, bytes32 feedId);
    event WeatherUpdated(string indexed location, WeatherMetric metric, uint256 value);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _oracle, address _owner) {
        oracle = IncryptOracle(_oracle);
        owner = _owner;
    }
    
    /**
     * @dev Create a weather feed
     * @param location Location name
     * @param metric Weather metric to track
     * @param updateInterval Minimum time between updates (in seconds)
     * @param validationThreshold Number of validators required
     */
    function createWeatherFeed(
        string memory location,
        WeatherMetric metric,
        uint256 updateInterval,
        uint256 validationThreshold
    ) external onlyOwner returns (bytes32) {
        require(bytes(location).length > 0, "Location required");
        require(feeds[location][metric].feedId == bytes32(0), "Feed already exists");
        
        string memory metricName = _getMetricName(metric);
        string memory question = string(abi.encodePacked(
            metricName,
            " in ",
            location
        ));
        
        string memory description = string(abi.encodePacked(
            "Weather: ",
            metricName,
            " in ",
            location,
            " - Updates every ",
            _uint2str(updateInterval / 60),
            " minutes"
        ));
        
        bytes32 feedId = oracle.createDataFeed(
            question,
            description,
            validationThreshold
        );
        
        feeds[location][metric] = WeatherFeed({
            feedId: feedId,
            location: location,
            metric: metric,
            measurementTime: 0,
            updateInterval: updateInterval
        });
        
        // Track unique locations
        bool locationExists = false;
        for (uint256 i = 0; i < activeLocations.length; i++) {
            if (keccak256(bytes(activeLocations[i])) == keccak256(bytes(location))) {
                locationExists = true;
                break;
            }
        }
        if (!locationExists) {
            activeLocations.push(location);
        }
        
        emit WeatherFeedCreated(location, metric, feedId);
        return feedId;
    }
    
    /**
     * @dev Get current weather value
     */
    function getWeatherValue(
        string memory location,
        WeatherMetric metric
    ) external view returns (
        uint256 value,
        uint256 timestamp
    ) {
        require(feeds[location][metric].feedId != bytes32(0), "Feed not found");
        
        bytes32 feedId = feeds[location][metric].feedId;
        (, , uint256 feedValue, uint256 feedTimestamp, , bool isActive) = 
            oracle.getDataFeed(feedId);
        
        require(isActive, "Feed not active");
        
        return (feedValue, feedTimestamp);
    }
    
    /**
     * @dev Check if weather feed can be updated
     */
    function canUpdate(
        string memory location,
        WeatherMetric metric
    ) external view returns (bool) {
        WeatherFeed memory feed = feeds[location][metric];
        if (feed.measurementTime == 0) return true;
        
        return block.timestamp >= feed.measurementTime + feed.updateInterval;
    }
    
    /**
     * @dev Get metric name as string
     */
    function _getMetricName(WeatherMetric metric) internal pure returns (string memory) {
        if (metric == WeatherMetric.Temperature) return "Temperature";
        if (metric == WeatherMetric.Precipitation) return "Precipitation";
        if (metric == WeatherMetric.WindSpeed) return "Wind Speed";
        if (metric == WeatherMetric.Humidity) return "Humidity";
        if (metric == WeatherMetric.ExtremeEvent) return "Extreme Event";
        return "Unknown";
    }
    
    /**
     * @dev Convert uint to string (helper function)
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}

