import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    ...(process.env.NODE_ENV === 'development' ? [bscTestnet] : []),
    bsc,
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === bscTestnet.id) {
          return {
            http: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
            webSocket: 'wss://data-seed-prebsc-1-s1.binance.org:8545/',
          };
        }
        if (chain.id === bsc.id) {
          return {
            http: 'https://bsc-dataseed1.binance.org/',
            webSocket: 'wss://bsc-ws-node.nariox.org:443/',
          };
        }
        return { http: chain.rpcUrls.default.http[0] };
      },
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Incrypt Oracle',
  projectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { wagmiConfig, chains };

// Chain configuration
export const SUPPORTED_CHAINS = {
  bscTestnet: {
    id: 97,
    name: 'BSC Testnet',
    network: 'bsc-testnet',
    nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] },
      public: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] },
    },
    blockExplorers: {
      default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
    },
    testnet: true,
  },
  bscMainnet: {
    id: 56,
    name: 'BSC Mainnet',
    network: 'bsc',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://bsc-dataseed1.binance.org/'] },
      public: { http: ['https://bsc-dataseed1.binance.org/'] },
    },
    blockExplorers: {
      default: { name: 'BscScan', url: 'https://bscscan.com' },
    },
    testnet: false,
  },
};

// Contract addresses (will be updated after deployment)
export const CONTRACT_ADDRESSES = {
  IO_TOKEN: process.env.NEXT_PUBLIC_IO_TOKEN_ADDRESS || '0x00placeholder000',
  ORACLE: process.env.NEXT_PUBLIC_ORACLE_ADDRESS || '',
  PREDICTION_MARKET: process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS || '',
  DAO: process.env.NEXT_PUBLIC_DAO_ADDRESS || '',
  REVENUE_DISTRIBUTOR: process.env.NEXT_PUBLIC_REVENUE_DISTRIBUTOR_ADDRESS || '',
};

// Get current chain ID
export const getCurrentChainId = () => {
  return process.env.NEXT_PUBLIC_CHAIN_ID 
    ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) 
    : (process.env.NODE_ENV === 'development' ? 97 : 56);
};
