export { IncryptOracle } from './IncryptOracle';
export { DataFeedManager } from './DataFeedManager';
export { EventEmitter } from './EventEmitter';
export { IncryptOracleError, NetworkError, ContractError, DataError, ValidationError } from './errors';

// Types
export type {
  OracleConfig,
  PriceData,
  DataFeed,
  ValidatorInfo,
  Subscription,
  SubscriptionCallbacks,
  NetworkConfig,
  AIValidationMetadata,
  ValidationSubmission
} from './types';

// Enums
export { ValidatorType } from './types';

// Constants
export { NETWORKS, CONTRACT_ADDRESSES, DEFAULT_CONFIG } from './constants';

// React hooks (if React is available)
export { useIncryptOracle } from './react/hooks';
