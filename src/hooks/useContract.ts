import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../utils/wagmi';

// Contract ABIs - these would normally be imported from compiled contracts
const IOTokenABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address, uint256) returns (bool)',
  'function approve(address, uint256) returns (bool)',
  'function allowance(address, address) view returns (uint256)',
  'function getVotes(address) view returns (uint256)',
  'function delegate(address)',
  'event Transfer(address indexed, address indexed, uint256)',
  'event Approval(address indexed, address indexed, uint256)',
];

const OracleABI = [
  'function getDataFeed(bytes32) view returns (string, string, uint256, uint256, uint256, bool)',
  'function getActiveFeedIds() view returns (bytes32[])',
  'function getValidator(address) view returns (uint256, uint256, bool, uint256, uint256)',
  'function createDataFeed(string, string, uint256) returns (bytes32)',
  'function registerValidator(uint256)',
  'function submitValidation(bytes32, uint256, string)',
  'event DataFeedCreated(bytes32 indexed, string, string)',
  'event DataFeedUpdated(bytes32 indexed, uint256, uint256)',
];

const PredictionMarketABI = [
  'function markets(uint256) view returns (string, string, string, uint256, uint8, uint8, uint256, uint256[2], uint256[2], address, uint256, uint256, bool)',
  'function getMarket(uint256) view returns (string, string, string, uint256, uint8, uint256[2], address, uint256)',
  'function getUserPosition(uint256, address) view returns (uint256, uint256, uint256, bool)',
  'function getOdds(uint256) view returns (uint256, uint256)',
  'function getUserMarkets(address) view returns (uint256[])',
  'function createMarket(string, string, string, uint256, bytes32, uint256) returns (uint256)',
  'function buyShares(uint256, uint8, uint256) returns (uint256)',
  'function sellShares(uint256, uint8, uint256) returns (uint256)',
  'function claimWinnings(uint256) returns (uint256)',
  'function calculateCost(uint256, uint8, uint256) view returns (uint256)',
  'event MarketCreated(uint256 indexed, address indexed, string, uint256, bytes32)',
  'event SharesPurchased(uint256 indexed, address indexed, uint8, uint256, uint256)',
];

const DAOABI = [
  'function propose(address[], uint256[], bytes[], string) returns (uint256)',
  'function castVote(uint256, uint8)',
  'function state(uint256) view returns (uint8)',
  'function proposalVotes(uint256) view returns (uint256, uint256, uint256)',
  'function getVotes(address, uint256) view returns (uint256)',
  'function proposalSnapshot(uint256) view returns (uint256)',
  'function proposalDeadline(uint256) view returns (uint256)',
  'function votingDelay() view returns (uint256)',
  'function votingPeriod() view returns (uint256)',
  'function proposalThreshold() view returns (uint256)',
  'event ProposalCreated(uint256, address, address[], uint256[], string[], bytes[], uint256, uint256, string)',
  'event VoteCast(address indexed, uint256, uint8, uint256, string)',
];

const RevenueDistributorABI = [
  'function stakingInfo(address) view returns (uint256, uint256, uint256, uint256, uint256)',
  'function totalStaked() view returns (uint256)',
  'function getPendingRewards(address) view returns (uint256)',
  'function getCurrentAPY() view returns (uint256)',
  'function getUserStakingInfo(address) view returns (uint256, uint256, uint256, uint256)',
  'function stakeTokens(uint256)',
  'function unstakeTokens(uint256)', 
  'function claimRewards() returns (uint256)',
  'event TokensStaked(address indexed, uint256)',
  'event TokensUnstaked(address indexed, uint256)',
  'event RewardsClaimed(address indexed, uint256)',
];

export function useIOToken() {
  return {
    address: CONTRACT_ADDRESSES.IO_TOKEN,
    abi: IOTokenABI,
  };
}

export function useOracle() {
  return {
    address: CONTRACT_ADDRESSES.ORACLE,
    abi: OracleABI,
  };
}

