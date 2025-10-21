import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CpuChipIcon,
  AcademicCapIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const partners = [
  {
    category: 'DeFi Protocols',
    icon: ChartBarIcon,
    description: 'Leading DeFi protocols we utilize',
    partners: [
      { name: 'PancakeSwap', logo: '/pancakeswap.png', description: 'DEX integration for trading pairs' },
      { name: 'Venus Protocol', logo: '/venusprotocol.png', description: 'Lending protocol price feeds' },
      { name: 'Alpaca Finance', logo: '/alpaccafinance.png', description: 'Leveraged yield farming oracle' }
    ]
  },
  {
    category: 'Infrastructure',
    icon: CpuChipIcon,
    description: 'Blockchain infrastructure and development tools',
    partners: [
      { name: 'Binance Smart Chain', logo: '/binancesmartchain.png', description: 'Native blockchain platform' },
      { name: 'Chainlink Labs', logo: '/chainlinklabs.png', description: 'Oracle technology collaboration' },
      { name: 'The Graph', logo: '/thegraph.png', description: 'Subgraph indexing partnership' }
    ]
  },
  {
    category: 'Security & Audits',
    icon: ShieldCheckIcon,
    description: 'Security firms ensuring platform safety',
    partners: [
      { name: 'CertiK', logo: '/certik.png', description: 'Smart contract security audits' },
      { name: 'Halborn', logo: '/halborn.png', description: 'Penetration testing services' },
      { name: 'OpenZeppelin', logo: '/openzepplin.png', description: 'Security framework provider' }
    ]
  }
];

const integrationStats = [
  { metric: '15+', label: 'Active Integrations' },
  { metric: '$2.5M+', label: 'Volume Supported' },
  { metric: '99.97%', label: 'Uptime SLA' },
  { metric: '< 1s', label: 'Response Time' }
];

export default function PartnersPage() {
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
            <span className="text-gradient">Our Partners</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Trusted by leading DeFi protocols and blockchain infrastructure providers. 
            Join our growing ecosystem of oracle-powered applications.
          </p>
          <div className="mt-4 inline-block px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              📊 Demo data for now - Real live platform launch TBA
            </p>
          </div>
        </motion.div>

        {/* Integration Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {integrationStats.map((stat, index) => (
            <div key={index} className="card-liquid-glass p-6 text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">{stat.metric}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Partner Categories */}
        <div className="space-y-16">
          {partners.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <motion.section
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="p-3 bg-primary-500/20 rounded-lg">
                      <IconComponent className="w-8 h-8 text-primary-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{category.category}</h2>
                  </div>
                  <p className="text-gray-300 max-w-2xl mx-auto">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {category.partners.map((partner, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card-liquid-glass p-6 text-center hover:scale-105 transition-all duration-300"
                    >
                      <div className="w-20 h-20 bg-white/5 rounded-lg mx-auto mb-4 flex items-center justify-center p-3">
                        <img 
                          src={partner.logo} 
                          alt={`${partner.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{partner.name}</h3>
                      <p className="text-gray-300 text-sm">{partner.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Become a Partner CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 text-center"
        >
          <div className="card-liquid-glass p-12">
            <BuildingOfficeIcon className="w-16 h-16 text-primary-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Become a Partner
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join our growing ecosystem and integrate reliable oracle data into your protocol. 
              We provide comprehensive support for technical integration and go-to-market strategies.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Technical Support</h3>
                <p className="text-sm text-gray-300">
                  Dedicated developer support, custom integrations, and technical documentation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Marketing Co-op</h3>
                <p className="text-sm text-gray-300">
                  Joint marketing campaigns, community cross-promotion, and ecosystem growth.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-400 mb-2">Revenue Sharing</h3>
                <p className="text-sm text-gray-300">
                  Competitive revenue sharing models and long-term partnership benefits.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:incryptinvestments@protonmail.com"
                className="btn-holographic"
              >
                Contact Partnerships Team
              </a>
              <Link href="/docs" className="btn-holographic">
                Integration Documentation
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
