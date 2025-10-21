import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ChartBarIcon,
  FireIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  CheckBadgeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import LoadingSpinner, { LoadingCard } from '../components/LoadingSpinner';
import ConnectWallet from '../components/ConnectWallet';

// Mock data - in real app this would come from blockchain
const mockMarkets = [
  {
    id: 1,
    question: "Will Bitcoin reach $100,000 before January 1, 2025?",
    description: "Prediction market for Bitcoin price reaching $100,000 USD on any major exchange (Binance, Coinbase, Kraken) before January 1, 2025.",
    category: "Crypto",
    endTime: new Date('2024-12-31T23:59:59Z').getTime(),
    resolutionTime: new Date('2025-01-01T12:00:00Z').getTime(),
    creator: "0x1234...5678",
    totalLiquidity: 125000,
    volume24h: 15000,
    yesOdds: 0.68,
    noOdds: 0.32,
    resolved: false,
    trending: true,
    participants: 1247
  },
  {
    id: 2,
    question: "Will the next US Federal Reserve rate decision be a cut?",
    description: "Will the Federal Reserve announce an interest rate cut at their next meeting?",
    category: "Economics", 
    endTime: new Date('2024-12-18T20:00:00Z').getTime(),
    resolutionTime: new Date('2024-12-19T08:00:00Z').getTime(),
    creator: "0xabcd...ef90",
    totalLiquidity: 89000,
    volume24h: 8500,
    yesOdds: 0.45,
    noOdds: 0.55,
    resolved: false,
    trending: false,
    participants: 892
  },
  {
    id: 3,
    question: "Will SpaceX successfully launch Starship to Mars in 2025?",
    description: "Will SpaceX achieve a successful uncrewed Starship mission to Mars orbit in 2025?",
    category: "Technology",
    endTime: new Date('2025-12-31T23:59:59Z').getTime(),
    resolutionTime: new Date('2026-01-05T12:00:00Z').getTime(),
    creator: "0x9876...5432",
    totalLiquidity: 203000,
    volume24h: 32000,
    yesOdds: 0.28,
    noOdds: 0.72,
    resolved: false,
    trending: true,
    participants: 2156
  },
  {
    id: 4,
    question: "Will Ethereum's price exceed $5,000 in 2024?",
    description: "Prediction on whether ETH will reach above $5,000 USD on any major exchange before December 31, 2024.",
    category: "Crypto",
    endTime: new Date('2024-12-31T23:59:59Z').getTime(),
    resolutionTime: new Date('2025-01-01T12:00:00Z').getTime(),
    creator: "0x5555...1111",
    totalLiquidity: 156000,
    volume24h: 19500,
    yesOdds: 0.52,
    noOdds: 0.48,
    resolved: false,
    trending: false,
    participants: 1834
  }
];

const mockUserPositions = [
  {
    marketId: 1,
    yesShares: 150,
    noShares: 0,
    totalInvested: 420,
    currentValue: 567,
    pnl: 147
  },
  {
    marketId: 3,
    yesShares: 0,
    noShares: 280,
    totalInvested: 320,
    currentValue: 380,
    pnl: 60
  }
];

interface Market {
  id: number;
  question: string;
  description: string;
  category: string;
  endTime: number;
  resolutionTime: number;
  creator: string;
  totalLiquidity: number;
  volume24h: number;
  yesOdds: number;
  noOdds: number;
  resolved: boolean;
  trending: boolean;
  participants: number;
}

