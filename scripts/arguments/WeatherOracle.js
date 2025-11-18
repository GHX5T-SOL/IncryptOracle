const deployment = require('../../deployments/bscTestnet-deployment.json');

module.exports = [
  deployment.contracts.IncryptOracle,
  deployment.deployer
];

