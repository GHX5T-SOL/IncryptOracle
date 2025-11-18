const deployment = require('../../deployments/bscTestnet-deployment.json');

module.exports = [
  24 * 60 * 60, // 86400 seconds
  [], // proposers (assigned after deployment)
  [], // executors (assigned after deployment)
  deployment.deployer
];

