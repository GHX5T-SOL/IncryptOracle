// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IncryptDAO
 * @dev Governance contract for Incrypt Oracle ecosystem
 * Features:
 * - Token-based voting using IO tokens
 * - Timelock for execution security
 * - Revenue distribution proposals
 * - Platform parameter updates
 */
contract IncryptDAO is 
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    enum ProposalType {
        General,
        TreasurySpending,
        ParameterUpdate,
        RevenueDistribution,
        EmergencyAction
    }
    
    struct ProposalMetadata {
        ProposalType proposalType;
        uint256 requestedAmount;
        string category;
        string externalUrl;
    }
    
    mapping(uint256 => ProposalMetadata) public proposalMetadata;
    
    // Proposal thresholds by type (in basis points of total supply)
    mapping(ProposalType => uint256) public proposalThresholds;
    
    // Voting parameters
    uint256 private constant VOTING_DELAY = 1 days; // 1 day
    uint256 private constant VOTING_PERIOD = 7 days; // 7 days
    uint256 private constant PROPOSAL_THRESHOLD = 100; // 1% of total supply
    uint256 private constant QUORUM_FRACTION = 400; // 4% of total supply
    
    event ProposalCreatedWithMetadata(
        uint256 proposalId,
        ProposalType proposalType,
        string category,
        uint256 requestedAmount
    );
    
    event TreasurySpendingExecuted(
        uint256 proposalId,
        address recipient,
        uint256 amount,
        string purpose
    );
    
    event ParameterUpdated(
        string parameter,
        uint256 oldValue,
        uint256 newValue
    );
    
    constructor(
        IVotes _token,
        TimelockController _timelock
    ) 
        Governor("IncryptDAO")
        GovernorSettings(VOTING_DELAY, VOTING_PERIOD, PROPOSAL_THRESHOLD)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(QUORUM_FRACTION)
        GovernorTimelockControl(_timelock)
    {
        // Set initial proposal thresholds
        proposalThresholds[ProposalType.General] = 50; // 0.5%
        proposalThresholds[ProposalType.TreasurySpending] = 100; // 1%
        proposalThresholds[ProposalType.ParameterUpdate] = 200; // 2%
        proposalThresholds[ProposalType.RevenueDistribution] = 100; // 1%
        proposalThresholds[ProposalType.EmergencyAction] = 500; // 5%
    }
    
    /**
     * @dev Create a proposal with metadata
     */
    function proposeWithMetadata(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        ProposalType proposalType,
        string memory category,
        uint256 requestedAmount,
        string memory externalUrl
    ) public returns (uint256) {
        // Check if proposer meets threshold for proposal type
        uint256 requiredThreshold = (token().totalSupply() * proposalThresholds[proposalType]) / 10000;
        require(
            token().getVotes(msg.sender) >= requiredThreshold,
            "Insufficient voting power for proposal type"
        );
        
        uint256 proposalId = propose(targets, values, calldatas, description);
        
        proposalMetadata[proposalId] = ProposalMetadata({
            proposalType: proposalType,
            requestedAmount: requestedAmount,
            category: category,
            externalUrl: externalUrl
        });
        
        emit ProposalCreatedWithMetadata(proposalId, proposalType, category, requestedAmount);
        
        return proposalId;
    }
    
    /**
     * @dev Create treasury spending proposal
     */
    function proposeTreasurySpending(
        address recipient,
        uint256 amount,
        string memory purpose,
        string memory description
    ) external returns (uint256) {
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);
        
        targets[0] = address(timelock());
        values[0] = 0;
        calldatas[0] = abi.encodeWithSignature(
            "execute(address,uint256,bytes)",
            recipient,
            amount,
            ""
        );
        
        return proposeWithMetadata(
            targets,
            values,
            calldatas,
            description,
            ProposalType.TreasurySpending,
            "Treasury",
            amount,
            ""
        );
    }
    
    /**
     * @dev Create parameter update proposal
     */
    function proposeParameterUpdate(
        address target,
        string memory functionSig,
        uint256 newValue,
        string memory parameterName,
        string memory description
    ) external returns (uint256) {
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);
        
        targets[0] = target;
        values[0] = 0;
        calldatas[0] = abi.encodeWithSignature(functionSig, newValue);
        
        return proposeWithMetadata(
            targets,
            values,
            calldatas,
            description,
            ProposalType.ParameterUpdate,
            parameterName,
            newValue,
            ""
        );
    }
    
    /**
     * @dev Create revenue distribution proposal
     */
    function proposeRevenueDistribution(
        address[] memory recipients,
        uint256[] memory amounts,
        string memory description
    ) external returns (uint256) {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        address[] memory targets = new address[](recipients.length);
        uint256[] memory values = new uint256[](recipients.length);
        bytes[] memory calldatas = new bytes[](recipients.length);
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            targets[i] = recipients[i];
            values[i] = amounts[i];
            calldatas[i] = "";
            totalAmount += amounts[i];
        }
        
        return proposeWithMetadata(
            targets,
            values,
            calldatas,
            description,
            ProposalType.RevenueDistribution,
            "Revenue",
            totalAmount,
            ""
        );
    }
    
    /**
     * @dev Get proposal metadata
     */
    function getProposalMetadata(uint256 proposalId) external view returns (
        ProposalType proposalType,
        uint256 requestedAmount,
        string memory category,
        string memory externalUrl
    ) {
        ProposalMetadata memory metadata = proposalMetadata[proposalId];
        return (metadata.proposalType, metadata.requestedAmount, metadata.category, metadata.externalUrl);
    }
    
    /**
     * @dev Update proposal threshold for a specific type
     */
    function updateProposalThreshold(ProposalType proposalType, uint256 newThreshold) external onlyGovernance {
        require(newThreshold <= 1000, "Threshold too high"); // Max 10%
        uint256 oldThreshold = proposalThresholds[proposalType];
        proposalThresholds[proposalType] = newThreshold;
        
        emit ParameterUpdated("ProposalThreshold", oldThreshold, newThreshold);
    }
    
    /**
     * @dev Get active proposals
     */
    function getActiveProposals() external view returns (uint256[] memory) {
        // This is a simplified implementation
        // In a production system, you'd want to maintain an array of active proposals
        uint256[] memory activeProposals = new uint256[](0);
        return activeProposals;
    }
    
    /**
     * @dev Calculate voting power at a specific block
     */
    function getVotingPower(address account, uint256 blockNumber) external view returns (uint256) {
        return token().getPastVotes(account, blockNumber);
    }
    
    /**
     * @dev Get voting stats for a proposal
     */
    function getProposalVotes(uint256 proposalId) external view returns (
        uint256 againstVotes,
        uint256 forVotes,
        uint256 abstainVotes
    ) {
        return proposalVotes(proposalId);
    }
    
    // The following functions are overrides required by Solidity.
    
    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }
    
    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }
    
    function quorum(uint256 blockNumber) public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }
    
    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }
    
    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }
    
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }
    
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }
    
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }
    
    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
