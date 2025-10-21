# 🚀 Deployment Guide

This guide covers the complete deployment process for the Incrypt Oracle platform on Binance Smart Chain.

## 📋 Prerequisites

### Development Environment

- **Node.js**: 16.0.0 or higher
- **Git**: Latest version
- **Hardhat**: Installed globally (`npm install -g hardhat`)

### Accounts & Keys

- **Deployer Wallet**: With sufficient BNB for gas fees
  - Testnet: ~0.1 BNB (free from faucet)
  - Mainnet: ~0.5 BNB for full deployment
- **BSCScan API Key**: For contract verification
- **WalletConnect Project ID**: For frontend wallet integration

### External Services

- **Vercel Account**: For frontend hosting
- **GitHub Repository**: For version control

## 🔧 Environment Setup

### 1. Clone and Install

```bash
git clone https://github.com/IncryptOracle/IncryptOracle.git
cd IncryptOracle
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Update `.env` with your values:

```bash
# Wallet Configuration
PRIVATE_KEY=your_deployer_private_key
MNEMONIC=your_deployer_mnemonic

# API Keys  
BSCSCAN_API_KEY=your_bscscan_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=97  # 97 for testnet, 56 for mainnet
NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/

# Development
REPORT_GAS=true
```

## 🧪 Testnet Deployment

### 1. Get Testnet BNB

Visit the [BSC Testnet Faucet](https://testnet.binance.org/faucet-smart) to get test BNB.

### 2. Compile Contracts

```bash
npm run compile
```

### 3. Run Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Gas usage report
REPORT_GAS=true npm run test
```

### 4. Deploy to Testnet

```bash
npm run deploy:testnet
```

This will:
- Deploy all smart contracts
- Configure contract relationships
- Create sample oracle data feeds
- Save deployment addresses to `deployments/`
- Generate verification commands

### 5. Verify Contracts

After deployment, verify contracts on BSCScan:

```bash
# The deployment script will output verification commands
npx hardhat verify --network bscTestnet 0xYourContractAddress

# Or use the generated script
./scripts/verify-testnet.sh
```

### 6. Test Frontend

```bash
# Update .env with deployed addresses
NEXT_PUBLIC_ORACLE_ADDRESS=0xYourOracleAddress
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0xYourPredictionMarketAddress
# ... etc

# Start frontend
npm run dev
```

Visit `http://localhost:3000` and test:
- Wallet connection
- Oracle data feeds
- Market creation/trading
- DAO proposals/voting

## 🌐 Mainnet Deployment

### ⚠️ Pre-deployment Checklist

- [ ] All tests passing
- [ ] Security audit completed  
- [ ] Frontend thoroughly tested
- [ ] Deployment wallet funded
- [ ] Backup deployment plan ready
- [ ] Team coordination scheduled

### 1. Final Security Check

```bash
# Run comprehensive tests
npm run test
npm run test:coverage

# Static analysis
npm install -g @crytic/slither
slither contracts/

# Gas optimization check
npm run compile
```

### 2. Update Configuration

Update `.env` for mainnet:

```bash
NEXT_PUBLIC_CHAIN_ID=56
NEXT_PUBLIC_RPC_URL=https://bsc-dataseed1.binance.org/
```

### 3. Deploy to Mainnet

```bash
# ⚠️ Double-check everything before running
npm run deploy:mainnet
```

### 4. Post-deployment Steps

```bash
# 1. Verify all contracts immediately
npm run verify

# 2. Transfer contract ownerships to timelock
# (Done automatically by deployment script)

# 3. Register initial validators
# (Manual process - coordinate with validator operators)

# 4. Create initial data feeds
# (Done by deployment script)

# 5. Test oracle functionality
npm run test:oracle-integration
```

### 5. Update Frontend

```bash
# Update production environment variables
NEXT_PUBLIC_ORACLE_ADDRESS=0xMainnetOracleAddress
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0xMainnetPredictionMarketAddress
# ... etc

# Deploy to Vercel
vercel --prod
```

## 🌍 Frontend Deployment

### Vercel Deployment

1. **Connect Repository**
   - Import project from GitHub
   - Select the IncryptOracle repository

2. **Configure Build Settings**
   ```json
   {
     "framework": "nextjs",
     "buildCommand": "npm run build",
     "installCommand": "npm install",
     "outputDirectory": ".next"
   }
   ```

3. **Environment Variables**
   Add all `NEXT_PUBLIC_*` variables from your `.env` file

4. **Deploy**
   ```bash
   # Using Vercel CLI
   npm install -g vercel
   vercel --prod
   ```

### Custom Domain Setup

