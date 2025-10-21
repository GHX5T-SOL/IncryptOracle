import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  GiftIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import ConnectWallet from '../components/ConnectWallet';

const mockStakingData = {
  userStaking: {
    stakedAmount: 5000,
    pendingRewards: 125,
    totalClaimed: 890,
    stakingTimestamp: Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days ago
  },
  globalStats: {
    totalStaked: 850000,
    currentAPY: 18.5,
    totalStakers: 1247,
    nextDistribution: Date.now() + 3 * 24 * 60 * 60 * 1000 // 3 days from now
  }
};

export default function StakingPage() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState(''); 
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  const handleStake = async () => {
    if (!stakeAmount || !isConnected) return;
    
    setLoading(true);
    try {
      // Simulate staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Staked ${stakeAmount} IO tokens successfully!`);
      setStakeAmount('');
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || !isConnected) return;
    
    setLoading(true);
    try {
      // Simulate unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Unstaked ${unstakeAmount} IO tokens successfully!`);
      setUnstakeAmount('');
    } catch (error) {
      console.error('Unstaking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!isConnected) return;
    
    setLoading(true);
    try {
      // Simulate claim transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Claimed ${mockStakingData.userStaking.pendingRewards} IO tokens in rewards!`);
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeUntilDistribution = (timestamp: number) => {
    const diff = timestamp - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
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
            <span className="text-gradient">Stake $IO Tokens</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stake your $IO tokens to earn a share of platform revenues. 
            50% of all fees are distributed proportionally to stakers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staking Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Global Stats */}
            <div className="card-liquid-glass p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Staking Overview</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400 mb-1">
                    {mockStakingData.globalStats.currentAPY}%
                  </div>
                  <div className="text-sm text-gray-400">Current APY</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {(mockStakingData.globalStats.totalStaked / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-gray-400">Total Staked</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    {mockStakingData.globalStats.totalStakers}
                  </div>
                  <div className="text-sm text-gray-400">Total Stakers</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">
                    {formatTimeUntilDistribution(mockStakingData.globalStats.nextDistribution)}
                  </div>
                  <div className="text-sm text-gray-400">Next Distribution</div>
                </div>
              </div>
            </div>

            {/* Staking Actions */}
            {isConnected ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stake Tokens */}
                <div className="card-liquid-glass p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BanknotesIcon className="w-6 h-6 text-primary-400" />
                    <h3 className="text-xl font-semibold text-white">Stake Tokens</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount to Stake
                      </label>
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="Enter IO amount..."
                        className="input-holographic w-full"
                        min="0"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      {[100, 500, 1000, 5000].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setStakeAmount(amount.toString())}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                    
                    <Button
                      onClick={handleStake}
                      loading={loading}
                      disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                      className="w-full"
                    >
                      <BanknotesIcon className="w-4 h-4 mr-2" />
                      Stake Tokens
                    </Button>
                  </div>
                </div>

                {/* Unstake Tokens */}
                <div className="card-liquid-glass p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-red-400" />
                    <h3 className="text-xl font-semibold text-white">Unstake Tokens</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Amount to Unstake
                      </label>
                      <input
                        type="number"
                        value={unstakeAmount}
                        onChange={(e) => setUnstakeAmount(e.target.value)}
                        placeholder="Enter IO amount..."
                        className="input-holographic w-full"
                        min="0"
                        max={mockStakingData.userStaking.stakedAmount}
                      />
                    </div>
                    
                    <div className="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
                      ⚠️ 7-day minimum staking period required
                    </div>
                    
                    <Button
                      onClick={handleUnstake}
                      loading={loading}
                      disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0}
                      className="w-full"
                      variant="outline"
                    >
                      Unstake Tokens
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-liquid-glass p-12 text-center">
                <BanknotesIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
                <p className="text-gray-300 mb-6">
                  Connect your wallet to start staking $IO tokens and earning rewards
                </p>
                <ConnectWallet />
              </div>
            )}
          </motion.div>

          {/* User Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {isConnected ? (
              <>
                {/* User Staking Stats */}
                <div className="card-liquid-glass p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Your Staking Position</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Staked Amount</span>
                      <span className="text-2xl font-bold text-white">
                        {mockStakingData.userStaking.stakedAmount.toLocaleString()} IO
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Pending Rewards</span>
                      <span className="text-xl font-bold text-green-400">
                        {mockStakingData.userStaking.pendingRewards} IO
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Claimed</span>
                      <span className="text-white font-semibold">
                        {mockStakingData.userStaking.totalClaimed} IO
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Staking Since</span>
                      <span className="text-white">
                        {new Date(mockStakingData.userStaking.stakingTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleClaimRewards}
                    loading={loading}
                    disabled={mockStakingData.userStaking.pendingRewards === 0}
                    className="w-full mt-6"
                  >
                    <GiftIcon className="w-4 h-4 mr-2" />
                    Claim Rewards ({mockStakingData.userStaking.pendingRewards} IO)
                  </Button>
                </div>

                {/* APY Calculator */}
                <div className="card-liquid-glass p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">APY Calculator</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Stake Amount (IO)
                      </label>
                      <input
                        type="number"
                        placeholder="1000"
                        className="input-holographic w-full text-sm"
                        min="0"
                      />
                    </div>
                    
                    <div className="bg-dark-900/50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-1">Estimated Annual Rewards</div>
                        <div className="text-xl font-bold text-primary-400">
                          185 IO tokens
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Based on {mockStakingData.globalStats.currentAPY}% current APY
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card-liquid-glass p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Staking Benefits</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
                    <span>Earn 50% of platform fees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="w-4 h-4 text-blue-400" />
                    <span>Higher APY with longer stakes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GiftIcon className="w-4 h-4 text-purple-400" />
                    <span>Weekly reward distributions</span>
                  </div>
                </div>
              </div>
            )}

            {/* How It Works */}
            <div className="card-liquid-glass p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How Staking Works</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="text-white font-medium">Stake $IO Tokens</div>
                    <div className="text-sm text-gray-400">Lock your tokens to participate in revenue sharing</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="text-white font-medium">Earn Revenue Share</div>
                    <div className="text-sm text-gray-400">Receive 50% of platform fees proportionally</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="text-white font-medium">Claim Weekly</div>
                    <div className="text-sm text-gray-400">Rewards distributed every 7 days automatically</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
