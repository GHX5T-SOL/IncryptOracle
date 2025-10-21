import type { IncryptOracle } from './IncryptOracle';
import type { DataFeed, PriceData, Subscription, SubscriptionCallbacks } from './types';
import { DataError, SubscriptionError } from './errors';

export class DataFeedManager {
  private oracle: IncryptOracle;
  private cache = new Map<string, { data: PriceData; timestamp: number }>();
  private readonly cacheExpiry = 30000; // 30 seconds

  constructor(oracle: IncryptOracle) {
    this.oracle = oracle;
  }

  /**
   * Get cached price data or fetch fresh data
   */
  async getCachedPrice(feedId: string, maxAge = this.cacheExpiry): Promise<PriceData> {
    const cached = this.cache.get(feedId);
    
    if (cached && Date.now() - cached.timestamp < maxAge) {
      return cached.data;
    }

    const data = await this.oracle.getPrice(feedId);
    this.cache.set(feedId, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * Get multiple prices efficiently
   */
  async getMultiplePrices(feedIds: string[]): Promise<Record<string, PriceData>> {
    const promises = feedIds.map(async (feedId) => {
      try {
        const data = await this.getCachedPrice(feedId);
        return { feedId, data };
      } catch (error) {
        console.warn(`Failed to get price for ${feedId}:`, error);
        return { feedId, data: null };
      }
    });

    const results = await Promise.all(promises);
    const priceData: Record<string, PriceData> = {};
    
    results.forEach(({ feedId, data }) => {
      if (data) {
        priceData[feedId] = data;
      }
    });

    return priceData;
  }

  /**
   * Subscribe to multiple feeds with a single callback
   */
  subscribeMultiple(
    feedIds: string[], 
    callback: (feedId: string, data: PriceData) => void,
    errorCallback?: (feedId: string, error: Error) => void
  ): { unsubscribeAll: () => void } {
    const subscriptions: Subscription[] = [];

    feedIds.forEach(feedId => {
      try {
        const subscription = this.oracle.subscribe(feedId, {
          onData: (data) => callback(feedId, data),
          onError: (error) => errorCallback?.(feedId, error)
        });
        subscriptions.push(subscription);
      } catch (error) {
        console.warn(`Failed to subscribe to ${feedId}:`, error);
        errorCallback?.(feedId, error as Error);
      }
    });

    return {
      unsubscribeAll: () => {
        subscriptions.forEach(sub => sub.unsubscribe());
      }
    };
  }

  /**
   * Get price history (mock implementation - would need historical data API)
   */
  async getPriceHistory(
    feedId: string, 
    timeframe: '1h' | '24h' | '7d' | '30d' = '24h'
  ): Promise<Array<{ timestamp: number; value: number; confidence: number }>> {
    // In a real implementation, this would fetch historical data
    // For now, we'll return mock data
    const currentPrice = await this.oracle.getPrice(feedId);
    const dataPoints: Array<{ timestamp: number; value: number; confidence: number }> = [];
    
    const intervals = timeframe === '1h' ? 12 : timeframe === '24h' ? 24 : timeframe === '7d' ? 168 : 720;
    const intervalMs = timeframe === '1h' ? 5 * 60 * 1000 : 60 * 60 * 1000; // 5min or 1hour
    
    for (let i = intervals; i >= 0; i--) {
      const timestamp = Date.now() - (i * intervalMs);
      const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
      const value = currentPrice.value * (1 + variance);
      const confidence = Math.max(70, Math.min(100, currentPrice.confidence + (Math.random() - 0.5) * 10));
      
      dataPoints.push({ timestamp, value, confidence });
    }
    
    return dataPoints;
  }

  /**
   * Calculate price change over time
   */
  async getPriceChange(feedId: string, timeframe: '1h' | '24h' | '7d' = '24h'): Promise<{
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  }> {
    const history = await this.getPriceHistory(feedId, timeframe);
    
    if (history.length < 2) {
      throw new DataError(`Insufficient historical data for ${feedId}`);
    }

    const current = history[history.length - 1].value;
    const previous = history[0].value;
    const change = current - previous;
    const changePercent = (change / previous) * 100;

    return { current, previous, change, changePercent };
  }

  /**
   * Get feed statistics
   */
  async getFeedStats(feedId: string): Promise<{
    current: PriceData;
    change24h: number;
    changePercent24h: number;
    high24h: number;
    low24h: number;
    avgConfidence: number;
  }> {
    const [current, history] = await Promise.all([
      this.oracle.getPrice(feedId),
      this.getPriceHistory(feedId, '24h')
    ]);

    const values = history.map(h => h.value);
    const confidences = history.map(h => h.confidence);
    
    const high24h = Math.max(...values);
    const low24h = Math.min(...values);
    const avgConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
    
    const change24h = current.value - history[0].value;
    const changePercent24h = (change24h / history[0].value) * 100;

    return {
      current,
      change24h,
      changePercent24h,
      high24h,
      low24h,
      avgConfidence
    };
  }

  /**
   * Monitor feed health
   */
  monitorFeedHealth(
    feedIds: string[], 
    callback: (feedId: string, health: 'healthy' | 'stale' | 'low_confidence' | 'error') => void
  ): { stopMonitoring: () => void } {
    const intervalId = setInterval(async () => {
      for (const feedId of feedIds) {
        try {
          const data = await this.oracle.getPrice(feedId);
          const age = Date.now() - (data.timestamp * 1000);
          
          if (age > 3600000) { // 1 hour
            callback(feedId, 'stale');
          } else if (data.confidence < 70) {
            callback(feedId, 'low_confidence');
          } else {
            callback(feedId, 'healthy');
          }
        } catch (error) {
          callback(feedId, 'error');
        }
      }
    }, 60000); // Check every minute

    return {
      stopMonitoring: () => clearInterval(intervalId)
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; feeds: string[] } {
    return {
      size: this.cache.size,
      feeds: Array.from(this.cache.keys())
    };
  }
}
