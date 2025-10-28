import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  CurrencyDollarIcon,
  UsersIcon,
  GiftIcon,
  Cog6ToothIcon,
  BanknotesIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface TokenAllocation {
  name: string;
  value: number;
  percentage: number;
  color: string;
  description: string;
}

const COLORS = {
  liquidity: '#FFB500',
  validator: '#10B981',
  staking: '#3B82F6',
  airdrop: '#F59E0B',
  partnerships: '#8B5CF6',
  development: '#EC4899',
};

const totalSupply = 1000000000; // 1 billion tokens
const devBuyPercentage = 12;
const devBuyAmount = totalSupply * (devBuyPercentage / 100); // 120 million tokens
const liquidityPoolAmount = totalSupply - devBuyAmount; // 880 million tokens

const devBuyDistribution: TokenAllocation[] = [
  {
    name: 'Team Validator Account',
    value: 40000000, // 4% of total supply
    percentage: 4,
    color: COLORS.validator,
    description: 'Tokens allocated for team validator nodes to ensure network security and initial oracle operations'
  },
  {
    name: 'Reward Pool for Stakers',
    value: 30000000, // 3% of total supply
    percentage: 3,
    color: COLORS.staking,
    description: 'Incentives for early stakers and long-term token holders who stake $IO tokens'
  },
  {
    name: 'Airdrop Campaign',
    value: 20000000, // 2% of total supply
    percentage: 2,
    color: COLORS.airdrop,
    description: 'Community airdrop campaigns to reward early supporters and bootstrap user adoption'
  },
  {
    name: 'Partnerships & Collaborations',
    value: 20000000, // 2% of total supply
    percentage: 2,
    color: COLORS.partnerships,
    description: 'Strategic partnerships, integrations, and collaborations to expand the ecosystem'
  },
  {
    name: 'Development Fund',
    value: 10000000, // 1% of total supply
    percentage: 1,
    color: COLORS.development,
    description: 'Ongoing development, maintenance, audits, and protocol improvements'
  },
];

const overallDistribution: TokenAllocation[] = [
  {
    name: 'Four Meme Liquidity Pool',
    value: liquidityPoolAmount,
    percentage: 88,
    color: COLORS.liquidity,
    description: 'Fair launch liquidity pool on Four Meme platform - available for public trading'
  },
  {
    name: 'Initial Developer Purchase (12%)',
    value: devBuyAmount,
    percentage: 12,
    color: '#6366F1',
    description: 'Initial developer allocation distributed across validator, staking, airdrop, partnerships, and development'
  },
];

