// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../IncryptOracle.sol";

/**
 * @title SportsOracle
 * @dev Specialized oracle template for sports event results
 * Optimized for immediate post-game resolution
 */
contract SportsOracle {
    IncryptOracle public immutable oracle;
    address public immutable owner;
    
    enum EventStatus {
        Scheduled,
        Live,
        Completed,
        Cancelled
    }
    
    struct SportsEvent {
        bytes32 feedId;
        string eventId; // Unique identifier from sports API
        string league; // e.g., "NFL", "NBA", "Premier League"
        string homeTeam;
        string awayTeam;
        uint256 scheduledTime;
        EventStatus status;
        uint256 resolutionTime; // When results are final
    }
    
    mapping(string => SportsEvent) public events;
    string[] public activeEvents;
    
    event SportsEventCreated(string indexed eventId, bytes32 feedId);
    event EventResolved(string indexed eventId, uint256 result);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _oracle, address _owner) {
        oracle = IncryptOracle(_oracle);
        owner = _owner;
    }
    
    /**
     * @dev Create a sports event feed
     * @param eventId Unique event identifier
     * @param league League name
     * @param homeTeam Home team name
     * @param awayTeam Away team name
     * @param scheduledTime Unix timestamp of scheduled start
     * @param validationThreshold Number of validators required
     */
    function createEventFeed(
        string memory eventId,
        string memory league,
        string memory homeTeam,
        string memory awayTeam,
        uint256 scheduledTime,
        uint256 validationThreshold
    ) external onlyOwner returns (bytes32) {
        require(bytes(eventId).length > 0, "Event ID required");
        require(events[eventId].feedId == bytes32(0), "Event already exists");
        require(scheduledTime > block.timestamp, "Scheduled time must be in future");
        
        // Create question for prediction market
        string memory question = string(abi.encodePacked(
            homeTeam,
            " vs ",
            awayTeam,
            " (",
            league,
            ")"
        ));
        
        string memory description = string(abi.encodePacked(
            "Sports Event: ",
            question,
            " - Result resolves immediately after game completion"
        ));
        
        bytes32 feedId = oracle.createDataFeed(
            question,
            description,
            validationThreshold
        );
        
        events[eventId] = SportsEvent({
            feedId: feedId,
            eventId: eventId,
            league: league,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            scheduledTime: scheduledTime,
            status: EventStatus.Scheduled,
            resolutionTime: 0
        });
        
        activeEvents.push(eventId);
        
        emit SportsEventCreated(eventId, feedId);
        return feedId;
    }
    
    /**
     * @dev Update event status
     */
    function updateEventStatus(
        string memory eventId,
        EventStatus status
    ) external onlyOwner {
        require(events[eventId].feedId != bytes32(0), "Event not found");
        
        SportsEvent storage event_ = events[eventId];
        event_.status = status;
        
        if (status == EventStatus.Completed) {
            event_.resolutionTime = block.timestamp;
        }
    }
    
    /**
     * @dev Get event result
     * Returns: homeScore, awayScore, status
     */
    function getEventResult(string memory eventId) external view returns (
        uint256 homeScore,
        uint256 awayScore,
        EventStatus status
    ) {
        require(events[eventId].feedId != bytes32(0), "Event not found");
        
        bytes32 feedId = events[eventId].feedId;
        (, , uint256 value, , , bool isActive) = oracle.getDataFeed(feedId);
        
        require(isActive, "Feed not active");
        
        // Decode value: first 16 bits = home score, next 16 bits = away score
        homeScore = (value >> 16) & 0xFFFF;
        awayScore = value & 0xFFFF;
        status = events[eventId].status;
        
        return (homeScore, awayScore, status);
    }
    
    /**
     * @dev Check if event can be resolved (game completed)
     */
    function canResolve(string memory eventId) external view returns (bool) {
        SportsEvent memory event_ = events[eventId];
        return event_.status == EventStatus.Completed && event_.resolutionTime > 0;
    }
}

