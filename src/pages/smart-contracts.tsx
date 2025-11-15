import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const contracts = [
  {
    name: 'IncryptOracle.sol',
    address: '0x823C0Ead984707A4B73173274E0e075492866593',
    description: 'Core oracle contract managing validators and data feeds with reputation-weighted consensus',
    keyFeatures: [
      'Reputation-weighted consensus mechanism',
      'Optimistic resolution with 4-hour dispute window',
      'Dynamic validator management (3-21 validators)',
      'Automatic slashing for poor performance',
      'Division-by-zero protection',
      'Gas-optimized validator updates'
    ],
    functions: [
      { name: 'createDataFeed', params: 'string name, string description, uint256 threshold', returns: 'bytes32', description: 'Create a new data feed for oracle validation' },
      { name: 'registerValidator', params: 'uint256 stakeAmount', returns: 'void', description: 'Register as a validator with minimum 1,000 IO token stake' },
      { name: 'submitValidation', params: 'bytes32 feedId, uint256 value, string dataSource', returns: 'void', description: 'Submit validation data for a feed (validator only)' },
      { name: 'getDataFeed', params: 'bytes32 feedId', returns: '(name, description, value, timestamp, confidence, isActive)', description: 'Retrieve complete data feed information' },
      { name: 'getActiveFeedIds', params: 'void', returns: 'bytes32[]', description: 'Get array of all active data feed IDs' },
      { name: 'raiseDispute', params: 'bytes32 feedId, uint256 proposedValue', returns: 'void', description: 'Raise a dispute during optimistic resolution window' },
      { name: 'isDisputeWindowOpen', params: 'bytes32 feedId', returns: 'bool', description: 'Check if dispute window is open for a feed' }
    ],
    events: ['DataFeedCreated', 'ValidationSubmitted', 'FeedResolved', 'ValidatorRegistered', 'ValidatorSlashed', 'OptimisticResolution', 'DisputeRaised'],
    security: 'ReentrancyGuard, Pausable, Ownable, division-by-zero protection, input validation'
  },
  {
    name: 'PredictionMarket.sol',
    address: '0x101B0f8d4B87669fdDd9d61386288Cc16003D0e5',
    description: 'AMM-based prediction market with oracle integration and private market support',
    keyFeatures: [
      'Constant Product Market Maker (CPMM) model',
      'Oracle-powered automatic resolution',
      'Optimistic resolution support (50% threshold)',
      'Private markets with access control',
      'Market creation fees (50 IO public, 100 IO private)',
      'Comprehensive input validation'
    ],
    functions: [
      { name: 'createMarket', params: 'string question, string desc, string category, uint256 duration, bytes32 oracleFeedId, uint256 liquidity, bool isPrivate, address[] allowed', returns: 'uint256', description: 'Create a new prediction market' },
      { name: 'buyShares', params: 'uint256 marketId, uint8 outcome, uint256 amount', returns: 'uint256', description: 'Buy shares for a specific outcome' },
      { name: 'sellShares', params: 'uint256 marketId, uint8 outcome, uint256 shares', returns: 'uint256', description: 'Sell shares back to the pool' },
      { name: 'resolveMarket', params: 'uint256 marketId', returns: 'void', description: 'Resolve market based on oracle data' },
      { name: 'disputeResolution', params: 'uint256 marketId', returns: 'void', description: 'Dispute and re-resolve market during dispute window' },
      { name: 'claimWinnings', params: 'uint256 marketId', returns: 'uint256', description: 'Claim winnings from resolved market' },
      { name: 'calculateCost', params: 'uint256 marketId, uint8 outcome, uint256 amount', returns: 'uint256', description: 'Calculate cost to buy shares before purchase' },
      { name: 'getOdds', params: 'uint256 marketId', returns: '(noOdds, yesOdds)', description: 'Get current odds for market outcomes' },
      { name: 'addParticipant', params: 'uint256 marketId, address participant', returns: 'void', description: 'Add participant to private market (creator only)' }
    ],
    events: ['MarketCreated', 'SharesPurchased', 'SharesSold', 'MarketResolved', 'WinningsClaimed', 'PrivateMarketCreated', 'ParticipantAdded'],
    security: 'ReentrancyGuard, input validation, division-by-zero protection, oracle staleness checks'
  },
  {
    name: 'IOToken.sol',
    address: '0xdc6a5752d457aAdF3f1C65E3a158f44277717183',
    description: 'ERC20 governance token with ERC20Votes extension for DAO voting',
    keyFeatures: [
      'ERC20Votes extension for delegation',
      'Governance voting capabilities',
      'Validator staking requirement',
      'Market currency and subscription payments'
    ],
    functions: [
      { name: 'transfer', params: 'address to, uint256 amount', returns: 'bool', description: 'Transfer tokens to another address' },
      { name: 'approve', params: 'address spender, uint256 amount', returns: 'bool', description: 'Approve spender to transfer tokens' },
      { name: 'delegate', params: 'address delegatee', returns: 'void', description: 'Delegate voting power to another address' },
      { name: 'getVotes', params: 'address account', returns: 'uint256', description: 'Get voting power of an account' }
    ],
    events: ['Transfer', 'Approval', 'DelegateChanged', 'DelegateVotesChanged'],
    security: 'OpenZeppelin ERC20, ERC20Votes standard implementation'
  },
  {
    name: 'RevenueDistributor.sol',
    address: '0xe68b3647c436B0De90D59600093F0DF13Af21596',
    description: 'Automated fee distribution with 50/50 split to stakers and treasury',
    keyFeatures: [
      '50/50 revenue split (holders/treasury)',
      'Round-based reward system',
      'Gas-optimized claiming (lastProcessedRound tracking)',
      'Paginated reward claiming (100 rounds max)',
      'Minimum 7-day staking period',
      'Emergency pause functionality'
    ],
    functions: [
      { name: 'stakeTokens', params: 'uint256 amount', returns: 'void', description: 'Stake IO tokens to receive rewards' },
      { name: 'unstakeTokens', params: 'uint256 amount', returns: 'void', description: 'Unstake tokens after minimum period' },
      { name: 'claimRewards', params: 'void', returns: 'uint256', description: 'Claim pending rewards' },
      { name: 'claimRewardsPaginated', params: 'uint256 startRound, uint256 endRound', returns: 'uint256', description: 'Claim rewards for specific round range (max 100 rounds)' },
      { name: 'distributeRevenue', params: 'uint256 amount', returns: 'void', description: 'Distribute revenue to stakers and treasury (internal)' },
      { name: 'getPendingRewards', params: 'address user', returns: 'uint256', description: 'Get total pending rewards for user' }
    ],
    events: ['TokensStaked', 'TokensUnstaked', 'RewardsClaimed', 'RevenueDistributed'],
    security: 'ReentrancyGuard, Pausable, SafeERC20, round limit checks'
  },
  {
    name: 'OracleSubscription.sol',
    address: 'TBD',
    description: 'Tiered subscription service for oracle API access with rate limiting',
    keyFeatures: [
      'Three subscription tiers (Free, Basic, Premium)',
      'Rate limiting per tier',
      'Monthly billing with renewal',
      'Per-request overflow pricing',
      'Revenue generation for protocol'
    ],
    functions: [
      { name: 'subscribe', params: 'SubscriptionTier tier, uint256 months', returns: 'void', description: 'Subscribe to oracle API access' },
      { name: 'freeSubscribe', params: 'void', returns: 'void', description: 'Subscribe to free tier (1,000 requests/month)' },
      { name: 'recordRequest', params: 'address subscriber, bytes32 feedId', returns: 'bool', description: 'Record API request (owner only)' },
      { name: 'canMakeRequest', params: 'address subscriber', returns: 'bool', description: 'Check if subscriber can make request' },
      { name: 'getSubscription', params: 'address subscriber', returns: '(tier, startTime, endTime, requestsUsed, requestsLimit, isActive)', description: 'Get subscription details' }
    ],
    events: ['SubscriptionCreated', 'SubscriptionRenewed', 'RequestRecorded'],
    security: 'Access control, rate limiting, input validation'
  },
  {
    name: 'IncryptDAO.sol',
    address: '0xb7ed1FDA4DAb1e0000D2e64bB9dD2D6b492bc1b0',
    description: 'OpenZeppelin Governor for community governance with timelock integration',
    keyFeatures: [
      'Proposal submission and voting',
      'Timelock integration for delayed execution',
      'Stake-weighted voting',
      'Proposal queuing and execution',
      'Emergency cancellation'
    ],
    functions: [
      { name: 'propose', params: 'address[] targets, uint256[] values, bytes[] calldatas, string description', returns: 'uint256', description: 'Submit a governance proposal' },
      { name: 'castVote', params: 'uint256 proposalId, uint8 support', returns: 'uint256', description: 'Cast vote on a proposal' },
      { name: 'execute', params: 'address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash', returns: 'uint256', description: 'Execute a successful proposal' },
      { name: 'queue', params: 'address[] targets, uint256[] values, bytes[] calldatas, bytes32 descriptionHash', returns: 'uint256', description: 'Queue proposal for execution after timelock' }
    ],
    events: ['ProposalCreated', 'VoteCast', 'ProposalExecuted', 'ProposalQueued'],
    security: 'OpenZeppelin Governor, TimelockController integration'
  }
];

