import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import {
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ChartPieIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import ConnectWallet from '../components/ConnectWallet';
import { LoadingCard } from '../components/LoadingSpinner';

enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7
}

enum VoteChoice {
  Against = 0,
  For = 1,
  Abstain = 2
}

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  state: ProposalState;
  startTime: number;
  endTime: number;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorumVotes: number;
  type: 'Treasury' | 'Parameter' | 'General' | 'Emergency';
  requestedAmount?: number;
  category: string;
  executionEta?: number;
}

const mockProposals: Proposal[] = [
  {
    id: 1,
    title: "Increase Oracle Validator Rewards",
    description: "Proposal to increase the monthly rewards for oracle validators from 100 IO to 150 IO tokens to incentivize more participation and improve network security. This increase will be funded from the treasury and is expected to attract 10-15 additional validators to the network.",
    proposer: "0x1234567890123456789012345678901234567890",
    state: ProposalState.Active,
    startTime: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    endTime: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days from now
    votesFor: 125000,
    votesAgainst: 45000,
    votesAbstain: 8000,
    quorumVotes: 100000,
    type: 'Parameter',
    category: 'Network Security',
  },
  {
    id: 2,
    title: "Treasury Allocation for Marketing Campaign",
    description: "Allocate 50,000 IO tokens from the treasury for a comprehensive marketing campaign to increase awareness of Incrypt Oracle among DeFi protocols and developers. The campaign will include influencer partnerships, conference sponsorships, and educational content creation.",
    proposer: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
    state: ProposalState.Active,
    startTime: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    endTime: Date.now() + 6 * 24 * 60 * 60 * 1000, // 6 days from now
    votesFor: 89000,
    votesAgainst: 67000,
    votesAbstain: 12000,
    quorumVotes: 100000,
    type: 'Treasury',
    category: 'Marketing',
    requestedAmount: 50000,
  },
  {
    id: 3,
    title: "Implement Emergency Pause Mechanism",
    description: "Add an emergency pause mechanism to the oracle contracts that can be triggered by a multi-sig wallet in case of critical vulnerabilities. This proposal includes upgrading the oracle contract and establishing the emergency response procedures.",
    proposer: "0x9876543210987654321098765432109876543210",
    state: ProposalState.Succeeded,
    startTime: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    endTime: Date.now() - 3 * 24 * 60 * 60 * 1000, // ended 3 days ago
    votesFor: 180000,
    votesAgainst: 25000,
    votesAbstain: 15000,
    quorumVotes: 100000,
    type: 'Emergency',
    category: 'Security',
    executionEta: Date.now() + 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 4,
    title: "Reduce Platform Fees",
    description: "Reduce the platform fee for prediction markets from 2% to 1.5% to increase competitiveness and attract more users to the platform. This change will be implemented across all existing and new prediction markets.",
    proposer: "0x5555555555555555555555555555555555555555",
    state: ProposalState.Defeated,
    startTime: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    endTime: Date.now() - 8 * 24 * 60 * 60 * 1000, // ended 8 days ago
    votesFor: 75000,
    votesAgainst: 140000,
    votesAbstain: 5000,
    quorumVotes: 100000,
    type: 'Parameter',
    category: 'Platform',
  }
];

