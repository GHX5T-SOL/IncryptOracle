import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDownTrayIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';

const installationMethods = {
  npm: 'npm install incrypt-oracle-sdk',
  yarn: 'yarn add incrypt-oracle-sdk',
  pnpm: 'pnpm add incrypt-oracle-sdk'
};

const quickStartExamples = {
  basic: `import { IncryptOracle } from 'incrypt-oracle-sdk';

// Initialize the oracle
const oracle = new IncryptOracle({
  network: 'bsc-mainnet',
  rpcUrl: 'https://bsc-dataseed1.binance.org/'
});

// Get latest price
const btcPrice = await oracle.getPrice('BTC/USD');
console.log(\`BTC: $\${btcPrice.value}\`);`,

  advanced: `import { IncryptOracle, DataFeedManager } from 'incrypt-oracle-sdk';

class PriceTracker {
  constructor() {
    this.oracle = new IncryptOracle({
      network: 'bsc-mainnet',
      contractAddress: '0x...',
      signer: yourWalletSigner // ethers.js signer
    });
    
    this.feedManager = new DataFeedManager(this.oracle);
  }
  
  async trackMultiplePrices() {
    const feeds = ['BTC/USD', 'ETH/USD', 'BNB/USD'];
    
    // Subscribe to multiple feeds
    const subscriptions = feeds.map(feed => 
      this.oracle.subscribe(feed, {
        onData: (data) => this.handlePriceUpdate(feed, data),
        onError: (error) => console.error(\`Error for \${feed}:\`, error)
      })
    );
    
    return subscriptions;
  }
  
  handlePriceUpdate(feed, data) {
    console.log(\`\${feed} updated:\`, {
      price: data.value,
      confidence: data.confidence,
      timestamp: new Date(data.timestamp * 1000)
    });
  }
}`,

  react: `import React, { useState, useEffect } from 'react';
import { useIncryptOracle } from 'incrypt-oracle-sdk/react';

function PriceDisplay() {
  const { oracle, isConnected } = useIncryptOracle({
    network: 'bsc-mainnet'
  });
  
  const [btcPrice, setBtcPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!oracle || !isConnected) return;
    
    const fetchPrice = async () => {
      try {
        const price = await oracle.getPrice('BTC/USD');
        setBtcPrice(price);
      } catch (error) {
        console.error('Failed to fetch BTC price:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Subscribe to price updates
    const subscription = oracle.subscribe('BTC/USD', {
      onData: (data) => setBtcPrice(data)
    });
    
    fetchPrice();
    
    return () => subscription.unsubscribe();
  }, [oracle, isConnected]);
  
  if (loading) return <div>Loading BTC price...</div>;
  
  return (
    <div>
      <h2>Bitcoin Price</h2>
      <p>$\{btcPrice?.value || 'N/A'}</p>
      <small>Confidence: \{btcPrice?.confidence || 0}%</small>
    </div>
  );
}`
};

const apiMethods = [
  {
    name: 'constructor(config)',
    description: 'Initialize the Oracle SDK instance',
    params: [
      { name: 'config.network', type: 'string', required: true, description: 'Network identifier (bsc-mainnet, bsc-testnet)' },
      { name: 'config.rpcUrl', type: 'string', required: false, description: 'Custom RPC endpoint URL' },
      { name: 'config.contractAddress', type: 'string', required: false, description: 'Custom oracle contract address' },
      { name: 'config.signer', type: 'Signer', required: false, description: 'Ethers.js signer for write operations' }
    ],
    returns: 'IncryptOracle instance'
  },
  {
    name: 'getPrice(feedId)',
    description: 'Get the latest price for a specific data feed',
    params: [
      { name: 'feedId', type: 'string', required: true, description: 'Data feed identifier (e.g., "BTC/USD")' }
    ],
    returns: 'Promise<PriceData>',
    example: 'const btcPrice = await oracle.getPrice("BTC/USD");'
  },
  {
    name: 'subscribe(feedId, callbacks)',
    description: 'Subscribe to real-time updates for a data feed',
    params: [
      { name: 'feedId', type: 'string', required: true, description: 'Data feed identifier' },
      { name: 'callbacks.onData', type: 'function', required: true, description: 'Callback for data updates' },
      { name: 'callbacks.onError', type: 'function', required: false, description: 'Callback for errors' }
    ],
    returns: 'Subscription object with unsubscribe method',
    example: 'const sub = oracle.subscribe("ETH/USD", { onData: console.log });'
  },
  {
    name: 'getAllFeeds()',
    description: 'Get list of all available data feeds',
    params: [],
    returns: 'Promise<DataFeed[]>',
    example: 'const feeds = await oracle.getAllFeeds();'
  },
  {
    name: 'getValidator(address)',
    description: 'Get validator information by address',
    params: [
      { name: 'address', type: 'string', required: true, description: 'Validator wallet address' }
    ],
    returns: 'Promise<ValidatorInfo>',
    example: 'const validator = await oracle.getValidator("0x...");'
  }
];

