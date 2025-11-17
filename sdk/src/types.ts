import { ethers } from 'ethers';

export interface OracleConfig {
  network: 'bsc-mainnet' | 'bsc-testnet' | 'localhost';
  rpcUrl?: string;
  contractAddress?: string;
  signer?: ethers.Signer;
  pollingInterval?: number;
  timeout?: number;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  contractAddress: string;
  blockExplorer: string;
}

export interface PriceData {
  feedId: string;
  name: string;
  value: number;
  confidence: number;
  timestamp: number;
  lastUpdated: Date;
}

export interface DataFeed {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  validationThreshold: number;
  currentValue?: number;
  confidence?: number;
  lastUpdate?: number;
}

export enum ValidatorType {
  Human = 0,
  AI = 1
}

export interface ValidatorInfo {
  address: string;
  stake: string;
  reputation: number;
  isActive: boolean;
  validationsCount: number;
  successfulValidations: number;
  validatorType: ValidatorType;
}

export interface AIValidationMetadata {
  confidence: number;
  sources: string[];
  reasoning: string;
  model: string;
  timestamp: number;
}

export interface ValidationSubmission {
  value: number;
  timestamp: number;
  submitted: boolean;
  dataSource: string;
  validatorType: ValidatorType;
  aiMetadata?: AIValidationMetadata;
}

export interface SubscriptionCallbacks {
  onData: (data: PriceData) => void;
  onError?: (error: Error) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export interface Subscription {
  feedId: string;
  unsubscribe: () => void;
  isActive: () => boolean;
}

export interface MarketData {
  id: number;
  question: string;
  description: string;
  category: string;
  endTime: number;
  totalLiquidity: string;
  yesOdds: number;
  noOdds: number;
  resolved: boolean;
}

export interface UserPosition {
  marketId: number;
  yesShares: string;
  noShares: string;
  totalInvested: string;
  claimed: boolean;
}

export interface ProposalData {
  id: number;
  title: string;
  description: string;
  proposer: string;
  state: number;
  startTime: number;
  endTime: number;
  votesFor: string;
  votesAgainst: string;
  votesAbstain: string;
}

// Event types
export type OracleEvent = 
  | { type: 'connected'; data: {} }
  | { type: 'disconnected'; data: {} }
  | { type: 'dataUpdate'; data: PriceData }
  | { type: 'error'; data: Error }
  | { type: 'validatorUpdate'; data: ValidatorInfo };
