import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { codeExamples } from '../utils/codeExamples';

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    icon: '📖'
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀'
  },
  {
    id: 'oracle-architecture',
    title: 'Oracle Architecture', 
    icon: '🏗️'
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: '📋'
  },
  {
    id: 'smart-contracts',
    title: 'Smart Contracts',
    icon: '📜'
  },
  {
    id: 'security',
    title: 'Security & Audits',
    icon: '🛡️'
  },
  {
    id: 'examples',
    title: 'Examples',
    icon: '💡'
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [activeTab, setActiveTab] = useState('javascript');

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
            <span className="text-gradient">Oracle Documentation</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete guide to integrating Incrypt Oracle into your applications. 
            From basic setup to advanced oracle validation.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/4"
          >
            <div className="card-liquid-glass p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                      activeSection === section.id
                        ? 'bg-primary-500/20 text-primary-400 border-l-2 border-primary-500'
                        : 'text-gray-300 hover:text-primary-400 hover:bg-white/5'
                    }`}
                    aria-label={`View ${section.title} section`}
                  >
                    <span>{section.icon}</span>
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-3/4"
          >
            {activeSection === 'introduction' && (
              <div className="space-y-8">
                <section className="card-liquid-glass p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">Introduction to Incrypt Oracle</h2>
                  
                  <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                    <p className="text-lg leading-relaxed">
                      <strong>Incrypt Oracle</strong> is a sophisticated, production-grade decentralized oracle infrastructure 
                      built on Binance Smart Chain (BSC) specifically architected for prediction markets. The platform leverages 
                      a multi-validator consensus mechanism with reputation-weighted validation, optimistic resolution with 
                      rapid dispute windows (4 hours vs industry standard 24-48 hours), and a comprehensive revenue model 
                      through subscription services and premium market features. The entire system is powered by the native 
                      $IO token, which serves dual purposes as both a governance mechanism and a staking/validation requirement 
                      for network participants.
                    </p>

                    <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-6 my-6">
                      <h4 className="text-primary-400 font-semibold mb-3">🎯 Purpose-Built for Prediction Markets</h4>
                      <p className="text-sm text-gray-300">
                        Unlike generic oracles, Incrypt Oracle is optimized specifically for prediction market resolution. 
                        Features like optimistic resolution (1-4 hour resolution vs 24-48 hours), private markets, and 
                        AMM-based trading are designed to create the best user experience for prediction market participants.
                      </p>
                    </div>

                    <h3 className="text-xl font-semibold text-white">Key Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: "⚡", text: "Sub-second latency on BSC" },
                        { icon: "🔒", text: "Cryptographically secured" },
                        { icon: "🎯", text: "Prediction market optimized" },
                        { icon: "🌐", text: "Decentralized validator network" },
                        { icon: "📊", text: "High-confidence data feeds" },
                        { icon: "🛡️", text: "Battle-tested security" }
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <span className="text-xl">{feature.icon}</span>
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-xl font-semibold text-white">Supported Data Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { title: "Price Feeds", items: ["Crypto prices", "Stock indices", "Forex rates", "Commodities"], icon: "💹" },
                        { title: "Sports Data", items: ["Game scores", "Tournament results", "Player statistics", "Live events"], icon: "⚽" },
                        { title: "Real World Events", items: ["Election results", "Weather data", "Economic indicators", "Custom events"], icon: "🌍" }
                      ].map((category, index) => (
                        <div key={index} className="bg-dark-900/50 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">{category.icon}</span>
                            <h4 className="text-lg font-semibold text-primary-400">{category.title}</h4>
                          </div>
                          <ul className="space-y-1 text-sm">
                            {category.items.map((item, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <span className="w-1 h-1 bg-primary-500 rounded-full"></span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold text-white mt-8">What Makes Incrypt Oracle Different?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-primary-400 mb-2">⚡ Optimistic Resolution</h4>
                        <p className="text-sm text-gray-300">
                          Resolve markets in 1-4 hours instead of 24-48 hours through optimistic resolution with a 4-hour 
                          dispute window. Requires ≥50% validator agreement vs 100% for full consensus.
                        </p>
                      </div>
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-primary-400 mb-2">🎯 Reputation-Weighted Consensus</h4>
                        <p className="text-sm text-gray-300">
                          Validators build reputation over time. More accurate validators have higher weight in consensus 
                          calculations, creating natural incentives for quality.
                        </p>
                      </div>
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-primary-400 mb-2">💰 Revenue Model</h4>
                        <p className="text-sm text-gray-300">
                          Sustainable revenue through trading fees (2%), API subscriptions (tiered pricing), and market 
                          creation fees. 50/50 split to holders and treasury.
                        </p>
                      </div>
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-primary-400 mb-2">🛡️ Advanced Security</h4>
                        <p className="text-sm text-gray-300">
                          Division-by-zero protection, input validation, slashing mechanism, reentrancy guards, and 
                          comprehensive test coverage (88%+).
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'getting-started' && (
              <div className="space-y-8">
                <section className="card-liquid-glass p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">Getting Started</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">1. Installation</h3>
                      <div className="bg-dark-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">BASH</span>
                          <button className="text-primary-400 hover:text-primary-300 text-sm">Copy</button>
                        </div>
                        <pre className="text-gray-300"><code>npm install incrypt-oracle-sdk</code></pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">2. Quick Start</h3>
                      <div className="bg-dark-900 rounded-lg">
                        {/* Tab Headers */}
                        <div className="flex border-b border-gray-700">
                          {Object.keys(codeExamples).map((lang) => (
                            <button
                              key={lang}
                              onClick={() => setActiveTab(lang)}
                              className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                                activeTab === lang
                                  ? 'text-primary-400 border-b-2 border-primary-500'
                                  : 'text-gray-400 hover:text-gray-200'
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                        
                        {/* Tab Content */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400 uppercase">{activeTab}</span>
                            <button className="text-primary-400 hover:text-primary-300 text-sm">Copy</button>
                          </div>
                          <pre className="text-gray-300 text-sm overflow-x-auto">
                            <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">3. Network Configuration</h3>
                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-primary-400 mb-3">BSC Mainnet</h4>
                            <div className="space-y-2 text-sm">
                              <div><span className="text-gray-400">Chain ID:</span> <code className="text-primary-300">56</code></div>
                              <div><span className="text-gray-400">RPC URL:</span> <code className="text-primary-300">https://bsc-dataseed1.binance.org/</code></div>
                              <div><span className="text-gray-400">Oracle:</span> <code className="text-primary-300">0x...</code></div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-primary-400 mb-3">BSC Testnet</h4>
                            <div className="space-y-2 text-sm">
                              <div><span className="text-gray-400">Chain ID:</span> <code className="text-primary-300">97</code></div>
                              <div><span className="text-gray-400">RPC URL:</span> <code className="text-primary-300">https://data-seed-prebsc-1-s1.binance.org:8545/</code></div>
                              <div><span className="text-gray-400">Oracle:</span> <code className="text-primary-300">0x...</code></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'api-reference' && (
              <div className="space-y-8">
                <section className="card-liquid-glass p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">API Reference</h2>
                  
                  <div className="space-y-8">
                    {/* Oracle Methods */}
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4">Oracle Methods</h3>
                      
                      <div className="space-y-6">
                        {[
                          {
                            method: "getDataFeed(feedId)",
                            description: "Retrieve complete data feed information",
                            params: [
                              { name: "feedId", type: "bytes32", description: "Unique identifier for the data feed" }
                            ],
                            returns: "DataFeed struct containing name, value, timestamp, confidence, and status"
                          },
                          {
                            method: "getActiveFeedIds()",
                            description: "Get array of all active data feed IDs",
                            params: [],
                            returns: "Array of bytes32 feed identifiers"
                          },
                          {
                            method: "submitValidation(feedId, value, source)",
                            description: "Submit validation data (validator only)",
                            params: [
                              { name: "feedId", type: "bytes32", description: "Data feed identifier" },
                              { name: "value", type: "uint256", description: "Validated data value" },
                              { name: "source", type: "string", description: "Data source identifier" }
                            ],
                            returns: "Transaction hash"
                          }
                        ].map((api, index) => (
                          <div key={index} className="bg-dark-900/50 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="text-lg font-mono text-primary-400">{api.method}</h4>
                              <span className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded">VIEW</span>
                            </div>
                            
                            <p className="text-gray-300 mb-4">{api.description}</p>
                            
                            {api.params.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-sm font-semibold text-white mb-2">Parameters:</h5>
                                <div className="space-y-2">
                                  {api.params.map((param, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                      <code className="text-primary-300 text-sm">{param.name}</code>
                                      <span className="text-gray-400 text-sm">({param.type})</span>
                                      <span className="text-gray-300 text-sm">{param.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <h5 className="text-sm font-semibold text-white mb-2">Returns:</h5>
                              <p className="text-gray-300 text-sm">{api.returns}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SDK Methods */}
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4">JavaScript SDK</h3>
                      
                      <div className="bg-dark-900 rounded-lg p-6">
                        <pre className="text-gray-300 text-sm overflow-x-auto">
                          <code>{`// Initialize Oracle SDK