export default function SDKPage() {
  const [activeTab, setActiveTab] = useState('npm');
  const [activeExample, setActiveExample] = useState('basic');
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [key]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

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
            <span className="text-gradient">JavaScript SDK</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Integrate Incrypt Oracle into your JavaScript applications with our comprehensive SDK. 
            Built for Node.js, React, and browser environments.
          </p>
          
          <div className="flex justify-center mt-8 space-x-4">
            <motion.a
              href="#installation"
              className="btn-holographic"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              Get Started
            </motion.a>
            
            <motion.a
              href="https://github.com/GHX5T-SOL/IncryptOracle/tree/main/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white transition-all duration-300 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View on GitHub
            </motion.a>
          </div>
        </motion.div>

        {/* Installation Section */}
        <section id="installation" className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card-liquid-glass p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Install the Incrypt Oracle SDK using your preferred package manager:
              </p>
              
              {/* Package Manager Tabs */}
              <div className="flex space-x-1 bg-dark-900/50 rounded-lg p-1 mb-4">
                {Object.keys(installationMethods).map((method) => (
                  <button
                    key={method}
                    onClick={() => setActiveTab(method)}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                      activeTab === method
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
              
              {/* Installation Command */}
              <div className="bg-dark-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 uppercase">{activeTab}</span>
                  <button
                    onClick={() => copyToClipboard(installationMethods[activeTab as keyof typeof installationMethods], `install-${activeTab}`)}
                    className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 text-sm"
                  >
                    {copiedStates[`install-${activeTab}`] ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    )}
                    <span>{copiedStates[`install-${activeTab}`] ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-gray-300">
                  <code>{installationMethods[activeTab as keyof typeof installationMethods]}</code>
                </pre>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">📋 Requirements</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Node.js 16.0.0 or higher</li>
                <li>• ethers.js ^6.0.0 (peer dependency)</li>
                <li>• A BSC-compatible wallet or signer for write operations</li>
              </ul>
            </div>
          </motion.div>
        </section>

        {/* Quick Start Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card-liquid-glass p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Quick Start Examples</h2>
            
            {/* Example Tabs */}
            <div className="flex space-x-1 bg-dark-900/50 rounded-lg p-1 mb-6">
              {Object.keys(quickStartExamples).map((example) => (
                <button
                  key={example}
                  onClick={() => setActiveExample(example)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 capitalize ${
                    activeExample === example
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {example}
                </button>
              ))}
            </div>
            
            {/* Example Code */}
            <div className="bg-dark-900 rounded-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <span className="text-sm text-gray-400 uppercase">JavaScript</span>
                <button
                  onClick={() => copyToClipboard(quickStartExamples[activeExample as keyof typeof quickStartExamples], `example-${activeExample}`)}
                  className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 text-sm"
                >
                  {copiedStates[`example-${activeExample}`] ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  )}
                  <span>{copiedStates[`example-${activeExample}`] ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-4">
                <pre className="text-gray-300 text-sm overflow-x-auto">
                  <code>{quickStartExamples[activeExample as keyof typeof quickStartExamples]}</code>
                </pre>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              {activeExample === 'basic' && '💡 Basic usage for getting oracle data in any JavaScript environment.'}
              {activeExample === 'advanced' && '🚀 Advanced patterns for production applications with error handling and subscriptions.'}
              {activeExample === 'react' && '⚛️ React hooks integration for seamless oracle data in your React components.'}
            </div>
          </motion.div>
        </section>

        {/* API Reference */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card-liquid-glass p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">API Reference</h2>
            
            <div className="space-y-6">
              {apiMethods.map((method, index) => (
                <div key={index} className="bg-dark-900/50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-mono text-primary-400 mb-2">{method.name}</h3>
                      <p className="text-gray-300">{method.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">METHOD</span>
                    </div>
                  </div>
                  
                  {/* Parameters */}
                  {method.params.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-3">Parameters:</h4>
                      <div className="space-y-2">
                        {method.params.map((param, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 bg-dark-950/50 rounded p-3">
                            <div className="flex items-center space-x-2 mb-1 sm:mb-0">
                              <code className="text-primary-300 text-sm font-mono">{param.name}</code>
                              <span className="text-xs text-gray-400">({param.type})</span>
                              {param.required && <span className="text-red-400 text-xs">*</span>}
                            </div>
                            <p className="text-gray-300 text-sm flex-1">{param.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Returns */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Returns:</h4>
                    <code className="text-primary-300 text-sm">{method.returns}</code>
                  </div>
                  
                  {/* Example */}
                  {method.example && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Example:</h4>
                      <div className="bg-dark-950 rounded p-3">
                        <code className="text-gray-300 text-sm">{method.example}</code>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* TypeScript Support */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card-liquid-glass p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">TypeScript Support</h2>
            
            <p className="text-gray-300 mb-6">
              The Incrypt Oracle SDK includes comprehensive TypeScript definitions for better development experience.
            </p>
            
            <div className="bg-dark-900 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">TYPESCRIPT</span>
                <button
                  onClick={() => copyToClipboard(`interface PriceData {
  value: number;
  confidence: number;
  timestamp: number;
  feedId: string;
}

interface OracleConfig {
  network: 'bsc-mainnet' | 'bsc-testnet';
  rpcUrl?: string;
  contractAddress?: string;
  signer?: ethers.Signer;
}

declare class IncryptOracle {
  constructor(config: OracleConfig);
  getPrice(feedId: string): Promise<PriceData>;
  subscribe(feedId: string, callbacks: SubscriptionCallbacks): Subscription;
  getAllFeeds(): Promise<DataFeed[]>;
}`, 'typescript')}
                  className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 text-sm"
                >
                  {copiedStates['typescript'] ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <DocumentDuplicateIcon className="w-4 h-4" />
                  )}
                  <span>{copiedStates['typescript'] ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-gray-300 text-sm overflow-x-auto">
                <code>{`interface PriceData {
  value: number;
  confidence: number;
  timestamp: number;
  feedId: string;
}

interface OracleConfig {
  network: 'bsc-mainnet' | 'bsc-testnet';
  rpcUrl?: string;
  contractAddress?: string;
  signer?: ethers.Signer;
}

declare class IncryptOracle {
  constructor(config: OracleConfig);
  getPrice(feedId: string): Promise<PriceData>;
  subscribe(feedId: string, callbacks: SubscriptionCallbacks): Subscription;
  getAllFeeds(): Promise<DataFeed[]>;
}`}</code>
              </pre>
            </div>
          </motion.div>
        </section>

        {/* Error Handling */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card-liquid-glass p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Error Handling</h2>
            
            <p className="text-gray-300 mb-6">
              The SDK provides comprehensive error handling with specific error types for different scenarios.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  type: 'NetworkError',
                  description: 'RPC connection issues or network problems',
                  example: 'catch (error) { if (error instanceof NetworkError) ... }'
                },
                {
                  type: 'ContractError', 
                  description: 'Smart contract execution failures',
                  example: 'Contract not found or method reverted'
                },
                {
                  type: 'DataError',
                  description: 'Invalid or stale oracle data',
                  example: 'Data confidence below threshold'
                },
                {
                  type: 'ValidationError',
                  description: 'Invalid parameters or configuration',
                  example: 'Invalid feed ID or network configuration'
                }
              ].map((error, index) => (
                <div key={index} className="bg-dark-900/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">{error.type}</h3>
                  <p className="text-gray-300 text-sm mb-2">{error.description}</p>
                  <code className="text-xs text-gray-400 bg-dark-950 rounded px-2 py-1">{error.example}</code>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Getting Help */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card-liquid-glass p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Need Help?</h2>
            
            <p className="text-gray-300 mb-8">
              Join our developer community and get support from our team and other developers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/docs" className="group bg-dark-900/50 rounded-lg p-6 hover:bg-dark-900/70 transition-all duration-300">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-white mb-2">Documentation</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300">Complete guides and tutorials</p>
              </Link>
              
              <a href="https://discord.gg/incrypt" className="group bg-dark-900/50 rounded-lg p-6 hover:bg-dark-900/70 transition-all duration-300">
                <div className="text-3xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-white mb-2">Discord</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300">Community support and discussions</p>
              </a>
              
              <a href="https://github.com/GHX5T-SOL/IncryptOracle/issues" target="_blank" rel="noopener noreferrer" className="group bg-dark-900/50 rounded-lg p-6 hover:bg-dark-900/70 transition-all duration-300">
                <div className="text-3xl mb-4">🐛</div>
                <h3 className="text-lg font-semibold text-white mb-2">GitHub Issues</h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300">Report bugs and request features</p>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mt-12 pt-8 border-t border-white/10"
        >
          <Link href="/docs" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>←</span>
            <span>Documentation</span>
          </Link>
          
          <Link href="/predict" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>Try IncryptPredict</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