const domainSpecificOracles = [
  {
    name: 'CryptoPriceOracle.sol',
    description: 'Specialized oracle for cryptocurrency prices with 60-second update intervals',
    features: ['Binance + CoinGecko aggregation', 'Median price calculation', 'Rate limiting', 'High-frequency updates']
  },
  {
    name: 'SportsOracle.sol',
    description: 'Sports event oracle with immediate post-game resolution',
    features: ['Event lifecycle tracking', 'Score encoding (16 bits each)', 'League metadata', 'Post-game resolution']
  },
  {
    name: 'ElectionOracle.sol',
    description: 'Election results oracle with official authority integration',
    features: ['Candidate array management', 'Winner index encoding', 'High validation thresholds', 'Integrity-focused']
  },
  {
    name: 'WeatherOracle.sol',
    description: 'Weather data oracle with multiple metric support',
    features: ['Temperature, Precipitation, WindSpeed, Humidity', 'Location-based feeds', 'Metric-specific encoding', 'Configurable intervals']
  }
];

export default function SmartContractsPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            <span className="text-gradient">Smart Contracts</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive overview of all Incrypt Oracle smart contracts, their functions, security features, and deployment addresses.
          </p>
        </motion.div>

        {/* Core Contracts */}
        <div className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Core Contracts</h2>
          
          {contracts.map((contract, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-liquid-glass p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-primary-400 mb-3">{contract.name}</h3>
                  <p className="text-gray-300 mb-4">{contract.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Contract Address (BSC Testnet):</div>
                    <div className="flex items-center space-x-3">
                      <code className="text-sm text-primary-300 bg-dark-900 px-3 py-2 rounded font-mono">
                        {contract.address}
                      </code>
                      {contract.address !== 'TBD' && (
                        <a
                          href={`https://testnet.bscscan.com/address/${contract.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          View on BSCScan →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contract.keyFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <span className="text-primary-400 mt-1">•</span>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Functions */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Key Functions</h4>
                <div className="space-y-4">
                  {contract.functions.map((func, i) => (
                    <div key={i} className="bg-dark-900/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <code className="text-primary-400 font-mono text-sm">
                          {func.name}({func.params})
                        </code>
                        {func.returns && (
                          <span className="text-xs text-gray-400 bg-dark-950 px-2 py-1 rounded">
                            → {func.returns}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{func.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Events */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Events</h4>
                <div className="flex flex-wrap gap-2">
                  {contract.events.map((event, i) => (
                    <code key={i} className="text-xs bg-dark-900 text-green-400 px-3 py-1 rounded">
                      {event}
                    </code>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">🛡️ Security Features</h4>
                <p className="text-gray-300 text-sm">{contract.security}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Domain-Specific Oracles */}
        <div className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Domain-Specific Oracle Templates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domainSpecificOracles.map((oracle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-liquid-glass p-6"
              >
                <h3 className="text-xl font-bold text-primary-400 mb-3">{oracle.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{oracle.description}</p>
                <div className="space-y-2">
                  {oracle.features.map((feature, i) => (
                    <div key={i} className="flex items-start space-x-2 text-sm">
                      <span className="text-primary-400 mt-1">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Technical Specifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Network Parameters</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Solidity Version:</span>
                  <code className="text-primary-300 ml-2">^0.8.19</code>
                </div>
                <div>
                  <span className="text-gray-400">Network:</span>
                  <span className="text-gray-300 ml-2">Binance Smart Chain (BSC)</span>
                </div>
                <div>
                  <span className="text-gray-400">Chain ID (Testnet):</span>
                  <code className="text-primary-300 ml-2">97</code>
                </div>
                <div>
                  <span className="text-gray-400">Chain ID (Mainnet):</span>
                  <code className="text-primary-300 ml-2">56</code>
                </div>
                <div>
                  <span className="text-gray-400">Validator Range:</span>
                  <span className="text-gray-300 ml-2">3-21 validators</span>
                </div>
                <div>
                  <span className="text-gray-400">Minimum Stake:</span>
                  <span className="text-gray-300 ml-2">1,000 IO tokens</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Gas Optimizations</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div>• Validator reputation updates: ~15,000 gas saved</div>
                <div>• Round-based reward claiming: ~50,000+ gas saved</div>
                <div>• Loop iteration reduction: 20-30% overall savings</div>
                <div>• Storage packing for efficient slot usage</div>
                <div>• Early termination checks in consensus</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Source Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center"
        >
          <h3 className="text-xl font-semibold text-blue-400 mb-3">📂 View Source Code</h3>
          <p className="text-gray-300 mb-4">
            All contracts are open-source and available on GitHub for review and auditing.
          </p>
          <a
            href="https://github.com/GHX5T-SOL/IncryptOracle/tree/main/contracts"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-holographic inline-block"
          >
            View Contracts on GitHub →
          </a>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mt-12 pt-8 border-t border-white/10"
        >
          <Link href="/docs" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>←</span>
            <span>Back to Documentation</span>
          </Link>
          
          <Link href="/security" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>Security & Audits</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

