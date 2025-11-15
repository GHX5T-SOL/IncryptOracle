import { ethers, Contract, Wallet, JsonRpcProvider } from 'ethers';
import { Logger } from '../monitoring/logger';
import { CryptoPriceSource } from '../dataSources/CryptoPriceSource';
import { BaseDataSource, DataFetchResult } from '../dataSources/BaseDataSource';
import { ValidatorConfig } from '../config';

// Oracle ABI - extracted from contract
const ORACLE_ABI = [
  'function submitValidation(bytes32 feedId, uint256 value, string memory dataSource) external',
  'function registerValidator(uint256 stakeAmount) external',
  'function getDataFeed(bytes32 feedId) external view returns (string memory, string memory, uint256, uint256, uint256, bool)',
  'function getActiveFeedIds() external view returns (bytes32[])',
  'function getValidator(address validatorAddress) external view returns (uint256, uint256, bool, uint256, uint256)',
  'function validators(address) external view returns (address validatorAddress, uint256 stake, uint256 reputation, bool isActive, uint256 validationsCount, uint256 successfulValidations)',
  'event ValidationSubmitted(bytes32 indexed feedId, address indexed validator, uint256 value)',
  'event DataFeedUpdated(bytes32 indexed feedId, uint256 value, uint256 confidence)',
];

// IO Token ABI for staking
const TOKEN_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)',
];

export class OracleValidator {
  private provider: JsonRpcProvider;
  private wallet: Wallet;
  private oracleContract: Contract;
  private tokenContract: Contract;
  private config: ValidatorConfig;
  private logger: Logger;
  private dataSources: Map<string, BaseDataSource>;
  private isRegistered: boolean = false;

  constructor(config: ValidatorConfig, logger?: Logger) {
    this.config = config;
    this.logger = logger || new Logger(config.logLevel);
    
    // Initialize provider and wallet
    this.provider = new JsonRpcProvider(config.rpcUrl);
    this.wallet = new Wallet(config.privateKey, this.provider);
    
    // Initialize contracts
    this.oracleContract = new Contract(config.oracleAddress, ORACLE_ABI, this.wallet);
    this.tokenContract = new Contract(config.tokenAddress, TOKEN_ABI, this.wallet);
    
    // Initialize data sources
    this.dataSources = new Map();
    
    // Add crypto price source
    if (config.dataSources.enabled.includes('crypto')) {
      const cryptoSource = new CryptoPriceSource(
        config.dataSources.crypto.binanceApiUrl,
        config.dataSources.crypto.coinGeckoApiKey,
        this.logger
      );
      this.dataSources.set('crypto', cryptoSource);
    }
  }

  /**
   * Register as a validator
   */
  async register(): Promise<boolean> {
    try {
      // Check if already registered
      const validatorInfo = await this.oracleContract.getValidator(this.wallet.address);
      if (validatorInfo.isActive) {
        this.logger.info('Validator already registered');
        this.isRegistered = true;
        return true;
      }

      this.logger.info('Registering as validator...');
      
      // Approve token spending
      const stakeAmount = ethers.parseEther(this.config.stakeAmount);
      const allowance = await this.tokenContract.allowance(this.wallet.address, this.config.oracleAddress);
      
      if (allowance < stakeAmount) {
        this.logger.info('Approving token spending...');
        const approveTx = await this.tokenContract.approve(this.config.oracleAddress, stakeAmount);
        await approveTx.wait();
        this.logger.info('Token approval confirmed');
      }

      // Register validator
      const tx = await this.oracleContract.registerValidator(stakeAmount);
      this.logger.info(`Validator registration transaction: ${tx.hash}`);
      
      const receipt = await tx.wait();
      this.logger.info('Validator registered successfully');
      
      this.isRegistered = true;
      return true;
    } catch (error: any) {
      this.logger.error('Failed to register validator:', error.message);
      return false;
    }
  }

  /**
   * Get all active feed IDs
   */
  async getActiveFeeds(): Promise<string[]> {
    try {
      const feedIds = await this.oracleContract.getActiveFeedIds();
      return feedIds;
    } catch (error: any) {
      this.logger.error('Failed to get active feeds:', error.message);
      return [];
    }
  }