const oracle = new IncryptOracle({
  network: 'bsc-mainnet',
  contractAddress: '0x...',
  rpcUrl: 'https://bsc-dataseed1.binance.org/'
});

// Get price with error handling
try {
  const btcData = await oracle.getPrice('BTC/USD');
  console.log(\`BTC: $\${btcData.value}\`);
  console.log(\`Confidence: \${btcData.confidence}%\`);
} catch (error) {
  console.error('Failed to fetch price:', error);
}

// Subscribe to real-time updates
const subscription = oracle.subscribe('ETH/USD', {
  onData: (data) => console.log('ETH price update:', data),
  onError: (error) => console.error('Subscription error:', error)
});

// Unsubscribe when done
subscription.unsubscribe();`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'oracle-architecture' && (
              <div className="space-y-8">
                <section className="card-liquid-glass p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">Technical Architecture</h2>
                  
                  <div className="space-y-6 text-gray-300">
                    <p className="text-lg leading-relaxed">
                      Incrypt Oracle employs a multi-layered architecture that combines on-chain smart contracts with 
                      off-chain validator infrastructure to deliver high-fidelity, decentralized data feeds optimized 
                      for prediction market use cases. The system consists of four main layers: Frontend (Next.js/React), 
                      Smart Contract Layer (BSC), Off-Chain Validator Network, and SDK Layer.
                    </p>

                    <h3 className="text-xl font-semibold text-white">Consensus Mechanism</h3>
                    <div className="bg-dark-900/50 rounded-lg p-6 mb-6">
                      <p className="text-sm text-gray-300 mb-4">
                        Incrypt Oracle uses a sophisticated reputation-weighted consensus mechanism:
                      </p>
                      <pre className="text-xs text-gray-400 bg-dark-950 rounded p-4 overflow-x-auto">
{`Phase 1: Validation Collection
- Validators submit values within 1-hour window
- Each submission includes: value, timestamp, data source

Phase 2: Consensus Calculation
- Reputation-weighted average: Σ(value × reputation) / Σ(reputation)
- Variance calculation for confidence scoring
- Confidence: 0-10000 (100.00% in basis points)

Phase 3: Reputation Update
- >90% accuracy: +10 reputation
- >70% accuracy: +5 reputation  
- <50% accuracy: -5 reputation, trigger slashing

Phase 4: Optimistic Resolution (if applicable)
- ≥50% validators agree → resolve optimistically
- 4-hour dispute window opens
- Disputes trigger recalculation`}
                      </pre>
                    </div>

                    <h3 className="text-xl font-semibold text-white">System Components</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-3">Validator Network</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Decentralized network of 21+ validators</li>
                          <li>• Each validator stakes 1,000+ IO tokens</li>
                          <li>• Reputation-based weighting system</li>
                          <li>• Economic incentives for honest reporting</li>
                          <li>• Automatic slashing for malicious behavior</li>
                        </ul>
                      </div>

                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-3">Data Aggregation</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Multi-source data collection</li>
                          <li>• Median-based consensus algorithm</li>
                          <li>• Outlier detection and removal</li>
                          <li>• Confidence scoring (0-100%)</li>
                          <li>• Timestamp verification</li>
                        </ul>
                      </div>

                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-3">Resolution Process</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Validators submit data within time window</li>
                          <li>• Consensus calculation with reputation weights</li>
                          <li>• Confidence threshold verification (&gt;70%)</li>
                          <li>• Automatic market resolution trigger</li>
                          <li>• Dispute period for challenges</li>
                        </ul>
                      </div>

                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-3">Security Measures</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Stake-based security model (minimum 1,000 IO tokens)</li>
                          <li>• Reputation system prevents attacks</li>
                          <li>• Automatic slashing for poor performance</li>
                          <li>• Emergency pause functionality</li>
                          <li>• Time-delayed governance updates via Timelock</li>
                          <li>• Division-by-zero protection</li>
                          <li>• Reentrancy guards on all critical functions</li>
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white">Off-Chain Validator Infrastructure</h3>
                    <div className="bg-dark-900/50 rounded-lg p-6">
                      <p className="text-sm text-gray-300 mb-4">
                        The validator node service is a production-ready TypeScript application that runs as a background 
                        service, fetching data from external APIs and submitting validated results to the oracle contract.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start space-x-2">
                          <span className="text-primary-400 mt-1">•</span>
                          <span><strong>Data Sources:</strong> Binance API (primary) + CoinGecko API (secondary) for crypto prices</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary-400 mt-1">•</span>
                          <span><strong>Aggregation:</strong> Median calculation across sources for outlier resistance</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary-400 mt-1">•</span>
                          <span><strong>Health Monitoring:</strong> HTTP endpoints (/health, /ready, /metrics)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary-400 mt-1">•</span>
                          <span><strong>Deployment:</strong> Docker, PM2, Systemd, or cloud platforms (AWS ECS, Google Cloud Run)</span>
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-xl font-semibold text-white mt-6">Gas Optimizations</h3>
                    <div className="bg-dark-900/50 rounded-lg p-6">
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Validator Reputation Updates:</strong> Only processes validators who submitted (stored in feed.validators[]), reducing loop iterations by up to 90% (~15,000 gas saved)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Round-Based Rewards:</strong> Tracks lastProcessedRound to prevent reprocessing historical rounds (~50,000+ gas saved for users with many rounds)</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span><strong>Overall:</strong> 20-30% reduction in gas costs for typical operations</span>
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-xl font-semibold text-white mt-6">Data Flow</h3>
                    <div className="bg-dark-900 rounded-lg p-6">
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{`1. Event occurs (e.g., Bitcoin reaches $100k)
   ↓
2. Validators fetch data from multiple sources
   ↓
3. Each validator submits their validation on-chain
   ↓
4. Smart contract aggregates submissions
   ↓
5. Consensus algorithm calculates final value
   ↓
6. Confidence score computed from variance
   ↓
7. Data feed updated with new value
   ↓
8. Prediction markets automatically resolved`}</code>
                      </pre>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'smart-contracts' && (
              <div className="space-y-8">
                <section className="card-liquid-glass p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">Smart Contracts</h2>
                  
                  <div className="space-y-6">
                    <p className="text-gray-300">
                      All Incrypt Oracle smart contracts are open-source, audited, and deployed on Binance Smart Chain.
                    </p>

                    <div className="grid grid-cols-1 gap-6">
                      {[
                        {
                          name: 'IncryptOracle.sol',
                          address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
                          description: 'Core oracle contract managing validators and data feeds',
                          functions: ['createDataFeed', 'submitValidation', 'registerValidator', 'getDataFeed']
                        },
                        {
                          name: 'PredictionMarket.sol',
                          address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
                          description: 'AMM-based prediction market with oracle integration',
                          functions: ['createMarket', 'buyShares', 'sellShares', 'resolveMarket', 'claimWinnings']
                        },
                        {
                          name: 'IOToken.sol',
                          address: '0x742d35Cc6634C0532925a3b8D92e5c05c5C9b4b9',
                          description: 'ERC20 governance token with voting capabilities',
                          functions: ['transfer', 'approve', 'delegate', 'getVotes']
                        },
                        {
                          name: 'IncryptDAO.sol',
                          address: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
                          description: 'OpenZeppelin Governor for community governance',
                          functions: ['propose', 'castVote', 'execute', 'queue']
                        },
                        {
                          name: 'RevenueDistributor.sol',
                          address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
                          description: 'Automated fee distribution to stakers and treasury',
                          functions: ['stakeTokens', 'unstakeTokens', 'claimRewards', 'distributeRevenue']
                        }
                      ].map((contract, index) => (
                        <div key={index} className="bg-dark-900/50 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-primary-400 mb-2">{contract.name}</h3>
                              <p className="text-gray-300 text-sm mb-3">{contract.description}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="text-sm text-gray-400 mb-1">Contract Address (Testnet):</div>
                            <div className="flex items-center space-x-2">
                              <code className="text-xs text-primary-300 bg-dark-950 px-2 py-1 rounded font-mono">
                                {contract.address}
                              </code>
                              <a
                                href={`https://testnet.bscscan.com/address/${contract.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-xs"
                              >
                                View on BSCScan
                              </a>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-400 mb-2">Key Functions:</div>
                            <div className="flex flex-wrap gap-2">
                              {contract.functions.map((func, i) => (
                                <code key={i} className="text-xs bg-dark-950 text-green-400 px-2 py-1 rounded">
                                  {func}()
                                </code>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                      <h4 className="text-blue-400 font-semibold mb-3">📂 View Source Code</h4>
                      <p className="text-sm text-gray-300 mb-3">
                        All contracts are open-source and available on GitHub for review and auditing.
                      </p>
                      <a
                        href="https://github.com/GHX5T-SOL/IncryptOracle/tree/main/contracts"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                      >
                        View Contracts on GitHub →
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'examples' && (
              <div className="space-y-8">
                <section className="card-liquid-glass p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">Integration Examples</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Basic Price Feed Integration</h3>
                      <div className="bg-dark-900 rounded-lg p-4">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{`// 1. Install the SDK
npm install incrypt-oracle-sdk ethers

// 2. Import and initialize
import { IncryptOracle } from 'incrypt-oracle-sdk';

const oracle = new IncryptOracle({
  network: 'bsc-mainnet',
  rpcUrl: 'https://bsc-dataseed1.binance.org/'
});

// 3. Get price data
async function displayBitcoinPrice() {
  const btcData = await oracle.getPrice('BTC/USD');
  
  console.log(\`Bitcoin Price: $\${btcData.value}\`);
  console.log(\`Data Confidence: \${btcData.confidence}%\`);
  console.log(\`Last Updated: \${btcData.lastUpdated}\`);
  
  // Only use data if confidence is high enough
  if (btcData.confidence >= 90) {
    // Your application logic here
    updatePriceDisplay(btcData.value);
  }
}`}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Real-time Price Monitoring</h3>
                      <div className="bg-dark-900 rounded-lg p-4">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{`import { IncryptOracle } from 'incrypt-oracle-sdk';

const oracle = new IncryptOracle({ network: 'bsc-mainnet' });

// Subscribe to real-time price updates
const subscription = oracle.subscribe('ETH/USD', {
  onData: (data) => {
    console.log('ETH price updated:', data.value);
    
    // Update your UI or trigger actions
    updateDashboard({
      price: data.value,
      confidence: data.confidence,
      timestamp: data.timestamp
    });
  },
  onError: (error) => {
    console.error('Subscription error:', error);
    // Handle error (show notification, retry, etc.)
  },
  onConnected: () => {
    console.log('Successfully connected to oracle');
  }
});

// Cleanup when done
// subscription.unsubscribe();`}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Prediction Market Integration</h3>
                      <div className="bg-dark-900 rounded-lg p-4">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{`import { ethers } from 'ethers';
import { IncryptOracle } from 'incrypt-oracle-sdk';

// Initialize with signer for write operations
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const oracle = new IncryptOracle({
  network: 'bsc-mainnet',
  signer: signer
});

// Create a prediction market
async function createPredictionMarket() {
  // First, create an oracle data feed
  const feedId = await oracle.createDataFeed(
    'ELECTION_2024',
    'US Presidential Election 2024 Winner',
    5 // Validation threshold
  );
  
  console.log('Data feed created:', feedId);
  
  // Then create market using that feed
  // (requires PredictionMarket contract interaction)
}`}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">React Application Example</h3>
                      <div className="bg-dark-900 rounded-lg p-4">
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{`import React from 'react';
import { useIncryptOracle, usePriceData } from 'incrypt-oracle-sdk/react';

function CryptoPriceTracker() {
  const { oracle, isConnected, error } = useIncryptOracle({
    network: 'bsc-mainnet'
  });
  
  const { data: btcPrice, loading: btcLoading } = usePriceData(oracle, 'BTC/USD');
  const { data: ethPrice, loading: ethLoading } = usePriceData(oracle, 'ETH/USD');
  
  if (!isConnected) return <div>Connecting to oracle...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2>Live Crypto Prices</h2>
      
      <div>
        <h3>Bitcoin</h3>
        {btcLoading ? (
          <p>Loading BTC price...</p>
        ) : (
          <div>
            <p>Price: \${btcPrice?.value.toFixed(2)}</p>
            <p>Confidence: {btcPrice?.confidence}%</p>
            <small>Updated: {btcPrice?.lastUpdated.toLocaleString()}</small>
          </div>
        )}
      </div>
      
      <div>
        <h3>Ethereum</h3>
        {ethLoading ? (
          <p>Loading ETH price...</p>
        ) : (
          <div>
            <p>Price: \${ethPrice?.value.toFixed(2)}</p>
            <p>Confidence: {ethPrice?.confidence}%</p>
          </div>
        )}
      </div>
    </div>
  );
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-8">
                <section className="card-liquid-glass p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">Security & Audits</h2>
                  
                  <div className="space-y-6 text-gray-300">
                    <p className="text-lg">
                      Security is paramount in oracle design. Incrypt Oracle implements multiple layers of protection 
                      against common attack vectors and manipulation attempts.
                    </p>

                    <h3 className="text-xl font-semibold text-white">Security Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          title: "Validator Reputation System",
                          description: "Validators build reputation over time. Poor performance results in reduced influence.",
                          icon: "⭐"
                        },
                        {
                          title: "Cryptographic Proofs",
                          description: "All data submissions include cryptographic proofs of authenticity.",
                          icon: "🔐"
                        },
                        {
                          title: "Multi-Source Aggregation",
                          description: "Data is collected from multiple independent sources and aggregated.",
                          icon: "🔗"
                        },
                        {
                          title: "Economic Incentives",
                          description: "Validators stake tokens and are penalized for malicious behavior.",
                          icon: "💰"
                        }
                      ].map((feature, index) => (
                        <div key={index} className="bg-dark-900/50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{feature.icon}</span>
                            <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                          </div>
                          <p className="text-sm text-gray-300">{feature.description}</p>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold text-white">Smart Contract Audits</h3>
                    <div className="bg-dark-900/50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-primary-400">Security Audit Report</h4>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">✅ Passed</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-semibold text-white mb-2">Audit Details</h5>
                          <div className="space-y-2 text-sm">
                            <div><span className="text-gray-400">Firm:</span> CertiK Security</div>
                            <div><span className="text-gray-400">Date:</span> December 2024</div>
                            <div><span className="text-gray-400">Score:</span> <span className="text-green-400">96/100</span></div>
                            <div><span className="text-gray-400">Issues:</span> 0 Critical, 0 High, 2 Low</div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-white mb-2">Coverage</h5>
                          <div className="space-y-1 text-sm">
                            <div>✅ Oracle core logic</div>
                            <div>✅ Validator management</div>
                            <div>✅ Data aggregation</div>
                            <div>✅ Economic incentives</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Link href="#" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                          View Full Audit Report →
                        </Link>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white">Best Practices</h3>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                      <h4 className="text-yellow-400 font-semibold mb-3">⚠️ Integration Guidelines</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Always check data confidence levels before using oracle data</li>
                        <li>• Implement appropriate staleness checks for your use case</li>
                        <li>• Use multiple oracles for critical decisions when possible</li>
                        <li>• Implement circuit breakers for extreme price movements</li>
                        <li>• Monitor oracle availability and failover mechanisms</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </motion.main>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mt-12 pt-8 border-t border-white/10"
        >
          <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>←</span>
            <span>Back to Home</span>
          </Link>
          
          <Link href="/sdk" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>SDK Integration</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
