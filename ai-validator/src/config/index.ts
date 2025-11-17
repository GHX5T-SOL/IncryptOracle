import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

export interface AIValidatorConfig {
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
  
  // Hugging Face config
  huggingFaceToken: string;
  huggingFaceModel: string;
  
  // API Discovery config (inspired by Sora Oracle)
  enableAPIDiscovery: boolean;
  rapidApiKey?: string;
  apisGuruEnabled: boolean;
  
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

export function loadConfig(): AIValidatorConfig {
  const privateKey = getEnvVar('AI_VALIDATOR_PRIVATE_KEY');
  const wallet = new ethers.Wallet(privateKey);
  
  return {
    rpcUrl: getEnvVar('RPC_URL', 'https://data-seed-prebsc-1-s1.binance.org:8545/'),
    chainId: parseInt(getEnvVar('CHAIN_ID', '97')),
    privateKey,
    oracleAddress: getEnvVar('ORACLE_ADDRESS'),
    tokenAddress: getEnvVar('IO_TOKEN_ADDRESS'),
    validatorAddress: wallet.address,
    stakeAmount: getEnvVar('STAKE_AMOUNT', '1000'),
    validationInterval: parseInt(getEnvVar('VALIDATION_INTERVAL', '60')),
    huggingFaceToken: getEnvVar('HUGGINGFACE_API_TOKEN'),
    huggingFaceModel: getEnvVar('HUGGINGFACE_MODEL', 'meta-llama/Meta-Llama-3-8B-Instruct'),
    enableAPIDiscovery: process.env.ENABLE_API_DISCOVERY === 'true',
    rapidApiKey: process.env.RAPIDAPI_KEY,
    apisGuruEnabled: process.env.APIS_GURU_ENABLED === 'true',
    healthCheckPort: parseInt(getEnvVar('HEALTH_CHECK_PORT', '3002')),
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    logLevel: getEnvVar('LOG_LEVEL', 'info'),
  };
}

