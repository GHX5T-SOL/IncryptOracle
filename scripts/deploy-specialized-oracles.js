const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const deploymentPath = path.join(__dirname, "..", "deployments", "bscTestnet-deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    throw new Error("Missing deployments/bscTestnet-deployment.json. Run the core deployment first.");
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const oracleAddress = deployment.contracts.IncryptOracle;
  if (!oracleAddress) {
    throw new Error("Core oracle address not found in deployment file.");
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying specialized oracle templates...\n");
  console.log(`Using core oracle: ${oracleAddress}`);
  console.log(`Deployer: ${deployer.address}\n`);

  const templates = [
    { key: "CryptoPriceOracle", contract: "CryptoPriceOracle" },
    { key: "SportsOracle", contract: "SportsOracle" },
    { key: "WeatherOracle", contract: "WeatherOracle" },
    { key: "ElectionOracle", contract: "ElectionOracle" }
  ];

  const results = {};

  for (const template of templates) {
    console.log(`Deploying ${template.key}...`);
    const Factory = await hre.ethers.getContractFactory(template.contract);
    const instance = await Factory.deploy(oracleAddress, deployer.address);
    await instance.waitForDeployment();
    const address = await instance.getAddress();
    results[template.key] = address;
    deployment.contracts[template.key] = address;
    console.log(`✅ ${template.key} deployed at: ${address}\n`);
  }

  deployment.templatesDeployedAt = new Date().toISOString();
  fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));

  const summaryLines = Object.entries(results).map(
    ([name, address]) => `${name}=${address}`
  );
  const addressesEnvPath = path.join(__dirname, "..", "deployments", "bscTestnet-addresses.env");
  const baseLines = [
    `IO_TOKEN_ADDRESS=${deployment.contracts.IOToken}`,
    `TIMELOCK_ADDRESS=${deployment.contracts.TimelockController}`,
    `DAO_ADDRESS=${deployment.contracts.IncryptDAO}`,
    `REVENUE_DISTRIBUTOR_ADDRESS=${deployment.contracts.RevenueDistributor}`,
    `ORACLE_ADDRESS=${deployment.contracts.IncryptOracle}`,
    `PREDICTION_MARKET_ADDRESS=${deployment.contracts.PredictionMarket}`,
    `ORACLE_SUBSCRIPTION_ADDRESS=${deployment.contracts.OracleSubscription}`,
    `CRYPTO_PRICE_ORACLE_ADDRESS=${results.CryptoPriceOracle}`,
    `SPORTS_ORACLE_ADDRESS=${results.SportsOracle}`,
    `WEATHER_ORACLE_ADDRESS=${results.WeatherOracle}`,
    `ELECTION_ORACLE_ADDRESS=${results.ElectionOracle}`
  ];

  fs.writeFileSync(addressesEnvPath, baseLines.join("\n") + "\n");

  console.log("🎉 Specialized oracle deployment complete!");
  console.log("========================");
  for (const line of baseLines) {
    console.log(line);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Specialized oracle deployment failed:", error);
    process.exit(1);
  });

