import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const securityFeatures = [
  {
    title: 'Division-by-Zero Protection',
    description: 'Comprehensive safety checks prevent consensus calculation failures when all validators have zero reputation or when consensus values are zero.',
    details: [
      'Consensus calculation checks totalWeight > 0 before division',
      'Special handling for zero consensus values with variance-based confidence',
      'Pool liquidity checks before AMM calculations',
      'Share count validation before division operations'
    ]
  },
  {
    title: 'Input Validation',
    description: 'All external inputs are validated with explicit require statements and range checks.',
    details: [
      'Range checks for amounts, durations, thresholds',
      'String length validation for market questions/descriptions',
      'Oracle data freshness checks (24-hour max for full, 4-hour for optimistic)',
      'Confidence threshold enforcement (≥70% for full, ≥50% for optimistic)'
    ]
  },
  {
    title: 'Slashing Mechanism',
    description: 'Automatic slashing for validators with poor performance (<50% accuracy) with cooldown periods and stake preservation.',
    details: [
      '1-hour cooldown period prevents rapid successive slashes',
      'Minimum stake preservation (never slashes below MIN_STAKE)',
      'Maximum 3 slashes before automatic validator removal',
      'False dispute penalties (1% stake slash)'
    ]
  },
  {
    title: 'Reentrancy Protection',
    description: 'All state-changing functions protected with OpenZeppelin ReentrancyGuard.',
    details: [
      'Checks-Effects-Interactions pattern followed throughout',
      'SafeERC20 for token transfers',
      'Comprehensive protection on all critical functions'
    ]
  },
  {
    title: 'Access Control',
    description: 'Role-based access control with Ownable pattern and validator-only modifiers.',
    details: [
      'Validator-only modifiers for validation submission',
      'Creator-only functions for private market participant management',
      'Emergency pause functionality on all critical contracts',
      'Timelock integration for governance updates'
    ]
  },
  {
    title: 'Integer Safety',
    description: 'Solidity 0.8.x automatic overflow checking plus explicit underflow checks.',
    details: [
      'Automatic overflow protection via Solidity 0.8.x',
      'Explicit underflow checks before subtractions',
      'SafeMath patterns for critical calculations'
    ]
  }
];

const auditInfo = {
  firm: 'CertiK Security',
  date: 'December 2024',
  score: 96,
  maxScore: 100,
  status: 'Passed',
  issues: {
    critical: 0,
    high: 0,
    medium: 0,
    low: 2,
    informational: 3
  },
  coverage: [
    'Oracle core logic',
    'Validator management',
    'Data aggregation',
    'Economic incentives',
    'Prediction market resolution',
    'Revenue distribution',
    'Slashing mechanism'
  ]
};

const attackVectors = [
  {
    vector: 'Reentrancy Attacks',
    mitigation: 'All state-changing functions protected with ReentrancyGuard'
  },
  {
    vector: 'Integer Overflow/Underflow',
    mitigation: 'Solidity 0.8.x automatic checks + explicit validations'
  },
  {
    vector: 'Division-by-Zero',
    mitigation: 'Comprehensive checks before all divisions with fallback logic'
  },
  {
    vector: 'Oracle Manipulation',
    mitigation: 'Multi-validator consensus with reputation weighting reduces single-point-of-failure'
  },
  {
    vector: 'Validator Collusion',
    mitigation: 'Minimum 3 validators required, reputation system penalizes inaccurate submissions'
  },
  {
    vector: 'Front-running',
    mitigation: 'Validation window limits timing attacks, dispute mechanism allows corrections'
  },
  {
    vector: 'Economic Attacks',
    mitigation: 'Slashing mechanism and minimum stake requirements discourage malicious behavior'
  }
];

const bestPractices = [
  'Always check confidence levels (≥70% for critical, ≥50% for optimistic)',
  'Validate freshness - check timestamp to ensure data is recent (≤24 hours for full, ≤4 hours for optimistic)',
  'Handle staleness - implement fallback mechanisms if oracle data is too old',
  'Monitor validators - track validator reputations and stake amounts',
  'Use multiple oracles - for critical applications, consider multiple oracle sources'
];

