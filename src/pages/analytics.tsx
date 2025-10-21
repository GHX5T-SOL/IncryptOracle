import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CpuChipIcon,
  UserGroupIcon,
  BanknotesIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';

// Mock analytics data
const mockData = {
  overview: {
    totalUsers: 5247,
    totalVolume: 2500000,
    activeMarkets: 23,
    oracleUptime: 99.97,
    validators: 21,
    totalStaked: 850000
  },
  volumeData: [
    { date: '2024-01-08', volume: 180000 },
    { date: '2024-01-09', volume: 220000 },
    { date: '2024-01-10', volume: 195000 },
    { date: '2024-01-11', volume: 245000 },
    { date: '2024-01-12', volume: 310000 },
    { date: '2024-01-13', volume: 285000 },
    { date: '2024-01-14', volume: 350000 }
  ],
  marketCategories: [
    { name: 'Crypto', value: 45, color: '#ffb500' },
    { name: 'Sports', value: 25, color: '#10b981' },
    { name: 'Politics', value: 15, color: '#3b82f6' },
    { name: 'Economics', value: 10, color: '#8b5cf6' },
    { name: 'Technology', value: 5, color: '#f59e0b' }
  ],
  userGrowth: [
    { month: 'Oct', users: 1200 },
    { month: 'Nov', users: 2100 },
    { month: 'Dec', users: 3800 },
    { month: 'Jan', users: 5247 }
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
    { question: 'Will Bitcoin reach $100k in 2024?', volume: 450000, traders: 1247 },
    { question: 'US Election Winner 2024?', volume: 320000, traders: 892 },
    { question: 'ETH price above $5k in 2024?', volume: 280000, traders: 743 },
    { question: 'Fed rate cut in Q1 2024?', volume: 190000, traders: 567 },
    { question: 'SpaceX Mars mission success?', volume: 150000, traders: 445 }
  ]
};

function StatCard({ title, value, change, icon: Icon, trend }: any) {
  const isPositive = change > 0;
  
  return (
    <motion.div
      className="card-liquid-glass p-6"
      whileHover={{ scale: 1.02 }}
    >
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
    </motion.div>
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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);

  const timeRanges = [
    { key: '24h', label: '24H' },
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: '90d', label: '90D' }
  ];

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
            <span className="text-gradient">Analytics Dashboard</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time insights into the Incrypt Oracle ecosystem. Monitor oracle uptime, 
            market performance, user growth, and platform metrics.
          </p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-4 mb-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Platform Overview</h2>
            <div className="flex space-x-2">
              {timeRanges.map((range) => (
                <button
                  key={range.key}
                  onClick={() => setTimeRange(range.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeRange === range.key
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Volume Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-liquid-glass p-6"
          >
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
          </motion.div>

          {/* Market Categories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card-liquid-glass p-6"
          >
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
          </motion.div>
        </div>

        {/* User Growth & Oracle Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-liquid-glass p-6"
          >
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
          </motion.div>

          {/* Oracle Uptime */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-liquid-glass p-6"
          >
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
          </motion.div>
        </div>

        {/* Top Markets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top Markets by Volume</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <FireIcon className="w-4 h-4" />
              <span>Last 7 days</span>
            </div>
          </div>

          <div className="space-y-4">
            {mockData.topMarkets.map((market, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real-time Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-liquid-glass p-6"
        >
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
              <div className="text-lg font-semibold text-purple-400">21 Online</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
