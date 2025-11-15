import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const phases = [
  {
    phase: 'Phase 1: Foundation',
    status: 'complete',
    icon: '✅',
    description: 'Core infrastructure and initial deployment',
    items: [
      { task: 'Core smart contracts development (Oracle, Market, DAO, Token, Revenue)', completed: true },
      { task: 'BSC testnet deployment and verification', completed: true },
      { task: 'Basic frontend interface with wallet connection', completed: true },
      { task: 'JavaScript SDK v1.0 with React hooks', completed: true },
      { task: 'Validator node service implementation', completed: true },
      { task: 'Security fixes and optimizations', completed: true },
      { task: 'Integration and edge case test suites', completed: true },
      { task: 'Documentation (SDK, Validator Guide, Deployment)', completed: true }
    ]
  },
  {
    phase: 'Phase 2: Launch',
    status: 'in-progress',
    icon: '🚀',
    description: 'Production launch and mainnet deployment',
    items: [
      { task: 'Optimistic resolution mechanism', completed: true },
      { task: 'Domain-specific oracle templates', completed: true },
      { task: 'Revenue features (subscription service, premium markets)', completed: true },
      { task: 'Frontend blockchain integration (real-time updates)', completed: true },
      { task: 'Final security audit (CertiK/Halborn)', completed: false },
      { task: 'BSC mainnet deployment', completed: false },
      { task: '$IO token launch on Four Meme', completed: false },
      { task: 'IncryptPredict production launch', completed: false },
      { task: 'Validator onboarding program', completed: false }
    ]
  },
  {
    phase: 'Phase 3: Growth',
    status: 'planned',
    icon: '📈',
    description: 'Expansion and ecosystem development',
    items: [
      { task: 'Mobile app (React Native/iOS/Android)', completed: false },
      { task: 'Additional data sources (stock prices, forex, commodities)', completed: false },
      { task: 'Third-party protocol integrations (DeFi lending, derivatives)', completed: false },
      { task: 'Cross-chain expansion (Polygon, Arbitrum, Optimism)', completed: false },
      { task: 'Advanced analytics dashboard', completed: false },
      { task: 'API rate limiting and tier management UI', completed: false }
    ]
  },
  {
    phase: 'Phase 4: Scale',
    status: 'future',
    icon: '🌍',
    description: 'Global scale and advanced features',
    items: [
      { task: 'Multi-outcome markets (beyond binary)', completed: false },
      { task: 'Conditional markets and market dependencies', completed: false },
      { task: 'Institutional oracle services (enterprise tier)', completed: false },
      { task: 'Automated market making algorithms', completed: false },
      { task: 'Historical data APIs', completed: false },
      { task: 'GraphQL endpoint for complex queries', completed: false },
      { task: 'WebSocket connections for real-time data streaming', completed: false }
    ]
  }
];

export default function RoadmapPage() {
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
            <span className="text-gradient">Development Roadmap</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our comprehensive development roadmap outlines the evolution of Incrypt Oracle from foundation 
            to global scale, with clear milestones and deliverables.
          </p>
        </motion.div>

        {/* Roadmap Timeline */}
        <div className="space-y-12">
          {phases.map((phase, phaseIndex) => (
            <motion.div
              key={phaseIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIndex * 0.2 }}
              className="relative"
            >
              {/* Phase Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`text-4xl ${phase.status === 'complete' ? 'text-green-400' : phase.status === 'in-progress' ? 'text-primary-400 animate-pulse' : 'text-gray-500'}`}>
                  {phase.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-3xl font-bold text-white">{phase.phase}</h2>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      phase.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                      phase.status === 'in-progress' ? 'bg-primary-500/20 text-primary-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {phase.status === 'complete' ? 'COMPLETE' : phase.status === 'in-progress' ? 'IN PROGRESS' : phase.status === 'planned' ? 'PLANNED' : 'FUTURE'}
                    </span>
                  </div>
                  <p className="text-gray-300">{phase.description}</p>
                </div>
              </div>

              {/* Tasks */}
              <div className="card-liquid-glass p-6">
                <div className="space-y-4">
                  {phase.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        item.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-dark-900/50'
                      }`}
                    >
                      <div className={`mt-1 ${item.completed ? 'text-green-400' : 'text-gray-500'}`}>
                        {item.completed ? '✓' : '○'}
                      </div>
                      <span className={`flex-1 ${item.completed ? 'text-gray-300 line-through' : 'text-white'}`}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 card-liquid-glass p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Overall Progress</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Foundation', value: 100, color: 'green' },
              { label: 'Launch', value: 44, color: 'primary' },
              { label: 'Growth', value: 0, color: 'gray' },
              { label: 'Scale', value: 0, color: 'gray' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  stat.color === 'green' ? 'text-green-400' :
                  stat.color === 'primary' ? 'text-primary-400' :
                  'text-gray-500'
                }`}>
                  {stat.value}%
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
                <div className="mt-3 h-2 bg-dark-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      stat.color === 'green' ? 'bg-green-500' :
                      stat.color === 'primary' ? 'bg-primary-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
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
          
          <Link href="/whitepaper" className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors">
            <span>Whitepaper & Revenue</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

