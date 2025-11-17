import { HfInference } from '@huggingface/inference';
import axios from 'axios';
import { ethers, Contract, Wallet, JsonRpcProvider } from 'ethers';
import { Logger } from '../monitoring/logger';
import { APIDiscovery, DiscoveredAPI } from './APIDiscovery';
import { AIValidatorConfig } from '../config';

// Oracle ABI - includes AI validator functions
const ORACLE_ABI = [
  'function submitAIValidation(bytes32 feedId, uint256 value, string memory dataSource, string memory aiMetadata) external',
  'function registerAIValidator(address validatorAddress, uint256 stakeAmount) external',
  'function getDataFeed(bytes32 feedId) external view returns (string memory, string memory, uint256, uint256, uint256, bool)',
  'function getActiveFeedIds() external view returns (bytes32[])',
  'function getValidator(address validatorAddress) external view returns (uint256, uint256, bool, uint256, uint256, uint8)',
  'event AIValidationSubmitted(bytes32 indexed feedId, address indexed validator, uint256 value, string aiMetadata)',
];

const TOKEN_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function allowance(address owner, address spender) external view returns (uint256)',
];

export interface AIValidationResult {
  value: number;
  confidence: number;
  sources: string[];
  reasoning: string;
  model: string;
}

/**
 * AI Validator - Uses Hugging Face models and API discovery to validate oracle feeds
 */
export class AIValidator {
  private provider: JsonRpcProvider;
  private wallet: Wallet;
  private oracleContract: Contract;
  private tokenContract: Contract;
  private config: AIValidatorConfig;
  private logger: Logger;
  private hf: HfInference;
  private apiDiscovery: APIDiscovery;
  private isRegistered: boolean = false;

  constructor(config: AIValidatorConfig, logger?: Logger) {
    this.config = config;
    this.logger = logger || new Logger(config.logLevel);
    
    // Initialize provider and wallet
    this.provider = new JsonRpcProvider(config.rpcUrl);
    this.wallet = new Wallet(config.privateKey, this.provider);
    
    // Initialize contracts
    this.oracleContract = new Contract(config.oracleAddress, ORACLE_ABI, this.wallet);
    this.tokenContract = new Contract(config.tokenAddress, TOKEN_ABI, this.wallet);
    
    // Initialize Hugging Face
    this.hf = new HfInference(config.huggingFaceToken);
    
    // Initialize API Discovery
    this.apiDiscovery = new APIDiscovery(config.rapidApiKey, this.logger);
  }

