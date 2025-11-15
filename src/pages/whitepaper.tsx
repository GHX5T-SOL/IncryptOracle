import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WhitepaperPage() {
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
            <span className="text-gradient">Whitepaper & Revenue Model</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive overview of Incrypt Oracle's tokenomics, revenue architecture, and economic model.
          </p>
        </motion.div>

        {/* Tokenomics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">💰 Tokenomics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">$IO Token Distribution</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Total Supply:</span>
                    <span className="text-white font-semibold">1,000,000,000 IO</span>
                  </div>
                  <div className="text-xs text-gray-500">Fixed supply, no minting capability</div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-primary-400 mb-3">Token Utility</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-400 mt-1">•</span>
                      <span><strong>Governance:</strong> ERC20Votes extension enables delegation and voting on DAO proposals</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-400 mt-1">•</span>
                      <span><strong>Validator Staking:</strong> Minimum 1,000 IO tokens required to register as validator</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-400 mt-1">•</span>
                      <span><strong>Prediction Market Currency:</strong> Primary medium of exchange for market participation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-400 mt-1">•</span>
                      <span><strong>Subscription Payments:</strong> Required for API access tiers (Basic: 100 IO/month, Premium: 1,000 IO/month)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary-400 mt-1">•</span>
                      <span><strong>Market Creation Fees:</strong> 50 IO for public markets, 100 IO for private markets</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Fair Launch Model</h3>
              <div className="bg-dark-900/50 rounded-lg p-4 mb-4">
                <p className="text-gray-300 text-sm mb-3">
                  Four Meme platform launch ensures no team allocation, fair distribution to community.
                </p>
                <div className="space-y-2 text-xs text-gray-400">
                  <div>• No pre-mine or team allocation</div>
                  <div>• Community-driven distribution</div>
                  <div>• Governance by token holders via DAO</div>
                  <div>• Validator incentives aligned with network health</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 mt-6">Economic Security Model</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <span className="text-gray-400">Minimum Validator Stake:</span>
                  <span className="ml-2">1,000 IO tokens (~$100-1,000 at various IO prices)</span>
                </div>
                <div>
                  <span className="text-gray-400">Slashing:</span>
                  <span className="ml-2">10% of stake per poor validation (&lt;50% accuracy)</span>
                </div>
                <div>
                  <span className="text-gray-400">Maximum Slashes:</span>
                  <span className="ml-2">3 before automatic removal</span>
                </div>
                <div>
                  <span className="text-gray-400">Cooldown:</span>
                  <span className="ml-2">1 hour between slashes (prevents rapid depletion)</span>
                </div>
                <div>
                  <span className="text-gray-400">Reputation System:</span>
                  <span className="ml-2">Builds over time, affects consensus weighting</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Model */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">💼 Revenue Model</h2>
          
          <div className="space-y-8">
            {/* Revenue Sources */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Revenue Sources</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-900/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary-400 mb-3">1. Prediction Market Trading Fees</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Default fee: 2% (200 basis points) on all buy/sell transactions</li>
                    <li>• Configurable per market (up to 10% maximum)</li>
                    <li>• Collected in IO tokens and routed to RevenueDistributor</li>
                  </ul>
                </div>

                <div className="bg-dark-900/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary-400 mb-3">2. Oracle API Subscriptions</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-gray-300 font-semibold mb-1">Free Tier:</div>
                      <div className="text-gray-400">1,000 requests/month (no revenue, network growth)</div>
                    </div>
                    <div>
                      <div className="text-gray-300 font-semibold mb-1">Basic Tier:</div>
                      <div className="text-gray-400">100 IO/month for 10,000 requests, 1 IO per additional request</div>
                    </div>
                    <div>
                      <div className="text-gray-300 font-semibold mb-1">Premium Tier:</div>
                      <div className="text-gray-400">1,000 IO/month for unlimited requests</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Estimated revenue potential: $5,000-50,000/month at scale
                    </div>
                  </div>
                </div>

                <div className="bg-dark-900/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary-400 mb-3">3. Market Creation Fees</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Public market: 50 IO tokens (~$5-50 depending on IO price)</li>
                    <li>• Private market: 100 IO tokens (~$10-100)</li>
                    <li>• Collected immediately on market creation</li>
                  </ul>
                </div>

                <div className="bg-dark-900/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-primary-400 mb-3">4. Premium Market Features</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Private market access control (100 IO creation fee)</li>
                    <li>• Future premium features: custom fee structures</li>
                    <li>• Extended resolution times</li>
                    <li>• Custom oracle feeds</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Revenue Distribution */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Revenue Distribution</h3>
              <div className="bg-gradient-to-r from-primary-500/10 to-primary-400/5 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  The <code className="text-primary-300">RevenueDistributor</code> contract implements an automated 50/50 revenue split:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-dark-900/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-400 mb-3">50% to Token Holders</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Distributed proportionally to stakers based on stake size</li>
                      <li>• Staking minimum: No minimum (but must stake to receive rewards)</li>
                      <li>• Distribution interval: 7 days (configurable)</li>
                      <li>• Reward calculation: <code className="text-primary-300">userReward = (userStake / totalStaked) × holderShare</code></li>
                      <li>• Gas-optimized claiming with round-based accounting</li>
                    </ul>
                  </div>

                  <div className="bg-dark-900/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">50% to Treasury</h4>
                    <div className="text-sm text-gray-300">
                      <div className="font-semibold mb-2">Controlled by DAO for:</div>
                      <ul className="space-y-1 ml-4">
                        <li>• Development funding</li>
                        <li>• Security audits</li>
                        <li>• Marketing and partnerships</li>
                        <li>• Validator incentives</li>
                        <li>• Emergency reserves</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Staking Mechanism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">🔒 Staking Mechanism</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">For Token Holders</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Stake IO tokens to receive proportional share of holder rewards</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Minimum staking period: 7 days (prevents gaming)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Unstake anytime after minimum period</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Rewards claimable anytime (gas-optimized pagination for users with many rounds)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">For Validators</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Minimum stake: 1,000 IO tokens required</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Stake can be slashed for poor performance (&lt;50% accuracy)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Reputation system builds over time with accurate validations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>Higher reputation = higher weight in consensus calculation</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Market Economics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">📊 Market Economics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-900/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-primary-400 mb-3">Liquidity Requirements</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Minimum liquidity: 1,000 IO tokens per market</li>
                <li>• Ensures market viability and prevents manipulation</li>
              </ul>
            </div>

            <div className="bg-dark-900/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-primary-400 mb-3">Fee Structure</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Default fee: 2% (200 basis points)</li>
                <li>• Market creator sets fee (up to 10% max)</li>
                <li>• Collected on all buy/sell transactions</li>
              </ul>
            </div>

            <div className="bg-dark-900/50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-primary-400 mb-3">AMM Slippage</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Automatic based on pool ratios</li>
                <li>• No slippage protection needed for small trades</li>
                <li>• Larger trades experience natural slippage</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center pt-8 border-t border-white/10"
        >
          <Link href="/security" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>←</span>
            <span>Security & Audits</span>
          </Link>
          
          <Link href="/roadmap" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>Roadmap</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