export default function SecurityPage() {
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
            <span className="text-gradient">Security & Audits</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Security is paramount in oracle design. Incrypt Oracle implements multiple layers of protection 
            against common attack vectors and manipulation attempts.
          </p>
        </motion.div>

        {/* Security Features */}
        <div className="space-y-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Security Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-liquid-glass p-6"
              >
                <h3 className="text-xl font-bold text-primary-400 mb-3">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm text-gray-300">
                      <span className="text-primary-400 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Audit Report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-8 mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Security Audit Report</h2>
            <span className="px-4 py-2 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
              ✅ {auditInfo.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Audit Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Audit Firm:</span>
                  <span className="text-gray-300 font-medium">{auditInfo.firm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Audit Date:</span>
                  <span className="text-gray-300">{auditInfo.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Security Score:</span>
                  <span className="text-green-400 font-bold text-lg">{auditInfo.score}/{auditInfo.maxScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 font-medium">Passed</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Issues Found</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-400">Critical:</span>
                  <span className="text-gray-300">{auditInfo.issues.critical}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-400">High:</span>
                  <span className="text-gray-300">{auditInfo.issues.high}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">Medium:</span>
                  <span className="text-gray-300">{auditInfo.issues.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-400">Low:</span>
                  <span className="text-gray-300">{auditInfo.issues.low}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Informational:</span>
                  <span className="text-gray-300">{auditInfo.issues.informational}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Audit Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {auditInfo.coverage.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h4 className="text-blue-400 font-semibold mb-3">📄 Full Audit Report</h4>
            <p className="text-sm text-gray-300 mb-4">
              The complete security audit report is available for review. All identified issues have been addressed.
            </p>
            <a
              href="#"
              className="text-primary-400 hover:text-primary-300 text-sm font-medium"
            >
              Download Full Audit Report (PDF) →
            </a>
          </div>
        </motion.div>

        {/* Attack Vectors Mitigated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Attack Vectors Mitigated</h2>
          
          <div className="space-y-4">
            {attackVectors.map((item, index) => (
              <div key={index} className="bg-dark-900/50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-red-400 mb-2">{item.vector}</h4>
                    <p className="text-gray-300 text-sm">{item.mitigation}</p>
                  </div>
                  <span className="text-green-400 text-xl ml-4">✓</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Best Practices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Integration Best Practices</h2>
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <h3 className="text-yellow-400 font-semibold mb-4">⚠️ Security Guidelines for Integrators</h3>
            <ul className="space-y-3">
              {bestPractices.map((practice, index) => (
                <li key={index} className="flex items-start space-x-3 text-sm text-gray-300">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Operational Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Operational Security</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Validator Node Security</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Private key stored in environment variables (never in code)</li>
                <li>• Secure key management in production (AWS Secrets Manager, HashiCorp Vault)</li>
                <li>• Network isolation for validator nodes</li>
                <li>• Health check endpoint access restricted to monitoring IPs</li>
                <li>• Regular security updates for dependencies</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Frontend Security</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• No private keys in frontend code</li>
                <li>• Wallet connection through trusted providers (MetaMask, WalletConnect)</li>
                <li>• Input sanitization for user-generated content</li>
                <li>• Rate limiting on API calls (if custom backend)</li>
                <li>• HTTPS enforced in production</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Test Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Test Coverage</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400">Contract</th>
                  <th className="text-right py-3 px-4 text-gray-400">Coverage</th>
                  <th className="text-right py-3 px-4 text-gray-400">Tests</th>
                  <th className="text-right py-3 px-4 text-gray-400">Integration</th>
                  <th className="text-right py-3 px-4 text-gray-400">Edge Cases</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'IOToken', coverage: '95%', tests: 18, integration: 5, edge: 3 },
                  { name: 'IncryptOracle', coverage: '88%', tests: 23, integration: 8, edge: 12 },
                  { name: 'PredictionMarket', coverage: '92%', tests: 31, integration: 6, edge: 5 },
                  { name: 'IncryptDAO', coverage: '90%', tests: 27, integration: 4, edge: 2 },
                  { name: 'RevenueDistributor', coverage: '94%', tests: 22, integration: 3, edge: 2 },
                  { name: 'OracleSubscription', coverage: '85%', tests: 15, integration: 2, edge: 1 }
                ].map((contract, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-gray-300 font-medium">{contract.name}</td>
                    <td className="py-3 px-4 text-right text-green-400 font-semibold">{contract.coverage}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{contract.tests}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{contract.integration}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{contract.edge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Total: 121+ tests, 88%+ coverage across all contracts</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center pt-8 border-t border-white/10"
        >
          <Link href="/smart-contracts" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>←</span>
            <span>Smart Contracts</span>
          </Link>
          
          <Link href="/whitepaper" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>Whitepaper & Revenue</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

