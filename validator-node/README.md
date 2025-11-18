# Incrypt Oracle Validator Node

Off-chain validator node service for the Incrypt Oracle network. This service fetches data from external sources, validates it, and submits it to the oracle smart contract on Binance Smart Chain.

## Features

- 🔄 Automatic validation of active oracle feeds
- 📊 Support for multiple data sources (Crypto prices, Sports, Elections, etc.)
- 🏥 Health check endpoint for monitoring
- 📈 Prometheus metrics support
- 🔒 Secure private key management
- 🐳 Docker containerization support
- ⚡ Configurable validation intervals

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Private key with IO tokens for staking (minimum 1000 IO tokens)
- Access to Binance Smart Chain (testnet or mainnet)

## Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:

```bash
# Required: Your validator private key
VALIDATOR_PRIVATE_KEY=your_private_key_here

# Required: Contract addresses
ORACLE_ADDRESS=0x35f86a92C903873dFB33fE7EF04CA0e4f93Ba0a7
IO_TOKEN_ADDRESS=0x40147E5600b107Dd48001Ec6034A8385aE3747E7

# Required: RPC endpoint
RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
CHAIN_ID=97

# Optional: Stake amount (default: 1000 IO tokens)
STAKE_AMOUNT=1000

# Optional: Validation interval in seconds (default: 60)
VALIDATION_INTERVAL=60

# Optional: CoinGecko API key for additional price sources
COINGECKO_API_KEY=your_key_here
```

## Running

### Development

```bash
npm run dev
```

### Production

```bash
# Build first
npm run build

# Run
npm start
```

### Docker

```bash
# Build image
docker build -t incrypt-validator .

# Run container
docker run -d \
  --name incrypt-validator \
  --env-file .env \
  -p 3001:3001 \
  incrypt-validator
```

## Health Checks

The validator exposes several health check endpoints:

- `GET /health` - Full health status
- `GET /ready` - Readiness probe (returns 200 if ready, 503 if not)
- `GET /metrics` - Prometheus-style metrics

Example:
```bash
curl http://localhost:3001/health
```

## Architecture

```
Validator Node
├── Config Layer      # Configuration management
├── Data Sources      # External API integrations
│   ├── CryptoPriceSource
│   ├── SportsSource (future)
│   └── ElectionSource (future)
├── Validator         # Oracle contract interaction
├── Monitoring        # Health checks & metrics
└── Main Service      # Orchestration
```

## Data Sources

### Crypto Prices

Supports fetching crypto prices from:
- **Binance API** (primary) - Real-time price data
- **CoinGecko API** (optional) - Additional price source for redundancy

The validator aggregates prices from multiple sources using median calculation for robustness.

### Adding New Data Sources

1. Create a new class extending `BaseDataSource`:
```typescript
export class MyDataSource extends BaseDataSource {
  async fetch(feedId: string, params?: Record<string, any>): Promise<DataFetchResult | null> {
    // Implement data fetching logic
  }
}
```

2. Register it in `OracleValidator` constructor

## Validator Registration

On first run, the validator will:
1. Check if already registered
2. Approve token spending if needed
3. Register with the oracle contract by staking IO tokens
4. Start validating feeds

## Monitoring

The validator logs all operations to:
- Console (development)
- `combined.log` (all logs)
- `error.log` (errors only)

Log levels: `debug`, `info`, `warn`, `error`

## Troubleshooting

### Validator not registering

- Ensure you have enough IO tokens for staking (minimum 1000)
- Check private key is correct
- Verify RPC endpoint is accessible
- Check contract addresses are correct

### No data being fetched

- Verify data source APIs are accessible
- Check network connectivity
- Review logs for API errors
- Ensure data sources are enabled in config

### Validation submissions failing

- Verify validator is registered and active
- Check gas prices and wallet balance (BNB for gas)
- Review contract logs for errors
- Ensure validation window hasn't closed

## Security

- **Never commit** your `.env` file or private keys
- Use environment variables or secure key management in production
- Run validator node on secure infrastructure
- Monitor for suspicious activity
- Keep dependencies updated

## Development

```bash
# Run in watch mode
npm run watch

# Run tests
npm test

# Lint code
npm run lint
```

## Contributing

See the main project [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

MIT

