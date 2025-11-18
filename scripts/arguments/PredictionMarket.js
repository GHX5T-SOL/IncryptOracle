const deployment = require('../../deployments/bscTestnet-deployment.json');

module.exports = [
  deployment.contracts.IOToken,
  deployment.contracts.IncryptOracle,
  deployment.contracts.RevenueDistributor,
  deployment.deployer
];