export default function TokenomicsPage() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(0)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-dark-900/95 border border-white/20 rounded-lg p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">{data.name}</p>
          <p className="text-primary-400 text-sm">
            {data.value.toLocaleString()} tokens
          </p>
          <p className="text-gray-300 text-sm">
            {data.payload.percentage}% of total supply
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any) => {
    if (entry.percentage > 5) {
      return (
        <text
          x={entry.cx}
          y={entry.cy}
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-semibold"
        >
          {`${entry.percentage}%`}
        </text>
      );
    }
    return null;
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-400/5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-gradient">$IO Token</span>
              <br />
              <span className="text-white">Tokenomics</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Fair launch on Four Meme platform with transparent token distribution 
              designed to support long-term ecosystem growth and decentralized governance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="card-liquid-glass p-6"
              >
                <CurrencyDollarIcon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gradient mb-2">
                  {formatNumber(totalSupply)}
                </div>
                <div className="text-gray-300">Total Supply</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card-liquid-glass p-6"
              >
                <FireIcon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gradient mb-2">
                  {devBuyPercentage}%
                </div>
                <div className="text-gray-300">Initial Dev Buy</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card-liquid-glass p-6"
              >
                <BanknotesIcon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gradient mb-2">
                  {88}%
                </div>
                <div className="text-gray-300">Fair Launch Pool</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fair Launch Section */}
      <section className="py-20 px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card-liquid-glass p-8 lg:p-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <FireIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Fair Launch on Four Meme
              </h2>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 space-y-4 text-lg">
              <p>
                The $IO token will be <strong className="text-white">fair-launched</strong> on the 
                <strong className="text-primary-400"> Four Meme</strong> platform, ensuring complete 
                transparency and equal opportunity for all participants. Unlike traditional token launches 
                with pre-sales, private rounds, or seed allocations, this fair launch model eliminates 
                early advantages and creates a level playing field.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 bg-dark-950/50 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">Initial Developer Purchase</h3>
                  <p className="text-gray-300">
                    The development team will make an initial purchase of <strong className="text-primary-400">12%</strong> of 
                    the total supply (120,000,000 $IO tokens). This allocation is strategically distributed 
                    across essential ecosystem functions as detailed below.
                  </p>
                </div>

                <div className="p-6 bg-dark-950/50 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-3">Public Liquidity Pool</h3>
                  <p className="text-gray-300">
                    The remaining <strong className="text-primary-400">88%</strong> of tokens 
                    (880,000,000 $IO tokens) will be available in the Four Meme liquidity pool, 
                    ensuring ample liquidity and fair price discovery from launch day.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overall Distribution Chart */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Overall <span className="text-gradient">Token Distribution</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Complete breakdown of the 1 billion $IO token supply across fair launch and developer allocation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card-liquid-glass p-8"
            >
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={overallDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {overallDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value, entry: any) => (
                      <span className="text-white">{value} ({entry.payload.percentage}%)</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {overallDistribution.map((item, index) => (
                <div
                  key={index}
                  className="card-liquid-glass p-6 hover:bg-white/10 transition-all duration-300"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <span className="text-primary-400 font-bold">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm mb-2">
                        {item.value.toLocaleString()} tokens
                      </div>
                      <p className="text-gray-300 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Developer Allocation Breakdown */}
      <section className="py-20 px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Developer Allocation <span className="text-gradient">Breakdown</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Detailed distribution of the 12% initial developer purchase (120M $IO tokens) 
              across critical ecosystem functions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card-liquid-glass p-8"
            >
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={devBuyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {devBuyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '14px' }}
                    formatter={(value, entry: any) => (
                      <span className="text-white text-xs">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              {devBuyDistribution.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card-liquid-glass p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <span className="text-primary-400 font-bold">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm mb-2">
                        {item.value.toLocaleString()} tokens
                      </div>
                      <p className="text-gray-300 text-sm">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Token Utility Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              <span className="text-gradient">$IO Token</span> Utility
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The $IO token powers the entire IncryptOracle ecosystem through multiple utility functions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheckIcon,
                title: 'Governance',
                description: 'Vote on protocol upgrades, parameter changes, and treasury allocations through the DAO',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: BanknotesIcon,
                title: 'Staking',
                description: 'Stake tokens to become a validator (min 1,000 IO) and earn rewards for securing the network',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: CurrencyDollarIcon,
                title: 'Transaction Fees',
                description: 'Pay for oracle data requests and prediction market transactions using $IO tokens',
                color: 'from-primary-500 to-yellow-500'
              },
              {
                icon: ChartBarIcon,
                title: 'Revenue Sharing',
                description: '50% of platform fees distributed to token holders, 50% to treasury for development',
                color: 'from-purple-500 to-pink-500'
              },
            ].map((utility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-liquid-glass p-6 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${utility.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <utility.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{utility.title}</h3>
                <p className="text-gray-300 text-sm">{utility.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 lg:px-8 bg-dark-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Fair Launch <span className="text-gradient">Key Features</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔒',
                title: 'No Pre-sale or Seed Rounds',
                description: 'Complete transparency with no early investor advantages or preferential treatment'
              },
              {
                icon: '⚖️',
                title: 'Equal Access',
                description: 'All participants have the same opportunity to acquire tokens from the liquidity pool'
              },
              {
                icon: '📊',
                title: 'Market-Driven Price',
                description: 'Price discovery through fair market forces without artificial price manipulation'
              },
              {
                icon: '🛡️',
                title: 'Locked Developer Allocation',
                description: 'Developer tokens allocated to essential ecosystem functions, not immediate profit'
              },
              {
                icon: '🌊',
                title: 'Ample Liquidity',
                description: '88% of supply in liquidity pool ensures stable trading from day one'
              },
              {
                icon: '🎯',
                title: 'Community-First',
                description: 'Tokenomics designed to reward long-term holders and active participants'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-liquid-glass p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Table */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card-liquid-glass p-8 lg:p-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 text-center">
              Token Distribution <span className="text-gradient">Summary</span>
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-primary-400 font-semibold">Allocation</th>
                    <th className="text-right py-4 px-6 text-primary-400 font-semibold">Amount</th>
                    <th className="text-right py-4 px-6 text-primary-400 font-semibold">Percentage</th>
                    <th className="text-left py-4 px-6 text-primary-400 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-white font-medium">Four Meme Liquidity Pool</td>
                    <td className="py-4 px-6 text-right text-gray-300">880,000,000</td>
                    <td className="py-4 px-6 text-right text-primary-400 font-semibold">88%</td>
                    <td className="py-4 px-6 text-gray-300">Fair launch public trading</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-white font-medium">Team Validator Account</td>
                    <td className="py-4 px-6 text-right text-gray-300">40,000,000</td>
                    <td className="py-4 px-6 text-right text-primary-400 font-semibold">4%</td>
                    <td className="py-4 px-6 text-gray-300">Network security & validation</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-white font-medium">Reward Pool for Stakers</td>
                    <td className="py-4 px-6 text-right text-gray-300">30,000,000</td>
                    <td className="py-4 px-6 text-right text-primary-400 font-semibold">3%</td>
                    <td className="py-4 px-6 text-gray-300">Staking incentives</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-white font-medium">Airdrop Campaign</td>
                    <td className="py-4 px-6 text-right text-gray-300">20,000,000</td>
                    <td className="py-4 px-6 text-right text-primary-400 font-semibold">2%</td>
                    <td className="py-4 px-6 text-gray-300">Community rewards</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 px-6 text-white font-medium">Partnerships & Collaborations</td>
                    <td className="py-4 px-6 text-right text-gray-300">20,000,000</td>
                    <td className="py-4 px-6 text-right text-primary-400 font-semibold">2%</td>
                    <td className="py-4 px-6 text-gray-300">Strategic partnerships</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-white font-medium">Development Fund</td>
                    <td className="py-4 px-6 text-right text-gray-300">10,000,000</td>
                    <td className="py-4 px-6 text-right text-primary-400 font-semibold">1%</td>
                    <td className="py-4 px-6 text-gray-300">Protocol improvements</td>
                  </tr>
                  <tr className="border-t-2 border-primary-500/50 bg-primary-500/5">
                    <td className="py-4 px-6 text-white font-bold">Total Supply</td>
                    <td className="py-4 px-6 text-right text-white font-bold">1,000,000,000</td>
                    <td className="py-4 px-6 text-right text-primary-400 font-bold">100%</td>
                    <td className="py-4 px-6 text-gray-300">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

