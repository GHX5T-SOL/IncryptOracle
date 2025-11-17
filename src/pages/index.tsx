import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const codeSnippets = [
  {
    title: "Quick Integration",
    language: "bash",
    code: `npm install incrypt-oracle-sdk
# Start using the oracle in your app`
  },
  {
    title: "JavaScript Usage",
    language: "javascript", 
    code: `import { IncryptOracle } from 'incrypt-oracle-sdk';

const oracle = new IncryptOracle();
const btcPrice = await oracle.getPrice('BTC/USD');
console.log('BTC Price:', btcPrice);`
  },
  {
    title: "Solidity Integration",
    language: "solidity",
    code: `pragma solidity ^0.8.20;
import "./IIncryptOracle.sol";

contract MyContract {
    IIncryptOracle oracle;
    
    function getPrice() external view returns (uint256) {
        return oracle.getLatestPrice("BTC/USD");
    }
}`
  }
];

const features = [
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Sub-second oracle updates on Binance Smart Chain with minimal gas fees"
  },
  {
    icon: "🔒", 
    title: "Decentralized Security",
    description: "Multiple validator nodes ensure data integrity and prevent manipulation"
  },
  {
    icon: "🎯",
    title: "Prediction Markets",
    description: "Purpose-built for prediction markets with specialized outcome resolution"
  },
  {
    icon: "💎",
    title: "DAO Governed",
    description: "Community-owned protocol with $IO token holder governance"
  },
  {
    icon: "📊",
    title: "Real-time Data",
    description: "Live price feeds, sports results, elections, and custom event data"
  },
  {
    icon: "🛡️",
    title: "Battle Tested",
    description: "Audited smart contracts with proven security track record"
  },
  {
    icon: "🤖",
    title: "AI-Powered",
    description: "AI validators with automatic API discovery and intelligent reasoning for faster resolutions"
  }
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-400/5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-gradient">Incrypt Oracle</span>
                <br />
                <span className="text-white">Prediction Market</span>
                <br />
                <span className="text-white">Data Feeds</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                Decentralized hybrid oracle infrastructure powering the next generation of prediction markets 
                on Binance Smart Chain. Blending AI intelligence with human intuition for faster, more accurate resolutions. 
                Fast, secure, and community-governed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/docs" className="btn-holographic text-center">
                  Learn More
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 lg:mt-0 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-3xl animate-pulse-glow" />
                <Image
                  src="/hero_img.png"
                  alt="Incrypt Oracle"
                  width={500}
                  height={500}
                  className="relative z-10 float"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-gradient">Incrypt Oracle</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built specifically for prediction markets, our oracle combines AI-powered validators with human validators 
              for unprecedented speed and accuracy. Automatic API discovery, intelligent reasoning, and reputation-weighted consensus 
              ensure reliable data feeds with community governance.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-liquid-glass p-6 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              How <span className="text-gradient">It Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our decentralized oracle network ensures accurate and tamper-proof data for prediction markets
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "AI-Powered Data Discovery",
                description: "AI validators automatically discover relevant APIs and fetch data from multiple sources using intelligent analysis",
                icon: "🤖"
              },
              {
                step: "2",
                title: "Hybrid Validation",
                description: "AI and human validators submit data, with AI providing detailed reasoning and metadata for transparency",
                icon: "🤝"
              },
              {
                step: "3", 
                title: "Reputation-Weighted Consensus",
                description: "Validators reach consensus through reputation-weighted voting, with AI validators starting with higher reputation",
                icon: "⚖️"
              },
              {
                step: "4",
                title: "Fast Market Resolution", 
                description: "Optimistic resolution enables 1-4 hour market settlement vs traditional 24-48 hour delays",
                icon: "✅"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-holographic">
                    <span className="text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  <div className="text-4xl mb-4">{step.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section className="py-20 px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Developer <span className="text-gradient">Integration</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started with our oracle in minutes. Simple APIs, comprehensive documentation.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {codeSnippets.map((snippet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-liquid-glass p-6"
              >
                <h3 className="text-lg font-semibold text-primary-400 mb-4">{snippet.title}</h3>
                <div className="bg-dark-950 rounded-lg p-4 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs uppercase tracking-wide">{snippet.language}</span>
                    <button className="text-primary-400 hover:text-primary-300 text-xs">Copy</button>
                  </div>
                  <pre className="text-gray-300 overflow-x-auto">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/sdk" className="btn-holographic">
              View Full SDK Documentation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Validators", value: "2+", icon: "👥" },
              { label: "Data Feeds", value: "50+", icon: "📊" },
              { label: "Markets Resolved", value: "7+", icon: "✅" },
              { label: "Total Volume", value: "$5,300", icon: "💰", subtitle: "(testnet BSC)" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-liquid-glass p-6"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
                {stat.subtitle && <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-primary-500/10 to-primary-400/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the decentralized oracle revolution powered by AI and human validators. 
              Experience faster resolutions, automatic API discovery, and intelligent consensus 
              for the next generation of prediction markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs" className="btn-holographic">
                Read Documentation
              </Link>
              <Link href="/dao" className="btn-holographic">
                Join the DAO
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
