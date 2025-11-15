import axios, { AxiosInstance } from 'axios';
import { Logger } from '../monitoring/logger';

export interface PriceData {
  symbol: string;
  price: number;
  timestamp: number;
  source: string;
}

export class CryptoPriceSource {
  private binanceClient: AxiosInstance;
  private coinGeckoClient?: AxiosInstance;
  private logger: Logger;
  private coinGeckoApiKey?: string;

  constructor(
    binanceApiUrl: string,
    coinGeckoApiKey?: string,
    logger?: Logger
  ) {
    this.logger = logger || new Logger();
    this.coinGeckoApiKey = coinGeckoApiKey;
    
    this.binanceClient = axios.create({
      baseURL: binanceApiUrl,
      timeout: 10000,
    });

    if (coinGeckoApiKey) {
      this.coinGeckoClient = axios.create({
        baseURL: 'https://api.coingecko.com/api/v3',
        timeout: 10000,
        headers: {
          'X-CG-Pro-API-Key': coinGeckoApiKey,
        },
      });
    }
  }

  /**
   * Fetch price from Binance
   */
  async fetchFromBinance(symbol: string): Promise<PriceData | null> {
    try {
      // Convert BTC/USD to BTCUSDT for Binance
      const binanceSymbol = symbol.replace('/', '');
      const tickerSymbol = binanceSymbol.endsWith('USD') 
        ? binanceSymbol.replace('USD', 'USDT')
        : binanceSymbol;
      
      const response = await this.binanceClient.get('/ticker/price', {
        params: { symbol: tickerSymbol },
      });

      if (response.data && response.data.price) {
        return {
          symbol,
          price: parseFloat(response.data.price),
          timestamp: Date.now(),
          source: 'binance',
        };
      }
      
      return null;
    } catch (error: any) {
      this.logger.error(`Binance fetch error for ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Fetch price from CoinGecko
   */
  async fetchFromCoinGecko(symbol: string): Promise<PriceData | null> {
    if (!this.coinGeckoClient) {
      return null;
    }

    try {
      // Convert BTC/USD to bitcoin format for CoinGecko
      const coinId = this.getCoinGeckoId(symbol);
      if (!coinId) return null;

      const response = await this.coinGeckoClient.get('/simple/price', {
        params: {
          ids: coinId,
          vs_currencies: 'usd',
          include_last_updated_at: true,
        },
      });

      const data = response.data[coinId];
      if (data && data.usd) {
        return {
          symbol,
          price: data.usd,
          timestamp: data.last_updated_at ? data.last_updated_at * 1000 : Date.now(),
          source: 'coingecko',
        };
      }

      return null;
    } catch (error: any) {
      this.logger.error(`CoinGecko fetch error for ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Fetch price from multiple sources and aggregate
   */
  async fetchPrice(symbol: string): Promise<PriceData | null> {
    const results: PriceData[] = [];

    // Fetch from Binance (primary)
    const binanceData = await this.fetchFromBinance(symbol);
    if (binanceData) results.push(binanceData);

    // Fetch from CoinGecko (secondary)
    const coinGeckoData = await this.fetchFromCoinGecko(symbol);
    if (coinGeckoData) results.push(coinGeckoData);

    if (results.length === 0) {
      this.logger.warn(`No price data available for ${symbol}`);
      return null;
    }

    // Calculate median price (more robust than average)
    const prices = results.map(r => r.price).sort((a, b) => a - b);
    const medianPrice = prices.length % 2 === 0
      ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
      : prices[Math.floor(prices.length / 2)];

    // Calculate variance for confidence scoring
    const variance = results.reduce((sum, r) => {
      const diff = r.price - medianPrice;
      return sum + (diff * diff);
    }, 0) / results.length;

    const stdDev = Math.sqrt(variance);
    const confidence = Math.max(0, 100 - (stdDev / medianPrice * 100));

    return {
      symbol,
      price: medianPrice,
      timestamp: Date.now(),
      source: 'aggregated',
    };
  }

  /**
   * Convert symbol to CoinGecko ID
   */
  private getCoinGeckoId(symbol: string): string | null {
    const mapping: Record<string, string> = {
      'BTC/USD': 'bitcoin',
      'ETH/USD': 'ethereum',
      'BNB/USD': 'binancecoin',
      'SOL/USD': 'solana',
      'ADA/USD': 'cardano',
      'DOT/USD': 'polkadot',
      'MATIC/USD': 'matic-network',
      'LINK/USD': 'chainlink',
      'AVAX/USD': 'avalanche-2',
      'UNI/USD': 'uniswap',
    };

    return mapping[symbol] || null;
  }

  /**
   * Get available symbols
   */
  getAvailableSymbols(): string[] {
    return Object.keys(this.getCoinGeckoId(''));
  }
}

