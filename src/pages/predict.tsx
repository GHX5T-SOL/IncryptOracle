import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import {
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ChartBarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import LoadingSpinner, { LoadingCard } from '../components/LoadingSpinner';
import ConnectWallet from '../components/ConnectWallet';
import { useMarkets, useUserMarkets, MarketData } from '../hooks/useMarkets';
import { 
  useUserPosition, 
  useBuyShares, 
  useSellShares, 
  useClaimWinnings, 
  useCalculateCost,
  useTokenBalance,
  useApproveToken 
} from '../hooks/useContract';
import { CONTRACT_ADDRESSES } from '../utils/wagmi';
import { waitForTransaction } from 'wagmi/actions';
import { usePublicClient } from 'wagmi';
import { getUserFriendlyError, getActionableError } from '../utils/errorHandler';

interface Market {
  id: number;
  question: string;
  description: string;
  category: string;
  endTime: number;
  resolutionTime: number;
  creator: string;
  totalLiquidity: bigint | number;
  volume24h?: number;
  yesOdds: number;
  noOdds: number;
  resolved: boolean;
  trending?: boolean;
  participants?: number;
  state: number;
}

function UserPositionsCount({ userAddress, markets }: { userAddress?: string; markets: Market[] }) {
  const { userMarketIds, loading } = useUserMarkets(userAddress);
  
  if (loading) return <span>-</span>;
  if (!userMarketIds || userMarketIds.length === 0) return <span>0</span>;
  
  // Filter to only active positions
  const activeCount = userMarketIds.filter(id => {
    const market = markets.find(m => m.id === id);
    return market && !market.resolved && market.state === 0;
  }).length;
  
  return <span>{activeCount}</span>;
}

function UserPositions({ userAddress, markets }: { userAddress: string; markets: Market[] }) {
  const { userMarketIds, loading } = useUserMarkets(userAddress);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!userMarketIds || userMarketIds.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">No active positions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {userMarketIds.map((marketId) => {
        const market = markets.find(m => m.id === marketId);
        if (!market) return null;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { data: positionData } = useUserPosition(marketId, userAddress);
        
        if (!positionData || (Number(positionData[0]) === 0 && Number(positionData[1]) === 0)) {
          return null;
        }

        const noShares = Number(positionData[0]);
        const yesShares = Number(positionData[1]);
        const totalInvested = Number(formatEther(positionData[2] as bigint));
        const claimed = positionData[3] as boolean;

        // Calculate current value (simplified - would need real-time pool calculations)
        const hasPosition = yesShares > 0 || noShares > 0;
        if (!hasPosition) return null;

        return (
          <motion.div
            key={marketId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-liquid-glass p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-white text-sm line-clamp-1">
                {market.question}
              </h3>
              {claimed && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                  Claimed
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-gray-400">Position</div>
                <div className="text-white font-medium">
                  {yesShares > 0 ? `${Number(formatEther(BigInt(yesShares)))} YES` : `${Number(formatEther(BigInt(noShares)))} NO`}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Invested</div>
                <div className="text-white font-medium">{totalInvested.toFixed(2)} IO</div>
              </div>
              <div>
                <div className="text-gray-400">Status</div>
                <div className={`font-medium ${
                  market.resolved ? 'text-green-400' : 'text-blue-400'
                }`}>
                  {market.resolved ? 'Resolved' : 'Active'}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function MarketCard({ market, onViewDetails }: { market: Market; onViewDetails: (market: Market) => void }) {
  const timeUntilEnd = market.endTime - Date.now();
  const timeUntilResolution = market.resolutionTime - Date.now();
  const isEnded = timeUntilEnd <= 0;
  const isResolved = market.resolved || market.state !== 0;

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
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-xl font-bold text-green-400">
            ${market.yesOdds.toFixed(2)}
          </div>
          <div className="text-xs text-green-300">
            {(market.yesOdds * 100).toFixed(0)}% chance
          </div>
        </div>
        
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-red-400 font-medium">No</span>
            <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl font-bold text-red-400">
            ${market.noOdds.toFixed(2)}
          </div>
          <div className="text-xs text-red-300">
            {(market.noOdds * 100).toFixed(0)}% chance
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <div className="text-gray-400">Liquidity</div>
          <div className="text-white font-semibold">
            {typeof market.totalLiquidity === 'number'
              ? market.totalLiquidity > 1000
                ? `${(market.totalLiquidity / 1000).toFixed(1)}k`
                : market.totalLiquidity.toFixed(0)
              : Number(formatEther(market.totalLiquidity as bigint)) > 1000
                ? `${(Number(formatEther(market.totalLiquidity as bigint)) / 1000).toFixed(1)}k`
                : Number(formatEther(market.totalLiquidity as bigint)).toFixed(0)
            } IO
          </div>
        </div>
        <div>
          <div className="text-gray-400">Creator</div>
          <div className="text-white font-semibold text-xs">
            {market.creator.slice(0, 6)}...{market.creator.slice(-4)}
          </div>
        </div>
        <div>
          <div className="text-gray-400">Status</div>
          <div className={`font-semibold ${
            isResolved ? 'text-green-400' : 
            isEnded ? 'text-yellow-400' : 
            'text-blue-400'
          }`}>
            {isResolved ? 'Resolved' : isEnded ? 'Ended' : 'Active'}
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
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  
  // Convert outcome to enum: Yes = 1, No = 0
  const outcomeEnum = selectedOutcome === 'yes' ? 1 : 0;
  const betAmountWei = betAmount ? parseEther(betAmount) : undefined;
  
  // Calculate cost before purchase
  const { data: costData } = useCalculateCost(
    market.id, 
    outcomeEnum, 
    betAmountWei
  );
  
  // Token balance for user
  const { data: balanceData } = useTokenBalance(address);
  const balance = balanceData ? Number(formatEther(balanceData as bigint)) : 0;
  
  // Approve hook
  const { writeAsync: approveToken, isLoading: approving } = useApproveToken(
    CONTRACT_ADDRESSES.PREDICTION_MARKET,
    costData as bigint
  );
  
  // Buy shares hook
  const { writeAsync: buyShares, isLoading: buying } = useBuyShares(
    market.id,
    outcomeEnum,
    betAmountWei
  );

  const handleBet = async () => {
    if (!isConnected || !betAmount || !betAmountWei) {
      setError('Please enter a valid amount');
      return;
    }

    if (Number(betAmount) > balance) {
      setError('Insufficient balance');
      return;
    }

    if (!costData || costData === 0n) {
      setError('Unable to calculate cost. Please try again.');
      return;
    }

    setError(null);
    setTxStatus('pending');

    try {
      // Check if approval is needed
      // For simplicity, we'll try to approve first if needed
      // In production, check allowance first
      try {
        await approveToken?.();
      } catch (err: any) {
        // If already approved, continue
        if (!err.message?.includes('rejected')) {
          console.warn('Approval skipped or already approved');
        }
      }

      // Execute buy shares transaction
      if (!buyShares) {
        throw new Error('Buy shares function not available');
      }

      const hash = await buyShares();
      
      if (publicClient && hash) {
        await waitForTransaction(publicClient, { hash });
      }

      setTxStatus('success');
      setBetAmount('');
      
      // Close modal after success (optional, or keep open for another bet)
      setTimeout(() => {
        setTxStatus('idle');
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Bet failed:', error);
      setTxStatus('error');
      const errorInfo = getActionableError(error);
      setError(errorInfo.message);
    }
  };
  
  const isLoading = approving || buying || txStatus === 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={onClose}>
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
                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
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
                    <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />
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
                    {typeof market.totalLiquidity === 'number'
                      ? market.totalLiquidity.toLocaleString()
                      : Number(formatEther(market.totalLiquidity as bigint)).toLocaleString()
                    } IO
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
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-semibold ${
                    market.resolved ? 'text-green-400' : 
                    market.state === 0 ? 'text-blue-400' : 
                    'text-yellow-400'
                  }`}>
                    {market.resolved ? 'Resolved' : market.state === 0 ? 'Active' : 'Ended'}
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
            ) : market.resolved || market.state !== 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">This market is no longer active for trading</p>
                {market.resolved && address && (
                  <div className="mt-4">
                    <ClaimWinningsButton marketId={market.id} />
                  </div>
                )}
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
                      <ArrowTrendingUpIcon className="w-5 h-5" />
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
                      <ArrowTrendingDownIcon className="w-5 h-5" />
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
                  
                  {betAmount && costData && (
                    <div className="mt-2 text-sm text-gray-400">
                      Estimated cost: ~{Number(formatEther(costData as bigint)).toFixed(4)} IO tokens
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
                      disabled={amount > balance}
                    >
                      {amount} IO
                    </button>
                  ))}
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 text-sm">{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {txStatus === 'success' && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-green-300 text-sm">
                    Transaction successful! Your bet has been placed.
                  </div>
                )}

                {/* Place Bet Button */}
                <Button
                  onClick={handleBet}
                  loading={isLoading}
                  disabled={!betAmount || parseFloat(betAmount) <= 0 || isLoading || market.resolved || market.state !== 0}
                  className="w-full"
                  size="lg"
                >
                  {isLoading 
                    ? (approving ? 'Approving...' : buying ? 'Placing Bet...' : 'Processing...')
                    : `Place ${selectedOutcome.toUpperCase()} Bet`
                  }
                </Button>
                
                {/* Cost Preview */}
                {costData && betAmount && (
                  <div className="text-sm text-gray-400 text-center mt-2">
                    Cost: ~{Number(formatEther(costData as bigint)).toFixed(4)} IO tokens
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ClaimWinningsButton({ marketId }: { marketId: number }) {
  const { writeAsync: claimWinnings, isLoading } = useClaimWinnings(marketId);
  const publicClient = usePublicClient();
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    if (!claimWinnings) return;
    
    setError(null);
    try {
      const hash = await claimWinnings();
      if (publicClient && hash) {
        await waitForTransaction(publicClient, { hash });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to claim winnings');
    }
  };

  return (
    <div>
      <Button onClick={handleClaim} loading={isLoading} disabled={isLoading}>
        Claim Winnings
      </Button>
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

export default function PredictPage() {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { address, isConnected } = useAccount();
  
  // Fetch markets from blockchain
  const { markets: blockchainMarkets, loading: marketsLoading, error: marketsError, refetch: refetchMarkets } = useMarkets();
  const { data: balanceData } = useTokenBalance(address);
  const balance = balanceData ? Number(formatEther(balanceData as bigint)) : 0;

  // Transform blockchain markets to Market interface
  const markets: Market[] = useMemo(() => {
    if (!blockchainMarkets) return [];
    
    return blockchainMarkets.map((m: MarketData) => ({
      id: m.id,
      question: m.question,
      description: m.description,
      category: m.category,
      endTime: m.endTime * 1000, // Convert to milliseconds
      resolutionTime: m.resolutionTime * 1000,
      creator: m.creator,
      totalLiquidity: Number(formatEther(m.totalLiquidity)),
      yesOdds: m.yesOdds || 0.5,
      noOdds: m.noOdds || 0.5,
      resolved: m.resolved || m.state !== 0,
      state: m.state,
      // Volume and participants would need additional tracking/events
      volume24h: 0, // TODO: Track from events
      participants: 0, // TODO: Track from events
      trending: false, // TODO: Calculate from recent activity
    }));
  }, [blockchainMarkets]);

  // Get unique categories from markets
  const categories = useMemo(() => {
    const uniqueCategories = new Set(markets.map(m => m.category));
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [markets]);

  const filteredMarkets = useMemo(() => {
    return markets.filter(market => {
      const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           market.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || market.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [markets, searchQuery, selectedCategory]);
  
  // Calculate total stats
  const totalLiquidity = useMemo(() => {
    return markets.reduce((sum, m) => sum + (typeof m.totalLiquidity === 'number' ? m.totalLiquidity : Number(formatEther(m.totalLiquidity as bigint))), 0);
  }, [markets]);
  
  const activeMarketsCount = useMemo(() => {
    return markets.filter(m => !m.resolved && m.state === 0).length;
  }, [markets]);

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
          <div className="mt-4 inline-block px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-300">
              ✓ Live blockchain integration - Real markets powered by Incrypt Oracle
            </p>
          </div>
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
                      <span className="text-white font-semibold">
                        {balance.toFixed(2)} IO
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Positions</span>
                      <span className="text-white font-semibold">
                        <UserPositionsCount userAddress={address} markets={markets} />
                      </span>
                    </div>
                  </div>
                  
                  {address && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-white mb-3">Active Positions</h4>
                      <UserPositions userAddress={address} markets={markets} />
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
                    <span className="text-white font-semibold">{activeMarketsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Markets</span>
                    <span className="text-white font-semibold">{markets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Liquidity</span>
                    <span className="text-white font-semibold">
                      {totalLiquidity > 1000 
                        ? `${(totalLiquidity / 1000).toFixed(1)}k IO`
                        : `${totalLiquidity.toFixed(0)} IO`
                      }
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

            {/* Error Display */}
            {marketsError && (
              <div className="card-liquid-glass p-6 bg-red-500/10 border border-red-500/30">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1">Error Loading Markets</h3>
                    <p className="text-red-300 text-sm">{marketsError.message || 'Failed to load markets from blockchain'}</p>
                    <button 
                      onClick={() => refetchMarkets()} 
                      className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Market Grid */}
            {marketsLoading ? (
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
                  {markets.length === 0 
                    ? 'No markets have been created yet. Be the first to create one!'
                    : 'Try adjusting your search or filter criteria'
                  }
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
