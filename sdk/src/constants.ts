import { NetworkConfig, OracleConfig } from './types';

export const NETWORKS: Record<string, NetworkConfig> = {
  'bsc-mainnet': {
    chainId: 56,
    name: 'BSC Mainnet',
    rpcUrl: 'https://bsc-dataseed1.binance.org/',
    contractAddress: '0x0000000000000000000000000000000000000000', // Will be updated after deployment
    blockExplorer: 'https://bscscan.com'
  },
  'bsc-testnet': {
    chainId: 97,
    name: 'BSC Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    contractAddress: '0x35f86a92C903873dFB33fE7EF04CA0e4f93Ba0a7',
    blockExplorer: 'https://testnet.bscscan.com'
  },
  'localhost': {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
    contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Default Hardhat deployment address
    blockExplorer: 'http://localhost:8545'
  }
};

export const CONTRACT_ADDRESSES = {
  BSC_MAINNET: {
    ORACLE: '0x0000000000000000000000000000000000000000',
    PREDICTION_MARKET: '0x0000000000000000000000000000000000000000',
    IO_TOKEN: '0x00placeholder000',
    DAO: '0x0000000000000000000000000000000000000000',
    REVENUE_DISTRIBUTOR: '0x0000000000000000000000000000000000000000'
  },
  BSC_TESTNET: {
    ORACLE: '0x35f86a92C903873dFB33fE7EF04CA0e4f93Ba0a7',
    PREDICTION_MARKET: '0x4448dE2d0Aab5129c92198fCbc55502dAEaA5096',
    IO_TOKEN: '0x40147E5600b107Dd48001Ec6034A8385aE3747E7',
    DAO: '0xa900e5f7074cf9C002217AbfE97c289dB1526825',
    REVENUE_DISTRIBUTOR: '0x5e69123b5591C16e236Ec1d508dc338168e80De6',
    ORACLE_SUBSCRIPTION: '0xfAA6F894ce67c1e6f101341E4330e648b649c676',
    CRYPTO_PRICE_ORACLE: '0x7c7A94F460d13004db170fd11cC11Ec01f14108f',
    SPORTS_ORACLE: '0x151c35c569605C752B1F765d9f12fc209c9026a8',
    WEATHER_ORACLE: '0x5bE075Cd0EF40B83B6F45caCC5A3fE548F571970',
    ELECTION_ORACLE: '0x1516901e599F2E5cE03869473272eFa98638c2d0'
  }
};

export const DEFAULT_CONFIG: Partial<OracleConfig> = {
  pollingInterval: 5000, // 5 seconds
  timeout: 30000, // 30 seconds
};

export const ABI = {
  ORACLE: [
    'function getDataFeed(bytes32) view returns (string, string, uint256, uint256, uint256, bool)',
    'function getActiveFeedIds() view returns (bytes32[])',
    'function getValidator(address) view returns (uint256, uint256, bool, uint256, uint256, uint8)',
    'function getValidationSubmission(bytes32, address) view returns (uint256, uint256, bool, string, uint8, string)',
    'function getAIValidatorCount() view returns (uint256)',
    'function submitValidation(bytes32, uint256, string)',
    'function submitAIValidation(bytes32, uint256, string, string)',
    'function registerValidator(uint256)',
    'function registerAIValidator(address, uint256)',
    'event DataFeedCreated(bytes32 indexed, string, string)',
    'event DataFeedUpdated(bytes32 indexed, uint256, uint256)',
    'event ValidationSubmitted(bytes32 indexed, address indexed, uint256, uint8)',
    'event AIValidationSubmitted(bytes32 indexed, address indexed, uint256, string)',
    'event ValidatorRegistered(address indexed, uint256, uint8)'
  ],
  PREDICTION_MARKET: [
    'function getMarket(uint256) view returns (string, string, string, uint256, uint8, uint256[2], address, uint256)',
    'function getUserPosition(uint256, address) view returns (uint256, uint256, uint256, bool)',
    'function getOdds(uint256) view returns (uint256, uint256)',
    'function getUserMarkets(address) view returns (uint256[])',
    'function buyShares(uint256, uint8, uint256) returns (uint256)',
    'function sellShares(uint256, uint8, uint256) returns (uint256)',
    'function claimWinnings(uint256) returns (uint256)',
    'function calculateCost(uint256, uint8, uint256) view returns (uint256)',
    'event MarketCreated(uint256 indexed, address indexed, string, uint256, bytes32)',
    'event SharesPurchased(uint256 indexed, address indexed, uint8, uint256, uint256)'
  ],
  ERC20: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address, uint256) returns (bool)',
    'function approve(address, uint256) returns (bool)',
    'function allowance(address, address) view returns (uint256)',
    'event Transfer(address indexed, address indexed, uint256)',
    'event Approval(address indexed, address indexed, uint256)'
  ]
};

export const FEED_IDS = {
  'BTC/USD': '0x4254432f55534400000000000000000000000000000000000000000000000000',
  'ETH/USD': '0x4554482f55534400000000000000000000000000000000000000000000000000',
  'BNB/USD': '0x424e422f55534400000000000000000000000000000000000000000000000000'
};

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONTRACT_ERROR: 'CONTRACT_ERROR',
  DATA_ERROR: 'DATA_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SUBSCRIPTION_ERROR: 'SUBSCRIPTION_ERROR'
} as const;