function MarketCard({ market, onViewDetails }: { market: Market; onViewDetails: (market: Market) => void }) {
  const timeUntilEnd = market.endTime - Date.now();
  const timeUntilResolution = market.resolutionTime - Date.now();
  const isEnded = timeUntilEnd <= 0;
  const isResolved = market.resolved;

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return 'Ended';
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <motion.div
      className="market-card cursor-pointer"
      onClick={() => onViewDetails(market)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full">
            {market.category}
          </span>
          {market.trending && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">
              <FireIcon className="w-3 h-3" />
              <span>Hot</span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <ClockIcon className="w-4 h-4" />
          <span>{formatTimeRemaining(timeUntilEnd)}</span>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
        {market.question}
      </h3>

      {/* Odds Display */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-green-400 font-medium">Yes</span>
            <TrendingUpIcon className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-xl font-bold text-green-400">
            ${(market.yesOdds).toFixed(2)}
          </div>
          <div className="text-xs text-green-300">
            {(market.yesOdds * 100).toFixed(0)}% chance
          </div>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-red-400 font-medium">No</span>
            <TrendingDownIcon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-400">
            ${(market.noOdds).toFixed(2)}
          </div>
          <div className="text-xs text-red-300">
            {(market.noOdds * 100).toFixed(0)}% chance
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <div className="text-gray-400">Volume 24h</div>
          <div className="text-white font-semibold">
            ${(market.volume24h / 1000).toFixed(0)}k
          </div>
        </div>
        <div>
          <div className="text-gray-400">Liquidity</div>
          <div className="text-white font-semibold">
            ${(market.totalLiquidity / 1000).toFixed(0)}k
          </div>
        </div>
        <div>
          <div className="text-gray-400">Traders</div>
          <div className="text-white font-semibold">
            {market.participants}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            Resolution: {new Date(market.resolutionTime).toLocaleDateString()}
          </span>
          <div className="flex items-center space-x-1">
            {isResolved ? (
              <CheckBadgeIcon className="w-4 h-4 text-green-400" />
            ) : isEnded ? (
              <XCircleIcon className="w-4 h-4 text-yellow-400" />
            ) : (
              <ClockIcon className="w-4 h-4 text-blue-400" />
            )}
            <span className={`${
              isResolved ? 'text-green-400' : 
              isEnded ? 'text-yellow-400' : 
              'text-blue-400'
            }`}>
              {isResolved ? 'Resolved' : isEnded ? 'Ended' : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MarketDetailModal({ market, onClose }: { market: Market; onClose: () => void }) {
  const [betAmount, setBetAmount] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no'>('yes');
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  const handleBet = async () => {
    if (!isConnected || !betAmount) return;
    
    setLoading(true);
    try {
      // Simulate bet transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Bet placed: ${betAmount} IO tokens on ${selectedOutcome.toUpperCase()}`);
      setBetAmount('');
    } catch (error) {
      console.error('Bet failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card-liquid-glass max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full">
                  {market.category}
                </span>
                {market.trending && (
                  <span className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">
                    <FireIcon className="w-3 h-3" />
                    <span>Trending</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{market.question}</h2>
              <p className="text-gray-300">{market.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Odds and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Current Odds */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Current Odds</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUpIcon className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Yes</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400">
                      ${market.yesOdds.toFixed(2)}
                    </div>
                    <div className="text-xs text-green-300">
                      {(market.yesOdds * 100).toFixed(0)}% implied probability
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingDownIcon className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-medium">No</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-400">
                      ${market.noOdds.toFixed(2)}
                    </div>
                    <div className="text-xs text-red-300">
                      {(market.noOdds * 100).toFixed(0)}% implied probability
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Market Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Liquidity</span>
                  <span className="text-white font-semibold">
                    ${market.totalLiquidity.toLocaleString()} IO
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="text-white font-semibold">
                    ${market.volume24h.toLocaleString()} IO
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Traders</span>
                  <span className="text-white font-semibold">
                    {market.participants}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Creator</span>
                  <span className="text-white font-mono text-sm">
                    {market.creator}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">End Time</span>
                  <span className="text-white">
                    {new Date(market.endTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Resolution Time</span>
                  <span className="text-white">
                    {new Date(market.resolutionTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Betting Interface */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Place Your Bet</h3>
            
            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Connect your wallet to place bets</p>
                <ConnectWallet />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Outcome Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedOutcome('yes')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      selectedOutcome === 'yes'
                        ? 'border-green-500 bg-green-500/20 text-green-400'
                        : 'border-green-500/20 bg-green-500/5 text-green-300 hover:bg-green-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingUpIcon className="w-5 h-5" />
                      <span className="font-medium">Yes - ${market.yesOdds.toFixed(2)}</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedOutcome('no')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      selectedOutcome === 'no'
                        ? 'border-red-500 bg-red-500/20 text-red-400'
                        : 'border-red-500/20 bg-red-500/5 text-red-300 hover:bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingDownIcon className="w-5 h-5" />
                      <span className="font-medium">No - ${market.noOdds.toFixed(2)}</span>
                    </div>
                  </button>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bet Amount (IO tokens)
                  </label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="input-holographic w-full"
                    min="0"
                    step="0.01"
                  />
                  
                  {betAmount && (
                    <div className="mt-2 text-sm text-gray-400">
                      Potential return: ~{((parseFloat(betAmount) * (selectedOutcome === 'yes' ? market.yesOdds : market.noOdds)) - parseFloat(betAmount)).toFixed(2)} IO tokens
                    </div>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex space-x-2">
                  {[10, 50, 100, 500].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount.toString())}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                    >
                      {amount} IO
                    </button>
                  ))}
                </div>

                {/* Place Bet Button */}
                <Button
                  onClick={handleBet}
                  loading={loading}
                  disabled={!betAmount || parseFloat(betAmount) <= 0}
                  className="w-full"
                  size="lg"
                >
                  Place {selectedOutcome.toUpperCase()} Bet
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function UserPositions() {
  return (
    <div className="space-y-4">
      {mockUserPositions.map((position, index) => {
        const market = mockMarkets.find(m => m.id === position.marketId);
        if (!market) return null;

        const isProfitable = position.pnl > 0;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-liquid-glass p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-white text-sm line-clamp-1">
                {market.question}
              </h3>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                isProfitable 
                  ? 'bg-green-500/20 text-green-400' 
                  : position.pnl < 0 
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-500/20 text-gray-400'
              }`}>
                {isProfitable ? '+' : ''}{position.pnl.toFixed(0)} IO
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-gray-400">Position</div>
                <div className="text-white font-medium">
                  {position.yesShares > 0 ? `${position.yesShares} YES` : `${position.noShares} NO`}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Invested</div>
                <div className="text-white font-medium">{position.totalInvested} IO</div>
              </div>
              <div>
                <div className="text-gray-400">Current Value</div>
                <div className="text-white font-medium">{position.currentValue} IO</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function PredictPage() {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  const categories = ['All', 'Crypto', 'Technology', 'Economics', 'Sports', 'Politics'];

  const filteredMarkets = mockMarkets.filter(market => {
    const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         market.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || market.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <span className="text-gradient">IncryptPredict</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Decentralized prediction markets powered by Incrypt Oracle. 
            Bet on future events with transparent, automated resolution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - User Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card-liquid-glass p-6 sticky top-8 space-y-6">
              {/* User Stats */}
              {isConnected ? (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Your Portfolio</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Balance</span>
                      <span className="text-white font-semibold">1,250 IO</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Positions</span>
                      <span className="text-white font-semibold">{mockUserPositions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total P&L</span>
                      <span className="text-green-400 font-semibold">
                        +{mockUserPositions.reduce((sum, pos) => sum + pos.pnl, 0)} IO
                      </span>
                    </div>
                  </div>
                  
                  {mockUserPositions.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-white mb-3">Active Positions</h4>
                      <UserPositions />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">Connect your wallet to view your portfolio</p>
                  <ConnectWallet />
                </div>
              )}

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Market Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Markets</span>
                    <span className="text-white font-semibold">{mockMarkets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Volume</span>
                    <span className="text-white font-semibold">
                      ${(mockMarkets.reduce((sum, m) => sum + m.volume24h, 0) / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Liquidity</span>
                    <span className="text-white font-semibold">
                      ${(mockMarkets.reduce((sum, m) => sum + m.totalLiquidity, 0) / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Search and Filters */}
            <div className="card-liquid-glass p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search markets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-holographic pl-10"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-holographic pr-8 appearance-none cursor-pointer"
                    aria-label="Filter markets by category"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-dark-900">
                        {category}
                      </option>
                    ))}
                  </select>
                  <FunnelIcon className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Market Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : filteredMarkets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMarkets.map((market, index) => (
                  <motion.div
                    key={market.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MarketCard 
                      market={market} 
                      onViewDetails={setSelectedMarket}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card-liquid-glass p-12 text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No markets found</h3>
                <p className="text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Market Detail Modal */}
        {selectedMarket && (
          <MarketDetailModal
            market={selectedMarket}
            onClose={() => setSelectedMarket(null)}
          />
        )}
      </div>
    </div>
  );
}
