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

// Contract addresses (BSC Testnet)
export const CONTRACT_ADDRESSES = {
  IO_TOKEN: process.env.NEXT_PUBLIC_IO_TOKEN_ADDRESS || '0x40147E5600b107Dd48001Ec6034A8385aE3747E7',
  ORACLE: process.env.NEXT_PUBLIC_ORACLE_ADDRESS || '0x35f86a92C903873dFB33fE7EF04CA0e4f93Ba0a7',
  PREDICTION_MARKET: process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS || '0x4448dE2d0Aab5129c92198fCbc55502dAEaA5096',
  DAO: process.env.NEXT_PUBLIC_DAO_ADDRESS || '0xa900e5f7074cf9C002217AbfE97c289dB1526825',
  REVENUE_DISTRIBUTOR: process.env.NEXT_PUBLIC_REVENUE_DISTRIBUTOR_ADDRESS || '0x5e69123b5591C16e236Ec1d508dc338168e80De6',
  ORACLE_SUBSCRIPTION: process.env.NEXT_PUBLIC_ORACLE_SUBSCRIPTION_ADDRESS || '0xfAA6F894ce67c1e6f101341E4330e648b649c676',
  CRYPTO_PRICE_ORACLE: process.env.NEXT_PUBLIC_CRYPTO_PRICE_ORACLE_ADDRESS || '0x7c7A94F460d13004db170fd11cC11Ec01f14108f',
  SPORTS_ORACLE: process.env.NEXT_PUBLIC_SPORTS_ORACLE_ADDRESS || '0x151c35c569605C752B1F765d9f12fc209c9026a8',
  WEATHER_ORACLE: process.env.NEXT_PUBLIC_WEATHER_ORACLE_ADDRESS || '0x5bE075Cd0EF40B83B6F45caCC5A3fE548F571970',
  ELECTION_ORACLE: process.env.NEXT_PUBLIC_ELECTION_ORACLE_ADDRESS || '0x1516901e599F2E5cE03869473272eFa98638c2d0',
};

// Get current chain ID
export const getCurrentChainId = () => {
  return process.env.NEXT_PUBLIC_CHAIN_ID 
    ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) 
    : (process.env.NODE_ENV === 'development' ? 97 : 56);
};
