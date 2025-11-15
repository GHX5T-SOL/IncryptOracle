import { Logger } from '../monitoring/logger';

export interface DataFetchResult {
  value: number;
  timestamp: number;
  source: string;
  confidence?: number;
}

/**
 * Base class for all data sources
 */
export abstract class BaseDataSource {
  protected logger: Logger;
  protected name: string;

  constructor(name: string, logger?: Logger) {
    this.name = name;
    this.logger = logger || new Logger();
  }

  /**
   * Fetch data from the source
   */
  abstract fetch(feedId: string, params?: Record<string, any>): Promise<DataFetchResult | null>;

  /**
   * Validate fetched data
   */
  validate(data: DataFetchResult): boolean {
    if (!data || typeof data.value !== 'number' || isNaN(data.value)) {
      return false;
    }

    if (data.value < 0 && !this.allowNegativeValues()) {
      return false;
    }

    // Check timestamp is recent (within last hour)
    const age = Date.now() - data.timestamp;
    if (age > 3600000) { // 1 hour
      return false;
    }

    return true;
  }

  /**
   * Whether this source allows negative values
   */
  protected allowNegativeValues(): boolean {
    return false;
  }

  /**
   * Get source name
   */
  getName(): string {
    return this.name;
  }
}

