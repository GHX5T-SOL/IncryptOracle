import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

export interface ValidatorConfig {
  // Blockchain config
  rpcUrl: string;
  chainId: number;
  privateKey: string;
  
  // Contract addresses
  oracleAddress: string;
  tokenAddress: string;
  
  // Validator config
  validatorAddress: string;
  stakeAmount: string;
  validationInterval: number; // seconds
  
  // Data source config
  dataSources: {
    enabled: string[];
    crypto: {
      coinGeckoApiKey?: string;
      binanceApiUrl: string;
    };
    sports?: {
      apiKey?: string;
    };
  };
  
  // Health check config
  healthCheckPort: number;
  
  // Monitoring
  enableMetrics: boolean;
  logLevel: string;
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || defaultValue!;
}

export function loadConfig(): ValidatorConfig {
  const privateKey = getEnvVar('VALIDATOR_PRIVATE_KEY');
  const wallet = new ethers.Wallet(privateKey);
  
  return {
    rpcUrl: getEnvVar('RPC_URL', 'https://data-seed-prebsc-1-s1.binance.org:8545/'),
    chainId: parseInt(getEnvVar('CHAIN_ID', '97')),
    privateKey,
    oracleAddress: getEnvVar('ORACLE_ADDRESS'),
    tokenAddress: getEnvVar('IO_TOKEN_ADDRESS'),
    validatorAddress: wallet.address,
    stakeAmount: getEnvVar('STAKE_AMOUNT', '1000'),
    validationInterval: parseInt(getEnvVar('VALIDATION_INTERVAL', '60')), // 60 seconds default
    dataSources: {
      enabled: (getEnvVar('ENABLED_DATA_SOURCES', 'crypto') || '').split(',').filter(Boolean),
      crypto: {
        coinGeckoApiKey: process.env.COINGECKO_API_KEY,
        binanceApiUrl: getEnvVar('BINANCE_API_URL', 'https://api.binance.com/api/v3'),
      },
      sports: {
        apiKey: process.env.SPORTS_API_KEY,
      },
    },
    healthCheckPort: parseInt(getEnvVar('HEALTH_CHECK_PORT', '3001')),
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    logLevel: getEnvVar('LOG_LEVEL', 'info'),
  };
}

