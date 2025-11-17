# Incrypt Oracle JavaScript SDK

[![npm version](https://badge.fury.io/js/incrypt-oracle-sdk.svg)](https://badge.fury.io/js/incrypt-oracle-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

The official JavaScript SDK for integrating **Incrypt Oracle** into your applications. Get reliable, decentralized price feeds and oracle data on Binance Smart Chain with just a few lines of code.

## 🚀 Features

- **Easy Integration**: Simple, intuitive API for all oracle functions
- **AI Validator Support**: Full support for AI validators with metadata access
- **Real-time Subscriptions**: Subscribe to live price feeds with automatic updates
- **TypeScript Support**: Full type definitions for better developer experience
- **React Hooks**: Ready-to-use hooks for React applications
- **Error Handling**: Comprehensive error types and handling
- **Caching**: Built-in caching for improved performance
- **Multi-chain Support**: BSC Mainnet, Testnet, and local development

## 📦 Installation

```bash
npm install incrypt-oracle-sdk
```

```bash
yarn add incrypt-oracle-sdk
```

```bash
pnpm add incrypt-oracle-sdk
```

## 🔧 Quick Start

### Basic Usage

```javascript
import { IncryptOracle } from 'incrypt-oracle-sdk';

// Initialize the oracle
const oracle = new IncryptOracle({
  network: 'bsc-mainnet'
});

// Get latest price
const btcPrice = await oracle.getPrice('BTC/USD');
console.log(`BTC: $${btcPrice.value}`);
console.log(`Confidence: ${btcPrice.confidence}%`);
```

### Real-time Subscriptions

```javascript
// Subscribe to price updates
const subscription = oracle.subscribe('ETH/USD', {
  onData: (data) => {
    console.log('New ETH price:', data.value);
  },
  onError: (error) => {
    console.error('Subscription error:', error);
  }
});

// Unsubscribe when done
subscription.unsubscribe();
```

### React Integration

```jsx
import React from 'react';
import { useIncryptOracle, usePriceData } from 'incrypt-oracle-sdk/react';

function PriceDisplay() {
  const { oracle, isConnected } = useIncryptOracle({
    network: 'bsc-mainnet'
  });
  
  const { data: btcPrice, loading, error } = usePriceData(oracle, 'BTC/USD');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!btcPrice) return <div>No data</div>;
  
  return (
    <div>
      <h2>Bitcoin Price</h2>
      <p>${btcPrice.value.toFixed(2)}</p>
      <small>Confidence: {btcPrice.confidence}%</small>
    </div>
  );
}
```

## 📖 API Documentation

### IncryptOracle Class

#### Constructor

```typescript
new IncryptOracle(config: OracleConfig)
```

**Config Options:**
- `network` (required): `'bsc-mainnet' | 'bsc-testnet' | 'localhost'`
- `rpcUrl` (optional): Custom RPC endpoint URL
- `contractAddress` (optional): Custom oracle contract address
- `signer` (optional): Ethers.js signer for write operations
- `pollingInterval` (optional): Polling interval in ms (default: 5000)
- `timeout` (optional): Request timeout in ms (default: 30000)

#### Methods

##### `getPrice(feedId: string): Promise<PriceData>`

Get the latest price for a specific data feed.

```javascript
const priceData = await oracle.getPrice('BTC/USD');
// Returns: { feedId, name, value, confidence, timestamp, lastUpdated }
```

##### `getAllFeeds(): Promise<DataFeed[]>`

Get information about all available data feeds.

```javascript
const feeds = await oracle.getAllFeeds();
feeds.forEach(feed => {
  console.log(feed.name, feed.description);
});
```

##### `subscribe(feedId: string, callbacks: SubscriptionCallbacks): Subscription`

Subscribe to real-time updates for a data feed.

```javascript
const subscription = oracle.subscribe('ETH/USD', {
  onData: (data) => console.log('New price:', data.value),
  onError: (error) => console.error('Error:', error),
  onConnected: () => console.log('Connected'),
  onDisconnected: () => console.log('Disconnected')
});
```

##### `getValidator(address: string): Promise<ValidatorInfo>`

Get information about a specific validator.

```javascript
const validator = await oracle.getValidator('0x...');
console.log('Stake:', validator.stake);
console.log('Reputation:', validator.reputation);
```

### React Hooks

#### `useIncryptOracle(config: OracleConfig)`

Initialize and manage an oracle instance.

```jsx
const { oracle, isConnected, error } = useIncryptOracle({
  network: 'bsc-mainnet'
});
```

#### `usePriceData(oracle, feedId, options?)`

Subscribe to a single price feed.

```jsx
const { data, loading, error, refetch } = usePriceData(oracle, 'BTC/USD', {
  enabled: true,
  onError: (error) => console.error(error)
});
```

#### `useMultiplePriceData(oracle, feedIds, options?)`

Subscribe to multiple price feeds.

```jsx
const { data, loading, errors } = useMultiplePriceData(
  oracle, 
  ['BTC/USD', 'ETH/USD', 'BNB/USD']
);
```

## 🛠 Advanced Usage

### Error Handling

The SDK provides specific error types for different scenarios:

```javascript
import { 
  NetworkError, 
  ContractError, 
  DataError, 
  ValidationError 
} from 'incrypt-oracle-sdk';

try {
  const price = await oracle.getPrice('BTC/USD');
} catch (error) {
  if (error instanceof NetworkError) {
    console.error('Network issue:', error.message);
  } else if (error instanceof DataError) {
    console.error('Data issue:', error.message);
  }
}
```

### Data Feed Manager

Use the DataFeedManager for advanced data operations:

```javascript
import { DataFeedManager } from 'incrypt-oracle-sdk';

const feedManager = new DataFeedManager(oracle);

// Get multiple prices efficiently
const prices = await feedManager.getMultiplePrices([
  'BTC/USD', 'ETH/USD', 'BNB/USD'
]);

// Get price statistics
const stats = await feedManager.getFeedStats('BTC/USD');
console.log('24h change:', stats.changePercent24h);

// Monitor feed health
const monitor = feedManager.monitorFeedHealth(
  ['BTC/USD', 'ETH/USD'],
  (feedId, health) => {
    console.log(`${feedId} is ${health}`);
  }
);
```

### Custom Network Configuration

```javascript
const oracle = new IncryptOracle({
  network: 'bsc-mainnet',
  rpcUrl: 'https://your-custom-rpc-endpoint.com',
  contractAddress: '0x...' // Your deployed contract address
});
```

### Validator Operations

```javascript
import { ethers } from 'ethers';

// Connect with a signer for validator operations
const signer = new ethers.Wallet(privateKey, provider);

const oracle = new IncryptOracle({
  network: 'bsc-testnet',
  signer: signer
});

// Register as validator
const txHash = await oracle.registerValidator('1000'); // 1000 IO tokens stake

// Submit validation data
await oracle.submitValidation('BTC/USD', 45000, 'CoinGecko API');
```

## 🌐 Supported Networks

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| BSC Mainnet | 56 | https://bsc-dataseed1.binance.org/ |
| BSC Testnet | 97 | https://data-seed-prebsc-1-s1.binance.org:8545/ |
| Localhost | 31337 | http://127.0.0.1:8545 |

## 📊 Supported Data Feeds

The oracle supports various data feeds including:

- **Cryptocurrencies**: BTC/USD, ETH/USD, BNB/USD, and more
- **Stock Indices**: SPX, DJI, NDX
- **Forex**: EUR/USD, GBP/USD, JPY/USD
- **Commodities**: Gold, Silver, Oil
- **Custom Events**: Elections, Sports, Weather data

## 🔒 Security Considerations

- Always validate data confidence levels before using oracle data
- Implement appropriate staleness checks for your use case
- Use multiple oracles for critical decisions when possible
- Monitor oracle availability and implement failover mechanisms

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://docs.incryptoracle.com)
- 💬 [Discord](https://discord.gg/incrypt)
- 🐛 [GitHub Issues](https://github.com/IncryptOracle/sdk/issues)
- 📧 [Email](mailto:support@incryptoracle.com)

## 🚀 What's Next?

- [x] Basic oracle data feeds
- [x] Real-time subscriptions
- [x] React hooks integration
- [ ] WebSocket connections
- [ ] Historical data APIs
- [ ] Advanced analytics
- [ ] Multi-chain support
- [ ] GraphQL endpoint

---

Built with ❤️ by the [Incrypt Oracle](https://incryptoracle.com) team.
