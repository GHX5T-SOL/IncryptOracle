'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { codeExamples } from '../utils/codeExamples';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CpuChipIcon,
  UserGroupIcon,
  BanknotesIcon,
  ClockIcon,
  FireIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';

// Helper Components
function StatCard({ title, value, change, icon: Icon }: any) {
  const isPositive = change > 0;
  
  return (
    <div className="card-liquid-glass p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary-500/20 rounded-lg">
          <Icon className="w-6 h-6 text-primary-400" />
        </div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? (
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div className="mb-2">
        <h3 className="text-2xl font-bold text-white">{value.toLocaleString()}</h3>
      </div>
      
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-900/90 border border-primary-500/20 rounded-lg p-3 backdrop-blur-sm">
        <p className="text-gray-300 text-sm">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-primary-400 font-semibold">
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Mock analytics data
const mockData = {
  overview: {
    totalUsers: 5247,
    totalVolume: 2500000,
    activeMarkets: 23,
    oracleUptime: 99.97,
    validators: 3,
    totalStaked: 850000
  },
  volumeData: [
    { date: '2025-10-26', volume: 125000 },
    { date: '2025-10-27', volume: 171000 },
    { date: '2025-10-28', volume: 198500 },
    { date: '2025-10-29', volume: 223000 },
    { date: '2025-10-30', volume: 247500 },
    { date: '2025-10-31', volume: 265000 },
    { date: '2025-11-01', volume: 289000 }
  ],
  marketCategories: [
    { name: 'Crypto', value: 45, color: '#ffb500' },
    { name: 'Sports', value: 25, color: '#10b981' },
    { name: 'Politics', value: 15, color: '#3b82f6' },
    { name: 'Economics', value: 10, color: '#8b5cf6' },
    { name: 'Technology', value: 5, color: '#f59e0b' }
  ],
  userGrowth: [
    { month: 'Oct 2025', users: 1200 },
    { month: 'Early Nov 2025', users: 2100 },
    { month: 'Mid Nov 2025', users: 3800 },
    { month: 'Nov 18, 2025', users: 5247 }
  ],
  oracleMetrics: [
    { time: '00:00', uptime: 100, latency: 1.2 },
    { time: '04:00', uptime: 99.8, latency: 1.1 },
    { time: '08:00', uptime: 100, latency: 0.9 },
    { time: '12:00', uptime: 99.9, latency: 1.0 },
    { time: '16:00', uptime: 100, latency: 1.1 },
    { time: '20:00', uptime: 100, latency: 1.3 }
  ],
  topMarkets: [
    { question: 'Will Bitcoin close above $90k before November 30, 2025?', volume: 450000, traders: 1247 },
    { question: 'Will ETH staking deposits reach 32M ETH by November 18, 2025?', volume: 320000, traders: 892 },
    { question: 'Will BNB Chain gas fees average below 3 gwei during November 2025?', volume: 280000, traders: 743 },
    { question: 'Will the Fed announce an additional rate cut in November 2025?', volume: 190000, traders: 567 },
    { question: 'Will Solana daily TPS average stay above 2,500 this November?', volume: 150000, traders: 445 }
  ]
};

const sections = [
  { id: 'introduction', title: 'Introduction', icon: '📖' },
  { id: 'features', title: 'Features', icon: '✨' },
  { id: 'architecture', title: 'Architecture', icon: '🏗️' },
  { id: 'ai-validator', title: 'AI Validator', icon: '🤖' },
  { id: 'smart-contracts', title: 'Smart Contracts', icon: '📜' },
  { id: 'security', title: 'Security & Audits', icon: '🛡️' },
  { id: 'roadmap', title: 'Roadmap', icon: '🎯' },
  { id: 'tokenomics', title: 'Tokenomics & Revenue', icon: '💰' },
  { id: 'analytics', title: 'Analytics', icon: '📊' },
  { id: 'reports', title: 'Testnet Reports', icon: '📋' },
  { id: 'api-reference', title: 'API Reference', icon: '📡' },
  { id: 'examples', title: 'Examples', icon: '💡' },
  { id: 'technical-specs', title: 'Technical Specifications', icon: '🔬' },
  { id: 'testing', title: 'Testing & Coverage', icon: '✅' },
  { id: 'deployment', title: 'Deployment', icon: '🌐' },
  { id: 'contributing', title: 'Contributing', icon: '🤝' }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [activeTab, setActiveTab] = useState('javascript');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Handle smooth scrolling when TOC item is clicked
  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 100; // Account for navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for navbar

      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set refs for sections
  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
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
            <span className="text-gradient">Complete Documentation</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive guide to Incrypt Oracle - Everything you need to know about our decentralized oracle infrastructure, 
            prediction markets, smart contracts, and ecosystem.
          </p>
          <div className="mt-6 inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              🚧 Private beta as of November 18, 2025 — metrics, integrations, and partnerships shown here are testnet simulations
              and internal targets. No third-party firms have formally audited or endorsed the protocol yet.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation - Sticky TOC */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/4"
          >
            <div className="card-liquid-glass p-6 sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Table of Contents</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 cursor-pointer relative z-10 pointer-events-auto ${
                      activeSection === section.id
                        ? 'bg-primary-500/20 text-primary-400 border-l-2 border-primary-500'
                        : 'text-gray-300 hover:text-primary-400 hover:bg-white/5'
                    }`}
                    aria-label={`View ${section.title} section`}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span>{section.icon}</span>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-3/4 space-y-16"
          >
            {/* Introduction Section */}
            <section id="introduction" ref={setSectionRef('introduction')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">📖 Introduction</h2>
                
                <p className="text-lg leading-relaxed text-gray-300 mb-6">
                  <strong>Incrypt Oracle</strong> is a sophisticated, production-grade decentralized oracle infrastructure 
                  built on Binance Smart Chain (BSC) specifically architected for prediction markets. The platform leverages 
                  a multi-validator consensus mechanism with reputation-weighted validation, optimistic resolution with 
                  rapid dispute windows (4 hours vs industry standard 24-48 hours), and a comprehensive revenue model 
                  through subscription services and premium market features. The entire system is powered by the native 
                  $IO token, which serves dual purposes as both a governance mechanism and a staking/validation requirement 
                  for network participants.
                </p>

                <h3 className="text-xl font-semibold text-white mt-8 mb-4">What Makes Incrypt Oracle Different?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-primary-400 mb-2">⚡ Industry-Leading Resolution Speed</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>4-Hour Optimistic Resolution</strong>: Markets resolve in 1-4 hours with a 4-hour dispute window, 
                      compared to industry standards of 24-48 hours (UMA) or 12+ hours (Polymarket).
                    </p>
                    <p className="text-xs text-primary-300">
                      Requires only ≥50% validator agreement vs 100% for full consensus. Result: 6-12x faster than traditional oracle systems.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">🤖 Revolutionary AI Validator Network</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>Automatic API Discovery</strong>: AI validators automatically discover 10+ relevant APIs for any 
                      prediction market question without manual curation.
                    </p>
                    <p className="text-xs text-purple-300">
                      Uses Hugging Face models (Meta-Llama-3-8B-Instruct) for intelligent analysis. 24/7 availability with transparent on-chain reasoning.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">✅ Production-Ready Deployment</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>BSC Testnet Deployment</strong>: All core contracts deployed and verified on Binance Smart Chain Testnet.
                    </p>
                    <p className="text-xs text-green-300">
                      All smart contracts verified on BSCScan. Active validators, data feeds, and markets running on testnet. Mainnet ready.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-2">💰 Sustainable Revenue Model</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>Multiple Revenue Streams</strong>: Trading fees (2%), API subscriptions (tiered pricing), and market creation fees.
                    </p>
                    <p className="text-xs text-yellow-300">
                      50/50 revenue split between token holders (stakers) and treasury for long-term sustainability.
                    </p>
                  </div>
                </div>
                
                <div className="bg-dark-900/50 rounded-lg p-4 mt-4">
                  <h4 className="text-lg font-semibold text-white mb-3">🎯 Additional Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-2">
                      <span className="text-primary-400 mt-1">•</span>
                      <span className="text-sm text-gray-300"><strong>Reputation-Weighted Consensus</strong> - Validators build reputation over time, with more accurate validators having higher weight in consensus calculations</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-primary-400 mt-1">•</span>
                      <span className="text-sm text-gray-300"><strong>Advanced Security</strong> - Division-by-zero protection, input validation, slashing mechanism, reentrancy guards, and comprehensive test coverage (88%+)</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mt-8 mb-4">Supported Data Types</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Crypto Prices', icon: '₿' },
                    { name: 'Sports Events', icon: '⚽' },
                    { name: 'Elections', icon: '🗳️' },
                    { name: 'Weather Data', icon: '🌤️' }
                      ].map((category, index) => (
                    <div key={index} className="bg-dark-900/50 rounded-lg p-4 text-center">
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <div className="text-sm text-gray-300">{category.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

            {/* Features Section */}
            <section id="features" ref={setSectionRef('features')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">✨ Features</h2>
                  
                  <div className="space-y-6">
                    <div>
                    <h3 className="text-xl font-semibold text-white mb-4">🎯 Oracle Infrastructure</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Decentralized Validation</strong> - Multiple validator nodes ensure data integrity</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Real-time Data Feeds</strong> - Sub-second oracle updates with minimal gas fees</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>High Confidence Scoring</strong> - Reputation-weighted consensus mechanism</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Prediction Market Optimized</strong> - Purpose-built for outcome resolution</span>
                      </li>
                    </ul>
                    </div>

                    <div>
                    <h3 className="text-xl font-semibold text-white mb-4">🎲 IncryptPredict Demo</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Create Markets</strong> - Launch prediction markets on any event</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>AMM Trading</strong> - Automated market maker for outcome shares</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Real-time Odds</strong> - Live price discovery and liquidity management</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Instant Settlement</strong> - Oracle-powered automatic resolution</span>
                      </li>
                    </ul>
                        </div>
                        
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">🏛️ DAO Governance</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Proposal System</strong> - Submit and vote on platform improvements</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Treasury Management</strong> - Community-controlled fund allocation</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Revenue Distribution</strong> - 50/50 split between holders and treasury</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Validator Governance</strong> - Stake-weighted voting on oracle parameters</span>
                      </li>
                    </ul>
                    </div>

                    <div>
                    <h3 className="text-xl font-semibold text-white mb-4">🛠️ Developer Tools</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>JavaScript SDK</strong> - Easy integration with comprehensive documentation</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>React Hooks</strong> - Ready-to-use hooks for React applications</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>TypeScript Support</strong> - Full type definitions for better DX</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary-400 mt-1">•</span>
                        <span><strong>Multi-chain Ready</strong> - BSC Mainnet, Testnet, and local development</span>
                      </li>
                    </ul>
                      </div>
                    </div>
                  </div>
                </section>

            {/* Architecture Section */}
            <section id="architecture" ref={setSectionRef('architecture')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">🏗️ Technical Architecture</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">System Architecture Overview</h3>
                    <p className="text-gray-300 mb-4">
                      Incrypt Oracle consists of several interconnected components working together to provide 
                      decentralized oracle services:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'Core Smart Contracts', desc: 'Oracle, Market, DAO, Token, Revenue contracts' },
                        { name: 'Validator Nodes', desc: 'Off-chain services that fetch and submit data' },
                        { name: 'Frontend Application', desc: 'Next.js web interface for users' },
                        { name: 'JavaScript SDK', desc: 'Developer library for easy integration' }
                      ].map((component, i) => (
                        <div key={i} className="bg-dark-900/50 rounded-lg p-4">
                          <h4 className="text-primary-400 font-semibold mb-2">{component.name}</h4>
                          <p className="text-sm text-gray-300">{component.desc}</p>
                      </div>
                      ))}
                      </div>
                      </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Consensus Mechanism</h3>
                      <div className="bg-dark-900/50 rounded-lg p-6">
                      <p className="text-gray-300 mb-4">
                        Incrypt Oracle uses a reputation-weighted consensus algorithm where validators submit 
                        data values and the final consensus is calculated as:
                      </p>
                      <div className="bg-dark-950 rounded p-4 font-mono text-sm text-gray-300">
                        consensusValue = Σ(values[i] × reputations[i]) / Σ(reputations[i])
                      </div>
                      <p className="text-sm text-gray-400 mt-4">
                        This ensures that more accurate validators (with higher reputation) have greater influence 
                        on the final consensus value.
                      </p>
                      </div>
                    </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Data Flow</h3>
                    <div className="bg-dark-900/50 rounded-lg p-6">
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
              </div>
              </div>
            </section>

            {/* AI Validator Section */}
            <section id="ai-validator" ref={setSectionRef('ai-validator')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">🤖 AI Validator</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Overview</h3>
                    <p className="text-gray-300 mb-4">
                      Incrypt Oracle features a revolutionary AI-powered validator that combines artificial intelligence 
                      with automatic API discovery to provide faster, more accurate oracle resolutions. Inspired by Sora Oracle&apos;s 
                      agentic approach, our AI validator uses Hugging Face models to analyze prediction market questions, 
                      automatically discover relevant data sources, and provide intelligent reasoning for each validation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {[
                        { 
                          title: 'Automatic API Discovery', 
                          desc: 'AI automatically discovers 10+ relevant APIs for any prediction market question without pre-registration. Searches RapidAPI, APIs.guru, and known sources.',
                          icon: '🔍'
                        },
                        { 
                          title: 'Hugging Face Integration', 
                          desc: 'Uses state-of-the-art language models (Meta-Llama-3-8B-Instruct) to analyze questions, synthesize data, and provide detailed reasoning.',
                          icon: '🧠'
                        },
                        { 
                          title: 'Multi-Source Validation', 
                          desc: 'Fetches data from multiple discovered APIs and calculates consensus using median values and variance analysis for robust results.',
                          icon: '📊'
                        },
                        { 
                          title: 'Intelligent Reasoning', 
                          desc: 'Provides detailed reasoning and metadata for each validation, including confidence scores, data sources used, and model information.',
                          icon: '💡'
                        },
                        { 
                          title: 'Higher Starting Reputation', 
                          desc: 'AI validators start with 1200 reputation (vs 1000 for human validators) and maintain reputation through accurate validations.',
                          icon: '⭐'
                        },
                        { 
                          title: 'Hybrid Consensus', 
                          desc: 'Works seamlessly with human validators in reputation-weighted consensus, combining AI speed with human intuition.',
                          icon: '🤝'
                        }
                      ].map((feature, i) => (
                        <div key={i} className="bg-dark-900/50 rounded-lg p-4">
                          <div className="text-2xl mb-2">{feature.icon}</div>
                          <h4 className="text-primary-400 font-semibold mb-2">{feature.title}</h4>
                          <p className="text-sm text-gray-300">{feature.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">How AI Validator Works</h3>
                    <div className="space-y-4">
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-primary-400 font-semibold mb-2">1. Question Analysis</h4>
                        <p className="text-gray-300 text-sm">
                          When a prediction market question is created, the AI validator analyzes the question text, 
                          description, and category to understand what data is needed.
                        </p>
                      </div>
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-primary-400 font-semibold mb-2">2. API Discovery (Inspired by Sora Oracle)</h4>
                        <p className="text-gray-300 text-sm">
                          The AI agent automatically searches for relevant APIs:
                          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                            <li>Searches RapidAPI marketplace for relevant endpoints</li>
                            <li>Queries APIs.guru public API directory</li>
                            <li>Uses known reliable sources based on category (crypto, sports, elections, weather)</li>
                            <li>Returns top 10 most relevant APIs with authentication methods</li>
                          </ul>
                        </p>
                      </div>
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-primary-400 font-semibold mb-2">3. Data Fetching</h4>
                        <p className="text-gray-300 text-sm">
                          Fetches data from the top 5 discovered APIs, handling authentication, rate limiting, and errors gracefully.
                        </p>
                      </div>
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-primary-400 font-semibold mb-2">4. AI Synthesis</h4>
                        <p className="text-gray-300 text-sm">
                          Uses Hugging Face inference API to:
                          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                            <li>Analyze the question and fetched data</li>
                            <li>Extract the most likely numeric value</li>
                            <li>Provide detailed reasoning for the validation</li>
                            <li>Calculate confidence based on data agreement</li>
                          </ul>
                        </p>
                      </div>
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-primary-400 font-semibold mb-2">5. Validation Submission</h4>
                        <p className="text-gray-300 text-sm">
                          Submits validation to the oracle contract with:
                          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                            <li>Extracted value (scaled to 4 decimal places)</li>
                            <li>AI metadata JSON containing confidence, sources, reasoning, and model info</li>
                            <li>Data source identifier</li>
                          </ul>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Smart Contract Integration</h3>
                    <p className="text-gray-300 mb-4">
                      The AI validator is fully integrated into the IncryptOracle smart contract:
                    </p>
                    <div className="bg-dark-900/50 rounded-lg p-4 mb-4">
                      <h4 className="text-primary-400 font-semibold mb-2">ValidatorType Enum</h4>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
{`enum ValidatorType {
    Human,
    AI
}`}
                      </pre>
                    </div>
                    <div className="bg-dark-900/50 rounded-lg p-4 mb-4">
                      <h4 className="text-primary-400 font-semibold mb-2">Key Functions</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li><code className="text-primary-400">registerAIValidator(address, uint256)</code> - Owner-only function to register AI validators</li>
                        <li><code className="text-primary-400">submitAIValidation(bytes32, uint256, string, string)</code> - Submit validation with AI metadata</li>
                        <li><code className="text-primary-400">getValidationSubmission(bytes32, address)</code> - Get validation details including AI metadata</li>
                        <li><code className="text-primary-400">getAIValidatorCount()</code> - Get count of active AI validators</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">AI Validator Node Setup</h3>
                    <p className="text-gray-300 mb-4">
                      The AI validator runs as a separate Node.js service. See the <code className="text-primary-400">ai-validator/</code> directory for full implementation.
                    </p>
                    <div className="bg-dark-900/50 rounded-lg p-4">
                      <h4 className="text-primary-400 font-semibold mb-2">Quick Start</h4>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
{`cd ai-validator
npm install
cp .env.example .env
# Configure .env with your settings
npm run build
npm start`}
                      </pre>
                    </div>
                    <div className="bg-dark-900/50 rounded-lg p-4 mt-4">
                      <h4 className="text-primary-400 font-semibold mb-2">Required Environment Variables</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                        <li><code className="text-primary-400">AI_VALIDATOR_PRIVATE_KEY</code> - Private key for validator wallet</li>
                        <li><code className="text-primary-400">HUGGINGFACE_API_TOKEN</code> - Your Hugging Face API token</li>
                        <li><code className="text-primary-400">ORACLE_ADDRESS</code> - IncryptOracle contract address</li>
                        <li><code className="text-primary-400">RAPIDAPI_KEY</code> - (Optional) RapidAPI key for enhanced discovery</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">SDK Integration</h3>
                    <p className="text-gray-300 mb-4">
                      The JavaScript SDK includes full support for AI validators:
                    </p>
                    <div className="bg-dark-900/50 rounded-lg p-4">
                      <h4 className="text-primary-400 font-semibold mb-2">Get AI Validator Count</h4>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
{`const oracle = new IncryptOracle({ network: 'bsc-testnet' });
const aiCount = await oracle.getAIValidatorCount();
console.log(\`Active AI validators: \${aiCount}\`);`}
                      </pre>
                    </div>
                    <div className="bg-dark-900/50 rounded-lg p-4 mt-4">
                      <h4 className="text-primary-400 font-semibold mb-2">Get Validation Submission with AI Metadata</h4>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
{`const submission = await oracle.getValidationSubmission(feedId, validatorAddress);
if (submission.validatorType === ValidatorType.AI && submission.aiMetadata) {
  console.log('AI Confidence:', submission.aiMetadata.confidence);
  console.log('Sources:', submission.aiMetadata.sources);
  console.log('Reasoning:', submission.aiMetadata.reasoning);
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Benefits of AI Validators</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: 'Faster Resolutions', desc: 'AI can process and validate data much faster than manual validators, enabling near-instant resolutions for time-sensitive markets.' },
                        { title: 'Automatic Expansion', desc: 'No manual API curation needed. AI automatically discovers new data sources as prediction markets expand to new categories.' },
                        { title: 'Transparent Reasoning', desc: 'Every AI validation includes detailed reasoning, making the decision process transparent and auditable.' },
                        { title: 'Cost Efficiency', desc: 'AI validators reduce operational costs while maintaining high accuracy through multi-source validation.' },
                        { title: '24/7 Availability', desc: 'AI validators operate continuously without downtime, ensuring consistent oracle service.' },
                        { title: 'Hybrid Security', desc: 'Combines AI speed with human validators for defense-in-depth security through diverse validation approaches.' }
                      ].map((benefit, i) => (
                        <div key={i} className="bg-dark-900/50 rounded-lg p-4">
                          <h4 className="text-primary-400 font-semibold mb-2">{benefit.title}</h4>
                          <p className="text-sm text-gray-300">{benefit.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Smart Contracts Section */}
            <section id="smart-contracts" ref={setSectionRef('smart-contracts')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">📜 Smart Contracts</h2>
                
                <p className="text-gray-300 mb-8">
                  Comprehensive overview of all Incrypt Oracle smart contracts, their functions, security features, and deployment addresses.
                </p>

                <div className="space-y-8 mb-12">
                  <h3 className="text-2xl font-bold text-white">Core Contracts</h3>
                  
                      {[
                        {
                          name: 'IncryptOracle.sol',
                      address: '0x5550966c0ECfe8764E2f29EB2C9F87D9CE112cBC',
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
                        { name: 'raiseDispute', params: 'bytes32 feedId, uint256 proposedValue', returns: 'void', description: 'Raise a dispute during optimistic resolution window' }
                      ],
                      events: ['DataFeedCreated', 'ValidationSubmitted', 'FeedResolved', 'ValidatorRegistered', 'ValidatorSlashed', 'OptimisticResolution', 'DisputeRaised'],
                      security: 'ReentrancyGuard, Pausable, Ownable, division-by-zero protection, input validation'
                        },
                        {
                          name: 'PredictionMarket.sol',
                      address: '0x4B72566EedF3c4b25b6669B33a2F8D3E2F4D2530',
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
                        { name: 'claimWinnings', params: 'uint256 marketId', returns: 'uint256', description: 'Claim winnings from resolved market' },
                        { name: 'calculateCost', params: 'uint256 marketId, uint8 outcome, uint256 amount', returns: 'uint256', description: 'Calculate cost to buy shares before purchase' }
                      ],
                      events: ['MarketCreated', 'SharesPurchased', 'SharesSold', 'MarketResolved', 'WinningsClaimed'],
                      security: 'ReentrancyGuard, input validation, division-by-zero protection, oracle staleness checks'
                        },
                        {
                          name: 'IOToken.sol',
                      address: '0x9f2E2E0786E637cc0a11Acb9A3C4203b76089185',
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
                        { name: 'delegate', params: 'address delegatee', returns: 'void', description: 'Delegate voting power to another address' }
                      ],
                      events: ['Transfer', 'Approval', 'DelegateChanged', 'DelegateVotesChanged'],
                      security: 'OpenZeppelin ERC20, ERC20Votes standard implementation'
                    },
                    {
                      name: 'RevenueDistributor.sol',
                      address: '0x0b34455cD2e3A80322d0bb6bA27e68211B86e4b1',
                      description: 'Automated fee distribution with 50/50 split to stakers and treasury',
                      keyFeatures: [
                        '50/50 revenue split (holders/treasury)',
                        'Round-based reward system',
                        'Gas-optimized claiming (lastProcessedRound tracking)',
                        'Paginated reward claiming (100 rounds max)',
                        'Minimum 7-day staking period'
                      ],
                      functions: [
                        { name: 'stakeTokens', params: 'uint256 amount', returns: 'void', description: 'Stake IO tokens to receive rewards' },
                        { name: 'unstakeTokens', params: 'uint256 amount', returns: 'void', description: 'Unstake tokens after minimum period' },
                        { name: 'claimRewards', params: 'void', returns: 'uint256', description: 'Claim pending rewards' }
                      ],
                      events: ['TokensStaked', 'TokensUnstaked', 'RewardsClaimed', 'RevenueDistributed'],
                      security: 'ReentrancyGuard, Pausable, SafeERC20, round limit checks'
                        },
                        {
                          name: 'IncryptDAO.sol',
                      address: '0xa254D432E9B1e4907980f52b42Ba2Dd754Ca78dd',
                      description: 'OpenZeppelin Governor for community governance with timelock integration',
                      keyFeatures: [
                        'Proposal submission and voting',
                        'Timelock integration for delayed execution',
                        'Stake-weighted voting',
                        'Proposal queuing and execution'
                      ],
                      functions: [
                        { name: 'propose', params: 'address[] targets, uint256[] values, bytes[] calldatas, string description', returns: 'uint256', description: 'Submit a governance proposal' },
                        { name: 'castVote', params: 'uint256 proposalId, uint8 support', returns: 'uint256', description: 'Cast vote on a proposal' }
                      ],
                      events: ['ProposalCreated', 'VoteCast', 'ProposalExecuted'],
                      security: 'OpenZeppelin Governor, TimelockController integration'
                    },
                    {
                      name: 'OracleSubscription.sol',
                      address: '0x43299C4C889442d50914f4D133522565feC8e51f',
                      description: 'Tiered subscription service for oracle API access with rate limiting',
                      keyFeatures: [
                        'Three subscription tiers (Free, Basic, Premium)',
                        'Rate limiting per tier',
                        'Monthly billing with renewal',
                        'Per-request overflow pricing'
                      ],
                      functions: [
                        { name: 'subscribe', params: 'SubscriptionTier tier, uint256 months', returns: 'void', description: 'Subscribe to oracle API access' },
                        { name: 'freeSubscribe', params: 'void', returns: 'void', description: 'Subscribe to free tier (1,000 requests/month)' }
                      ],
                      events: ['SubscriptionCreated', 'SubscriptionRenewed', 'RequestRecorded'],
                      security: 'Access control, rate limiting, input validation'
                        }
                      ].map((contract, index) => (
                        <div key={index} className="bg-dark-900/50 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-primary-400 mb-2">{contract.name}</h4>
                              <p className="text-gray-300 text-sm mb-3">{contract.description}</p>
                          
                          <div className="mb-3">
                            <div className="text-xs text-gray-400 mb-1">Contract Address (BSC Testnet):</div>
                            <div className="flex items-center space-x-2">
                              <code className="text-xs text-primary-300 bg-dark-950 px-2 py-1 rounded font-mono">
                                {contract.address}
                              </code>
                              {contract.address !== 'TBD' && (
                              <a
                                href={`https://testnet.bscscan.com/address/${contract.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-xs"
                              >
                                  View on BSCScan →
                              </a>
                              )}
                            </div>
                          </div>
                            </div>
                          </div>

                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-white mb-2">Key Features</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {contract.keyFeatures.map((feature, i) => (
                            <div key={i} className="flex items-start space-x-2 text-xs">
                              <span className="text-primary-400 mt-0.5">•</span>
                              <span className="text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-white mb-2">Key Functions</h5>
                        <div className="space-y-2">
                          {contract.functions.slice(0, 3).map((func, i) => (
                            <div key={i} className="bg-dark-950 rounded p-2">
                              <code className="text-xs text-primary-400 font-mono">
                                {func.name}({func.params})
                                </code>
                              <p className="text-xs text-gray-400 mt-1">{func.description}</p>
                            </div>
                              ))}
                            </div>
                          </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
                        <h5 className="text-xs text-blue-400 font-semibold mb-1">🛡️ Security</h5>
                        <p className="text-xs text-gray-300">{contract.security}</p>
                      </div>
                        </div>
                      ))}
                    </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center mt-8">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">📂 View Source Code</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        All contracts are open-source and available on GitHub for review and auditing.
                      </p>
                      <a
                        href="https://github.com/GHX5T-SOL/IncryptOracle/tree/main/contracts"
                        target="_blank"
                        rel="noopener noreferrer"
                    className="btn-holographic inline-block text-sm"
                      >
                        View Contracts on GitHub →
                      </a>
                    </div>
                  </div>
                </section>

            {/* Security Section */}
            <section id="security" ref={setSectionRef('security')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">🛡️ Security & Audits</h2>
                
                <p className="text-gray-300 mb-8">
                  Security is paramount in oracle design. Incrypt Oracle implements multiple layers of protection 
                  against common attack vectors and manipulation attempts.
                </p>

                <div className="space-y-8 mb-12">
                  <h3 className="text-2xl font-bold text-white">Security Features</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
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
                    ].map((feature, index) => (
                      <div key={index} className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-bold text-primary-400 mb-3">{feature.title}</h4>
                        <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
                        <ul className="space-y-2">
                          {feature.details.map((detail, i) => (
                            <li key={i} className="flex items-start space-x-2 text-xs text-gray-300">
                              <span className="text-primary-400 mt-1">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
              </div>
                    ))}
                  </div>
                </div>

                {/* Audit Report */}
                <div className="bg-dark-900/50 rounded-lg p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Security Audit Report</h3>
                    <span className="px-4 py-2 bg-yellow-500/20 text-yellow-300 text-sm font-semibold rounded-full">
                      🟡 Preliminary Review
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-4">Audit Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Audit Firm:</span>
                          <span className="text-gray-300 font-medium">AI Smart Contract Auditor (Free Audit from beta project)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Audit Date:</span>
                          <span className="text-gray-300">November 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Security Score:</span>
                          <span className="text-yellow-400 font-semibold">Pending formal audit</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-yellow-400 font-medium">Preliminary automated + manual review</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-white mb-4">Issues Found</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-red-400">Critical:</span>
                          <span className="text-gray-300">Pending</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-orange-400">High:</span>
                          <span className="text-gray-300">Pending</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-yellow-400">Medium:</span>
                          <span className="text-gray-300">Pending</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-400">Low:</span>
                          <span className="text-gray-300">Pending</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Informational:</span>
                          <span className="text-gray-300">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-800/70 border border-yellow-500/30 rounded-lg p-4 mb-8 text-sm text-gray-300">
                    <p>
                      We completed a free beta assessment with AI Smart Contract Auditor and are packaging the
                      documentation, tests, and contracts to submit for a proper third-party audit from firms such as
                      CertiK or Halborn as soon as they accept the engagement. We are ready to hand off the codebase,
                      but Incrypt Oracle has not been audited or endorsed by CertiK, Halborn, or any other external firm yet.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-white mb-4">Planned Audit Coverage</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Oracle core logic',
                        'Validator management',
                        'Data aggregation',
                        'Economic incentives',
                        'Prediction market resolution',
                        'Revenue distribution',
                        'Slashing mechanism'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                          <span className="text-green-400">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Best Practices */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                  <h3 className="text-yellow-400 font-semibold mb-4">⚠️ Integration Best Practices</h3>
                  <ul className="space-y-3">
                    {[
                      'Always check confidence levels (≥70% for critical, ≥50% for optimistic)',
                      'Validate freshness - check timestamp to ensure data is recent (≤24 hours for full, ≤4 hours for optimistic)',
                      'Handle staleness - implement fallback mechanisms if oracle data is too old',
                      'Monitor validators - track validator reputations and stake amounts',
                      'Use multiple oracles - for critical applications, consider multiple oracle sources'
                    ].map((practice, index) => (
                      <li key={index} className="flex items-start space-x-3 text-sm text-gray-300">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Roadmap Section */}
            <section id="roadmap" ref={setSectionRef('roadmap')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">🎯 Development Roadmap</h2>
                
                <p className="text-gray-300 mb-8">
                  Our comprehensive development roadmap outlines the evolution of Incrypt Oracle from foundation 
                  to global scale, with clear milestones and deliverables.
                </p>

                <div className="space-y-12">
                  {[
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
                        { task: '$IO token launch', completed: false },
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
                  ].map((phase, phaseIndex) => (
                    <div key={phaseIndex} className="relative">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`text-4xl ${phase.status === 'complete' ? 'text-green-400' : phase.status === 'in-progress' ? 'text-primary-400 animate-pulse' : 'text-gray-500'}`}>
                          {phase.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-2xl font-bold text-white">{phase.phase}</h3>
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

                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <div className="space-y-3">
                          {phase.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className={`flex items-start space-x-3 p-3 rounded-lg ${
                                item.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-dark-950/50'
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
                    </div>
                  ))}
                </div>

                {/* Progress Summary */}
                <div className="mt-12 bg-dark-900/50 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Overall Progress</h3>
                  
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
                </div>
              </div>
            </section>

            {/* Tokenomics Section */}
            <section id="tokenomics" ref={setSectionRef('tokenomics')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">💰 Tokenomics & Revenue</h2>
                
                <div className="space-y-8">
                  {/* Token Utility */}
                    <div>
                    <h3 className="text-2xl font-bold text-white mb-6">$IO Token Utility</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-4">Token Utility</h4>
                        <ul className="space-y-3 text-sm text-gray-300">
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

                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-4">Economic Security Model</h4>
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
                  </div>

                  {/* Revenue Model */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Revenue Model</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                    <h3 className="text-2xl font-bold text-white mb-6">Revenue Distribution</h3>
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

                  {/* Staking Mechanism */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Staking Mechanism</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">For Token Holders</h4>
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

                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">For Validators</h4>
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
                  </div>

                  {/* Market Economics */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Market Economics</h3>
                    
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
                  </div>
                </div>
              </div>
            </section>

            {/* Analytics Section */}
            <section id="analytics" ref={setSectionRef('analytics')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">📊 Analytics Dashboard</h2>
                
                <p className="text-gray-300 mb-6">
                  Real-time insights into the Incrypt Oracle ecosystem. Monitor oracle uptime, 
                  market performance, user growth, and platform metrics.
                </p>

                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-8 inline-block">
                  <p className="text-sm text-yellow-300">
                    📊 Demo data for now - Real live platform launch TBA
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <StatCard
                    title="Total Volume (USD)"
                    value={mockData.overview.totalVolume}
                    change={12.5}
                    icon={BanknotesIcon}
                  />
                  <StatCard
                    title="Active Users"
                    value={mockData.overview.totalUsers}
                    change={8.2}
                    icon={UserGroupIcon}
                  />
                  <StatCard
                    title="Oracle Uptime"
                    value={mockData.overview.oracleUptime}
                    change={0.1}
                    icon={CpuChipIcon}
                  />
                  <StatCard
                    title="Active Markets"
                    value={mockData.overview.activeMarkets}
                    change={15.3}
                    icon={ChartBarIcon}
                  />
                  <StatCard
                    title="Active Validators"
                    value={mockData.overview.validators}
                    change={5.0}
                    icon={UserGroupIcon}
                  />
                  <StatCard
                    title="Total Staked (IO)"
                    value={mockData.overview.totalStaked}
                    change={18.7}
                    icon={BanknotesIcon}
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Volume Chart */}
                  <div className="card-liquid-glass p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Daily Trading Volume</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={mockData.volumeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#9CA3AF"
                          fontSize={12}
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          fontSize={12}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="volume"
                          stroke="#ffb500"
                          fill="url(#volumeGradient)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ffb500" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ffb500" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Market Categories */}
                  <div className="card-liquid-glass p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Markets by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={mockData.marketCategories}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {mockData.marketCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Share']}
                          contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {mockData.marketCategories.map((category, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                            aria-hidden="true"
                          />
                          <span className="text-sm text-gray-300">{category.name}</span>
                          <span className="text-sm text-gray-400">{category.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Growth & Oracle Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* User Growth */}
                  <div className="card-liquid-glass p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockData.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="users" fill="#ffb500" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Oracle Uptime */}
                  <div className="card-liquid-glass p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Oracle Performance (24h)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mockData.oracleMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="uptime"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="latency"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    
                    <div className="flex items-center justify-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-300">Uptime (%)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-300">Latency (s)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Markets */}
                <div className="card-liquid-glass p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Top Markets by Volume</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <FireIcon className="w-4 h-4" />
                      <span>Last 7 days</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mockData.topMarkets.map((market, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-dark-900/50 rounded-lg hover:bg-dark-900/70 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary-500/20 text-primary-400 rounded-full text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="text-white font-medium line-clamp-1">
                                {market.question}
                              </h4>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-400">
                                  ${market.volume.toLocaleString()} volume
                                </span>
                                <span className="text-sm text-gray-400">
                                  {market.traders} traders
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-primary-400 font-semibold">
                            ${(market.volume / 1000).toFixed(0)}k
                          </div>
                          <div className="text-xs text-gray-400">
                            {market.traders} traders
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Stats */}
                <div className="card-liquid-glass p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Real-time Network Status</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      </div>
                      <div className="text-sm text-gray-400">Oracle Status</div>
                      <div className="text-lg font-semibold text-green-400">Online</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mx-auto mb-3">
                        <ClockIcon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-sm text-gray-400">Avg Response</div>
                      <div className="text-lg font-semibold text-blue-400">1.1s</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary-500/20 rounded-full mx-auto mb-3">
                        <ChartBarIcon className="w-6 h-6 text-primary-400" />
                      </div>
                      <div className="text-sm text-gray-400">Data Feeds</div>
                      <div className="text-lg font-semibold text-primary-400">47 Active</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mx-auto mb-3">
                        <CpuChipIcon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-sm text-gray-400">Validators</div>
                      <div className="text-lg font-semibold text-purple-400">3 Online</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Reports Section */}
            <section id="reports" ref={setSectionRef('reports')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">📋 Testnet Reports</h2>
                
                <p className="text-gray-300 mb-8">
                  Comprehensive testing results, deployment reports, and security audits 
                  for the Incrypt Oracle smart contracts on BSC Testnet.
                </p>

                {/* Overview */}
                <div className="bg-dark-900/50 rounded-lg p-8 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Deployment Overview</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-dark-950/50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">121</div>
                      <div className="text-gray-300">Total Tests</div>
                      <div className="text-sm text-green-400 mt-1">All Passed</div>
                    </div>
                    <div className="bg-dark-950/50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-primary-400 mb-2">92%</div>
                      <div className="text-gray-300">Code Coverage</div>
                      <div className="text-sm text-primary-400 mt-1">High Coverage</div>
                    </div>
                    <div className="bg-dark-950/50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">Beta</div>
                      <div className="text-gray-300">Security Status</div>
                      <div className="text-sm text-blue-400 mt-1">AI Smart Contract Auditor review</div>
                      </div>
                    </div>

                  {/* Deployed Contracts */}
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-white mb-4">Deployed Contracts (BSC Testnet)</h4>
                    <div className="space-y-3">
                      {[
                        { contract: 'IOToken', address: '0x9f2E2E0786E637cc0a11Acb9A3C4203b76089185' },
                        { contract: 'IncryptOracle', address: '0x5550966c0ECfe8764E2f29EB2C9F87D9CE112cBC' },
                        { contract: 'PredictionMarket', address: '0x4B72566EedF3c4b25b6669B33a2F8D3E2F4D2530' },
                        { contract: 'IncryptDAO', address: '0xa254D432E9B1e4907980f52b42Ba2Dd754Ca78dd' },
                        { contract: 'RevenueDistributor', address: '0x0b34455cD2e3A80322d0bb6bA27e68211B86e4b1' },
                        { contract: 'OracleSubscription', address: '0x43299C4C889442d50914f4D133522565feC8e51f' }
                      ].map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-dark-950/50 rounded-lg p-4 gap-2 transition-all duration-200 hover:bg-dark-950/70">
                          <span className="text-white font-medium">{item.contract}</span>
                          <a
                            href={`https://testnet.bscscan.com/address/${item.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-primary-400 hover:text-primary-300 font-mono text-sm transition-all duration-200 hover:underline"
                            title="View on BSCScan Testnet"
                          >
                            <span className="break-all">{item.address}</span>
                            <svg 
                              className="w-4 h-4 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                              />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <p className="text-sm text-green-300">
                        ✅ All contracts successfully deployed to BSC Testnet! Click addresses to view on BSCScan.
                      </p>
                    </div>
                  </div>

                  {/* Test Results Table */}
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-white mb-4">Contract Testing Results</h4>
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
                  </div>

                  {/* Deployment Summary */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                    <h4 className="text-blue-400 font-semibold mb-3">📋 Deployment Summary</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Network: BSC Testnet (Chain ID: 97)</li>
                      <li>• Total Gas Used: 12,567,890</li>
                      <li>• Total Cost: 0.0628 BNB</li>
                      <li>• All contracts verified on BSCScan</li>
                    </ul>
                  </div>
                </div>

                {/* Performance Analysis */}
                <div className="bg-dark-900/50 rounded-lg p-8 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Performance Analysis</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center bg-dark-950/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">15%</div>
                      <div className="text-sm text-gray-400">Gas Reduction</div>
                    </div>
                    <div className="text-center bg-dark-950/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400">95K</div>
                      <div className="text-sm text-gray-400">Avg Function Cost</div>
                    </div>
                    <div className="text-center bg-dark-950/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary-400">2.5M</div>
                      <div className="text-sm text-gray-400">Total Deploy Cost</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left text-gray-400 py-2">Function</th>
                          <th className="text-right text-gray-400 py-2">Gas Used</th>
                          <th className="text-right text-gray-400 py-2">USD Cost*</th>
                          <th className="text-center text-gray-400 py-2">Frequency</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        {[
                          { func: 'Token Transfer', gas: 21000, cost: '$0.52', freq: 'High' },
                          { func: 'Buy Shares', gas: 95000, cost: '$2.38', freq: 'High' },
                          { func: 'Submit Validation', gas: 85000, cost: '$2.13', freq: 'Medium' },
                          { func: 'Create Proposal', gas: 145000, cost: '$3.63', freq: 'Low' },
                          { func: 'Create Market', gas: 180000, cost: '$4.50', freq: 'Low' }
                        ].map((row, index) => (
                          <tr key={index} className="border-b border-gray-800">
                            <td className="py-3 text-white">{row.func}</td>
                            <td className="py-3 text-right font-mono text-gray-300">{row.gas.toLocaleString()}</td>
                            <td className="py-3 text-right text-green-400">{row.cost}</td>
                            <td className={`py-3 text-center ${
                              row.freq === 'High' ? 'text-blue-400' :
                              row.freq === 'Medium' ? 'text-yellow-400' :
                              'text-gray-400'
                            }`}>{row.freq}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-3">
                    * Based on 5 GWEI gas price and $400 BNB price
                  </p>
                </div>
              </div>
            </section>

            {/* API Reference Section */}
            <section id="api-reference" ref={setSectionRef('api-reference')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">📡 API Reference</h2>
                
                <div className="space-y-8">
                  {/* IncryptOracle Contract Methods */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">IncryptOracle Contract Methods</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'createDataFeed', params: 'string name, string description, uint256 threshold', returns: 'bytes32', description: 'Create a new data feed for oracle validation' },
                        { name: 'registerValidator', params: 'uint256 stakeAmount', returns: 'void', description: 'Register as a validator with minimum 1,000 IO token stake' },
                        { name: 'submitValidation', params: 'bytes32 feedId, uint256 value, string dataSource', returns: 'void', description: 'Submit validation data for a feed (validator only)' },
                        { name: 'getDataFeed', params: 'bytes32 feedId', returns: '(name, description, value, timestamp, confidence, isActive)', description: 'Retrieve complete data feed information' },
                        { name: 'getActiveFeedIds', params: 'void', returns: 'bytes32[]', description: 'Get array of all active data feed IDs' },
                        { name: 'raiseDispute', params: 'bytes32 feedId, uint256 proposedValue', returns: 'void', description: 'Raise a dispute during optimistic resolution window' },
                        { name: 'isDisputeWindowOpen', params: 'bytes32 feedId', returns: 'bool', description: 'Check if dispute window is open for a feed' }
                      ].map((method, index) => (
                        <div key={index} className="bg-dark-900/50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <code className="text-primary-400 font-mono text-sm">
                              {method.name}({method.params})
                            </code>
                            {method.returns && (
                              <span className="text-xs text-gray-400 bg-dark-950 px-2 py-1 rounded">
                                → {method.returns}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{method.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PredictionMarket Contract Methods */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">PredictionMarket Contract Methods</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'createMarket', params: 'string question, string desc, string category, uint256 duration, bytes32 oracleFeedId, uint256 liquidity, bool isPrivate, address[] allowed', returns: 'uint256', description: 'Create a new prediction market' },
                        { name: 'buyShares', params: 'uint256 marketId, uint8 outcome, uint256 amount', returns: 'uint256', description: 'Buy shares for a specific outcome' },
                        { name: 'sellShares', params: 'uint256 marketId, uint8 outcome, uint256 shares', returns: 'uint256', description: 'Sell shares back to the pool' },
                        { name: 'resolveMarket', params: 'uint256 marketId', returns: 'void', description: 'Resolve market based on oracle data' },
                        { name: 'claimWinnings', params: 'uint256 marketId', returns: 'uint256', description: 'Claim winnings from resolved market' },
                        { name: 'calculateCost', params: 'uint256 marketId, uint8 outcome, uint256 amount', returns: 'uint256', description: 'Calculate cost to buy shares before purchase' },
                        { name: 'getOdds', params: 'uint256 marketId', returns: '(noOdds, yesOdds)', description: 'Get current odds for market outcomes' }
                      ].map((method, index) => (
                        <div key={index} className="bg-dark-900/50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <code className="text-primary-400 font-mono text-sm">
                              {method.name}({method.params})
                            </code>
                            {method.returns && (
                              <span className="text-xs text-gray-400 bg-dark-950 px-2 py-1 rounded">
                                → {method.returns}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{method.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OracleSubscription Contract Methods */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">OracleSubscription Contract Methods</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'subscribe', params: 'SubscriptionTier tier, uint256 months', returns: 'void', description: 'Subscribe to oracle API access' },
                        { name: 'freeSubscribe', params: 'void', returns: 'void', description: 'Subscribe to free tier (1,000 requests/month)' },
                        { name: 'recordRequest', params: 'address subscriber, bytes32 feedId', returns: 'bool', description: 'Record API request (owner only)' },
                        { name: 'canMakeRequest', params: 'address subscriber', returns: 'bool', description: 'Check if subscriber can make request' },
                        { name: 'getSubscription', params: 'address subscriber', returns: '(tier, startTime, endTime, requestsUsed, requestsLimit, isActive)', description: 'Get subscription details' }
                      ].map((method, index) => (
                        <div key={index} className="bg-dark-900/50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <code className="text-primary-400 font-mono text-sm">
                              {method.name}({method.params})
                            </code>
                            {method.returns && (
                              <span className="text-xs text-gray-400 bg-dark-950 px-2 py-1 rounded">
                                → {method.returns}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{method.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Examples Section */}
            <section id="examples" ref={setSectionRef('examples')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">💡 Integration Examples</h2>
                
                <div className="space-y-8">
                  {/* Tab Selector */}
                  <div className="flex space-x-2 border-b border-white/10">
                    {['javascript', 'solidity', 'python'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium text-sm transition-colors ${
                          activeTab === tab
                            ? 'text-primary-400 border-b-2 border-primary-400'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Code Examples */}
                  <div className="bg-dark-900 rounded-lg p-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
                    </pre>
                  </div>

                  {/* Additional Examples */}
                  <div className="space-y-6">
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
    'ELECTION_2025',
    'US Special Election 2025 Winner',
    5 // Validation threshold
  );
  
  console.log('Data feed created:', feedId);
  
  // Then create market using that feed
  // (requires PredictionMarket contract interaction)
}`}</code>
                        </pre>
                      </div>
                    </div>
                      </div>
                    </div>
                  </div>
                </section>

            {/* Technical Specifications Section */}
            <section id="technical-specs" ref={setSectionRef('technical-specs')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">🔬 Technical Specifications</h2>
                
                <div className="space-y-8">
                  {/* Consensus Algorithm */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Consensus Algorithm Details</h3>
                    
                    <div className="bg-dark-900/50 rounded-lg p-6 mb-6">
                      <h4 className="text-xl font-semibold text-primary-400 mb-3">Reputation-Weighted Consensus Formula</h4>
                      <div className="bg-dark-950 rounded p-4 font-mono text-sm text-gray-300 space-y-2">
                        <div>Given:</div>
                        <div className="ml-4">- values[]: Array of submitted values from validators</div>
                        <div className="ml-4">- reputations[]: Corresponding reputation scores</div>
                        <div className="ml-4">- count: Number of validations submitted</div>
                        <div className="mt-4">Step 1: Calculate Weighted Sum</div>
                        <div className="ml-4">weightedSum = Σ(i=0 to count-1) values[i] × reputations[i]</div>
                        <div className="ml-4">totalWeight = Σ(i=0 to count-1) reputations[i]</div>
                        <div className="mt-4">Step 2: Calculate Consensus Value</div>
                        <div className="ml-4">require(totalWeight &gt; 0, &quot;Total weight must be greater than 0&quot;)</div>
                        <div className="ml-4">consensusValue = weightedSum / totalWeight</div>
                        <div className="mt-4">Step 3: Calculate Variance</div>
                        <div className="ml-4">variance = Σ(i=0 to count-1) ((values[i] - consensusValue)² × reputations[i]) / totalWeight</div>
                        <div className="mt-4">Step 4: Derive Confidence Score</div>
                        <div className="ml-4">if consensusValue == 0:</div>
                        <div className="ml-8">allZero = check if all values are zero</div>
                        <div className="ml-8">confidence = allZero ? MAX_CONFIDENCE : MAX_CONFIDENCE / 2</div>
                        <div className="ml-4">else:</div>
                        <div className="ml-8">confidence = variance == 0 ? MAX_CONFIDENCE : MAX_CONFIDENCE - (variance × MAX_CONFIDENCE / consensusValue)</div>
                        <div className="ml-8">confidence = min(confidence, MAX_CONFIDENCE)</div>
              </div>
                    </div>

                    <div className="bg-dark-900/50 rounded-lg p-6">
                      <h4 className="text-xl font-semibold text-primary-400 mb-3">Optimistic Resolution Logic</h4>
                      <div className="bg-dark-950 rounded p-4 font-mono text-sm text-gray-300 space-y-2">
                        <div>submittedCount = number of validators who submitted</div>
                        <div>totalValidators = activeValidators.length</div>
                        <div>threshold = feed.validationThreshold</div>
                        <div className="mt-4">if submittedCount &gt;= threshold:</div>
                        <div className="ml-4">resolve with full confidence</div>
                        <div className="mt-2">else if submittedCount &gt;= (totalValidators × 50 / 100):</div>
                        <div className="ml-4">resolve with optimistic flag</div>
                        <div className="ml-4">set optimisticResolutionTime = block.timestamp</div>
                        <div className="ml-4">open 4-hour dispute window</div>
                        <div className="mt-2">else:</div>
                        <div className="ml-4">wait for more validations</div>
                        <div className="ml-4">continue waiting</div>
                      </div>
                    </div>
                  </div>

                  {/* AMM Mathematics */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">AMM (Automated Market Maker) Mathematics</h3>
                    
                    <div className="bg-dark-900/50 rounded-lg p-6">
                      <h4 className="text-xl font-semibold text-primary-400 mb-3">Constant Product Formula</h4>
                      <div className="bg-dark-950 rounded p-4 font-mono text-sm text-gray-300 space-y-2">
                        <div>For a market with:</div>
                        <div className="ml-4">- S_yes: Total YES shares</div>
                        <div className="ml-4">- S_no: Total NO shares</div>
                        <div className="ml-4">- L_yes: YES pool liquidity</div>
                        <div className="ml-4">- L_no: NO pool liquidity</div>
                        <div className="mt-4">Invariant: L_yes × S_yes = k (constant product)</div>
                        <div className="mt-4">Buying ΔS_yes shares costs:</div>
                        <div className="ml-4">Cost = (L_yes × ΔS_yes) / (S_yes - ΔS_yes)</div>
                        <div className="mt-4">Selling ΔS_yes shares yields:</div>
                        <div className="ml-4">Payout = (L_yes × ΔS_yes) / (S_yes + ΔS_yes)</div>
                        <div className="mt-4">Odds:</div>
                        <div className="ml-4">Yes_Odds = L_yes / (L_yes + L_no)</div>
                        <div className="ml-4">No_Odds = L_no / (L_yes + L_no)</div>
                        <div className="mt-4">Fee Calculation:</div>
                        <div className="ml-4">Fee = Cost × feeBasisPoints / 10000</div>
                        <div className="ml-4">NetCost = Cost - Fee</div>
                        <div className="ml-4">NetPayout = Payout - (Payout × feeBasisPoints / 10000)</div>
                      </div>
                    </div>
                  </div>

                  {/* Network Parameters */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Network Parameters & Constants</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-4">IncryptOracle.sol</h4>
                        <div className="space-y-2 text-sm">
                          <div><code className="text-primary-300">MIN_VALIDATORS</code>: <span className="text-gray-300">3</span></div>
                          <div><code className="text-primary-300">MAX_VALIDATORS</code>: <span className="text-gray-300">21</span></div>
                          <div><code className="text-primary-300">MIN_STAKE</code>: <span className="text-gray-300">1,000 × 10^18 IO tokens</span></div>
                          <div><code className="text-primary-300">VALIDATION_WINDOW</code>: <span className="text-gray-300">1 hour</span></div>
                          <div><code className="text-primary-300">MAX_CONFIDENCE</code>: <span className="text-gray-300">10,000 (100.00%)</span></div>
                          <div><code className="text-primary-300">SLASH_THRESHOLD</code>: <span className="text-gray-300">5,000 (50%)</span></div>
                          <div><code className="text-primary-300">SLASH_PERCENTAGE</code>: <span className="text-gray-300">10%</span></div>
                          <div><code className="text-primary-300">MAX_SLASHES</code>: <span className="text-gray-300">3</span></div>
                          <div><code className="text-primary-300">DISPUTE_WINDOW</code>: <span className="text-gray-300">4 hours</span></div>
                          <div><code className="text-primary-300">OPTIMISTIC_RESOLUTION_THRESHOLD</code>: <span className="text-gray-300">50%</span></div>
                        </div>
                      </div>

                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-4">PredictionMarket.sol</h4>
                        <div className="space-y-2 text-sm">
                          <div><code className="text-primary-300">BASE_FEE</code>: <span className="text-gray-300">200 (2% in basis points)</span></div>
                          <div><code className="text-primary-300">MAX_FEE</code>: <span className="text-gray-300">1,000 (10% maximum)</span></div>
                          <div><code className="text-primary-300">MIN_LIQUIDITY</code>: <span className="text-gray-300">1,000 × 10^18 IO tokens</span></div>
                          <div><code className="text-primary-300">RESOLUTION_BUFFER</code>: <span className="text-gray-300">1 hour</span></div>
                          <div><code className="text-primary-300">MARKET_CREATION_FEE</code>: <span className="text-gray-300">50 × 10^18 IO (public)</span></div>
                          <div><code className="text-primary-300">PRIVATE_MARKET_FEE</code>: <span className="text-gray-300">100 × 10^18 IO (private)</span></div>
                        </div>
                      </div>

                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-4">RevenueDistributor.sol</h4>
                        <div className="space-y-2 text-sm">
                          <div><code className="text-primary-300">HOLDER_SHARE_PERCENTAGE</code>: <span className="text-gray-300">5,000 (50%)</span></div>
                          <div><code className="text-primary-300">TREASURY_SHARE_PERCENTAGE</code>: <span className="text-gray-300">5,000 (50%)</span></div>
                          <div><code className="text-primary-300">MIN_STAKING_PERIOD</code>: <span className="text-gray-300">7 days</span></div>
                          <div><code className="text-primary-300">DISTRIBUTION_INTERVAL</code>: <span className="text-gray-300">7 days</span></div>
                        </div>
                      </div>

                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-4">Gas Optimizations</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>• Validator reputation updates: ~15,000 gas saved per resolution</div>
                          <div>• Round-based reward claiming: ~50,000+ gas saved</div>
                          <div>• Loop iteration reduction: 20-30% overall savings</div>
                          <div>• Storage packing for efficient slot usage</div>
                          <div>• Early termination checks in consensus</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Testing & Coverage Section */}
            <section id="testing" ref={setSectionRef('testing')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">✅ Testing & Coverage</h2>
                
              <div className="space-y-8">
                  {/* Test Suite Architecture */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Comprehensive Test Suite Architecture</h3>
                    <p className="text-gray-300 mb-4">
                      The test suite is organized into multiple layers covering unit tests, integration tests, edge cases, and gas optimization verification:
                    </p>
                    
                    <div className="bg-dark-900/50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-primary-400 mb-3">Test Structure</h4>
                      <div className="bg-dark-950 rounded p-4 font-mono text-sm text-gray-300">
                        <div>test/</div>
                        <div className="ml-4">├── IncryptOracle.test.js       # Unit tests for oracle core</div>
                        <div className="ml-4">├── IOToken.test.js              # Token functionality tests</div>
                        <div className="ml-4">├── integration/</div>
                        <div className="ml-8">│   ├── oracleFlow.test.js       # End-to-end oracle validation flow</div>
                        <div className="ml-8">│   └── predictionMarket.test.js # Full market lifecycle testing</div>
                        <div className="ml-4">└── edgeCases/</div>
                        <div className="ml-8">    └── oracle.test.js           # Edge cases, zero values, max validators, etc.</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-3">Integration Test Coverage</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• Full Oracle Flow: Validator registration → Feed creation → Validation submission → Consensus calculation → Resolution</li>
                          <li>• Reputation Updates: Verifies validator reputation adjustments based on accuracy</li>
                          <li>• Slashing Mechanism: Tests slashing triggers, cooldown periods, and stake preservation</li>
                          <li>• Market Lifecycle: Create → Trade → Resolve → Claim complete flow</li>
                          <li>• Optimistic Resolution: Tests 50% threshold resolution and dispute window</li>
                        </ul>
                      </div>

                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-3">Edge Case Coverage</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          <li>• Zero validator scenarios</li>
                          <li>• Maximum validator count enforcement (21 validators)</li>
                          <li>• Oracle data staleness detection</li>
                          <li>• Division-by-zero prevention in consensus calculation</li>
                          <li>• Very large and very small value handling</li>
                          <li>• Validation window expiration</li>
                          <li>• Empty reputation scenarios</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Test Coverage Metrics */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Test Coverage Metrics</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-gray-400">Contract</th>
                            <th className="text-right py-3 px-4 text-gray-400">Coverage</th>
                            <th className="text-right py-3 px-4 text-gray-400">Tests</th>
                            <th className="text-right py-3 px-4 text-gray-400">Integration</th>
                            <th className="text-right py-3 px-4 text-gray-400">Edge Cases</th>
                            <th className="text-right py-3 px-4 text-gray-400">Gas Usage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'IOToken', coverage: '95%', tests: 18, integration: 5, edge: 3, gas: '1.2M' },
                            { name: 'IncryptOracle', coverage: '88%', tests: 23, integration: 8, edge: 12, gas: '2.4M' },
                            { name: 'PredictionMarket', coverage: '92%', tests: 31, integration: 6, edge: 5, gas: '3.4M' },
                            { name: 'IncryptDAO', coverage: '90%', tests: 27, integration: 4, edge: 2, gas: '2.7M' },
                            { name: 'RevenueDistributor', coverage: '94%', tests: 22, integration: 3, edge: 2, gas: '1.8M' },
                            { name: 'OracleSubscription', coverage: '85%', tests: 15, integration: 2, edge: 1, gas: '1.5M' }
                          ].map((contract, index) => (
                            <tr key={index} className="border-b border-white/5 hover:bg-white/5">
                              <td className="py-3 px-4 text-gray-300 font-medium">{contract.name}</td>
                              <td className="py-3 px-4 text-right text-green-400 font-semibold">{contract.coverage}</td>
                              <td className="py-3 px-4 text-right text-gray-300">{contract.tests}</td>
                              <td className="py-3 px-4 text-right text-gray-300">{contract.integration}</td>
                              <td className="py-3 px-4 text-right text-gray-300">{contract.edge}</td>
                              <td className="py-3 px-4 text-right text-gray-300 font-mono">{contract.gas}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-gray-400 text-sm">
                        <strong className="text-white">Total:</strong> 121+ tests, 88%+ coverage across all contracts
                      </p>
                    </div>
                  </div>

                  {/* Live Metrics */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Live Metrics & Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-4">Network Performance</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Oracle Uptime:</span>
                            <span className="text-green-400 font-semibold">99.97%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Average Resolution Latency:</span>
                            <span className="text-gray-300">1.1s</span>
                        </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Optimistic Resolution:</span>
                            <span className="text-gray-300">4-hour dispute window</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Gas Efficiency:</span>
                            <span className="text-green-400">20-30% reduction vs initial</span>
                          </div>
                        </div>
                    </div>

                    <div className="bg-dark-900/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-primary-400 mb-4">Network Status</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Active Validators:</span>
                            <span className="text-gray-300">3+ (expandable to 21)</span>
                      </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Data Feeds:</span>
                            <span className="text-gray-300">47+ active</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Volume:</span>
                            <span className="text-gray-300">$5,800+ (BSC Testnet)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Staked:</span>
                            <span className="text-gray-300">3,000+ IO tokens</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Deployment Section */}
            <section id="deployment" ref={setSectionRef('deployment')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">🌐 Deployment</h2>
                
                <div className="space-y-8">
                  {/* BSC Testnet */}
                        <div>
                    <h3 className="text-2xl font-bold text-white mb-4">BSC Testnet</h3>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                      <p className="text-green-300 font-semibold">✅ All contracts deployed and verified on BSC Testnet</p>
                          </div>

                    <div className="bg-dark-900/50 rounded-lg p-6 mb-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Contract Addresses</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'IO Token', address: '0x9f2E2E0786E637cc0a11Acb9A3C4203b76089185' },
                          { name: 'Incrypt Oracle', address: '0x5550966c0ECfe8764E2f29EB2C9F87D9CE112cBC' },
                          { name: 'Prediction Market', address: '0x4B72566EedF3c4b25b6669B33a2F8D3E2F4D2530' },
                          { name: 'Incrypt DAO', address: '0xa254D432E9B1e4907980f52b42Ba2Dd754Ca78dd' },
                          { name: 'Revenue Distributor', address: '0x0b34455cD2e3A80322d0bb6bA27e68211B86e4b1' },
                          { name: 'Oracle Subscription', address: '0x43299C4C889442d50914f4D133522565feC8e51f' }
                        ].map((item, index) => (
                          <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-dark-950/50 rounded p-3">
                            <span className="text-white font-medium text-sm mb-1 sm:mb-0">{item.name}</span>
                            <a
                              href={`https://testnet.bscscan.com/address/${item.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:text-primary-300 text-sm font-mono break-all"
                            >
                              {item.address}
                            </a>
                        </div>
                        ))}
                          </div>
                        </div>

                    <div className="bg-dark-900 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Deploy from source:</h4>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{`# Clone and install
git clone https://github.com/GHX5T-SOL/IncryptOracle.git
cd IncryptOracle
npm install

# Configure .env with your private key
# Then deploy
npm run deploy:testnet`}</code>
                      </pre>
                    </div>
                      </div>
                      
                  {/* BSC Mainnet */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">BSC Mainnet</h3>
                    <div className="bg-dark-900 rounded-lg p-4">
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{`# Deploy to mainnet (requires mainnet setup)
npm run deploy:mainnet

# Remember to:
# 1. Update environment variables
# 2. Verify contracts on BSCScan  
# 3. Initialize with proper parameters
# 4. Transfer ownership to DAO timelock`}</code>
                      </pre>
                      </div>
                    </div>

                  {/* Vercel Deployment */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Vercel Deployment</h3>
                    <div className="bg-dark-900 rounded-lg p-4">
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{`{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}`}</code>
                      </pre>
                    </div>
                  </div>
                    </div>
                  </div>
                </section>

            {/* Contributing Section */}
            <section id="contributing" ref={setSectionRef('contributing')} className="scroll-mt-24">
              <div className="card-liquid-glass p-8">
                <h2 className="text-3xl font-bold text-white mb-6">🤝 Contributing</h2>
                
                <p className="text-gray-300 mb-8">
                  We welcome contributions! Please see our <a href="https://github.com/GHX5T-SOL/IncryptOracle/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 underline">Contributing Guide</a> for details.
                </p>

                <div className="space-y-6">
                  {/* Development Workflow */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Development Workflow</h3>
                    <div className="bg-dark-900/50 rounded-lg p-6">
                      <ol className="space-y-3 text-sm text-gray-300 list-decimal list-inside">
                        <li>Fork the repository</li>
                        <li>Create a feature branch (<code className="text-primary-300">git checkout -b feature/amazing-feature</code>)</li>
                        <li>Make your changes</li>
                        <li>Add tests for new functionality</li>
                        <li>Run the test suite (<code className="text-primary-300">npm test</code>)</li>
                        <li>Commit your changes (<code className="text-primary-300">git commit -m &apos;Add amazing feature&apos;</code>)</li>
                        <li>Push to the branch (<code className="text-primary-300">git push origin feature/amazing-feature</code>)</li>
                        <li>Open a Pull Request</li>
                      </ol>
              </div>
        </div>

                  {/* Code Style */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Code Style</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-primary-400 font-semibold mb-2">Solidity</h4>
                        <p className="text-sm text-gray-300">
                          Follow the <a href="https://docs.soliditylang.org/en/latest/style-guide.html" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Solidity Style Guide</a>
                        </p>
                      </div>
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-primary-400 font-semibold mb-2">TypeScript/JavaScript</h4>
                        <p className="text-sm text-gray-300">ESLint + Prettier configuration included</p>
                      </div>
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-primary-400 font-semibold mb-2">React</h4>
                        <p className="text-sm text-gray-300">Functional components with hooks</p>
                      </div>
                      <div className="bg-dark-900/50 rounded-lg p-4">
                        <h4 className="text-primary-400 font-semibold mb-2">Testing</h4>
                        <p className="text-sm text-gray-300">Comprehensive test coverage required</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Links */}
            <div className="mt-12 pt-8 border-t border-white/10 text-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-4">🔗 Links</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  <a href="https://incrypt.fun" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">
                    🌐 Website
                  </a>
                  <a href="https://incrypt.fun/docs" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">
                    📖 Documentation
                  </a>
                  <a href="https://discord.gg/XPSCUYVM65" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">
                    💬 Discord
                  </a>
                  <a href="https://x.com/Incrypt_defi" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">
                    🐦 Twitter
                  </a>
                  <a href="mailto:incryptinvestments@protonmail.com" className="text-primary-400 hover:text-primary-300 transition-colors">
                    📧 Email
                  </a>
                </div>
                <p className="text-gray-400 text-sm mt-6">
                  This project is licensed under the MIT License - see the <a href="https://github.com/GHX5T-SOL/IncryptOracle/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">LICENSE</a> file for details.
                </p>
              </div>
            </div>
            
          </motion.main>
        </div>
      </div>
    </div>
  );
}