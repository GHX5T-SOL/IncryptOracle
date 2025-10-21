// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IOToken
 * @dev The native token for the Incrypt Oracle ecosystem
 * Features:
 * - ERC20 with permit functionality
 * - Voting capabilities for DAO governance
 * - Fixed supply with fair launch tokenomics
 */
contract IOToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant MAX_TRANSFER_AMOUNT = TOTAL_SUPPLY / 100; // 1% max transfer initially
    
    bool public transferRestrictionsEnabled = true;
    mapping(address => bool) public exemptFromRestrictions;
    
    event TransferRestrictionsToggled(bool enabled);
    event ExemptionUpdated(address account, bool exempt);
    
    constructor(
        address initialOwner
    ) 
        ERC20("Incrypt Oracle Token", "IO") 
        ERC20Permit("Incrypt Oracle Token")
        Ownable(initialOwner)
    {
        // Mint total supply to initial owner (will be distributed via Four Meme fair launch)
        _mint(initialOwner, TOTAL_SUPPLY);
        
        // Exempt owner from restrictions initially
        exemptFromRestrictions[initialOwner] = true;
    }
    
    /**
     * @dev Override transfer to implement initial restrictions
     */
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        // Apply transfer restrictions if enabled
        if (transferRestrictionsEnabled && from != address(0) && to != address(0)) {
            require(
                exemptFromRestrictions[from] || 
                exemptFromRestrictions[to] || 
                value <= MAX_TRANSFER_AMOUNT,
                "IOToken: Transfer amount exceeds maximum allowed"
            );
        }
        
        super._update(from, to, value);
    }
    
    /**
     * @dev Toggle transfer restrictions (can be disabled after fair launch)
     */
    function toggleTransferRestrictions(bool _enabled) external onlyOwner {
        transferRestrictionsEnabled = _enabled;
        emit TransferRestrictionsToggled(_enabled);
    }
    
    /**
     * @dev Add or remove addresses from transfer restrictions
     */
    function updateExemption(address account, bool exempt) external onlyOwner {
        exemptFromRestrictions[account] = exempt;
        emit ExemptionUpdated(account, exempt);
    }
    
    /**
     * @dev Batch update exemptions for efficiency
     */
    function updateExemptionsBatch(address[] calldata accounts, bool exempt) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            exemptFromRestrictions[accounts[i]] = exempt;
            emit ExemptionUpdated(accounts[i], exempt);
        }
    }
    
    /**
     * @dev Required override for ERC20Votes
     */
    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
