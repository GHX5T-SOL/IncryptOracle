import { ethers } from 'ethers';
import { EventEmitter } from './EventEmitter';
import { DataFeedManager } from './DataFeedManager';
import { NetworkError, ContractError, DataError, ValidationError } from './errors';
import { NETWORKS, DEFAULT_CONFIG, ABI, FEED_IDS } from './constants';
import type {
  OracleConfig,
  PriceData,
  DataFeed,
  ValidatorInfo,
  Subscription,
  SubscriptionCallbacks,
  NetworkConfig,
  MarketData,
  UserPosition,
  ValidationSubmission,
  AIValidationMetadata,
  ValidatorType
} from './types';

export class IncryptOracle extends EventEmitter {
  private config: Required<OracleConfig>;
  private provider: ethers.JsonRpcProvider;
  private oracleContract: ethers.Contract;
  private predictionMarketContract?: ethers.Contract;
  private tokenContract?: ethers.Contract;
  private dataFeedManager: DataFeedManager;
  private subscriptions = new Map<string, Subscription>();
  private pollingIntervals = new Map<string, NodeJS.Timeout>();

  constructor(config: OracleConfig) {
    super();
    
    // Validate and merge config
    this.config = this.validateAndMergeConfig(config);
    
    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
    
    // Initialize contracts
    const networkConfig = NETWORKS[this.config.network];
    const contractAddress = this.config.contractAddress || networkConfig.contractAddress;
    
    this.oracleContract = new ethers.Contract(
      contractAddress,
      ABI.ORACLE,
      this.config.signer || this.provider
    );
    
    // Initialize data feed manager
    this.dataFeedManager = new DataFeedManager(this);
    
    this.emit('connected', {});
  }

  private validateAndMergeConfig(config: OracleConfig): Required<OracleConfig> {
    if (!config.network || !NETWORKS[config.network]) {
      throw new ValidationError(`Invalid network: ${config.network}. Supported networks: ${Object.keys(NETWORKS).join(', ')}`);
    }

    const networkConfig = NETWORKS[config.network];
    
    return {
      network: config.network,
      rpcUrl: config.rpcUrl || networkConfig.rpcUrl,
      contractAddress: config.contractAddress || networkConfig.contractAddress,
      signer: config.signer || null,
      pollingInterval: config.pollingInterval || DEFAULT_CONFIG.pollingInterval!,
      timeout: config.timeout || DEFAULT_CONFIG.timeout!,
    };
  }

  /**
   * Get the latest price data for a specific feed
   */
  async getPrice(feedId: string): Promise<PriceData> {
    try {
      const feedIdBytes = this.getFeedIdBytes(feedId);
      const result = await this.oracleContract.getDataFeed(feedIdBytes);
      
      if (!result[5]) { // isActive
        throw new DataError(`Data feed ${feedId} is not active`);
      }

      const priceData: PriceData = {
        feedId,
        name: result[0],
        value: this.formatValue(result[2]),
        confidence: Number(result[4]) / 100, // Convert basis points to percentage
        timestamp: Number(result[3]),
        lastUpdated: new Date(Number(result[3]) * 1000)
      };

      // Validate data freshness (default 1 hour)
      const maxAge = 3600; // 1 hour in seconds
      if (Date.now() / 1000 - priceData.timestamp > maxAge) {
        throw new DataError(`Data for ${feedId} is stale (last updated: ${priceData.lastUpdated.toISOString()})`);
      }

      // Validate confidence level
      if (priceData.confidence < 70) {
        throw new DataError(`Data confidence too low for ${feedId}: ${priceData.confidence}%`);
      }

      this.emit('dataUpdate', priceData);
      return priceData;
    } catch (error) {
      if (error instanceof DataError) {
        throw error;
      }
      throw new ContractError(`Failed to get price for ${feedId}`, error);
    }
  }

  /**
   * Get information about all available data feeds
   */
  async getAllFeeds(): Promise<DataFeed[]> {
    try {
      const feedIds = await this.oracleContract.getActiveFeedIds();
      const feeds: DataFeed[] = [];

      for (const feedIdBytes of feedIds) {
        try {
          const result = await this.oracleContract.getDataFeed(feedIdBytes);
          feeds.push({
            id: this.bytesToFeedId(feedIdBytes),
            name: result[0],
            description: result[1],
            isActive: result[5],
            validationThreshold: 3, // Default threshold
            currentValue: this.formatValue(result[2]),
            confidence: Number(result[4]) / 100,
            lastUpdate: Number(result[3])
          });
        } catch (error) {
          console.warn(`Failed to fetch data for feed ${feedIdBytes}:`, error);
        }
      }

      return feeds;
    } catch (error) {
      throw new ContractError('Failed to get data feeds', error);
    }
  }

