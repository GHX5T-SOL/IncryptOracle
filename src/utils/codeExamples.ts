export const codeExamples: Record<string, string> = {
  javascript: `import { IncryptOracle } from 'incrypt-oracle-sdk';

// Initialize the oracle
const oracle = new IncryptOracle({
  network: 'bsc-mainnet', // or 'bsc-testnet'
  rpcUrl: 'https://bsc-dataseed1.binance.org/',
});

// Get latest price data
const btcPrice = await oracle.getPrice('BTC/USD');
console.log('BTC Price:', btcPrice.value, 'USD');

// Subscribe to price updates
oracle.subscribe('BTC/USD', (data) => {
  console.log('New BTC price:', data.value);
  console.log('Confidence:', data.confidence);
  console.log('Timestamp:', data.timestamp);
});`,

  solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IIncryptOracle.sol";

contract PriceConsumer {
    IIncryptOracle public oracle;
    
    constructor(address _oracle) {
        oracle = IIncryptOracle(_oracle);
    }
    
    function getLatestPrice(bytes32 feedId) 
        external 
        view 
        returns (uint256 price, uint256 confidence) 
    {
        (,, uint256 value, uint256 timestamp, uint256 conf, bool isActive) = 
            oracle.getDataFeed(feedId);
            
        require(isActive, "Data feed not active");
        require(block.timestamp - timestamp < 3600, "Data too old");
        require(conf >= 7000, "Confidence too low");
        
        return (value, conf);
    }
}`,

  python: `from incrypt_oracle import IncryptOracle
import asyncio

async def main():
    # Initialize oracle client
    oracle = IncryptOracle(
        network='bsc-mainnet',
        rpc_url='https://bsc-dataseed1.binance.org/'
    )
    
    # Get multiple price feeds
    feeds = ['BTC/USD', 'ETH/USD', 'BNB/USD']
    
    for feed in feeds:
        price_data = await oracle.get_price(feed)
        print(f"Feed: $" + str(price_data['value']))
        print(f"Confidence: " + str(price_data['confidence']) + "%")
        print(f"Last updated: " + str(price_data['timestamp']))

if __name__ == "__main__":
    asyncio.run(main())`
};

