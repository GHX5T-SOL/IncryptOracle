const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting Incrypt Oracle Testnet Deployment...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  
  console.log(`Deploying contracts with account: ${deployer.address}`);
  console.log(`Account balance: ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} BNB`);
  console.log(`Network: ${network}\n`);

  const deploymentLog = [];
  
  // Deploy IO Token
  console.log("📝 Deploying IO Token...");
  const IOToken = await hre.ethers.getContractFactory("IOToken");
  const ioToken = await IOToken.deploy(deployer.address);
  await ioToken.waitForDeployment();
  const ioTokenAddress = await ioToken.getAddress();
  
  console.log(`✅ IO Token deployed to: ${ioTokenAddress}`);
  deploymentLog.push(`IO_TOKEN_ADDRESS=${ioTokenAddress}`);
  
  // Deploy Timelock Controller for DAO
  console.log("\n🔒 Deploying Timelock Controller...");
  const TimelockController = await hre.ethers.getContractFactory("TimelockController");
  const minDelay = 24 * 60 * 60; // 24 hours
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
  
  // Transfer token ownership to timelock (treasury)
  await ioToken.transferOwnership(timelockAddress);
  console.log("✅ IO Token ownership transferred to timelock");
  
  // Create sample oracle data feeds for testing
  console.log("\n📊 Creating sample oracle data feeds...");
  
  const sampleFeeds = [
    {
      name: "BTC/USD",
      description: "Bitcoin price in USD",
      threshold: 3
    },
    {
      name: "ETH/USD", 
      description: "Ethereum price in USD",
      threshold: 3
    },
    {
      name: "Election2024",
      description: "2024 US Presidential Election Winner",
      threshold: 5
    }
  ];
  
  for (const feed of sampleFeeds) {
    const tx = await oracle.createDataFeed(feed.name, feed.description, feed.threshold);
    const receipt = await tx.wait();
    console.log(`✅ Created data feed: ${feed.name}`);
  }
  
  // Save deployment addresses
  const deploymentInfo = {
    network: network,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
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
    gasUsed: {
      // Will be filled by actual deployment
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
  
  console.log("\n🎉 Deployment Summary:");
  console.log("========================");
  console.log(`Network: ${network}`);
  console.log(`IO Token: ${ioTokenAddress}`);
  console.log(`Timelock: ${timelockAddress}`);
  console.log(`DAO: ${daoAddress}`);
  console.log(`Revenue Distributor: ${revenueDistributorAddress}`);
  console.log(`Oracle: ${oracleAddress}`);
  console.log(`Prediction Market: ${predictionMarketAddress}`);
  
  console.log("\n📋 Next Steps:");
  console.log("1. Update .env file with deployed addresses");
  console.log("2. Verify contracts on BSCScan");
  console.log("3. Register as oracle validator");
  console.log("4. Create test prediction markets");
  console.log("5. Test DAO governance proposals");
  
  // Generate verification commands
  console.log("\n🔍 Verification Commands:");
  console.log(`npx hardhat verify --network ${network} ${ioTokenAddress} "${deployer.address}"`);
  console.log(`npx hardhat verify --network ${network} ${timelockAddress} "${minDelay}" "[]" "[]" "${admin}"`);
  console.log(`npx hardhat verify --network ${network} ${daoAddress} "${ioTokenAddress}" "${timelockAddress}"`);
  console.log(`npx hardhat verify --network ${network} ${revenueDistributorAddress} "${ioTokenAddress}" "${timelockAddress}" "${deployer.address}"`);
  console.log(`npx hardhat verify --network ${network} ${oracleAddress} "${deployer.address}"`);
  console.log(`npx hardhat verify --network ${network} ${predictionMarketAddress} "${ioTokenAddress}" "${oracleAddress}" "${revenueDistributorAddress}" "${deployer.address}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
