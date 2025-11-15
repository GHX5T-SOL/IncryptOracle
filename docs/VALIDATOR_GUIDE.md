# Incrypt Oracle Validator Guide

This guide explains how to run a validator node for the Incrypt Oracle network. Validators are responsible for fetching data from external sources, validating it, and submitting it to the oracle smart contract.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup](#setup)
4. [Configuration](#configuration)
5. [Running the Validator](#running-the-validator)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Overview

### What is a Validator?

Validators are off-chain services that:
- Fetch data from multiple external sources (APIs, exchanges, etc.)
- Validate and aggregate data using consensus algorithms
- Submit validated data to the oracle smart contract
- Earn rewards based on accuracy and reputation

### Validator Requirements

- Minimum stake: 1,000 IO tokens
- Infrastructure: Server with stable internet connection
- Technical knowledge: Basic Node.js and blockchain understanding
- Commitment: Regular monitoring and maintenance

## Prerequisites

### System Requirements

- **OS**: Linux (Ubuntu 20.04+ recommended), macOS, or Windows
- **Node.js**: v18.0.0 or higher
- **RAM**: 2GB minimum (4GB+ recommended)
- **Storage**: 10GB available space
- **Network**: Stable internet connection with low latency

### Blockchain Requirements

- **Wallet**: Ethereum-compatible wallet with IO tokens
- **BNB**: Sufficient BNB for gas fees (recommended: 0.1+ BNB)
- **IO Tokens**: Minimum 1,000 IO tokens for staking

### API Access (Optional but Recommended)

- **CoinGecko API Key**: For additional price sources (optional)
- **Binance API**: Public endpoints (no key required)
- **Other Data Sources**: As needed for your validator's focus

## Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/GHX5T-SOL/IncryptOracle.git
cd IncryptOracle/validator-node
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build TypeScript

```bash
npm run build
```

### Step 4: Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Configuration](#configuration) section below).

## Configuration

### Required Configuration

#### Blockchain Configuration

```bash
# Your validator private key (DO NOT commit this!)
VALIDATOR_PRIVATE_KEY=your_private_key_here

# RPC endpoint
RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
CHAIN_ID=97

# Contract addresses (update after deployment)
ORACLE_ADDRESS=0x823C0Ead984707A4B73173274E0e075492866593
IO_TOKEN_ADDRESS=0xdc6a5752d457aAdF3f1C65E3a158f44277717183
```

#### Validator Configuration

```bash
# Stake amount (in IO tokens, must be >= 1000)
STAKE_AMOUNT=1000

# Validation interval (seconds)
VALIDATION_INTERVAL=60
```

### Optional Configuration

#### Data Sources

```bash
# Enabled data sources (comma-separated)
ENABLED_DATA_SOURCES=crypto

# Binance API (public, no key needed)
BINANCE_API_URL=https://api.binance.com/api/v3

# CoinGecko API (optional, for additional sources)
COINGECKO_API_KEY=your_key_here
```

#### Monitoring

```bash
# Health check port
HEALTH_CHECK_PORT=3001

# Enable Prometheus metrics
ENABLE_METRICS=true

# Log level: debug, info, warn, error
LOG_LEVEL=info
```

### Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use secure private key storage** - Consider using key management services in production
3. **Restrict file permissions** - `chmod 600 .env`
4. **Use environment variables** - Prefer environment variables over files
5. **Rotate keys periodically** - Update private keys regularly

## Running the Validator

### Development Mode

```bash
npm run dev
```

This runs the validator with TypeScript directly (using `ts-node`) and auto-reloads on changes.

### Production Mode

First, build the TypeScript:

```bash
npm run build
```

Then run the compiled JavaScript:

```bash
npm start
```

### Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start validator
pm2 start dist/index.js --name incrypt-validator

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Using Docker

Build the Docker image:

```bash
docker build -t incrypt-validator .
```

Run the container:

```bash
docker run -d \
  --name incrypt-validator \
  --restart unless-stopped \
  --env-file .env \
  -p 3001:3001 \
  incrypt-validator
```

### Using Docker Compose

```bash
docker-compose up -d
```

## Monitoring

### Health Check Endpoints

The validator exposes several health check endpoints:

#### Basic Health Check

```bash
curl http://localhost:3001/health
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": 1234567890,
  "uptime": 3600,
  "validator": {
    "address": "0x...",
    "active": true,
    "stake": "1000000000000000000000"
  },
  "oracle": {
    "connected": true,
    "lastValidation": 1234567890
  },
  "dataSources": [
    {
      "name": "crypto",
      "status": "operational",
      "lastFetch": 1234567890
    }
  ]
}
```

#### Readiness Probe

```bash
curl http://localhost:3001/ready
```

Returns `200 OK` if ready, `503 Service Unavailable` if not.

#### Prometheus Metrics

```bash
curl http://localhost:3001/metrics
```

Returns Prometheus-format metrics:

```
validator_uptime_seconds 3600
validator_last_validation_timestamp 1234567890
validator_active 1
```

### Logs

The validator logs to:
- **Console**: Development mode
- **combined.log**: All logs
- **error.log**: Errors only

Log levels:
- `debug`: Detailed debugging information
- `info`: General information (default)
- `warn`: Warning messages
- `error`: Error messages

### Key Metrics to Monitor

1. **Validator Status**
   - Is validator active and registered?
   - Current stake amount
   - Reputation score

2. **Validation Activity**
   - Last validation timestamp
   - Success/failure rate
   - Number of validations submitted

3. **Data Source Health**
   - API response times
   - Error rates
   - Data freshness

4. **Network Health**
   - RPC endpoint connectivity
   - Gas prices
   - Transaction success rate

## Troubleshooting

### Validator Not Registering

**Symptoms**: Validator fails to register or stays inactive

**Solutions**:
- Verify you have enough IO tokens (minimum 1,000)
- Check private key is correct
- Ensure RPC endpoint is accessible
- Verify contract addresses are correct
- Check gas prices and wallet balance (BNB)

### No Data Being Fetched

**Symptoms**: No validations being submitted, empty logs

**Solutions**:
- Verify data source APIs are accessible
- Check network connectivity
- Review logs for API errors
- Ensure data sources are enabled in config
- Verify API keys (if using premium APIs)

### Validation Submissions Failing

**Symptoms**: Transactions reverting or failing

**Solutions**:
- Check validator is registered and active
- Verify gas prices and wallet balance (BNB)
- Review contract logs for errors
- Check validation window hasn't closed
- Ensure sufficient stake hasn't been slashed

### High Memory Usage

**Symptoms**: Server running out of memory

**Solutions**:
- Reduce validation interval
- Limit number of feeds validated
- Upgrade server resources
- Check for memory leaks in logs

### Network Issues

**Symptoms**: RPC errors, timeouts

**Solutions**:
- Test RPC endpoint connectivity: `curl RPC_URL`
- Try alternative RPC endpoints
- Check firewall rules
- Verify network security groups
- Use WebSocket endpoint for better reliability

## Best Practices

### Operational

1. **Regular Monitoring**
   - Check health endpoints daily
   - Monitor logs for errors
   - Track validator reputation
   - Review gas costs

2. **Maintenance**
   - Keep Node.js updated
   - Update dependencies regularly
   - Monitor security advisories
   - Backup configuration files

3. **Uptime**
   - Use process managers (PM2, systemd)
   - Setup automatic restarts
   - Monitor system resources
   - Have backup infrastructure

### Technical

1. **Data Quality**
   - Use multiple data sources
   - Implement outlier detection
   - Monitor data freshness
   - Validate data before submission

2. **Gas Optimization**
   - Batch validations when possible
   - Monitor gas prices
   - Use optimal gas settings
   - Consider transaction timing

3. **Security**
   - Use secure key management
   - Implement rate limiting
   - Monitor for suspicious activity
   - Keep dependencies updated

### Economic

1. **Stake Management**
   - Maintain sufficient stake above minimum
   - Monitor for slashing events
   - Plan for stake adjustments
   - Track validator rewards

2. **Cost Management**
   - Monitor gas costs
   - Optimize validation frequency
   - Consider API costs
   - Track operational expenses

## Advanced Topics

### Custom Data Sources

To add a new data source:

1. Create a class extending `BaseDataSource`:

```typescript
export class MyDataSource extends BaseDataSource {
  async fetch(feedId: string, params?: Record<string, any>): Promise<DataFetchResult | null> {
    // Implement data fetching logic
  }
}
```

2. Register it in `OracleValidator` constructor

3. Update configuration to enable it

### Multi-Validator Setup

For redundancy, run multiple validators:
- Use different private keys
- Distribute across different servers
- Use different data sources
- Monitor independently

### Performance Tuning

Optimize validator performance:
- Adjust validation interval based on feed requirements
- Parallelize data fetching
- Cache frequently accessed data
- Use CDN for API requests

## Support

For issues or questions:

- **GitHub Issues**: https://github.com/GHX5T-SOL/IncryptOracle/issues
- **Discord**: https://discord.gg/XPSCUYVM65
- **Email**: incryptinvestments@protonmail.com

## Additional Resources

- [Deployment Guide](../validator-node/DEPLOYMENT.md)
- [API Documentation](../sdk/README.md)
- [Main README](../README.md)
- [Smart Contract Documentation](../contracts/README.md)

---

**Note**: This guide is for the validator node service. For running a prediction market or using the oracle as a consumer, see other documentation.