function ProposalCard({ proposal, onViewDetails, onVote }: { 
  proposal: Proposal; 
  onViewDetails: (proposal: Proposal) => void;
  onVote: (proposalId: number, choice: VoteChoice) => void;
}) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
  const abstainPercentage = totalVotes > 0 ? (proposal.votesAbstain / totalVotes) * 100 : 0;

  const timeRemaining = proposal.endTime - Date.now();
  const hasQuorum = totalVotes >= proposal.quorumVotes;
  const isActive = proposal.state === ProposalState.Active;
  const canVote = isActive && timeRemaining > 0;

  const getStateColor = (state: ProposalState) => {
    switch (state) {
      case ProposalState.Active:
        return 'text-blue-400 bg-blue-500/20';
      case ProposalState.Succeeded:
        return 'text-green-400 bg-green-500/20';
      case ProposalState.Defeated:
        return 'text-red-400 bg-red-500/20';
      case ProposalState.Executed:
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStateIcon = (state: ProposalState) => {
    switch (state) {
      case ProposalState.Active:
        return <ClockIcon className="w-4 h-4" />;
      case ProposalState.Succeeded:
        return <CheckCircleIcon className="w-4 h-4" />;
      case ProposalState.Defeated:
        return <XCircleIcon className="w-4 h-4" />;
      case ProposalState.Executed:
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return 'Voting ended';
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Treasury':
        return <BanknotesIcon className="w-4 h-4" />;
      case 'Parameter':
        return <Cog6ToothIcon className="w-4 h-4" />;
      case 'Emergency':
        return <FireIcon className="w-4 h-4" />;
      default:
        return <UserGroupIcon className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      className="card-liquid-glass p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetails(proposal)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${getStateColor(proposal.state)}`}>
            {getStateIcon(proposal.state)}
            <span>{ProposalState[proposal.state]}</span>
          </span>
          <span className="flex items-center space-x-1 px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full">
            {getTypeIcon(proposal.type)}
            <span>{proposal.type}</span>
          </span>
        </div>
        <div className="text-xs text-gray-400">
          #{proposal.id}
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
        {proposal.title}
      </h3>
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {proposal.description}
      </p>

      {/* Voting Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Voting Progress</span>
          <span className="text-sm text-gray-400">
            {totalVotes.toLocaleString()} / {proposal.quorumVotes.toLocaleString()} votes
          </span>
        </div>
        
        {/* Progress Bar */}
                <div className="progress-bar mb-3">
          <div className="h-full flex">
            <div 
              className="bg-green-500 transition-all duration-500 h-full" 
              style={{ width: `${forPercentage}%` }}
              role="progressbar"
              aria-valuenow={forPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
            <div 
              className="bg-red-500 transition-all duration-500 h-full" 
              style={{ width: `${againstPercentage}%` }}
              role="progressbar"
            />
            <div 
              className="bg-yellow-500 transition-all duration-500 h-full" 
              style={{ width: `${abstainPercentage}%` }}
              role="progressbar"
            />
          </div>
        </div>

        <div className="flex justify-between text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">For: {forPercentage.toFixed(1)}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">Against: {againstPercentage.toFixed(1)}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400">Abstain: {abstainPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="text-xs text-gray-400">
          <div>By: {proposal.proposer.slice(0, 10)}...</div>
          <div>{formatTimeRemaining(timeRemaining)}</div>
        </div>
        
        {!hasQuorum && (
          <div className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded">
            Needs quorum
          </div>
        )}

        {proposal.requestedAmount && (
          <div className="text-xs text-primary-400 bg-primary-500/20 px-2 py-1 rounded">
            {proposal.requestedAmount.toLocaleString()} IO
          </div>
        )}
      </div>

      {/* Quick Vote Buttons */}
      {canVote && (
        <div className="flex space-x-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onVote(proposal.id, VoteChoice.For)}
            className="flex-1 !border-green-500 !text-green-400 hover:!bg-green-500"
          >
            <ChevronUpIcon className="w-4 h-4 mr-1" />
            For
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onVote(proposal.id, VoteChoice.Against)}
            className="flex-1 !border-red-500 !text-red-400 hover:!bg-red-500"
          >
            <ChevronDownIcon className="w-4 h-4 mr-1" />
            Against
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function ProposalDetailModal({ proposal, onClose, onVote }: { 
  proposal: Proposal; 
  onClose: () => void;
  onVote: (proposalId: number, choice: VoteChoice) => void;
}) {
  const [selectedVote, setSelectedVote] = useState<VoteChoice>(VoteChoice.For);
  const [loading, setLoading] = useState(false);
  const { isConnected } = useAccount();

  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
  const abstainPercentage = totalVotes > 0 ? (proposal.votesAbstain / totalVotes) * 100 : 0;
  
  const timeRemaining = proposal.endTime - Date.now();
  const canVote = proposal.state === ProposalState.Active && timeRemaining > 0 && isConnected;

  const handleVote = async () => {
    setLoading(true);
    try {
      await onVote(proposal.id, selectedVote);
      // In real app, this would close the modal after successful vote
    } catch (error) {
      console.error('Vote failed:', error);
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
        className="card-liquid-glass max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-full ${
                  proposal.state === ProposalState.Active ? 'text-blue-400 bg-blue-500/20' :
                  proposal.state === ProposalState.Succeeded ? 'text-green-400 bg-green-500/20' :
                  proposal.state === ProposalState.Defeated ? 'text-red-400 bg-red-500/20' :
                  'text-gray-400 bg-gray-500/20'
                }`}>
                  <span>{ProposalState[proposal.state]}</span>
                </span>
                <span className="px-3 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full">
                  {proposal.type}
                </span>
                <span className="text-gray-400 text-sm">#{proposal.id}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">{proposal.title}</h2>
              <p className="text-gray-300 leading-relaxed">{proposal.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Voting Results */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Voting Results</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">For</span>
                  <span className="text-green-400 font-semibold">
                    {proposal.votesFor.toLocaleString()} ({forPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-green-500" 
                    style={{ width: `${forPercentage}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Against</span>
                  <span className="text-red-400 font-semibold">
                    {proposal.votesAgainst.toLocaleString()} ({againstPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-red-500" 
                    style={{ width: `${againstPercentage}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Abstain</span>
                  <span className="text-yellow-400 font-semibold">
                    {proposal.votesAbstain.toLocaleString()} ({abstainPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-yellow-500" 
                    style={{ width: `${abstainPercentage}%` }}
                  />
                </div>
              </div>

              {/* Quorum Progress */}
              <div className="bg-dark-900/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Quorum Progress</span>
                  <span className="text-gray-400">
                    {totalVotes >= proposal.quorumVotes ? '✅' : '⏳'}
                  </span>
                </div>
                <div className="progress-bar mb-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((totalVotes / proposal.quorumVotes) * 100, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={Math.min((totalVotes / proposal.quorumVotes) * 100, 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  {totalVotes.toLocaleString()} / {proposal.quorumVotes.toLocaleString()} votes
                </div>
              </div>
            </div>

            {/* Proposal Details */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Proposal Details</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Proposer</span>
                  <span className="text-white font-mono text-sm">{proposal.proposer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white">{proposal.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Start Time</span>
                  <span className="text-white">{new Date(proposal.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">End Time</span>
                  <span className="text-white">{new Date(proposal.endTime).toLocaleDateString()}</span>
                </div>
                {proposal.requestedAmount && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Requested Amount</span>
                    <span className="text-primary-400 font-semibold">
                      {proposal.requestedAmount.toLocaleString()} IO
                    </span>
                  </div>
                )}
                {proposal.executionEta && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Execution ETA</span>
                    <span className="text-white">{new Date(proposal.executionEta).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Voting Interface */}
              {canVote && (
                <div className="bg-dark-900/50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Cast Your Vote</h4>
                  
                  <div className="space-y-3 mb-4">
                    {[
                      { choice: VoteChoice.For, label: 'For', color: 'green', icon: ChevronUpIcon },
                      { choice: VoteChoice.Against, label: 'Against', color: 'red', icon: ChevronDownIcon },
                      { choice: VoteChoice.Abstain, label: 'Abstain', color: 'yellow', icon: ClockIcon }
                    ].map(({ choice, label, color, icon: Icon }) => (
                      <button
                        key={choice}
                        onClick={() => setSelectedVote(choice)}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-300 flex items-center space-x-3 ${
                          selectedVote === choice
                            ? `border-${color}-500 bg-${color}-500/20 text-${color}-400`
                            : `border-${color}-500/20 bg-${color}-500/5 text-${color}-300 hover:bg-${color}-500/10`
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <Button
                    onClick={handleVote}
                    loading={loading}
                    className="w-full"
                    size="lg"
                  >
                    Cast Vote
                  </Button>
                </div>
              )}

              {!isConnected && canVote && (
                <div className="bg-dark-900/50 rounded-lg p-6 text-center">
                  <p className="text-gray-400 mb-4">Connect your wallet to vote</p>
                  <ConnectWallet />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CreateProposalModal({ onClose, onSubmit }: { 
  onClose: () => void;
  onSubmit: (proposal: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'General',
    category: '',
    requestedAmount: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction
      onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create proposal:', error);
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
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create New Proposal</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-holographic w-full"
                placeholder="Enter proposal title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-holographic w-full h-32 resize-none"
                placeholder="Describe your proposal in detail..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type *
                </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-holographic w-full"
                aria-label="Select proposal type"
                required
              >
                  <option value="General">General</option>
                  <option value="Treasury">Treasury</option>
                  <option value="Parameter">Parameter</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-holographic w-full"
                  placeholder="e.g., Network, Marketing"
                  required
                />
              </div>
            </div>

            {formData.type === 'Treasury' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Requested Amount (IO tokens)
                </label>
                <input
                  type="number"
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                  className="input-holographic w-full"
                  placeholder="Enter amount..."
                  min="0"
                />
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">📋 Requirements</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• You need at least 1,000 IO tokens to create a proposal</li>
                <li>• Proposal will be active for 7 days after creation</li>
                <li>• Requires {(100000).toLocaleString()} votes to reach quorum</li>
                <li>• Simple majority (&gt;50%) needed to pass</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="flex-1"
              >
                Create Proposal
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DAOPage() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'succeeded' | 'defeated'>('all');
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  const handleVote = async (proposalId: number, choice: VoteChoice) => {
    if (!isConnected) {
      alert('Please connect your wallet to vote');
      return;
    }

    console.log(`Voting ${VoteChoice[choice]} on proposal ${proposalId}`);
    // In real app, this would call the smart contract
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`Vote cast: ${VoteChoice[choice]} on proposal ${proposalId}`);
  };

  const handleCreateProposal = async (proposalData: any) => {
    console.log('Creating proposal:', proposalData);
    // In real app, this would call the smart contract
    alert('Proposal created successfully!');
  };

  const filteredProposals = mockProposals.filter(proposal => {
    if (filter === 'all') return true;
    if (filter === 'active') return proposal.state === ProposalState.Active;
    if (filter === 'succeeded') return proposal.state === ProposalState.Succeeded;
    if (filter === 'defeated') return proposal.state === ProposalState.Defeated;
    return true;
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
            <span className="text-gradient">DAO Governance</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Shape the future of Incrypt Oracle through community governance. 
            Submit proposals, vote on decisions, and manage the treasury together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - DAO Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card-liquid-glass p-6 sticky top-8 space-y-6">
              {/* User DAO Stats */}
              {isConnected ? (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Your Governance Power</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">IO Balance</span>
                      <span className="text-white font-semibold">2,500 IO</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Voting Power</span>
                      <span className="text-white font-semibold">2,500 votes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Proposals Created</span>
                      <span className="text-white font-semibold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Votes Cast</span>
                      <span className="text-white font-semibold">12</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">Connect wallet to participate in governance</p>
                  <ConnectWallet />
                </div>
              )}

              {/* DAO Overview */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">DAO Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Proposals</span>
                    <span className="text-white font-semibold">{mockProposals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Proposals</span>
                    <span className="text-white font-semibold">
                      {mockProposals.filter(p => p.state === ProposalState.Active).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Treasury Balance</span>
                    <span className="text-white font-semibold">1.2M IO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Holders</span>
                    <span className="text-white font-semibold">5,247</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  disabled={!isConnected}
                  className="w-full"
                  variant="primary"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Proposal
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                >
                  <ChartPieIcon className="w-4 h-4 mr-2" />
                  View Treasury
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Filters */}
            <div className="card-liquid-glass p-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Proposals' },
                  { key: 'active', label: 'Active' },
                  { key: 'succeeded', label: 'Succeeded' },
                  { key: 'defeated', label: 'Defeated' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filter === key
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Proposals Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <LoadingCard key={i} />
                ))}
              </div>
            ) : filteredProposals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProposals.map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProposalCard
                      proposal={proposal}
                      onViewDetails={setSelectedProposal}
                      onVote={handleVote}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card-liquid-glass p-12 text-center">
                <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No proposals found</h3>
                <p className="text-gray-400 mb-4">
                  Be the first to create a proposal for the community
                </p>
                <Button onClick={() => setShowCreateModal(true)} disabled={!isConnected}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Proposal
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Modals */}
        {selectedProposal && (
          <ProposalDetailModal
            proposal={selectedProposal}
            onClose={() => setSelectedProposal(null)}
            onVote={handleVote}
          />
        )}

        {showCreateModal && (
          <CreateProposalModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateProposal}
          />
        )}
      </div>
    </div>
  );
}