  /**
   * Get feed information
   */
  async getFeedInfo(feedId: string): Promise<{
    name: string;
    description: string;
    value: bigint;
    timestamp: bigint;
    confidence: bigint;
    isActive: boolean;
  } | null> {
    try {
      const result = await this.oracleContract.getDataFeed(feedId);
      return {
        name: result[0],
        description: result[1],
        value: result[2],
        timestamp: result[3],
        confidence: result[4],
        isActive: result[5],
      };
    } catch (error: any) {
      this.logger.error(`Failed to get feed info for ${feedId}:`, error.message);
      return null;
    }
  }

  /**
   * Submit validation for a feed
   */
  async submitValidation(
    feedId: string,
    value: number,
    dataSource: string
  ): Promise<boolean> {
    try {
      if (!this.isRegistered) {
        this.logger.warn('Validator not registered, attempting registration...');
        const registered = await this.register();
        if (!registered) {
          return false;
        }
      }

      // Convert value to appropriate scale (assuming 4 decimal places like in contract)
      const scaledValue = BigInt(Math.round(value * 10000));

      // Submit validation
      const tx = await this.oracleContract.submitValidation(
        feedId,
        scaledValue,
        dataSource
      );
      
      this.logger.info(`Validation submitted for feed ${feedId}: ${tx.hash}`);
      
      const receipt = await tx.wait();
      this.logger.info(`Validation confirmed for feed ${feedId}`);
      
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to submit validation for ${feedId}:`, error.message);
      return false;
    }
  }

  /**
   * Validate a feed by fetching data and submitting
   */
  async validateFeed(feedId: string): Promise<boolean> {
    try {
      // Get feed info
      const feedInfo = await this.getFeedInfo(feedId);
      if (!feedInfo || !feedInfo.isActive) {
        this.logger.warn(`Feed ${feedId} is not active`);
        return false;
      }

      // Determine data source type from feed name/description
      const sourceType = this.determineSourceType(feedInfo.name, feedInfo.description);
      const dataSource = this.dataSources.get(sourceType);
      
      if (!dataSource) {
        this.logger.warn(`No data source available for type: ${sourceType}`);
        return false;
      }

      // Fetch data
      this.logger.info(`Fetching data for feed: ${feedInfo.name}`);
      const data = await dataSource.fetch(feedId, {
        name: feedInfo.name,
        description: feedInfo.description,
      });

      if (!data || !dataSource.validate(data)) {
        this.logger.warn(`Invalid data fetched for feed ${feedId}`);
        return false;
      }

      // Submit validation
      const success = await this.submitValidation(
        feedId,
        data.value,
        data.source
      );

      return success;
    } catch (error: any) {
      this.logger.error(`Error validating feed ${feedId}:`, error.message);
      return false;
    }
  }

  /**
   * Validate all active feeds
   */
  async validateAllFeeds(): Promise<{ success: number; failed: number }> {
    const feeds = await this.getActiveFeeds();
    let success = 0;
    let failed = 0;

    this.logger.info(`Validating ${feeds.length} active feeds...`);

    for (const feedId of feeds) {
      const result = await this.validateFeed(feedId);
      if (result) {
        success++;
      } else {
        failed++;
      }

      // Add delay between validations to avoid rate limiting
      await this.sleep(1000);
    }

    this.logger.info(`Validation complete: ${success} succeeded, ${failed} failed`);
    return { success, failed };
  }

  /**
   * Determine data source type from feed name/description
   */
  private determineSourceType(name: string, description: string): string {
    const lowerName = name.toLowerCase();
    const lowerDesc = description.toLowerCase();

    if (lowerName.includes('/') || lowerDesc.includes('price') || lowerDesc.includes('crypto')) {
      return 'crypto';
    }

    // Default to crypto for now
    return 'crypto';
  }

  /**
   * Get validator info
   */
  async getValidatorInfo(): Promise<{
    stake: bigint;
    reputation: bigint;
    isActive: boolean;
    validationsCount: bigint;
    successfulValidations: bigint;
  } | null> {
    try {
      const result = await this.oracleContract.getValidator(this.wallet.address);
      return {
        stake: result[0],
        reputation: result[1],
        isActive: result[2],
        validationsCount: result[3],
        successfulValidations: result[4],
      };
    } catch (error: any) {
      this.logger.error('Failed to get validator info:', error.message);
      return null;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

