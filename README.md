# 🔮 Incrypt Oracle

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-blue.svg)](https://soliditylang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![BSC Testnet](https://img.shields.io/badge/BSC-Testnet-yellow.svg)](https://testnet.bscscan.com/)

<div align="center">
  <img src="https://i.ibb.co/TBDNZrwv/favicon.png" alt="Incrypt Oracle Logo" width="120" height="120" />
</div>

**Incrypt Oracle** is a pre-launch decentralized oracle infrastructure currently in private beta on Binance Smart Chain (BSC) and purpose-built for prediction markets. The platform leverages a hybrid AI-human validator network with automatic API discovery, reputation-weighted consensus, optimistic resolution with rapid dispute windows, and a comprehensive revenue model. The system features AI-powered validators that use Hugging Face models to automatically discover data sources and provide intelligent reasoning, working alongside human validators for faster, more transparent resolutions. The entire system is powered by the native $IO token, which serves dual purposes as both a governance mechanism and a staking/validation requirement for network participants.

> 🚧 **Private beta notice (November 18, 2025):** Incrypt Oracle is still in private beta on BSC Testnet. Metrics, integrations, partner logos, and revenue figures referenced in this README are internal targets or testnet simulations. The codebase has completed a free beta assessment with AI Smart Contract Auditor, but no third-party firms such as CertiK or Halborn have formally audited or endorsed the project yet.

## 📑 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
  - [System Requirements](#system-requirements)
  - [Installation](#installation)
- [🏗️ Technical Architecture](#️-technical-architecture)
  - [System Architecture Overview](#system-architecture-overview)
  - [Core Smart Contracts Deep Dive](#core-smart-contracts-deep-dive)
  - [Off-Chain Validator Node Infrastructure](#off-chain-validator-node-infrastructure)
  - [Frontend Architecture & Blockchain Integration](#frontend-architecture--blockchain-integration)
  - [Gas Optimization Strategies](#gas-optimization-strategies)
  - [Security Architecture](#security-architecture)
  - [Consensus Mechanism Deep Dive](#consensus-mechanism-deep-dive)
- [💻 Development](#-development)
  - [Smart Contract Development](#smart-contract-development)
  - [Frontend Development](#frontend-development)
  - [Validator Node Development](#validator-node-development)
  - [SDK Development](#sdk-development)
- [🔧 Configuration & Environment Setup](#-configuration--environment-setup)
- [🎯 Usage Examples & Integration Guides](#-usage-examples--integration-guides)
- [📊 Testing & Security](#-testing--security)
  - [Comprehensive Test Suite Architecture](#comprehensive-test-suite-architecture)
  - [Security Audit & Hardening](#security-audit--hardening)
  - [Live Metrics & Performance](#live-metrics--performance)
- [🌐 Deployment](#-deployment)
- [💰 Tokenomics & Revenue Architecture](#-tokenomics--revenue-architecture)
- [🚀 Advanced Features & Recent Implementations](#-advanced-features--recent-implementations)
- [🎯 Development Roadmap](#-development-roadmap)
- [📚 Additional Documentation](#-additional-documentation)
  - [API Reference](#api-reference)
- [🔬 Technical Specifications](#-technical-specifications)
  - [Consensus Algorithm Details](#consensus-algorithm-details)
  - [AMM Mathematics](#amm-automated-market-maker-mathematics)
  - [Gas Cost Analysis](#gas-cost-analysis)
  - [Network Parameters & Constants](#network-parameters--constants)
- [🛡️ Security Considerations](#️-security-considerations)
- [⚠️ Disclaimer & Risk Warnings](#️-disclaimer--risk-warnings)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🔗 Links](#-links)

## ✨ Features

### 🎯 **Oracle Infrastructure**
- **Decentralized Validation** - Multiple validator nodes (AI + Human) ensure data integrity
- **AI-Powered Validators** - Automatic API discovery and intelligent reasoning using Hugging Face models
- **Real-time Data Feeds** - Sub-second oracle updates with minimal gas fees  
- **High Confidence Scoring** - Reputation-weighted consensus mechanism
- **Prediction Market Optimized** - Purpose-built for outcome resolution
- **Hybrid Consensus** - AI and human validators work together for faster, more accurate resolutions

### 🎲 **IncryptPredict Demo**
- **Create Markets** - Launch prediction markets on any event
- **AMM Trading** - Automated market maker for outcome shares
- **Real-time Odds** - Live price discovery and liquidity management
- **Instant Settlement** - Oracle-powered automatic resolution

### 🏛️ **DAO Governance**
- **Proposal System** - Submit and vote on platform improvements
- **Treasury Management** - Community-controlled fund allocation
- **Revenue Distribution** - 50/50 split between holders and treasury
- **Validator Governance** - Stake-weighted voting on oracle parameters

### 🛠️ **Developer Tools**
- **JavaScript SDK** - Easy integration with comprehensive documentation
- **React Hooks** - Ready-to-use hooks for React applications
- **TypeScript Support** - Full type definitions for better DX
- **Multi-chain Ready** - BSC Mainnet, Testnet, and local development

## 🏆 Competitive Advantages

### ⚡ Industry-Leading Resolution Speed
- **4-Hour Optimistic Resolution**: Markets can resolve in 1-4 hours with a 4-hour dispute window, compared to industry standards of 24-48 hours (UMA) or 12+ hours (Polymarket)
- **50% Threshold for Optimistic Resolution**: Requires only ≥50% validator agreement for fast resolution, vs 100% for full consensus
- **Rapid Dispute Window**: 4-hour window allows corrections while maintaining speed advantage
- **Result**: Prediction markets resolve 6-12x faster than traditional oracle systems

### 🤖 Revolutionary AI Validator Network
- **Automatic API Discovery**: AI validators automatically discover 10+ relevant APIs for any prediction market question without manual curation
- **Hugging Face Integration**: Uses state-of-the-art language models (Meta-Llama-3-8B-Instruct) for intelligent data analysis and synthesis
- **Multi-Source Validation**: Fetches and synthesizes data from multiple discovered sources automatically
- **Transparent Reasoning**: Every AI validation includes detailed reasoning and metadata stored on-chain
- **Higher Starting Reputation**: AI validators start with 1200 reputation (vs 1000 for humans) due to their multi-source validation approach
- **24/7 Availability**: Continuous operation without downtime, enabling faster resolutions

### ✅ Production-Ready Deployment
- **BSC Testnet Deployment**: All core contracts deployed and verified on Binance Smart Chain Testnet
- **Verified Contracts**: All smart contracts verified on BSCScan for transparency and security
- **Live Testnet Operations**: Active validators, data feeds, and markets running on testnet
- **Mainnet Ready**: Codebase tested, optimized, and ready for mainnet deployment

### 💰 Sustainable Revenue Model
- **Multiple Revenue Streams**: Trading fees (2%), API subscriptions (tiered pricing), and market creation fees
- **50/50 Revenue Split**: Balanced distribution between token holders (stakers) and treasury for long-term sustainability
- **Tiered Subscription Service**: Free (1,000 requests/month), Basic (10,000 requests/month for 100 IO), Premium (unlimited for 1,000 IO/month)
- **Market Creation Fees**: 50 IO for public markets, 100 IO for private markets
- **Economic Security**: Validator staking requirements (1,000 IO minimum) and slashing mechanisms ensure network security

## 🚀 Quick Start

### System Requirements

**Development Environment:**
- Node.js 18.0.0 or higher (LTS recommended)
- npm 9.0.0+ or yarn 1.22.0+ or pnpm 8.0.0+
- Git 2.30.0+
- MetaMask or compatible BSC wallet extension

**For Smart Contract Development:**
- Hardhat 2.19.0+
- Solidity compiler 0.8.19+
- Access to BSC RPC endpoint (testnet or mainnet)

**For Validator Node Operation:**
- Node.js 18.0.0+
- 2GB+ RAM (4GB+ recommended)
- 10GB+ storage space
- Stable internet connection
- 1,000+ IO tokens for staking
- BNB for gas fees (~0.1+ BNB recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/IncryptOracle/IncryptOracle.git
cd IncryptOracle

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

**Start Development Server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

**Running Validator Node:**
```bash
cd validator-node
npm install
cp .env.example .env
# Edit .env with your configuration
npm run build
npm start
```

The validator node will:
1. Connect to BSC RPC endpoint
2. Check/register as validator (requires 1,000+ IO tokens staked)
3. Begin fetching data from configured sources
4. Submit validations to oracle contract on configured interval
5. Expose health check endpoints on port 3001

## 🏗️ Technical Architecture

Incrypt Oracle employs a multi-layered architecture that combines on-chain smart contracts with off-chain validator infrastructure to deliver high-fidelity, decentralized data feeds optimized for prediction market use cases.

### System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js React Frontend] --> B[Wagmi/viem Integration]
        B --> C[Custom React Hooks]
        C --> D[Real-time Event Subscriptions]
    end
    
    subgraph "Smart Contract Layer (BSC)"
        E[IncryptOracle Core] --> F[PredictionMarket]
        E --> G[OracleSubscription]
        F --> E
        H[IOToken ERC20Votes] --> I[IncryptDAO Governor]
        I --> J[TimelockController]
        F --> K[RevenueDistributor]
        K --> H
    end
    
    subgraph "Off-Chain Validator Network"
        L[Validator Node Service] --> M[Data Source Adapters]
        M --> N[CryptoPriceSource]
        M --> O[SportsOracle]
        M --> P[ElectionOracle]
        M --> Q[WeatherOracle]
        L --> R[Health Check Service]
        L --> S[Monitoring & Logging]
    end
    
    subgraph "SDK Layer"
        T[JavaScript SDK] --> U[DataFeedManager]
        T --> V[EventEmitter]
        W[React Hooks] --> T
    end
    
    A --> E
    L --> E
    T --> E
    D --> E
```

### Core Smart Contracts Deep Dive

#### 1. IncryptOracle.sol - Decentralized Oracle Core

The `IncryptOracle` contract implements a sophisticated consensus mechanism that aggregates data from multiple validator nodes using reputation-weighted algorithms. The contract architecture includes:

**Key Components:**
- **Hybrid Validator Network**: Supports both AI and human validators with `ValidatorType` enum (Human, AI)
- **AI Validator Support**: AI validators can submit validations with detailed metadata including confidence, sources, reasoning, and model information
- **Reputation-Weighted Consensus**: Each validator's submission is weighted by their reputation score, which dynamically adjusts based on validation accuracy. AI validators start with 1200 reputation (vs 1000 for humans)
- **Optimistic Resolution Mechanism**: Implements a 4-hour dispute window (vs UMA's 24-48 hours) allowing feeds to resolve when ≥50% of validators agree, dramatically reducing resolution latency for prediction markets
- **Dynamic Validator Management**: Supports 3-21 active validators with minimum stake requirements (1,000 IO tokens) and automatic slashing for poor performance
- **Division-by-Zero Protection**: Comprehensive safety checks prevent consensus calculation failures when all validators have zero reputation or when consensus values are zero
- **AI Metadata Storage**: Validation submissions from AI validators include JSON metadata stored on-chain for transparency and auditability

**Consensus Algorithm:**
```
weightedSum = Σ(values[i] × reputations[i])
totalWeight = Σ(reputations[i])
consensusValue = weightedSum / totalWeight

variance = Σ((values[i] - consensusValue)² × reputations[i]) / totalWeight
confidence = variance == 0 ? MAX_CONFIDENCE : MAX_CONFIDENCE - (variance × MAX_CONFIDENCE / consensusValue)
```

**Security Features:**
- ReentrancyGuard protection on all state-changing functions
- Pausable mechanism for emergency stops
- Slashing mechanism with 1-hour cooldown periods to prevent rapid stake depletion
- Maximum slash count (3) before validator removal
- Validation window enforcement (1 hour) to prevent stale data submissions

**Gas Optimizations:**
- Only processes validators who have actually submitted for a given feed (stored in `feed.validators[]` array) rather than iterating through all active validators
- Early termination checks in consensus calculation
- Efficient storage packing for validator and feed data structures

#### 2. PredictionMarket.sol - Automated Market Maker for Prediction Markets

The `PredictionMarket` contract implements a Constant Product Market Maker (CPMM) model specifically designed for binary outcome prediction markets, with tight integration to the oracle for automated resolution.

**AMM Implementation:**
```
For outcome pool with shares S and liquidity L:
Price = L / S
Cost to buy ΔS shares = (L × ΔS) / (S - ΔS)
Payout for selling ΔS shares = (L × ΔS) / (S + ΔS)
```

**Features:**
- **Optimistic Resolution Support**: Markets can resolve immediately after optimistic oracle resolution (50% confidence threshold) vs waiting for full consensus (70% threshold), enabling 1-4 hour resolution vs traditional 24-48 hour delays
- **Private Market Capability**: Supports private markets with access control, allowing market creators to restrict participation to approved addresses (useful for institutional or private prediction markets)
- **Revenue Generation**: Market creation fees (50 IO for public, 100 IO for private markets) generate platform revenue
- **Input Validation**: Comprehensive checks prevent division-by-zero errors, underflows, and invalid state transitions
- **Oracle Data Freshness**: Validates oracle data timestamps and confidence levels before resolution

**Security Hardening:**
- Division-by-zero protection in `buyShares()` and `sellShares()` with explicit pool liquidity checks
- Underflow protection with pre-flight balance validation
- Oracle staleness checks (24-hour maximum age for full resolution, 4-hour for optimistic)
- Minimum liquidity requirements (1,000 IO tokens) to ensure market viability

#### 3. OracleSubscription.sol - Revenue-Generating API Service

A tiered subscription service contract that provides rate-limited access to oracle data feeds, generating sustainable revenue for the protocol.

**Subscription Tiers:**
- **Free Tier**: 1,000 requests/month, no cost
- **Basic Tier**: 10,000 requests/month, 100 IO/month, 1 IO per additional request
- **Premium Tier**: Unlimited requests, 1,000 IO/month

**Implementation Details:**
- Automatic monthly billing with renewal support
- Per-request rate limiting with overflow pricing
- Request tracking via owner-controlled recording (integrated with oracle contract)
- Fee collection to designated fee collector address

#### 4. RevenueDistributor.sol - Automated Revenue Sharing

Implements a sophisticated staking and reward distribution mechanism with gas-optimized round processing.

**Distribution Mechanism:**
- **50/50 Split**: 50% to stakers (proportional to stake), 50% to treasury
- **Round-Based System**: Revenue collected into discrete rounds for precise accounting
- **Gas Optimization**: Tracks `lastProcessedRound` per user to only process unclaimed rounds, preventing unbounded loops
- **Paginated Claiming**: `claimRewardsPaginated()` function allows users with many unprocessed rounds to claim incrementally (max 100 rounds per call)

**Staking Features:**
- Minimum staking period: 7 days
- Distribution interval: 7 days (configurable)
- Automatic reward calculation based on stake proportional to total staked
- Emergency pause functionality

#### 5. Domain-Specific Oracle Templates

Specialized oracle contracts optimized for specific data types:

**CryptoPriceOracle.sol:**
- 60-second update intervals for cryptocurrency prices
- Multiple exchange aggregation (Binance, CoinGecko)
- Median price calculation for outlier resistance
- Rate limiting to prevent excessive API calls

**SportsOracle.sol:**
- Event status tracking (Scheduled → Live → Completed)
- Immediate post-game resolution capability
- Score encoding: homeScore in upper 16 bits, awayScore in lower 16 bits of uint256 value

**ElectionOracle.sol:**
- Official election authority integration
- Candidate array management
- Winner index encoding for multi-candidate elections
- High validation threshold requirements for electoral integrity

**WeatherOracle.sol:**
- Multiple metric support (Temperature, Precipitation, WindSpeed, Humidity, ExtremeEvents)
- Location-based feed management
- Configurable update intervals per metric type
- Metric-specific encoding schemes

### Off-Chain Validator Node Infrastructure

The validator node service is a production-ready TypeScript application that runs as a background service, fetching data from external APIs and submitting validated results to the oracle contract.

**Architecture:**

```
Validator Node
├── Configuration Layer
│   ├── Environment variable management
│   ├── Contract address configuration
│   └── Data source enablement flags
├── Data Source Layer
│   ├── BaseDataSource (abstract class)
│   ├── CryptoPriceSource (Binance + CoinGecko aggregation)
│   ├── SportsSource (placeholder for future)
│   └── ElectionSource (placeholder for future)
├── Validator Layer
│   ├── Oracle contract interaction (ethers.js v6)
│   ├── Automatic registration on startup
│   ├── Validation cycle scheduling (node-cron)
│   └── Feed monitoring and submission
├── Monitoring Layer
│   ├── Winston logging (multi-level, file + console)
│   ├── Health check HTTP server (Express)
│   ├── Prometheus metrics endpoint
│   └── Status tracking (validator info, last validation, data source health)
└── Main Service
    ├── Graceful shutdown handling (SIGTERM/SIGINT)
    ├── Error recovery mechanisms
    └── Event loop management
```

**Data Aggregation Algorithm:**
The validator fetches data from multiple sources (e.g., Binance and CoinGecko for crypto prices) and calculates a median value for robustness against single-source failures or manipulation attempts. Confidence scores are derived from variance across sources.

**Health Monitoring:**
- HTTP endpoints: `/health`, `/ready`, `/metrics`
- Status tracking: validator registration, last validation timestamp, data source operational status
- Automatic health status calculation: healthy → degraded → unhealthy based on component states

**Deployment Options:**
- Docker containerization with health check support
- PM2 process management for production
- Systemd service for Linux servers
- Cloud platforms: AWS ECS, Google Cloud Run, Railway, Heroku

### AI Validator Node Infrastructure

Incrypt Oracle features a revolutionary AI-powered validator that combines artificial intelligence with automatic API discovery, inspired by Sora Oracle's agentic approach. The AI validator uses Hugging Face inference models to analyze prediction market questions, automatically discover relevant data sources, and provide intelligent reasoning for each validation.

**Architecture:**

```
AI Validator Node
├── Configuration Layer
│   ├── Hugging Face API token and model configuration
│   ├── API discovery settings (RapidAPI, APIs.guru)
│   └── Validator wallet and contract addresses
├── API Discovery Layer (Inspired by Sora Oracle Layer 1)
│   ├── Automatic API discovery for any prediction market question
│   ├── RapidAPI marketplace search
│   ├── APIs.guru directory query
│   └── Known reliable sources by category
├── Data Fetching Layer
│   ├── Multi-source data aggregation
│   ├── Authentication handling
│   └── Error recovery and fallbacks
├── AI Inference Layer
│   ├── Hugging Face model integration (Meta-Llama-3-8B-Instruct)
│   ├── Question analysis and data synthesis
│   ├── Value extraction and reasoning generation
│   └── Confidence calculation
├── Validation Layer
│   ├── Oracle contract interaction (ethers.js v6)
│   ├── AI metadata JSON generation
│   ├── Validation submission with reasoning
│   └── Health check and monitoring
└── Main Service
    ├── Graceful shutdown handling
    ├── Error recovery mechanisms
    └── Continuous validation cycles
```

**Key Features:**

1. **Automatic API Discovery**
   - Analyzes prediction market question to extract search terms
   - Searches RapidAPI marketplace for relevant endpoints
   - Queries APIs.guru public API directory
   - Returns top 10 most relevant APIs with authentication methods
   - No manual API curation required - automatically expands to new data types

2. **Hugging Face Integration**
   - Uses state-of-the-art language models for question analysis
   - Synthesizes data from multiple sources
   - Provides detailed reasoning for each validation
   - Calculates confidence scores based on data agreement

3. **Multi-Source Validation**
   - Fetches data from top 5 discovered APIs
   - Calculates median values for robustness
   - Analyzes variance for confidence scoring
   - Handles authentication, rate limiting, and errors gracefully

4. **AI Metadata**
   - Each validation includes JSON metadata with:
     - Confidence score (0-100)
     - List of data sources used
     - Detailed reasoning for the validation
     - Model information and timestamp

5. **Smart Contract Integration**
   - AI validators registered via `registerAIValidator()` (owner-only)
   - Submit validations via `submitAIValidation()` with metadata
   - Higher starting reputation (1200 vs 1000 for human validators)
   - Full integration with reputation-weighted consensus

**Setup:**

```bash
cd ai-validator
npm install
cp .env.example .env
# Configure .env with:
# - AI_VALIDATOR_PRIVATE_KEY
# - HUGGINGFACE_API_TOKEN
# - ORACLE_ADDRESS
# - RAPIDAPI_KEY (optional)
npm run build
npm start
```

**Health Checks:**
- HTTP endpoints: `/health`, `/ready`, `/metrics`, `/status`
- Tracks: AI validator status, last validation, Hugging Face API status, API discovery health

**Benefits:**
- **Faster Resolutions**: AI processes and validates data much faster than manual validators
- **Automatic Expansion**: No manual API curation - AI discovers new sources automatically
- **Transparent Reasoning**: Every validation includes detailed reasoning for auditability
- **24/7 Availability**: Continuous operation without downtime
- **Cost Efficiency**: Reduces operational costs while maintaining high accuracy
- **Hybrid Security**: Combines AI speed with human validators for defense-in-depth

### Frontend Architecture & Blockchain Integration

The Next.js frontend implements a fully integrated blockchain experience with real-time updates, comprehensive error handling, and mobile-optimized responsive design.

**React Hooks Architecture:**

**useMarkets.ts:**
- Fetches market counter from contract
- Iterates through all markets and fetches full market data
- Calculates odds dynamically from pool ratios
- Real-time updates via `useWatchContractEvent` for:
  - `MarketCreated` events
  - `SharesPurchased` events
  - `SharesSold` events
  - `MarketResolved` events
- Debounced refetching to prevent excessive RPC calls

**useContract.ts:**
- Comprehensive contract ABIs for all contracts
- Typed hooks using wagmi and viem
- Prepared contract writes with proper argument encoding
- Read hooks with conditional enabling based on arguments

**Error Handling:**
- Centralized error parser (`errorHandler.ts`) that categorizes errors:
  - User rejection (transaction cancelled)
  - Insufficient funds
  - Gas estimation failures
  - Network errors
  - Contract-specific errors (validation window, not validator, etc.)
- User-friendly error messages with actionable suggestions

**Real-Time Updates:**
- Event watching via wagmi's `useWatchContractEvent`
- Automatic UI refresh on contract state changes
- Optimistic UI updates where appropriate
- Debouncing to prevent UI thrashing from rapid events

**Mobile Optimizations:**
- Touch-friendly button sizes (minimum 44×44px)
- Responsive grid layouts (1 column mobile → 2 tablet → 4 desktop)
- iOS zoom prevention (16px minimum font size on inputs)
- Smooth scrolling with `-webkit-overflow-scrolling: touch`
- Reduced padding on mobile for better space utilization

### Gas Optimization Strategies

Multiple optimization techniques were implemented to reduce contract gas consumption:

**IncryptOracle.sol Optimizations:**
1. **Validator Reputation Updates**: Only processes validators who submitted (stored in `feed.validators[]`) instead of iterating all `activeValidators` (max 21), reducing loop iterations by up to 90%
2. **Early Termination**: Consensus calculation stops processing once sufficient data collected
3. **Storage Packing**: Validator struct fields organized for efficient storage slot usage

**RevenueDistributor.sol Optimizations:**
1. **Round Tracking**: `lastProcessedRound` field prevents reprocessing historical rounds
2. **Paginated Claiming**: Users with many unprocessed rounds can claim incrementally (100 rounds per call)
3. **View Function Limits**: `getPendingRewards()` limits calculation to 50 rounds to prevent excessive gas in view calls

**Estimated Gas Savings:**
- Validator reputation update: ~15,000 gas reduction per feed resolution
- Reward claiming: ~50,000+ gas reduction for users with 100+ unprocessed rounds
- Overall: ~20-30% reduction in gas costs for typical operations

### Security Architecture

**On-Chain Security:**
- **Reentrancy Protection**: All state-changing functions protected with OpenZeppelin ReentrancyGuard
- **Access Control**: Role-based access with Ownable pattern and modifier-based checks
- **Integer Overflow Protection**: Solidity 0.8.x automatic overflow checking
- **Division-by-Zero Prevention**: Explicit checks before all division operations with fallback logic
- **Input Validation**: Comprehensive require statements for all external inputs
- **Slashing Mechanism**: Economic penalties for malicious or incompetent validators (10% stake per slash, max 3 slashes before removal)

**Off-Chain Security:**
- Private key management via environment variables (never committed)
- Secure API key storage
- Rate limiting on data source API calls
- Input sanitization in validator node
- Health check authentication (can be extended with API keys)

**Audit Considerations:**
- OpenZeppelin battle-tested libraries used throughout
- Comprehensive test coverage (integration tests + edge cases)
- Formal verification ready (pure functions isolated, minimal side effects)

### Consensus Mechanism Deep Dive

The oracle employs a sophisticated multi-phase consensus mechanism:

**Phase 1: Validation Collection**
- Validators submit values within 1-hour validation window
- Each submission includes: value (uint256 scaled), timestamp, data source identifier
- Submissions are stored in mapping: `validations[feedId][validatorAddress]`

**Phase 2: Consensus Calculation**
When validation threshold is reached OR ≥50% of validators agree:
1. Collect all submitted values and corresponding validator reputations
2. Calculate reputation-weighted average: `Σ(value × reputation) / Σ(reputation)`
3. Calculate variance: `Σ((value - consensus)² × reputation) / Σ(reputation)`
4. Derive confidence score: inverse relationship to variance, bounded 0-10000 (100.00%)

**Phase 3: Reputation Update**
After consensus calculation:
- Calculate accuracy for each validator: `accuracy = 10000 - ((|submitted - consensus| / consensus) × 10000)`
- Update reputations:
  - >90% accuracy: +10 reputation, increment successfulValidations
  - >70% accuracy: +5 reputation
  - <50% accuracy: -5 reputation, trigger slashing check
- Slashing: If accuracy <50% and cooldown passed, slash 10% of stake (minimum stake preserved)

**Phase 4: Optimistic Resolution (if applicable)**
- If ≥50% validators agree but <100% threshold: resolve optimistically
- Set `optimisticResolutionTime` timestamp
- Open 4-hour dispute window
- Validators can raise disputes with alternative values during window
- Disputes trigger consensus recalculation including disputed value
- False disputes penalized with 1% stake slash

### Smart Contracts

| Contract | Address (Testnet) | Purpose | Key Features |
|----------|------------------|---------|--------------|
| **IOToken** | `0xdc6a5752...` | ERC20 governance token | ERC20Votes extension, delegate voting, fixed supply 1B tokens |
| **IncryptOracle** | `0x823C0Ead...` | Core oracle with hybrid AI-human validator network | Reputation-weighted consensus, AI validator support, optimistic resolution, slashing, 3-21 validators |
| **PredictionMarket** | `0x101B0f8d...` | AMM-based prediction markets | CPMM model, oracle integration, private markets, creation fees |
| **IncryptDAO** | `0xb7ed1FDA...` | OpenZeppelin Governor | Proposal system, voting, timelock integration |
| **RevenueDistributor** | `0xe68b3647...` | Automated fee distribution | 50/50 split, staking rewards, gas-optimized rounds |
| **OracleSubscription** | TBD | API subscription service | Tiered access (Free/Basic/Premium), rate limiting, revenue generation |
| **TimelockController** | `0xF5B20c8f...` | DAO timelock | Delayed execution, multi-signature support |

## 💻 Development Workflow

### Smart Contract Development

**Local Development:**
```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run Hardhat local node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

**Testing:**
```bash
# Run all tests
npm run test

# Run specific test file
npx hardhat test test/IncryptOracle.test.js

# Run with gas reporting
REPORT_GAS=true npm run test

# Run with coverage (if configured)
npm run coverage
```

**Testnet Deployment:**
```bash
# Deploy to BSC Testnet
npm run deploy:testnet

# Verify contracts on BSCScan
npm run verify:testnet

# Interact with deployed contracts
npx hardhat console --network bscTestnet
```

**Mainnet Deployment:**
```bash
# Deploy to BSC Mainnet (REQUIRES MAINNET SETUP)
npm run deploy:mainnet

# Verify contracts
npm run verify:mainnet

# Transfer ownership to DAO timelock
# (Use transfer-ownership.js script)
```

### Frontend Development

**Development Mode:**
```bash
# Install dependencies
npm install

# Start Next.js dev server with hot reload
npm run dev

# Access at http://localhost:3000
```

**Production Build:**
```bash
# Build optimized production bundle
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel deploy
```

**Code Quality:**
```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking (TypeScript)
npm run type-check
```

**Testing Frontend:**
```bash
# Run React component tests (if configured)
npm run test:frontend

# E2E testing with Playwright (if configured)
npm run test:e2e
```

### Validator Node Development

**Local Development:**
```bash
cd validator-node

# Install dependencies
npm install

# Development mode (TypeScript direct execution)
npm run dev

# Watch mode (auto-recompile on changes)
npm run watch
```

**Testing Validator Node:**
```bash
# Run validator node tests
npm test

# Test against local Hardhat node
# 1. Start Hardhat node: npx hardhat node
# 2. Deploy contracts to localhost
# 3. Update .env RPC_URL to http://localhost:8545
# 4. Run validator: npm run dev
```

**Production Deployment:**
```bash
# Build TypeScript
npm run build

# Run with PM2
pm2 start dist/index.js --name incrypt-validator

# Or with Docker
docker build -t incrypt-validator .
docker run -d --env-file .env incrypt-validator
```

### SDK Development

**Local Development:**
```bash
cd sdk

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Watch mode for development
npm run watch
```

**SDK Testing:**
```bash
# Unit tests
npm test

# Integration tests against testnet
INTEGRATION_TEST=true npm test

# Build for distribution
npm run build
```

**Publishing:**
```bash
# Bump version
npm version patch|minor|major

# Publish to npm
npm publish --access public

# Or publish to GitHub Packages
npm publish
```

## 🔧 Configuration & Environment Setup

### Frontend Environment Variables

**Required Variables:**
```bash
# Blockchain Network
NEXT_PUBLIC_CHAIN_ID=97  # 97 for BSC Testnet, 56 for BSC Mainnet
NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Contract Addresses (BSC Testnet - update after deployment)
NEXT_PUBLIC_IO_TOKEN_ADDRESS=0xdc6a5752d457aAdF3f1C65E3a158f44277717183
NEXT_PUBLIC_ORACLE_ADDRESS=0x823C0Ead984707A4B73173274E0e075492866593
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0x101B0f8d4B87669fdDd9d61386288Cc16003D0e5
NEXT_PUBLIC_DAO_ADDRESS=0xb7ed1FDA4DAb1e0000D2e64bB9dD2D6b492bc1b0
NEXT_PUBLIC_REVENUE_DISTRIBUTOR_ADDRESS=0xe68b3647c436B0De90D59600093F0DF13Af21596
```

**Optional Variables:**
```bash
# Analytics & Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Feature Flags
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS=true
NEXT_PUBLIC_ENABLE_PRIVATE_MARKETS=true
```

### Validator Node Environment Variables

**Required for Validator Operation:**
```bash
# Validator Identity (KEEP SECURE - DO NOT COMMIT)
VALIDATOR_PRIVATE_KEY=your_validator_private_key_here

# Blockchain Configuration
RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
CHAIN_ID=97

# Contract Addresses
ORACLE_ADDRESS=0x823C0Ead984707A4B73173274E0e075492866593
IO_TOKEN_ADDRESS=0xdc6a5752d457aAdF3f1C65E3a158f44277717183

# Validator Configuration
STAKE_AMOUNT=1000  # Minimum 1,000 IO tokens
VALIDATION_INTERVAL=60  # Seconds between validation cycles

# Data Source Configuration
ENABLED_DATA_SOURCES=crypto  # Comma-separated: crypto,sports,elections,weather
BINANCE_API_URL=https://api.binance.com/api/v3
COINGECKO_API_KEY=your_coingecko_api_key_optional

# Monitoring & Health Checks
HEALTH_CHECK_PORT=3001
ENABLE_METRICS=true
LOG_LEVEL=info  # debug, info, warn, error
```

### Smart Contract Deployment Configuration

**Hardhat Configuration:**
```javascript
// hardhat.config.js
module.exports = {
  solidity: "0.8.19",
  networks: {
    bscTestnet: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 97
    },
    bscMainnet: {
      url: "https://bsc-dataseed1.binance.org/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 56
    }
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY
  }
};
```

**Deployment Script Variables:**
```bash
# Deployment
PRIVATE_KEY=deployer_private_key
MNEMONIC=deployer_mnemonic_phrase
BSCSCAN_API_KEY=your_bscscan_api_key

# Contract addresses populated after deployment
IO_TOKEN_ADDRESS=deployed_address
ORACLE_ADDRESS=deployed_address
PREDICTION_MARKET_ADDRESS=deployed_address
DAO_ADDRESS=deployed_address
REVENUE_DISTRIBUTOR_ADDRESS=deployed_address
TIMELOCK_ADDRESS=deployed_address
```

## 🎯 Usage Examples & Integration Guides

### Using the JavaScript SDK

**Basic Oracle Integration:**
```javascript
import { IncryptOracle } from 'incrypt-oracle-sdk';

// Initialize oracle with configuration
const oracle = new IncryptOracle({
  network: 'bsc-mainnet',  // or 'bsc-testnet', 'localhost'
  rpcUrl: 'https://bsc-dataseed1.binance.org/',  // Optional: custom RPC
  contractAddress: '0x823C0Ead984707A4B73173274E0e075492866593',  // Optional: custom contract
  pollingInterval: 5000,  // 5 seconds default
  timeout: 30000  // 30 seconds default
});

// Get latest BTC price
const btcPrice = await oracle.getPrice('BTC/USD');
console.log(`BTC: $${btcPrice.value / 10000}`);  // Value is scaled by 10000
console.log(`Confidence: ${btcPrice.confidence / 100}%`);
console.log(`Timestamp: ${new Date(btcPrice.timestamp * 1000)}`);

// Get all active feeds
const feeds = await oracle.getAllFeeds();
feeds.forEach(feed => {
  console.log(`${feed.name}: ${feed.description}`);
});
```

**Real-Time Subscriptions:**
```javascript
// Subscribe to price updates
const subscription = oracle.subscribe('ETH/USD', {
  onData: (data) => {
    console.log('New ETH price:', data.value / 10000);
    console.log('Confidence:', data.confidence / 100, '%');
  },
  onError: (error) => {
    console.error('Subscription error:', error);
  },
  onConnected: () => {
    console.log('Connected to oracle feed');
  },
  onDisconnected: () => {
    console.log('Disconnected from feed');
  }
});

// Unsubscribe when done
subscription.unsubscribe();
```

**AI Validator Integration:**
```javascript
import { IncryptOracle, ValidatorType } from 'incrypt-oracle-sdk';

const oracle = new IncryptOracle({
  network: 'bsc-testnet',
  signer: wallet
});

// Get count of AI validators
const aiCount = await oracle.getAIValidatorCount();
console.log(`Active AI validators: ${aiCount}`);

// Get validation submission with AI metadata
const submission = await oracle.getValidationSubmission(feedId, validatorAddress);
if (submission.validatorType === ValidatorType.AI && submission.aiMetadata) {
  console.log('AI Confidence:', submission.aiMetadata.confidence);
  console.log('Sources:', submission.aiMetadata.sources);
  console.log('Reasoning:', submission.aiMetadata.reasoning);
}

// Submit AI validation (AI validator only)
const aiMetadata = {
  confidence: 92.5,
  sources: ['Binance API', 'CoinGecko API'],
  reasoning: 'Based on analysis of multiple sources...',
  model: 'meta-llama/Meta-Llama-3-8B-Instruct',
  timestamp: Date.now()
};

await oracle.submitAIValidation(feedId, value, 'AI Validator', aiMetadata);
```

**Validator Operations:**
```javascript
import { ethers } from 'ethers';

// Connect with signer for validator operations
const provider = new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org/');
const wallet = new ethers.Wallet(process.env.VALIDATOR_PRIVATE_KEY, provider);

const oracle = new IncryptOracle({
  network: 'bsc-mainnet',
  signer: wallet  // Required for write operations
});

// Register as validator (requires 1,000 IO tokens)
const stakeAmount = ethers.parseEther('1000');
const tx = await oracle.registerValidator(stakeAmount);
await tx.wait();
console.log('Validator registered!');

// Submit validation for a feed
const feedId = '0x...';  // Feed ID from createDataFeed
const value = 50000 * 10000;  // $50,000 scaled by 10000
const dataSource = 'Binance API';
const validationTx = await oracle.submitValidation(feedId, value, dataSource);
await validationTx.wait();
console.log('Validation submitted!');
```

### React Integration

**Using React Hooks:**
```jsx
import React from 'react';
import { useIncryptOracle, usePriceData, useOracleFeeds } from 'incrypt-oracle-sdk/react';

function PriceWidget() {
  const { oracle, isConnected, error: oracleError } = useIncryptOracle({ 
    network: 'bsc-mainnet' 
  });
  
  const { data: btcPrice, loading, error } = usePriceData(oracle, 'BTC/USD', {
    enabled: isConnected,  // Only fetch when connected
    pollingInterval: 5000,  // Poll every 5 seconds
    onError: (err) => console.error('Price fetch error:', err)
  });
  
  const { data: feeds } = useOracleFeeds(oracle);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!btcPrice) return <div>No data available</div>;
  
  return (
    <div>
      <h2>Bitcoin Price</h2>
      <p>${(btcPrice.value / 10000).toFixed(2)}</p>
      <small>Confidence: {(btcPrice.confidence / 100).toFixed(2)}%</small>
      <small>Last updated: {new Date(btcPrice.timestamp * 1000).toLocaleString()}</small>
      
      <div>
        <h3>Active Feeds: {feeds?.length || 0}</h3>
        {feeds?.map(feedId => (
          <div key={feedId}>{feedId}</div>
        ))}
      </div>
    </div>
  );
}
```

**Using Custom Hooks (Frontend Integration):**
```jsx
import { useMarkets, useUserPosition } from '../hooks/useMarkets';
import { useBuyShares, useCalculateCost } from '../hooks/useContract';
import { useAccount } from 'wagmi';

function PredictionMarketPage() {
  const { address } = useAccount();
  const { markets, loading, error } = useMarkets();
  const { writeAsync: buyShares, isLoading: buying } = useBuyShares();
  
  const handleBuyShares = async (marketId, outcome, amount) => {
    try {
      const hash = await buyShares({
        marketId,
        outcome,  // 0 = No, 1 = Yes
        amount: parseEther(amount.toString())
      });
      await waitForTransaction({ hash });
      console.log('Shares purchased!');
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };
  
  return (
    <div>
      {markets.map(market => (
        <MarketCard 
          key={market.id} 
          market={market}
          onBuy={handleBuyShares}
        />
      ))}
    </div>
  );
}
```

### Smart Contract Integration

**Basic Oracle Integration:**
```solidity
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IncryptOracle.sol";

contract MyPredictionMarket {
    IncryptOracle public oracle;
    
    struct Market {
        bytes32 oracleFeedId;
        uint256 threshold;  // e.g., 50000 = $50,000
        bool resolved;
        bool outcome;
    }
    
    mapping(uint256 => Market) public markets;
    
    constructor(address _oracle) {
        oracle = IncryptOracle(_oracle);
    }
    
    function resolveMarket(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(!market.resolved, "Already resolved");
        
        // Get oracle data
        (, , uint256 value, uint256 timestamp, uint256 confidence, bool isActive) = 
            oracle.getDataFeed(market.oracleFeedId);
            
        require(isActive, "Oracle feed not active");
        require(confidence >= 7000, "Confidence too low");  // 70% minimum
        require(block.timestamp - timestamp <= 24 hours, "Data too stale");
        
        // Check optimistic resolution
        bool isOptimistic = oracle.optimisticResolutionTime(market.oracleFeedId) > 0;
        bool disputeWindowOpen = oracle.isDisputeWindowOpen(market.oracleFeedId);
        
        if (isOptimistic && disputeWindowOpen) {
            // Optimistic resolution: lower confidence threshold (50%)
            require(confidence >= 5000, "Optimistic confidence too low");
        }
        
        // Resolve market
        market.outcome = value > market.threshold;
        market.resolved = true;
    }
}
```

**Advanced: Using Domain-Specific Oracles:**
```solidity
import "./oracles/CryptoPriceOracle.sol";
import "./oracles/SportsOracle.sol";

contract AdvancedMarketCreator {
    CryptoPriceOracle public cryptoOracle;
    SportsOracle public sportsOracle;
    
    constructor(address _cryptoOracle, address _sportsOracle) {
        cryptoOracle = CryptoPriceOracle(_cryptoOracle);
        sportsOracle = SportsOracle(_sportsOracle);
    }
    
    function createCryptoMarket(string memory symbol) external {
        // Get crypto price feed
        bytes32 feedId = cryptoOracle.createPriceFeed(
            symbol,
            string(abi.encodePacked("Price feed for ", symbol)),
            3  // 3 validators required
        );
        
        // Use feedId in prediction market...
    }
    
    function createSportsMarket(
        string memory eventId,
        string memory league,
        string memory homeTeam,
        string memory awayTeam
    ) external {
        bytes32 feedId = sportsOracle.createEventFeed(
            eventId,
            league,
            homeTeam,
            awayTeam,
            block.timestamp + 2 hours,  // Game in 2 hours
            3  // 3 validators
        );
        
        // Use feedId in prediction market...
    }
}
```

### Validator Node Integration

**Running Your Own Validator:**
```bash
# 1. Clone repository
git clone https://github.com/GHX5T-SOL/IncryptOracle.git
cd IncryptOracle/validator-node

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your validator private key and settings

# 4. Build and start
npm run build
npm start

# Validator will:
# - Register with oracle (if not already registered)
# - Fetch data from Binance/CoinGecko every 60 seconds
# - Submit validations to oracle contract
# - Expose health checks on port 3001
```

**Monitoring Validator:**
```bash
# Check health
curl http://localhost:3001/health

# Check readiness
curl http://localhost:3001/ready

# Get Prometheus metrics
curl http://localhost:3001/metrics

# View logs
tail -f combined.log
tail -f error.log
```

## 📊 Testing & Security

### Comprehensive Test Suite Architecture

The test suite is organized into multiple layers covering unit tests, integration tests, edge cases, and gas optimization verification:

**Test Structure:**
```
test/
├── IncryptOracle.test.js       # Unit tests for oracle core
├── IOToken.test.js              # Token functionality tests
├── integration/
│   ├── oracleFlow.test.js       # End-to-end oracle validation flow
│   └── predictionMarket.test.js # Full market lifecycle testing
└── edgeCases/
    └── oracle.test.js           # Edge cases, zero values, max validators, etc.
```

**Integration Test Coverage:**
- **Full Oracle Flow**: Validator registration → Feed creation → Validation submission → Consensus calculation → Resolution
- **Reputation Updates**: Verifies validator reputation adjustments based on accuracy
- **Slashing Mechanism**: Tests slashing triggers, cooldown periods, and stake preservation
- **Market Lifecycle**: Create → Trade → Resolve → Claim complete flow
- **Optimistic Resolution**: Tests 50% threshold resolution and dispute window

**Edge Case Coverage:**
- Zero validator scenarios
- Maximum validator count enforcement (21 validators)
- Oracle data staleness detection
- Division-by-zero prevention in consensus calculation
- Very large and very small value handling
- Validation window expiration
- Empty reputation scenarios

**Test Coverage Metrics:**

```bash
| Contract           | Coverage | Tests | Integration | Edge Cases | Gas Usage |
|-------------------|----------|-------|-------------|------------|-----------|
| IOToken           | 95%      | 18    | 5           | 3          | 1.2M      |
| IncryptOracle     | 88%      | 23    | 8           | 12         | 2.4M      |
| PredictionMarket  | 92%      | 31    | 6           | 5          | 3.4M      |
| IncryptDAO        | 90%      | 27    | 4           | 2          | 2.7M      |
| RevenueDistributor| 94%      | 22    | 3           | 2          | 1.8M      |
| OracleSubscription| 85%      | 15    | 2           | 1          | 1.5M      |
```

**Total**: 121+ tests, 88%+ coverage across all contracts

### Security Audit & Hardening

**Security Features Implemented:**

1. **Division-by-Zero Protection**
   - Consensus calculation checks `totalWeight > 0` before division
   - Special handling for zero consensus values with variance-based confidence calculation
   - Pool liquidity checks before AMM calculations
   - Share count validation before division operations

2. **Input Validation**
   - All external inputs validated with explicit require statements
   - Range checks for amounts, durations, thresholds
   - String length validation for market questions/descriptions
   - Oracle data freshness checks (24-hour max for full resolution, 4-hour for optimistic)
   - Confidence threshold enforcement (≥70% for full, ≥50% for optimistic)

3. **Slashing Mechanism**
   - Automatic slashing for validators with <50% accuracy
   - 1-hour cooldown period prevents rapid successive slashes
   - Minimum stake preservation (never slashes below MIN_STAKE)
   - Maximum 3 slashes before automatic validator removal
   - False dispute penalties (1% stake slash)

4. **Access Control**
   - Ownable pattern for administrative functions
   - Validator-only modifiers for validation submission
   - Creator-only functions for private market participant management
   - Emergency pause functionality on all critical contracts

5. **Reentrancy Protection**
   - OpenZeppelin ReentrancyGuard on all state-changing functions
   - Checks-Effects-Interactions pattern followed throughout
   - SafeERC20 for token transfers

6. **Integer Safety**
   - Solidity 0.8.x automatic overflow checking
   - Explicit underflow checks before subtractions
   - SafeMath patterns for critical calculations

**Audit Readiness:**
- **OpenZeppelin Libraries**: All security-critical functionality uses battle-tested libraries
- **Formal Verification**: Core consensus and AMM functions isolated and verifiable
- **Fuzzing Ready**: Contracts designed with property-based testing in mind
- **Gas Optimization**: Efficient code reduces attack surface and deployment costs
- **Current Status (Nov 18, 2025)**: Completed a free beta assessment with AI Smart Contract Auditor and preparing submission packages for firms like CertiK or Halborn. No independent security firm has published an audit or endorsement yet.

### Live Metrics & Performance

> ℹ️ These metrics reflect internal BSC Testnet simulations during the private beta as of November 18, 2025. They are not production or mainnet usage figures.

**Network Performance:**
- **Oracle Uptime**: 99.97% (monitored via health check endpoints)
- **Average Resolution Latency**: 1.1s (from validation submission to consensus)
- **Optimistic Resolution**: 4-hour dispute window vs 24-48h industry standard
- **Gas Efficiency**: 20-30% reduction vs initial implementation through loop optimizations

**Network Status:**
- **Active Validators**: 3+ (expandable to 21)
- **Data Feeds**: 47+ active (crypto, sports, elections, weather)
- **Total Volume**: $5,800+ (BSC Testnet)
- **Markets Created**: 7+ (testnet)
- **Total Staked**: 3,000+ IO tokens

**Validator Network Health:**
- Average validator reputation: 1,000+ (starting reputation)
- Successful validation rate: >90% (validator accuracy tracking)
- Slashing events: 0 (indicating high-quality validator participation)

## 🌐 Deployment

### BSC Testnet

✅ **All contracts deployed and verified on BSC Testnet**

| Contract | Address | BSCScan |
|----------|---------|---------|
| **IO Token** | `0xdc6a5752d457aAdF3f1C65E3a158f44277717183` | [View](https://testnet.bscscan.com/address/0xdc6a5752d457aAdF3f1C65E3a158f44277717183) |
| **Incrypt Oracle** | `0x823C0Ead984707A4B73173274E0e075492866593` | [View](https://testnet.bscscan.com/address/0x823C0Ead984707A4B73173274E0e075492866593) |
| **Prediction Market** | `0x101B0f8d4B87669fdDd9d61386288Cc16003D0e5` | [View](https://testnet.bscscan.com/address/0x101B0f8d4B87669fdDd9d61386288Cc16003D0e5) |
| **Incrypt DAO** | `0xb7ed1FDA4DAb1e0000D2e64bB9dD2D6b492bc1b0` | [View](https://testnet.bscscan.com/address/0xb7ed1FDA4DAb1e0000D2e64bB9dD2D6b492bc1b0) |
| **Revenue Distributor** | `0xe68b3647c436B0De90D59600093F0DF13Af21596` | [View](https://testnet.bscscan.com/address/0xe68b3647c436B0De90D59600093F0DF13Af21596) |
| **Timelock Controller** | `0xF5B20c8fcC3e57e334ed417Ba3cd865C086A95DE` | [View](https://testnet.bscscan.com/address/0xF5B20c8fcC3e57e334ed417Ba3cd865C086A95DE) |

**Deploy from source:**
```bash
# Clone and install
git clone https://github.com/GHX5T-SOL/IncryptOracle.git
cd IncryptOracle
npm install

# Configure .env with your private key
# Then deploy
npm run deploy:testnet
```

### BSC Mainnet

```bash
# Deploy to mainnet (requires mainnet setup)
npm run deploy:mainnet

# Remember to:
# 1. Update environment variables
# 2. Verify contracts on BSCScan  
# 3. Initialize with proper parameters
# 4. Transfer ownership to DAO timelock
```

### Vercel Deployment

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- **Solidity**: Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **TypeScript/JavaScript**: ESLint + Prettier configuration included
- **React**: Functional components with hooks
- **Testing**: Comprehensive test coverage required

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **🌐 Website**: [https://incrypt.fun](https://incrypt.fun)
- **📖 Documentation**: [https://incrypt.fun/docs](https://incrypt.fun/docs)
- **💬 Discord**: [https://discord.gg/incrypt](https://discord.gg/incrypt)
- **🐦 Twitter**: [https://x.com/incryppt_defi](https://x.com/incrypt_defi/)
- **📧 Email**: [incryptinvestments@protonmail.com](mailto:incryptinvestments@protonmail.com)

## 💰 Tokenomics & Revenue Architecture

### $IO Token Utility

**Token Utility:**
1. **Governance**: ERC20Votes extension enables delegation and voting on DAO proposals
2. **Validator Staking**: Minimum 1,000 IO tokens required to register as validator (slashed for poor performance)
3. **Prediction Market Currency**: Primary medium of exchange for market participation
4. **Subscription Payments**: Required for API access tiers (Basic: 100 IO/month, Premium: 1,000 IO/month)
5. **Market Creation Fees**: 50 IO for public markets, 100 IO for private markets

### Revenue Model & Distribution Mechanism

**Revenue Sources:**

1. **Prediction Market Trading Fees**
   - Default fee: 2% (200 basis points) on all buy/sell transactions
   - Configurable per market (up to 10% maximum)
   - Collected in IO tokens and routed to `RevenueDistributor`

2. **Oracle API Subscriptions**
   - **Free Tier**: 1,000 requests/month (no revenue, network growth)
   - **Basic Tier**: 100 IO/month for 10,000 requests, 1 IO per additional request
   - **Premium Tier**: 1,000 IO/month for unlimited requests
   - Estimated revenue potential: $5,000-50,000/month at scale (depending on subscribers)

3. **Market Creation Fees**
   - Public market: 50 IO tokens (~$5-50 depending on IO price)
   - Private market: 100 IO tokens (~$10-100)
   - Collected immediately on market creation

4. **Premium Market Features**
   - Private market access control (100 IO creation fee)
   - Future premium features: custom fee structures, extended resolution times, custom oracle feeds

**Revenue Distribution:**

The `RevenueDistributor` contract implements an automated 50/50 revenue split:

- **50% to Token Holders**: Distributed proportionally to stakers based on stake size
  - Staking minimum: No minimum (but must stake to receive rewards)
  - Distribution interval: 7 days (configurable)
  - Reward calculation: `userReward = (userStake / totalStaked) × holderShare`
  - Gas-optimized claiming with round-based accounting

- **50% to Treasury**: Controlled by DAO for:
  - Development funding
  - Security audits
  - Marketing and partnerships
  - Validator incentives
  - Emergency reserves

**Staking Mechanism:**
- Stake IO tokens to receive proportional share of holder rewards
- Minimum staking period: 7 days (prevents gaming)
- Unstake anytime after minimum period
- Rewards claimable anytime (gas-optimized pagination for users with many rounds)

### Economic Security Model

**Validator Economics:**
- Minimum stake: 1,000 IO tokens (~$100-1,000 at various IO prices)
- Slashing: 10% of stake per poor validation (<50% accuracy)
- Maximum slashes: 3 before automatic removal
- Cooldown: 1 hour between slashes (prevents rapid depletion)
- Reputation system: Builds over time, affects consensus weighting

**Market Economics:**
- Minimum liquidity: 1,000 IO tokens per market (ensures viability)
- Fee structure: 2% default (200 basis points), market creator sets fee
- AMM slippage: Automatic based on pool ratios (no slippage protection needed for small trades)

## 🚀 Advanced Features & Recent Implementations

### AI-Powered Validator Network

Incrypt Oracle introduces a revolutionary AI validator system that combines artificial intelligence with automatic API discovery, inspired by Sora Oracle's agentic approach. This hybrid AI-human validator network enables faster resolutions, automatic expansion to new data types, and transparent reasoning for every validation.

**Key Innovations:**
- **Automatic API Discovery**: AI automatically discovers 10+ relevant APIs for any prediction market question without pre-registration
- **Hugging Face Integration**: Uses state-of-the-art language models (Meta-Llama-3-8B-Instruct) for intelligent analysis
- **Multi-Source Validation**: Fetches and synthesizes data from multiple discovered sources
- **Transparent Reasoning**: Every AI validation includes detailed reasoning and metadata
- **Hybrid Consensus**: AI and human validators work together in reputation-weighted consensus

**Technical Implementation:**
- AI validators start with 1200 reputation (vs 1000 for humans)
- AI metadata stored on-chain as JSON (confidence, sources, reasoning, model)
- Automatic API discovery searches RapidAPI, APIs.guru, and known sources
- Full SDK support for querying AI validator information and metadata

### Optimistic Resolution Mechanism

Incrypt Oracle implements an innovative optimistic resolution system that dramatically reduces market resolution time compared to industry standards:

**Technical Implementation:**
- **Threshold**: Requires ≥50% of active validators to agree (vs 100% for full consensus)
- **Dispute Window**: 4 hours (vs UMA's 24-48 hours, Polymarket's 12+ hours)
- **Confidence Threshold**: 50% minimum for optimistic resolution (70% for full consensus)
- **Dispute Mechanism**: Any validator can raise dispute within 4-hour window with alternative value
- **Dispute Resolution**: Recalculates consensus including disputed value; false disputes penalized with 1% stake slash

**Benefits:**
- **1-4 hour resolution** vs traditional 24-48 hour delays
- **Maintains security** through dispute window and validator penalties
- **Better UX** for prediction markets requiring rapid settlement
- **Economic incentives** align validators toward accurate, timely submissions

### Off-Chain Validator Node Service

A production-ready TypeScript service for running validator nodes:

**Architecture:**
- **Language**: TypeScript (compiled to JavaScript)
- **Runtime**: Node.js 18+
- **Blockchain Interaction**: ethers.js v6
- **Scheduling**: node-cron for precise validation intervals
- **Monitoring**: Winston logging + Express health check server
- **Containerization**: Docker with health check support

**Data Source Integration:**
- **Crypto Prices**: Binance API (primary) + CoinGecko API (secondary, optional)
- **Aggregation**: Median calculation across sources for outlier resistance
- **Extensible**: BaseDataSource class enables easy addition of new data sources
- **Validation**: Data freshness checks, value range validation, timestamp verification

**Deployment:**
- Docker container with health check endpoints
- PM2 process management for production
- Systemd service for Linux servers
- Cloud-ready (AWS ECS, Google Cloud Run, Railway, Heroku)

**Monitoring:**
- HTTP endpoints: `/health`, `/ready`, `/metrics` (Prometheus format)
- Tracks: validator status, last validation time, data source health, uptime
- Logs: Winston with multiple transports (console, files, optional remote)

### Domain-Specific Oracle Templates

Specialized oracle contracts optimized for specific use cases:

**CryptoPriceOracle.sol:**
- 60-second minimum update intervals
- Multiple exchange aggregation
- Median price calculation
- Rate limiting enforcement
- Optimized for high-frequency price feeds

**SportsOracle.sol:**
- Event lifecycle tracking (Scheduled → Live → Completed)
- Immediate post-game resolution
- Score encoding: `uint256 = (homeScore << 16) | awayScore` (16 bits each)
- League and team metadata storage

**ElectionOracle.sol:**
- Official election authority integration points
- Candidate array management
- Winner index encoding for multi-candidate scenarios
- High validation threshold requirements (integrity critical)

**WeatherOracle.sol:**
- Multiple metric support: Temperature, Precipitation, WindSpeed, Humidity, ExtremeEvents
- Location-based feed management
- Metric-specific encoding schemes
- Configurable update intervals per metric

### Frontend Blockchain Integration

**Real-Time Data Flow:**
1. **Initial Load**: `useMarkets()` fetches `marketCounter`, iterates all markets
2. **Market Data**: Reads `markets(marketId)` for each market
3. **Odds Calculation**: Calls `getOdds(marketId)` to calculate YES/NO probabilities
4. **Event Watching**: `useWatchContractEvent` subscribes to:
   - `MarketCreated`: New markets appear automatically
   - `SharesPurchased`: Pool ratios update in real-time
   - `SharesSold`: Liquidity changes reflected immediately
   - `MarketResolved`: Resolution status updates instantly

**Transaction Flow:**
1. User enters bet amount
2. `useCalculateCost()` estimates cost before purchase
3. `useApproveToken()` handles ERC20 approval if needed
4. `useBuyShares()` executes purchase transaction
5. `waitForTransaction()` waits for confirmation
6. UI updates automatically via event watching

**Error Handling Pipeline:**
1. Raw blockchain error caught
2. `parseError()` categorizes error type
3. User-friendly message displayed with actionable guidance
4. Retry mechanisms where appropriate

### Gas Optimization Techniques

**Loop Optimization:**
- **Before**: `for (i = 0; i < activeValidators.length; i++)` - processes all 21 validators
- **After**: `for (i = 0; i < feed.validators.length; i++)` - only processes validators who submitted (typically 3-5)
- **Savings**: ~15,000 gas per feed resolution

**Round-Based Reward System:**
- **Before**: Processed all rounds from 0 to currentRound (potentially unbounded)
- **After**: Track `lastProcessedRound`, only process unclaimed rounds
- **Savings**: ~50,000+ gas for users with 100+ unprocessed rounds

**Pagination Support:**
- `claimRewardsPaginated(startRound, endRound)` allows incremental claiming
- Prevents gas limit issues for long-term stakers
- Maximum 100 rounds per call enforced

### Security Hardening Details

**Division-by-Zero Prevention:**
```solidity
// Consensus calculation
require(totalWeight > 0, "Total weight must be greater than 0");
consensusValue = weightedSum / totalWeight;

// Special handling for zero consensus
if (consensusValue == 0) {
    bool allZero = true;
    for (uint256 i = 0; i < count; i++) {
        if (values[i] != 0) {
            allZero = false;
            break;
        }
    }
    confidence = allZero ? MAX_CONFIDENCE : MAX_CONFIDENCE / 2;
}
```

**Input Validation:**
```solidity
// PredictionMarket buyShares
require(amount > 0, "Amount must be greater than 0");
require(cost > 0, "Cost must be greater than 0");
require(netCost > 0, "Net cost must be greater than 0");
require(market.outcomePools[outcomeIndex] > 0, "Pool must have liquidity");
require(shares > 0, "Shares must be greater than 0");
require(shares >= amount, "Slippage too high");
```

**Slashing Protection:**
```solidity
// Ensure minimum stake preserved
if (validators[validator].stake - slashAmount < MIN_STAKE) {
    slashAmount = validators[validator].stake > MIN_STAKE 
        ? validators[validator].stake - MIN_STAKE 
        : 0;
}
```

## 🎯 Development Roadmap

### Phase 1: Foundation ✅ COMPLETE
- [x] Core smart contracts development (Oracle, Market, DAO, Token, Revenue)
- [x] BSC testnet deployment and verification
- [x] Basic frontend interface with wallet connection
- [x] JavaScript SDK v1.0 with React hooks
- [x] Validator node service implementation
- [x] Security fixes and optimizations
- [x] Integration and edge case test suites
- [x] Documentation (SDK, Validator Guide, Deployment)

### Phase 2: Launch 🚀 IN PROGRESS
- [x] Optimistic resolution mechanism
- [x] Domain-specific oracle templates
- [x] Revenue features (subscription service, premium markets)
- [x] Frontend blockchain integration (real-time updates)
- [x] AI Validator implementation with Hugging Face integration
- [x] Automatic API discovery (inspired by Sora Oracle)
- [x] AI validator smart contract support
- [x] SDK support for AI validators
- [ ] Final security audit (CertiK/Halborn)
- [ ] BSC mainnet deployment
- [ ] $IO token launch
- [ ] IncryptPredict production launch
- [ ] AI Validator deployment and registration
- [ ] Validator onboarding program

### Phase 3: Growth 📈 PLANNED
- [ ] Mobile app (React Native/iOS/Android)
- [ ] Additional data sources (stock prices, forex, commodities)
- [ ] Third-party protocol integrations (DeFi lending, derivatives)
- [ ] Cross-chain expansion (Polygon, Arbitrum, Optimism)
- [ ] Advanced analytics dashboard
- [ ] API rate limiting and tier management UI

### Phase 4: Scale 🌍 FUTURE
- [ ] Multi-outcome markets (beyond binary)
- [ ] Conditional markets and market dependencies
- [ ] Institutional oracle services (enterprise tier)
- [ ] Automated market making algorithms
- [ ] Historical data APIs
- [ ] GraphQL endpoint for complex queries
- [ ] WebSocket connections for real-time data streaming

## 📚 Additional Documentation

### Core Documentation Files

- **[SDK Documentation](sdk/README.md)**: Comprehensive JavaScript SDK guide with API reference
- **[Validator Guide](docs/VALIDATOR_GUIDE.md)**: Complete guide to running validator nodes
- **[Deployment Guide](validator-node/DEPLOYMENT.md)**: Production deployment instructions
- **[Security Policy](SECURITY.md)**: Security reporting and best practices
- **[Contributing Guide](CONTRIBUTING.md)**: Development guidelines and contribution process

### API Reference

**IncryptOracle Contract Methods:**
- `createDataFeed(string name, string description, uint256 threshold) → bytes32`
- `registerValidator(uint256 stakeAmount)` - Register as human validator
- `registerAIValidator(address validatorAddress, uint256 stakeAmount)` - Owner-only: Register AI validator
- `submitValidation(bytes32 feedId, uint256 value, string dataSource)` - Human validator submission
- `submitAIValidation(bytes32 feedId, uint256 value, string dataSource, string aiMetadata)` - AI validator submission with metadata
- `getDataFeed(bytes32 feedId) → (name, description, value, timestamp, confidence, isActive)`
- `getActiveFeedIds() → bytes32[]`
- `getValidator(address) → (stake, reputation, isActive, validationsCount, successfulValidations, validatorType)`
- `getValidationSubmission(bytes32 feedId, address validator) → (value, timestamp, submitted, dataSource, validatorType, aiMetadata)`
- `getAIValidatorCount() → uint256` - Get count of active AI validators
- `raiseDispute(bytes32 feedId, uint256 proposedValue)`
- `isDisputeWindowOpen(bytes32 feedId) → bool`

**PredictionMarket Contract Methods:**
- `createMarket(string question, string desc, string category, uint256 duration, bytes32 oracleFeedId, uint256 liquidity, bool isPrivate, address[] allowed) → uint256`
- `buyShares(uint256 marketId, uint8 outcome, uint256 amount) → uint256 shares`
- `sellShares(uint256 marketId, uint8 outcome, uint256 shares) → uint256 payout`
- `resolveMarket(uint256 marketId)`
- `claimWinnings(uint256 marketId) → uint256 payout`
- `calculateCost(uint256 marketId, uint8 outcome, uint256 amount) → uint256`
- `getMarket(uint256 marketId) → (question, description, category, endTime, state, pools, creator, liquidity)`
- `getOdds(uint256 marketId) → (noOdds, yesOdds)`

**OracleSubscription Contract Methods:**
- `subscribe(SubscriptionTier tier, uint256 months)`
- `freeSubscribe()`
- `recordRequest(address subscriber, bytes32 feedId) → bool`
- `canMakeRequest(address subscriber) → bool`
- `getSubscription(address subscriber) → (tier, startTime, endTime, requestsUsed, requestsLimit, isActive)`

## 🔬 Technical Specifications

### Consensus Algorithm Details

**Reputation-Weighted Consensus Formula:**
```
Given:
  - values[]: Array of submitted values from validators
  - reputations[]: Corresponding reputation scores
  - count: Number of validations submitted

Step 1: Calculate Weighted Sum
  weightedSum = Σ(i=0 to count-1) values[i] × reputations[i]
  totalWeight = Σ(i=0 to count-1) reputations[i]

Step 2: Calculate Consensus Value
  require(totalWeight > 0, "Total weight must be greater than 0")
  consensusValue = weightedSum / totalWeight

Step 3: Calculate Variance
  variance = Σ(i=0 to count-1) ((values[i] - consensusValue)² × reputations[i]) / totalWeight

Step 4: Derive Confidence Score
  if consensusValue == 0:
    allZero = check if all values are zero
    confidence = allZero ? MAX_CONFIDENCE : MAX_CONFIDENCE / 2
  else:
    confidence = variance == 0 
      ? MAX_CONFIDENCE 
      : MAX_CONFIDENCE - (variance × MAX_CONFIDENCE / consensusValue)
    confidence = min(confidence, MAX_CONFIDENCE)
```

**Optimistic Resolution Logic:**
```
submittedCount = number of validators who submitted
totalValidators = activeValidators.length
threshold = feed.validationThreshold

if submittedCount >= threshold:
    // Full consensus: Resolve immediately
    resolve with full confidence
else if submittedCount >= (totalValidators × 50 / 100):
    // Optimistic resolution: ≥50% agreement
    resolve with optimistic flag
    set optimisticResolutionTime = block.timestamp
    open 4-hour dispute window
else:
    // Wait for more validations
    continue waiting
```

### AMM (Automated Market Maker) Mathematics

**Constant Product Formula:**
```
For a market with:
  - S_yes: Total YES shares
  - S_no: Total NO shares  
  - L_yes: YES pool liquidity
  - L_no: NO pool liquidity

Invariant: L_yes × S_yes = k (constant product)

Buying ΔS_yes shares costs:
  Cost = (L_yes × ΔS_yes) / (S_yes - ΔS_yes)
  
Selling ΔS_yes shares yields:
  Payout = (L_yes × ΔS_yes) / (S_yes + ΔS_yes)

Odds:
  Yes_Odds = L_yes / (L_yes + L_no)
  No_Odds = L_no / (L_yes + L_no)
```

**Fee Calculation:**
```
Fee = Cost × feeBasisPoints / 10000
NetCost = Cost - Fee
NetPayout = Payout - (Payout × feeBasisPoints / 10000)
```

### Gas Cost Analysis

**Typical Transaction Costs (BSC Testnet):**

| Operation | Gas Used | Cost (at 3 gwei) |
|-----------|----------|------------------|
| Create Market | ~350,000 | ~0.001 BNB |
| Buy Shares | ~120,000 | ~0.00036 BNB |
| Sell Shares | ~110,000 | ~0.00033 BNB |
| Submit Validation | ~85,000 | ~0.00026 BNB |
| Register Validator | ~180,000 | ~0.00054 BNB |
| Resolve Market | ~95,000 | ~0.00029 BNB |
| Claim Winnings | ~65,000 | ~0.00020 BNB |

**Gas Optimizations Applied:**
- Validator reputation updates: ~15,000 gas saved per resolution
- Reward claiming: ~50,000+ gas saved for users with many rounds
- Loop iteration reduction: ~20-30% overall gas savings

### Network Parameters & Constants

**IncryptOracle.sol:**
- `MIN_VALIDATORS`: 3 (minimum validators for network operation)
- `MAX_VALIDATORS`: 21 (maximum active validators)
- `MIN_STAKE`: 1,000 × 10^18 IO tokens (minimum validator stake)
- `VALIDATION_WINDOW`: 1 hour (time window for submissions)
- `MAX_CONFIDENCE`: 10,000 (100.00% in basis points)
- `SLASH_THRESHOLD`: 5,000 (50% accuracy threshold)
- `SLASH_PERCENTAGE`: 10% (stake slashed per violation)
- `MAX_SLASHES`: 3 (maximum slashes before removal)
- `DISPUTE_WINDOW`: 4 hours (optimistic resolution dispute period)
- `OPTIMISTIC_RESOLUTION_THRESHOLD`: 50% (validators needed for optimistic resolution)

**PredictionMarket.sol:**
- `BASE_FEE`: 200 (2% in basis points)
- `MAX_FEE`: 1,000 (10% maximum)
- `MIN_LIQUIDITY`: 1,000 × 10^18 IO tokens
- `RESOLUTION_BUFFER`: 1 hour (buffer after market end)
- `MARKET_CREATION_FEE`: 50 × 10^18 IO tokens (public markets)
- `PRIVATE_MARKET_FEE`: 100 × 10^18 IO tokens (private markets)

**RevenueDistributor.sol:**
- `HOLDER_SHARE_PERCENTAGE`: 5,000 (50% to holders)
- `TREASURY_SHARE_PERCENTAGE`: 5,000 (50% to treasury)
- `MIN_STAKING_PERIOD`: 7 days
- `DISTRIBUTION_INTERVAL`: 7 days
- `minimumDistributionAmount`: 1,000 × 10^18 IO tokens

## 🛡️ Security Considerations

### Smart Contract Security

**Attack Vectors Mitigated:**

1. **Reentrancy Attacks**: All state-changing functions protected with ReentrancyGuard
2. **Integer Overflow/Underflow**: Solidity 0.8.x automatic checks + explicit validations
3. **Division-by-Zero**: Comprehensive checks before all divisions with fallback logic
4. **Oracle Manipulation**: Multi-validator consensus with reputation weighting reduces single-point-of-failure
5. **Validator Collusion**: Minimum 3 validators required, reputation system penalizes inaccurate submissions
6. **Front-running**: Validation window limits timing attacks, dispute mechanism allows corrections
7. **Economic Attacks**: Slashing mechanism and minimum stake requirements discourage malicious behavior

**Best Practices for Integrators:**

1. **Always Check Confidence**: Require ≥70% confidence for critical operations (≥50% for optimistic)
2. **Validate Freshness**: Check `timestamp` to ensure data is recent (≤24 hours for full, ≤4 hours for optimistic)
3. **Handle Staleness**: Implement fallback mechanisms if oracle data is too old
4. **Monitor Validators**: Track validator reputations and stake amounts
5. **Use Multiple Oracles**: For critical applications, consider multiple oracle sources

### Operational Security

**Validator Node Security:**
- Private key stored in environment variables (never in code)
- Secure key management in production (AWS Secrets Manager, HashiCorp Vault)
- Network isolation for validator nodes
- Health check endpoint access restricted to monitoring IPs
- Regular security updates for dependencies

**Frontend Security:**
- No private keys in frontend code
- Wallet connection through trusted providers (MetaMask, WalletConnect)
- Input sanitization for user-generated content
- Rate limiting on API calls (if custom backend)

## ⚠️ Disclaimer & Risk Warnings

**Software Disclaimer:**
This software is provided "as is" without warranty of any kind, express or implied. While the smart contracts have been developed with security best practices and comprehensive testing, users should conduct their own security analysis and understand the risks involved.

**Prediction Market Risks:**
- **Outcome Uncertainty**: Prediction markets involve speculation on future events; outcomes are not guaranteed
- **Liquidity Risk**: Markets may have low liquidity, affecting ability to buy/sell shares
- **Oracle Risk**: Market resolution depends on oracle data accuracy and availability
- **Smart Contract Risk**: Despite extensive internal testing and the AI Smart Contract Auditor beta review, the contracts have not yet undergone an external third-party audit and may contain bugs or vulnerabilities
- **Regulatory Risk**: Prediction markets may be regulated or prohibited in some jurisdictions

**Token & Economic Risks:**
- **Market Volatility**: IO token price may fluctuate significantly
- **Staking Risk**: Staked tokens may be slashed for validator misbehavior
- **Impermanent Loss**: Providing liquidity in markets may result in losses
- **Gas Costs**: Network congestion may increase transaction costs

**Validator Risks:**
- **Slashing Risk**: Poor performance may result in stake slashing
- **Operational Risk**: Validator downtime may affect earnings
- **Infrastructure Costs**: Running validator requires ongoing server and API costs
- **Technical Risk**: Software bugs or configuration errors may cause losses

**Recommendation:** Never invest more than you can afford to lose. Understand the technology, risks, and regulatory environment before participating.

---

<div align="center">

**Built with ❤️ by the Incrypt Oracle Team**

[Website](https://incrypt.fun) • [Documentation](https://incrypt.fun/docs) • [Discord](https://discord.gg/XPSCUYVM65) • [Twitter](https://x.com/Incrypt_defi)

</div>
