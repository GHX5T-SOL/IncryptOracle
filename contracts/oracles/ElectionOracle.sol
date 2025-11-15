// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../IncryptOracle.sol";

/**
 * @title ElectionOracle
 * @dev Specialized oracle template for election results
 * Optimized for official results from election authorities
 */
contract ElectionOracle {
    IncryptOracle public immutable oracle;
    address public immutable owner;
    
    struct Election {
        bytes32 feedId;
        string electionId; // Unique identifier
        string jurisdiction; // e.g., "US Presidential 2024"
        string[] candidates;
        uint256 electionDate;
        uint256 officialResultsTime; // When official results are available
        bool officialResultsReceived;
    }
    
    mapping(string => Election) public elections;
    string[] public activeElections;
    
    event ElectionCreated(string indexed electionId, bytes32 feedId);
    event OfficialResultsReceived(string indexed electionId, uint256 winnerIndex);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(address _oracle, address _owner) {
        oracle = IncryptOracle(_oracle);
        owner = _owner;
    }
    
    /**
     * @dev Create an election feed
     * @param electionId Unique election identifier
     * @param jurisdiction Jurisdiction name
     * @param candidates Array of candidate names
     * @param electionDate Unix timestamp of election
     * @param validationThreshold Number of validators required (should be high for elections)
     */
    function createElectionFeed(
        string memory electionId,
        string memory jurisdiction,
        string[] memory candidates,
        uint256 electionDate,
        uint256 validationThreshold
    ) external onlyOwner returns (bytes32) {
        require(bytes(electionId).length > 0, "Election ID required");
        require(elections[electionId].feedId == bytes32(0), "Election already exists");
        require(candidates.length >= 2, "Need at least 2 candidates");
        
        // Create question
        string memory question = string(abi.encodePacked(
            "Who will win ",
            jurisdiction,
            "?"
        ));
        
        string memory description = string(abi.encodePacked(
            "Election: ",
            jurisdiction,
            " - Resolves with official election authority results"
        ));
        
        bytes32 feedId = oracle.createDataFeed(
            question,
            description,
            validationThreshold
        );
        
        elections[electionId] = Election({
            feedId: feedId,
            electionId: electionId,
            jurisdiction: jurisdiction,
            candidates: candidates,
            electionDate: electionDate,
            officialResultsTime: 0,
            officialResultsReceived: false
        });
        
        activeElections.push(electionId);
        
        emit ElectionCreated(electionId, feedId);
        return feedId;
    }
    
    /**
     * @dev Submit official election results
     * @param electionId Election identifier
     * @param winnerIndex Index of winning candidate (0-based)
     */
    function submitOfficialResults(
        string memory electionId,
        uint256 winnerIndex
    ) external onlyOwner {
        require(elections[electionId].feedId != bytes32(0), "Election not found");
        require(!elections[electionId].officialResultsReceived, "Results already submitted");
        require(winnerIndex < elections[electionId].candidates.length, "Invalid winner index");
        
        Election storage election = elections[electionId];
        election.officialResultsTime = block.timestamp;
        election.officialResultsReceived = true;
        
        emit OfficialResultsReceived(electionId, winnerIndex);
    }
    
    /**
     * @dev Get election winner
     * Returns: winnerIndex, candidateName
     */
    function getElectionWinner(string memory electionId) external view returns (
        uint256 winnerIndex,
        string memory winnerName
    ) {
        require(elections[electionId].feedId != bytes32(0), "Election not found");
        require(elections[electionId].officialResultsReceived, "Results not available");
        
        bytes32 feedId = elections[electionId].feedId;
        (, , uint256 value, , , bool isActive) = oracle.getDataFeed(feedId);
        
        require(isActive, "Feed not active");
        
        // Value represents winner index
        winnerIndex = value;
        require(winnerIndex < elections[electionId].candidates.length, "Invalid winner index");
        winnerName = elections[electionId].candidates[winnerIndex];
        
        return (winnerIndex, winnerName);
    }
    
    /**
     * @dev Check if election results are available
     */
    function hasResults(string memory electionId) external view returns (bool) {
        return elections[electionId].officialResultsReceived;
    }
}