  /**
   * Subscribe to real-time updates for a specific data feed
   */
  subscribe(feedId: string, callbacks: SubscriptionCallbacks): Subscription {
    if (this.subscriptions.has(feedId)) {
      throw new ValidationError(`Already subscribed to ${feedId}`);
    }

    const subscription: Subscription = {
      feedId,
      unsubscribe: () => this.unsubscribe(feedId),
      isActive: () => this.subscriptions.has(feedId)
    };

    this.subscriptions.set(feedId, subscription);

    // Start polling for updates
    const intervalId = setInterval(async () => {
      try {
        const data = await this.getPrice(feedId);
        callbacks.onData(data);
      } catch (error) {
        if (callbacks.onError) {
          callbacks.onError(error as Error);
        }
      }
    }, this.config.pollingInterval);

    this.pollingIntervals.set(feedId, intervalId);

    // Initial data fetch
    this.getPrice(feedId)
      .then(callbacks.onData)
      .catch(error => callbacks.onError?.(error));

    if (callbacks.onConnected) {
      callbacks.onConnected();
    }

    return subscription;
  }

  /**
   * Unsubscribe from a data feed
   */
  private unsubscribe(feedId: string): void {
    const interval = this.pollingIntervals.get(feedId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(feedId);
    }
    
    this.subscriptions.delete(feedId);
  }

  /**
   * Get validator information
   */
  async getValidator(address: string): Promise<ValidatorInfo> {
    try {
      if (!ethers.isAddress(address)) {
        throw new ValidationError(`Invalid address: ${address}`);
      }

      const result = await this.oracleContract.getValidator(address);
      
      return {
        address,
        stake: ethers.formatEther(result[0]),
        reputation: Number(result[1]),
        isActive: result[2],
        validationsCount: Number(result[3]),
        successfulValidations: Number(result[4]),
        validatorType: Number(result[5]) as ValidatorType
      };
    } catch (error) {
      throw new ContractError(`Failed to get validator info for ${address}`, error);
    }
  }

  /**
   * Register as a validator (requires signer)
   */
  async registerValidator(stakeAmount: string): Promise<string> {
    if (!this.config.signer) {
      throw new ValidationError('Signer required for validator registration');
    }

    try {
      const stakeAmountWei = ethers.parseEther(stakeAmount);
      const tx = await this.oracleContract.registerValidator(stakeAmountWei);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      throw new ContractError('Failed to register validator', error);
    }
  }

  /**
   * Submit validation data (validator only)
   */
  async submitValidation(feedId: string, value: number, source: string): Promise<string> {
    if (!this.config.signer) {
      throw new ValidationError('Signer required for validation submission');
    }

    try {
      const feedIdBytes = this.getFeedIdBytes(feedId);
      const valueScaled = Math.round(value * 10000); // Scale to 4 decimal places
      
      const tx = await this.oracleContract.submitValidation(feedIdBytes, valueScaled, source);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      throw new ContractError('Failed to submit validation', error);
    }
  }

  /**
   * Submit AI validation (AI validator only)
   */
  async submitAIValidation(
    feedId: string,
    value: number,
    source: string,
    aiMetadata: AIValidationMetadata
  ): Promise<string> {
    if (!this.config.signer) {
      throw new ValidationError('Signer required for AI validation submission');
    }

    try {
      const feedIdBytes = this.getFeedIdBytes(feedId);
      const valueScaled = Math.round(value * 10000);
      const metadataJson = JSON.stringify(aiMetadata);
      
      const tx = await this.oracleContract.submitAIValidation(feedIdBytes, valueScaled, source, metadataJson);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      throw new ContractError('Failed to submit AI validation', error);
    }
  }

  /**
   * Get validation submission details including AI metadata
   */
  async getValidationSubmission(feedId: string, validatorAddress: string): Promise<ValidationSubmission> {
    try {
      const feedIdBytes = this.getFeedIdBytes(feedId);
      const result = await this.oracleContract.getValidationSubmission(feedIdBytes, validatorAddress);
      
      let aiMetadata: AIValidationMetadata | undefined;
      if (result[4] === 1 && result[5]) { // ValidatorType.AI and has metadata
        try {
          aiMetadata = JSON.parse(result[5]);
        } catch {
          // Invalid JSON, ignore
        }
      }
      
      return {
        value: Number(result[0]) / 10000,
        timestamp: Number(result[1]),
        submitted: result[2],
        dataSource: result[3],
        validatorType: Number(result[4]) as ValidatorType,
        aiMetadata
      };
    } catch (error) {
      throw new ContractError(`Failed to get validation submission for ${feedId}`, error);
    }
  }