  /**
   * Register as AI validator (must be called by owner first)
   */
  async register(): Promise<boolean> {
    try {
      // Check if already registered
      const validatorInfo = await this.oracleContract.getValidator(this.wallet.address);
      if (validatorInfo.isActive) {
        this.logger.info('AI Validator already registered');
        this.isRegistered = true;
        return true;
      }

      this.logger.info('AI Validator registration must be done by contract owner');
      this.logger.info(`Validator address: ${this.wallet.address}`);
      return false;
    } catch (error: any) {
      this.logger.error('Failed to check validator status:', error.message);
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
   * Analyze prediction market question using AI
   */
  async analyzeQuestion(question: string, description: string, category: string): Promise<AIValidationResult> {
    try {
      this.logger.info(`Analyzing question: ${question}`);
      
      // Step 1: Discover relevant APIs
      const discoveredAPIs = this.config.enableAPIDiscovery
        ? await this.apiDiscovery.discoverAPIs(question, category)
        : [];
      
      this.logger.info(`Discovered ${discoveredAPIs.length} APIs`);
      
      // Step 2: Fetch data from discovered APIs
      const dataPoints: number[] = [];
      const sources: string[] = [];
      
      for (const api of discoveredAPIs.slice(0, 5)) { // Limit to top 5 APIs
        try {
          const data = await this.fetchFromAPI(api, question);
          if (data !== null) {
            dataPoints.push(data);
            sources.push(api.name);
          }
        } catch (error: any) {
          this.logger.warn(`Failed to fetch from ${api.name}:`, error.message);
        }
      }
      
      // Step 3: Use Hugging Face model to analyze and extract value
      const aiAnalysis = await this.analyzeWithAI(question, description, dataPoints, sources);
      
      // Step 4: Calculate confidence based on data agreement
      const confidence = this.calculateConfidence(dataPoints, aiAnalysis.value);
      
      return {
        value: aiAnalysis.value,
        confidence,
        sources,
        reasoning: aiAnalysis.reasoning,
        model: this.config.huggingFaceModel
      };
    } catch (error: any) {
      this.logger.error('AI analysis error:', error.message);
      throw error;
    }
  }

  /**
   * Fetch data from a discovered API
   */
  private async fetchFromAPI(api: DiscoveredAPI, question: string): Promise<number | null> {
    try {
      // Simplified implementation - in production, this would parse the API response
      // and extract the relevant numeric value based on the question
      
      if (api.category === 'crypto') {
        // Extract symbol from question (e.g., "BTC" from "Will BTC reach $100k?")
        const symbolMatch = question.match(/\b(BTC|ETH|BNB|SOL|ADA|DOT|MATIC|LINK|AVAX|UNI)\b/i);
        if (symbolMatch) {
          const symbol = symbolMatch[1];
          const response = await axios.get(`${api.url}/simple/price`, {
            params: {
              ids: this.getCoinGeckoId(symbol),
              vs_currencies: 'usd'
            },
            timeout: 5000
          });
          
          const coinId = this.getCoinGeckoId(symbol);
          if (response.data[coinId]?.usd) {
            return response.data[coinId].usd;
          }
        }
      }
      
      // For other categories, return null (would need specific implementations)
      return null;
    } catch (error: any) {
      this.logger.warn(`API fetch error for ${api.name}:`, error.message);
      return null;
    }
  }

  /**
   * Analyze question and data using Hugging Face model
   */
  private async analyzeWithAI(
    question: string,
    description: string,
    dataPoints: number[],
    sources: string[]
  ): Promise<{ value: number; reasoning: string }> {
    try {
      const prompt = this.buildPrompt(question, description, dataPoints, sources);
      
      // Use Hugging Face text generation
      const response = await this.hf.textGeneration({
        model: this.config.huggingFaceModel,
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.3,
          return_full_text: false
        }
      });
      
      const generatedText = response.generated_text;
      
      // Extract value and reasoning from AI response
      const valueMatch = generatedText.match(/value[:\s]+([\d.]+)/i);
      const value = valueMatch ? parseFloat(valueMatch[1]) : (dataPoints.length > 0 ? this.calculateMedian(dataPoints) : 0);
      
      return {
        value,
        reasoning: generatedText.substring(0, 500) // Limit reasoning length
      };
    } catch (error: any) {
      this.logger.error('Hugging Face inference error:', error.message);
      
      // Fallback to median of data points
      const value = dataPoints.length > 0 ? this.calculateMedian(dataPoints) : 0;
      return {
        value,
        reasoning: `Fallback: Used median of ${dataPoints.length} data points due to AI inference error`
      };
    }
  }

  /**
   * Build prompt for AI model
   */
  private buildPrompt(question: string, description: string, dataPoints: number[], sources: string[]): string {
    return `You are an oracle validator analyzing a prediction market question.

Question: ${question}
Description: ${description}

Data points from ${sources.length} sources:
${dataPoints.map((dp, i) => `Source ${i + 1}: ${dp}`).join('\n')}

Based on the question and available data, provide:
1. The most likely numeric value (as a number)
2. Brief reasoning (2-3 sentences)

Format your response as:
value: [number]
reasoning: [explanation]

Response:`;
  }

  /**
   * Calculate confidence based on data agreement
   */
  private calculateConfidence(dataPoints: number[], aiValue: number): number {
    if (dataPoints.length === 0) return 70; // Default confidence if no data
    
    // Calculate variance
    const mean = dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length;
    const variance = dataPoints.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dataPoints.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower variance = higher confidence
    const coefficientOfVariation = mean > 0 ? stdDev / mean : 1;
    const baseConfidence = Math.max(50, 100 - (coefficientOfVariation * 100));
    
    // Adjust based on AI value agreement with data
    const aiDiff = Math.abs(aiValue - mean) / (mean > 0 ? mean : 1);
    const agreementBonus = aiDiff < 0.1 ? 10 : (aiDiff < 0.2 ? 5 : 0);
    
    return Math.min(95, baseConfidence + agreementBonus);
  }

  /**
   * Calculate median of data points
   */
  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Get CoinGecko ID for symbol
   */
  private getCoinGeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'BNB': 'binancecoin',
      'SOL': 'solana',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'MATIC': 'matic-network',
      'LINK': 'chainlink',
      'AVAX': 'avalanche-2',
      'UNI': 'uniswap',
    };
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
  }

  /**
   * Submit AI validation to oracle
   */
  async submitValidation(
    feedId: string,
    result: AIValidationResult
  ): Promise<boolean> {
    try {
      if (!this.isRegistered) {
        const registered = await this.register();
        if (!registered) {
          this.logger.warn('AI Validator not registered. Owner must register it first.');
          return false;
        }
      }

      // Convert value to appropriate scale (4 decimal places)
      const scaledValue = BigInt(Math.round(result.value * 10000));

      // Create AI metadata JSON
      const aiMetadata = JSON.stringify({
        confidence: result.confidence,
        sources: result.sources,
        reasoning: result.reasoning,
        model: result.model,
        timestamp: Date.now()
      });

      // Submit validation
      const tx = await this.oracleContract.submitAIValidation(
        feedId,
        scaledValue,
        'AI Validator',
        aiMetadata
      );
      
      this.logger.info(`AI Validation submitted for feed ${feedId}: ${tx.hash}`);
      
      const receipt = await tx.wait();
      this.logger.info(`AI Validation confirmed for feed ${feedId}`);
      
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to submit AI validation for ${feedId}:`, error.message);
      return false;
    }
  }

  /**
   * Validate a feed using AI
   */
  async validateFeed(feedId: string): Promise<boolean> {
    try {
      const feedInfo = await this.getFeedInfo(feedId);
      if (!feedInfo || !feedInfo.isActive) {
        this.logger.warn(`Feed ${feedId} is not active`);
        return false;
      }

      // Analyze using AI
      const result = await this.analyzeQuestion(
        feedInfo.name,
        feedInfo.description,
        this.determineCategory(feedInfo.name, feedInfo.description)
      );

      // Submit validation
      return await this.submitValidation(feedId, result);
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

    this.logger.info(`Validating ${feeds.length} active feeds with AI...`);

    for (const feedId of feeds) {
      const result = await this.validateFeed(feedId);
      if (result) {
        success++;
      } else {
        failed++;
      }

      // Add delay between validations
      await this.sleep(2000);
    }

    return { success, failed };
  }

  /**
   * Determine category from feed name/description
   */
  private determineCategory(name: string, description: string): string {
    const lower = (name + ' ' + description).toLowerCase();
    
    if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('ethereum') || lower.includes('price')) {
      return 'crypto';
    }
    if (lower.includes('sport') || lower.includes('game') || lower.includes('match')) {
      return 'sports';
    }
    if (lower.includes('election') || lower.includes('vote') || lower.includes('politic')) {
      return 'election';
    }
    if (lower.includes('weather') || lower.includes('temperature') || lower.includes('climate')) {
      return 'weather';
    }
    
    return 'crypto'; // Default
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