export function usePredictionMarket() {
  return {
    address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
    abi: PredictionMarketABI,
  };
}

export function useDAO() {
  return {
    address: CONTRACT_ADDRESSES.DAO,
    abi: DAOABI,
  };
}

export function useRevenueDistributor() {
  return {
    address: CONTRACT_ADDRESSES.REVENUE_DISTRIBUTOR,
    abi: RevenueDistributorABI,
  };
}

// Specific contract hooks
export function useTokenBalance(address?: string) {
  const { address: tokenAddress, abi } = useIOToken();
  
  return useContractRead({
    address: tokenAddress as `0x${string}`,
    abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: Boolean(address && tokenAddress),
  });
}

export function useTokenApproval(owner?: string, spender?: string) {
  const { address: tokenAddress, abi } = useIOToken();
  
  return useContractRead({
    address: tokenAddress as `0x${string}`,
    abi,
    functionName: 'allowance',
    args: (owner && spender) ? [owner, spender] : undefined,
    enabled: Boolean(owner && spender && tokenAddress),
  });
}

export function useApproveToken(spender?: string, amount?: bigint) {
  const { address: tokenAddress, abi } = useIOToken();
  
  const { config } = usePrepareContractWrite({
    address: tokenAddress as `0x${string}`,
    abi,
    functionName: 'approve',
    args: (spender && amount) ? [spender, amount] : undefined,
    enabled: Boolean(spender && amount && tokenAddress),
  });
  
  return useContractWrite(config);
}

export function useMarketData(marketId?: number) {
  const { address, abi } = usePredictionMarket();
  
  return useContractRead({
    address: address as `0x${string}`,
    abi,
    functionName: 'getMarket',
    args: marketId !== undefined ? [marketId] : undefined,
    enabled: Boolean(marketId !== undefined && address),
  });
}

export function useUserPosition(marketId?: number, userAddress?: string) {
  const { address, abi } = usePredictionMarket();
  
  return useContractRead({
    address: address as `0x${string}`,
    abi,
    functionName: 'getUserPosition',
    args: (marketId !== undefined && userAddress) ? [marketId, userAddress] : undefined,
    enabled: Boolean(marketId !== undefined && userAddress && address),
  });
}

export function useMarketOdds(marketId?: number) {
  const { address, abi } = usePredictionMarket();
  
  return useContractRead({
    address: address as `0x${string}`,
    abi,
    functionName: 'getOdds',
    args: marketId !== undefined ? [marketId] : undefined,
    enabled: Boolean(marketId !== undefined && address),
  });
}

export function useBuyShares() {
  const { address, abi } = usePredictionMarket();
  
  const { config } = usePrepareContractWrite({
    address: address as `0x${string}`,
    abi,
    functionName: 'buyShares',
  });
  
  return useContractWrite(config);
}

export function useStakingInfo(userAddress?: string) {
  const { address, abi } = useRevenueDistributor();
  
  return useContractRead({
    address: address as `0x${string}`,
    abi,
    functionName: 'getUserStakingInfo',
    args: userAddress ? [userAddress] : undefined,
    enabled: Boolean(userAddress && address),
  });
}

export function usePendingRewards(userAddress?: string) {
  const { address, abi } = useRevenueDistributor();
  
  return useContractRead({
    address: address as `0x${string}`,
    abi,
    functionName: 'getPendingRewards',
    args: userAddress ? [userAddress] : undefined,
    enabled: Boolean(userAddress && address),
  });
}

export function useStakeTokens() {
  const { address, abi } = useRevenueDistributor();
  
  const { config } = usePrepareContractWrite({
    address: address as `0x${string}`,
    abi,
    functionName: 'stakeTokens',
  });
  
  return useContractWrite(config);
}

export function useOracleFeeds() {
  const { address, abi } = useOracle();
  
  return useContractRead({
    address: address as `0x${string}`,
    abi,
    functionName: 'getActiveFeedIds',
    enabled: Boolean(address),
  });
}