  /**
   * Get count of AI validators
   */
  async getAIValidatorCount(): Promise<number> {
    try {
      const count = await this.oracleContract.getAIValidatorCount();
      return Number(count);
    } catch (error) {
      throw new ContractError('Failed to get AI validator count', error);
    }
  }

  /**
   * Get all AI validators
   */
  async getAIValidators(): Promise<ValidatorInfo[]> {
    try {
      const feedIds = await this.oracleContract.getActiveFeedIds();
      const validators = new Map<string, ValidatorInfo>();
      
      // Get all validators and filter for AI
      // Note: This is a simplified approach. In production, you might want to track AI validators separately
      const allFeeds = await this.getAllFeeds();
      
      for (const feed of allFeeds) {
        // This would require additional contract methods to get all validators
        // For now, return empty array - can be enhanced
      }
      
      return Array.from(validators.values());
    } catch (error) {
      throw new ContractError('Failed to get AI validators', error);
    }
  }

  /**
   * Get prediction market data (if available)
   */
  async getMarket(marketId: number): Promise<MarketData> {
    if (!this.predictionMarketContract) {
      this.initializePredictionMarketContract();
    }

    try {
      const result = await this.predictionMarketContract!.getMarket(marketId);
      const odds = await this.predictionMarketContract!.getOdds(marketId);
      
      return {
        id: marketId,
        question: result[0],
        description: result[1],
        category: result[2],
        endTime: Number(result[3]),
        totalLiquidity: ethers.formatEther(result[7]),
        yesOdds: Number(odds[1]) / 10000,
        noOdds: Number(odds[0]) / 10000,
        resolved: result[4] !== 0
      };
    } catch (error) {
      throw new ContractError(`Failed to get market ${marketId}`, error);
    }
  }

  /**
   * Get user position in a market
   */
  async getUserPosition(marketId: number, userAddress: string): Promise<UserPosition> {
    if (!this.predictionMarketContract) {
      this.initializePredictionMarketContract();
    }

    try {
      const result = await this.predictionMarketContract!.getUserPosition(marketId, userAddress);
      
      return {
        marketId,
        yesShares: ethers.formatEther(result[1]),
        noShares: ethers.formatEther(result[0]),
        totalInvested: ethers.formatEther(result[2]),
        claimed: result[3]
      };
    } catch (error) {
      throw new ContractError(`Failed to get user position for market ${marketId}`, error);
    }
  }

  /**
   * Initialize prediction market contract (lazy loading)
   */
  private initializePredictionMarketContract(): void {
    const networkConfig = NETWORKS[this.config.network];
    // In a real implementation, you would have the prediction market contract address
    const contractAddress = '0x0000000000000000000000000000000000000000'; // Placeholder
    
    this.predictionMarketContract = new ethers.Contract(
      contractAddress,
      ABI.PREDICTION_MARKET,
      this.config.signer || this.provider
    );
  }

  /**
   * Get network information
   */
  getNetworkConfig(): NetworkConfig {
    return NETWORKS[this.config.network];
  }

  /**
   * Check if connected to the correct network
   */
  async checkNetwork(): Promise<boolean> {
    try {
      const network = await this.provider.getNetwork();
      const expectedChainId = NETWORKS[this.config.network].chainId;
      return Number(network.chainId) === expectedChainId;
    } catch (error) {
      throw new NetworkError('Failed to check network', error);
    }
  }

  /**
   * Get current block number
   */
  async getBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      throw new NetworkError('Failed to get block number', error);
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    // Clear all subscriptions
    for (const subscription of this.subscriptions.values()) {
      subscription.unsubscribe();
    }
    
    // Clear all intervals
    for (const interval of this.pollingIntervals.values()) {
      clearInterval(interval);
    }
    
    this.subscriptions.clear();
    this.pollingIntervals.clear();
    
    this.emit('disconnected', {});
  }

  // Utility methods
  private getFeedIdBytes(feedId: string): string {
    if (FEED_IDS[feedId as keyof typeof FEED_IDS]) {
      return FEED_IDS[feedId as keyof typeof FEED_IDS];
    }
    // If not a predefined feed, convert string to bytes32
    return ethers.id(feedId);
  }

  private bytesToFeedId(feedIdBytes: string): string {
    // Try to find matching predefined feed ID
    for (const [feedId, bytes] of Object.entries(FEED_IDS)) {
      if (bytes === feedIdBytes) {
        return feedId;
      }
    }
    // If not found, return the bytes as hex
    return feedIdBytes;
  }

  private formatValue(value: bigint): number {
    // Assuming values are scaled by 10000 (4 decimal places)
    return Number(value) / 10000;
  }
}