```bash
# Add custom domain in Vercel dashboard
# Configure DNS records:
# A record: @ -> 76.76.19.61
# CNAME: www -> cname.vercel-dns.com
```

## 📊 Monitoring & Maintenance

### Oracle Monitoring

Set up monitoring for:

- **Oracle uptime**: Check data feed freshness
- **Validator performance**: Monitor validation accuracy
- **Gas prices**: Optimize transaction costs
- **Contract balances**: Ensure adequate funding

### Frontend Monitoring

Monitor:

- **Page performance**: Core Web Vitals
- **Error rates**: JavaScript errors and crashes  
- **User analytics**: Usage patterns and engagement
- **Wallet connections**: Success rates

### Database Backups

```bash
# Backup deployment configurations
cp -r deployments/ backups/deployments-$(date +%Y%m%d)/

# Backup environment files (excluding secrets)
cp .env.example backups/config-backup-$(date +%Y%m%d).env
```

## 🚨 Emergency Procedures

### Oracle Issues

1. **Data Feed Problems**
   - Check validator node status
   - Review recent validations
   - Emergency pause if needed: `oracle.pause()`

2. **Consensus Issues**
   - Investigate validator behavior
   - Temporary manual resolution if needed
   - Review and update consensus algorithms

### Smart Contract Emergencies

1. **Immediate Response**
   ```solidity
   // Emergency pause (if enabled)
   oracle.pause();
   predictionMarket.pause();
   
   // DAO emergency proposal
   dao.proposeEmergencyAction(targets, values, calldatas, description);
   ```

2. **Investigation & Resolution**
   - Analyze transaction logs
   - Coordinate with security audit firm
   - Prepare fix and migration plan

### Frontend Issues

1. **Site Down**
   - Check Vercel status
   - Verify DNS configuration
   - Switch to backup hosting if needed

2. **Wallet Issues**
   - Check WalletConnect status
   - Verify RPC endpoints
   - Test with multiple wallet providers

## 🔄 Release Process

### Version Management

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Release Workflow

1. **Pre-release**
   ```bash
   # Update version numbers
   npm version patch  # or minor/major
   
   # Update CHANGELOG.md
   # Test on testnet
   npm run deploy:testnet
   npm run test:integration
   ```

2. **Release**
   ```bash
   # Create release branch
   git checkout -b release/v1.1.0
   
   # Final testing
   npm run test
   npm run build
   
   # Merge to main
   git checkout main
   git merge release/v1.1.0
   git tag v1.1.0
   git push origin main --tags
   ```

3. **Post-release**
   - Deploy to production
   - Update documentation
   - Announce to community

## 🤝 Community Guidelines

### Communication

- **Be respectful**: Treat all community members with respect
- **Be constructive**: Focus on improving the project
- **Be patient**: Maintainers are volunteers with limited time
- **Be helpful**: Help other community members when possible

### Code Review Process

1. **Automated Checks**
   - Tests must pass
   - Code must lint
   - Coverage requirements met

2. **Manual Review**
   - Code quality and style
   - Security considerations
   - Documentation updates
   - Breaking change assessment

## 📈 Performance Guidelines

### Smart Contract Optimization

- **Gas Efficiency**: Optimize for common operations
- **Storage Layout**: Pack structs efficiently  
- **External Calls**: Minimize cross-contract calls
- **Loop Optimization**: Avoid unbounded loops

### Frontend Performance

- **Bundle Size**: Keep JavaScript bundles minimal
- **Image Optimization**: Use Next.js image optimization
- **Caching**: Implement appropriate caching strategies
- **Core Web Vitals**: Maintain good performance scores

## 🎯 Current Priorities

### High Priority

- 🔒 **Security improvements** based on audit findings
- 🐛 **Critical bug fixes** affecting user funds
- 📖 **Documentation** gaps and unclear sections
- ⚡ **Gas optimizations** for frequently used functions

### Medium Priority

- ✨ **New oracle data sources** (sports, weather, etc.)
- 🎨 **UI/UX improvements** and accessibility
- 📱 **Mobile optimization** and responsive design
- 🧪 **Test coverage** improvements

### Future

- 🌐 **Multi-chain expansion** (Polygon, Arbitrum)
- 🤖 **AI-powered features** for market creation
- 📊 **Advanced analytics** and reporting
- 🏆 **Gamification** and user engagement

## 📞 Contact

- **Discord**: [discord.gg/incrypt](https://discord.gg/incrypt)
- **Email**: [dev@incryptoracle.com](mailto:dev@incryptoracle.com)
- **Twitter**: [@incryptoracle](https://twitter.com/incryptoracle)

---

Thank you for contributing to Incrypt Oracle! 🚀
