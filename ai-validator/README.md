# Incrypt Oracle AI Validator

AI-powered validator node for Incrypt Oracle that uses Hugging Face models and automatic API discovery to validate prediction market data feeds.

## Features

- **AI-Powered Analysis**: Uses Hugging Face inference models to analyze prediction market questions
- **Automatic API Discovery**: Discovers relevant data sources automatically (inspired by Sora Oracle)
- **Multi-Source Validation**: Fetches data from multiple APIs and synthesizes results
- **Intelligent Reasoning**: Provides detailed reasoning for validation decisions
- **Production Ready**: Health checks, logging, and monitoring included

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure `.env` with your settings:
- `AI_VALIDATOR_PRIVATE_KEY`: Private key for the AI validator wallet
- `HUGGINGFACE_API_TOKEN`: Your Hugging Face API token
- `ORACLE_ADDRESS`: Address of the IncryptOracle contract
- `IO_TOKEN_ADDRESS`: Address of the IO token contract

4. Register the AI validator (must be done by contract owner):
```solidity
oracle.registerAIValidator(validatorAddress, stakeAmount);
```

5. Build and start:
```bash
npm run build
npm start
```

## Development

```bash
# Development mode with hot reload
npm run dev

# Watch mode
npm run watch
```

## Health Checks

- `GET /health` - Overall health status
- `GET /ready` - Readiness check
- `GET /metrics` - Prometheus metrics
- `GET /status` - Detailed status information

## How It Works

1. **Question Analysis**: AI analyzes the prediction market question
2. **API Discovery**: Automatically discovers relevant APIs (RapidAPI, APIs.guru, known sources)
3. **Data Fetching**: Fetches data from multiple discovered sources
4. **AI Synthesis**: Uses Hugging Face model to synthesize data and extract value
5. **Validation Submission**: Submits validation with metadata to oracle contract

## Configuration

See `.env.example` for all configuration options.

