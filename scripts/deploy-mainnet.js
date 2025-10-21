const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting Incrypt Oracle Mainnet Deployment...\n");
  console.log("⚠️  WARNING: This is a MAINNET deployment!");
  console.log("⚠️  Please ensure all parameters are correct before proceeding.\n");
  
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  
  console.log(`Deploying contracts with account: ${deployer.address}`);
  console.log(`Account balance: ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} BNB`);
  console.log(`Network: ${network}\n`);

  // Check if we're actually on mainnet
  const chainId = (await hre.ethers.provider.getNetwork()).chainId;
  if (chainId !== 56n) {
    throw new Error(`Expected BSC Mainnet (chainId: 56), got chainId: ${chainId}`);
  }

  // Confirm deployment with user (in production, you might want to add an interactive prompt)
  console.log("Proceeding with mainnet deployment in 5 seconds...");
  await new Promise(resolve => setTimeout(resolve, 5000));

  const deploymentLog = [];
  const gasUsed = {};
  
  // Deploy IO Token (Note: In real scenario, this might already be deployed via Four Meme)
  console.log("📝 Deploying IO Token...");
  const IOToken = await hre.ethers.getContractFactory("IOToken");
  const ioToken = await IOToken.deploy(deployer.address);
  const ioTokenTx = await ioToken.waitForDeployment();
  const ioTokenAddress = await ioToken.getAddress();
  
  console.log(`✅ IO Token deployed to: ${ioTokenAddress}`);
  deploymentLog.push(`IO_TOKEN_ADDRESS=${ioTokenAddress}`);
  
  // Deploy Timelock Controller for DAO
  console.log("\n🔒 Deploying Timelock Controller...");
  const TimelockController = await hre.ethers.getContractFactory("TimelockController");
  const minDelay = 48 * 60 * 60; // 48 hours for mainnet (more secure)
  const proposers = []; // Will be set to DAO address later
  const executors = []; // Will be set to DAO address later
  const admin = deployer.address; // Temporarily set deployer as admin
  
  const timelock = await TimelockController.deploy(minDelay, proposers, executors, admin);
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  
  console.log(`✅ Timelock Controller deployed to: ${timelockAddress}`);
  deploymentLog.push(`TIMELOCK_ADDRESS=${timelockAddress}`);
  
  // Deploy IncryptDAO
  console.log("\n🏛️ Deploying Incrypt DAO...");
  const IncryptDAO = await hre.ethers.getContractFactory("IncryptDAO");
  const dao = await IncryptDAO.deploy(ioTokenAddress, timelockAddress);
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  
  console.log(`✅ Incrypt DAO deployed to: ${daoAddress}`);
  deploymentLog.push(`DAO_ADDRESS=${daoAddress}`);
  
  // Deploy Revenue Distributor
  console.log("\n💰 Deploying Revenue Distributor...");
  const RevenueDistributor = await hre.ethers.getContractFactory("RevenueDistributor");
  const revenueDistributor = await RevenueDistributor.deploy(
    ioTokenAddress,
    timelockAddress, // Treasury will be the timelock
    deployer.address
  );
  await revenueDistributor.waitForDeployment();
  const revenueDistributorAddress = await revenueDistributor.getAddress();
  
  console.log(`✅ Revenue Distributor deployed to: ${revenueDistributorAddress}`);
  deploymentLog.push(`REVENUE_DISTRIBUTOR_ADDRESS=${revenueDistributorAddress}`);
  
  // Deploy Incrypt Oracle
  console.log("\n🔮 Deploying Incrypt Oracle...");
  const IncryptOracle = await hre.ethers.getContractFactory("IncryptOracle");
  const oracle = await IncryptOracle.deploy(deployer.address);
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  
  console.log(`✅ Incrypt Oracle deployed to: ${oracleAddress}`);
  deploymentLog.push(`ORACLE_ADDRESS=${oracleAddress}`);
  
  // Deploy Prediction Market
  console.log("\n🎯 Deploying Prediction Market...");
  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(
    ioTokenAddress,
    oracleAddress,
    revenueDistributorAddress, // Fee collector
    deployer.address
  );
  await predictionMarket.waitForDeployment();
  const predictionMarketAddress = await predictionMarket.getAddress();
  
  console.log(`✅ Prediction Market deployed to: ${predictionMarketAddress}`);
  deploymentLog.push(`PREDICTION_MARKET_ADDRESS=${predictionMarketAddress}`);
  
  // Post-deployment configuration
  console.log("\n⚙️ Configuring contracts...");
  
  // Grant roles to DAO in timelock
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  const ADMIN_ROLE = await timelock.DEFAULT_ADMIN_ROLE();
  
  await timelock.grantRole(PROPOSER_ROLE, daoAddress);
  await timelock.grantRole(EXECUTOR_ROLE, daoAddress);
  console.log("✅ DAO granted proposer and executor roles in timelock");
  
  // Authorize prediction market as fee collector
  await revenueDistributor.authorizeCollector(predictionMarketAddress, true);
  console.log("✅ Prediction market authorized as fee collector");
  
  // Create initial oracle data feeds for mainnet
  console.log("\n📊 Creating initial oracle data feeds...");
  
  const mainnetFeeds = [
    {
      name: "BTC/USD",
      description: "Bitcoin price in USD from multiple exchanges",
      threshold: 5
    },
    {
      name: "ETH/USD", 
      description: "Ethereum price in USD from multiple exchanges",
      threshold: 5
    },
    {
      name: "BNB/USD",
      description: "BNB price in USD from multiple exchanges", 
      threshold: 5
    },
    {
      name: "SPX",
      description: "S&P 500 Index closing price",
      threshold: 7
    },
    {
      name: "US_ELECTION_2024",
      description: "2024 US Presidential Election Winner (1=Dem, 0=Rep)",
      threshold: 9
    }
  ];
  
  for (const feed of mainnetFeeds) {
    const tx = await oracle.createDataFeed(feed.name, feed.description, feed.threshold);
    await tx.wait();
    console.log(`✅ Created data feed: ${feed.name}`);
  }
  
  // Important: Keep ownership with deployer initially for setup, will transfer later via governance
  console.log("\n⚠️ Keeping initial ownership with deployer for setup phase");
  console.log("   Transfer ownership to DAO via governance proposal after testing");
  
  // Save deployment addresses
  const deploymentInfo = {
    network: network,
    chainId: chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      IOToken: ioTokenAddress,
      TimelockController: timelockAddress,
      IncryptDAO: daoAddress,
      RevenueDistributor: revenueDistributorAddress,
      IncryptOracle: oracleAddress,
      PredictionMarket: predictionMarketAddress
    },
    configuration: {
      timelockDelay: minDelay,
      minValidators: await oracle.MIN_VALIDATORS(),
      baseFee: await predictionMarket.BASE_FEE()
    }
  };
  
  // Save to multiple formats
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save JSON
  fs.writeFileSync(
    path.join(deploymentsDir, `${network}-deployment.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  // Save .env format
  fs.writeFileSync(
    path.join(deploymentsDir, `${network}-addresses.env`),
    deploymentLog.join('\n') + '\n'
  );
  
  console.log("\n🎉 MAINNET Deployment Summary:");
  console.log("===============================");
  console.log(`Network: BSC Mainnet (${network})`);
  console.log(`Chain ID: ${chainId}`);
  console.log(`IO Token: ${ioTokenAddress}`);
  console.log(`Timelock: ${timelockAddress}`);
  console.log(`DAO: ${daoAddress}`);
  console.log(`Revenue Distributor: ${revenueDistributorAddress}`);
  console.log(`Oracle: ${oracleAddress}`);
  console.log(`Prediction Market: ${predictionMarketAddress}`);
  
  console.log("\n🔒 Security Checklist:");
  console.log("1. ✅ Timelock delay set to 48 hours");
  console.log("2. ✅ DAO has proposer/executor roles");
  console.log("3. ✅ Revenue distribution configured");
  console.log("4. ⚠️  Oracle validators need to be registered");
  console.log("5. ⚠️  Initial token distribution needs to be completed");
  console.log("6. ⚠️  Ownership transfer to DAO pending governance proposal");
  
  console.log("\n📋 Critical Next Steps:");
  console.log("1. Verify all contracts on BSCScan immediately");
  console.log("2. Register trusted oracle validators");
  console.log("3. Complete token distribution via Four Meme");
  console.log("4. Test oracle data feeds with validators");
  console.log("5. Create initial governance proposal for ownership transfer");
  console.log("6. Set up monitoring and alerting systems");
  console.log("7. Prepare emergency response procedures");
  
  console.log("\n🔍 Contract Verification Commands:");
  console.log(`npx hardhat verify --network ${network} ${ioTokenAddress} "${deployer.address}"`);
  console.log(`npx hardhat verify --network ${network} ${timelockAddress} "${minDelay}" "[]" "[]" "${admin}"`);
  console.log(`npx hardhat verify --network ${network} ${daoAddress} "${ioTokenAddress}" "${timelockAddress}"`);
  console.log(`npx hardhat verify --network ${network} ${revenueDistributorAddress} "${ioTokenAddress}" "${timelockAddress}" "${deployer.address}"`);
  console.log(`npx hardhat verify --network ${network} ${oracleAddress} "${deployer.address}"`);
  console.log(`npx hardhat verify --network ${network} ${predictionMarketAddress} "${ioTokenAddress}" "${oracleAddress}" "${revenueDistributorAddress}" "${deployer.address}"`);
  
  console.log("\n💡 Frontend Environment Variables:");
  console.log("Update your production .env with these addresses:");
  deploymentLog.forEach(line => console.log(`NEXT_PUBLIC_${line}`));
  
  console.log("\n🚨 IMPORTANT REMINDERS:");
  console.log("- Keep deployment keys secure and transfer to hardware wallet");
  console.log("- Set up multi-sig for critical operations");
  console.log("- Monitor contract interactions and balances");
  console.log("- Have incident response plan ready");
  console.log("- Regular security audits and updates");
}

main()
  .then(() => {
    console.log("\n✅ Mainnet deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ MAINNET Deployment failed:", error);
    console.log("\n🛠️ Troubleshooting:");
    console.log("1. Check account balance and gas fees");
    console.log("2. Verify network configuration");
    console.log("3. Check for contract size limits");
    console.log("4. Retry with higher gas price if needed");
    process.exit(1);
  });
