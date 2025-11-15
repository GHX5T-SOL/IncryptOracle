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
  IO_TOKEN: process.env.NEXT_PUBLIC_IO_TOKEN_ADDRESS || '0x9f2E2E0786E637cc0a11Acb9A3C4203b76089185',
  ORACLE: process.env.NEXT_PUBLIC_ORACLE_ADDRESS || '0x5550966c0ECfe8764E2f29EB2C9F87D9CE112cBC',
  PREDICTION_MARKET: process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS || '0x4B72566EedF3c4b25b6669B33a2F8D3E2F4D2530',
  DAO: process.env.NEXT_PUBLIC_DAO_ADDRESS || '0xa254D432E9B1e4907980f52b42Ba2Dd754Ca78dd',
  REVENUE_DISTRIBUTOR: process.env.NEXT_PUBLIC_REVENUE_DISTRIBUTOR_ADDRESS || '0x0b34455cD2e3A80322d0bb6bA27e68211B86e4b1',
  ORACLE_SUBSCRIPTION: process.env.NEXT_PUBLIC_ORACLE_SUBSCRIPTION_ADDRESS || '0x43299C4C889442d50914f4D133522565feC8e51f',
};

// Get current chain ID
export const getCurrentChainId = () => {
  return process.env.NEXT_PUBLIC_CHAIN_ID 
    ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) 
    : (process.env.NODE_ENV === 'development' ? 97 : 56);
};
