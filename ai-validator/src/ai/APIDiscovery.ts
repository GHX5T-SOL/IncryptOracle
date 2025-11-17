import axios, { AxiosInstance } from 'axios';
import { Logger } from '../monitoring/logger';

export interface DiscoveredAPI {
  name: string;
  url: string;
  description: string;
  category: string;
  authentication?: {
    type: 'api_key' | 'bearer' | 'basic';
    header?: string;
  };
  pricing?: string;
}

/**
 * API Discovery Service (inspired by Sora Oracle's Layer 1)
 * Automatically discovers relevant APIs for any prediction market question
 */
export class APIDiscovery {
  private rapidApiClient?: AxiosInstance;
  private logger: Logger;
  private rapidApiKey?: string;

  constructor(rapidApiKey?: string, logger?: Logger) {
    this.logger = logger || new Logger();
    this.rapidApiKey = rapidApiKey;
    
    if (rapidApiKey) {
      this.rapidApiClient = axios.create({
        baseURL: 'https://rapidapi.com',
        timeout: 10000,
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'rapidapi.com'
        }
      });
    }
  }

  /**
   * Discover APIs for a given prediction market question
   * Analyzes the question and finds relevant data sources
   */
  async discoverAPIs(question: string, category: string): Promise<DiscoveredAPI[]> {
    const discovered: DiscoveredAPI[] = [];
    
    try {
      // Determine category and search for relevant APIs
      const searchTerms = this.extractSearchTerms(question, category);
      
      // Search RapidAPI (if available)
      if (this.rapidApiClient && this.rapidApiKey) {
        const rapidAPIs = await this.searchRapidAPI(searchTerms);
        discovered.push(...rapidAPIs);
      }
      
      // Search APIs.guru (public API directory)
      const apisGuru = await this.searchAPIsGuru(searchTerms);
      discovered.push(...apisGuru);
      
      // Add known reliable sources based on category
      const knownSources = this.getKnownSources(category);
      discovered.push(...knownSources);
      
      this.logger.info(`Discovered ${discovered.length} APIs for question: ${question.substring(0, 50)}...`);
      
      return discovered.slice(0, 10); // Limit to top 10
    } catch (error: any) {
      this.logger.error('API discovery error:', error.message);
      // Fallback to known sources
      return this.getKnownSources(category);
    }
  }

  /**
   * Extract search terms from question and category
   */
  private extractSearchTerms(question: string, category: string): string[] {
    const terms: string[] = [category.toLowerCase()];
    
    // Extract key entities from question
    const lowerQuestion = question.toLowerCase();
    
    // Common patterns
    if (lowerQuestion.includes('price') || lowerQuestion.includes('$')) {
      terms.push('price', 'crypto', 'financial');
    }
    if (lowerQuestion.includes('sport') || lowerQuestion.includes('game') || lowerQuestion.includes('match')) {
      terms.push('sports', 'scores', 'events');
    }
    if (lowerQuestion.includes('election') || lowerQuestion.includes('vote')) {
      terms.push('election', 'politics', 'voting');
    }
    if (lowerQuestion.includes('weather') || lowerQuestion.includes('temperature')) {
      terms.push('weather', 'climate');
    }
    
    return [...new Set(terms)]; // Remove duplicates
  }

  /**
   * Search RapidAPI marketplace
   */
  private async searchRapidAPI(searchTerms: string[]): Promise<DiscoveredAPI[]> {
    const apis: DiscoveredAPI[] = [];
    
    try {
      // Note: This is a simplified version. Real implementation would use RapidAPI's search API
      // For now, we return known RapidAPI endpoints
      const knownRapidAPIs: Record<string, DiscoveredAPI> = {
        crypto: {
          name: 'CoinGecko API',
          url: 'https://api.coingecko.com/api/v3',
          description: 'Cryptocurrency prices and market data',
          category: 'crypto',
          authentication: { type: 'api_key', header: 'X-CG-Pro-API-Key' }
        },
        sports: {
          name: 'API-Football',
          url: 'https://api-football.com',
          description: 'Football scores and statistics',
          category: 'sports',
          authentication: { type: 'api_key', header: 'X-RapidAPI-Key' }
        }
      };
      
      for (const term of searchTerms) {
        if (knownRapidAPIs[term]) {
          apis.push(knownRapidAPIs[term]);
        }
      }
    } catch (error: any) {
      this.logger.warn('RapidAPI search error:', error.message);
    }
    
    return apis;
  }

  /**
   * Search APIs.guru directory
   */
  private async searchAPIsGuru(searchTerms: string[]): Promise<DiscoveredAPI[]> {
    const apis: DiscoveredAPI[] = [];
    
    try {
      // APIs.guru provides a public directory of APIs
      const response = await axios.get('https://api.apis.guru/v2/list.json', {
        timeout: 10000
      });
      
      const apiList = response.data;
      const matchingAPIs: DiscoveredAPI[] = [];
      
      // Search through APIs for matches
      for (const [apiName, apiData] of Object.entries(apiList as any)) {
        const apiInfo = (apiData as any).versions?.[Object.keys((apiData as any).versions)[0]];
        if (!apiInfo) continue;
        
        const nameLower = apiName.toLowerCase();
        const infoLower = JSON.stringify(apiInfo).toLowerCase();
        
        for (const term of searchTerms) {
          if (nameLower.includes(term) || infoLower.includes(term)) {
            matchingAPIs.push({
              name: apiName,
              url: apiInfo.info?.contact?.url || apiInfo.info?.externalDocs?.url || '',
              description: apiInfo.info?.description || '',
              category: term
            });
            break;
          }
        }
      }
      
      apis.push(...matchingAPIs.slice(0, 5)); // Top 5 matches
    } catch (error: any) {
      this.logger.warn('APIs.guru search error:', error.message);
    }
    
    return apis;
  }

  /**
   * Get known reliable sources for a category
   */
  private getKnownSources(category: string): DiscoveredAPI[] {
    const knownSources: Record<string, DiscoveredAPI[]> = {
      crypto: [
        {
          name: 'Binance API',
          url: 'https://api.binance.com/api/v3',
          description: 'Cryptocurrency exchange prices',
          category: 'crypto'
        },
        {
          name: 'CoinGecko API',
          url: 'https://api.coingecko.com/api/v3',
          description: 'Cryptocurrency market data',
          category: 'crypto'
        },
        {
          name: 'CoinMarketCap API',
          url: 'https://pro-api.coinmarketcap.com/v1',
          description: 'Cryptocurrency prices and market cap',
          category: 'crypto'
        }
      ],
      sports: [
        {
          name: 'TheSportsDB',
          url: 'https://www.thesportsdb.com/api/v1/json',
          description: 'Sports scores and statistics',
          category: 'sports'
        }
      ],
      election: [
        {
          name: 'Google Civic Information API',
          url: 'https://www.googleapis.com/civicinfo/v2',
          description: 'Election and voting information',
          category: 'election'
        }
      ],
      weather: [
        {
          name: 'OpenWeatherMap API',
          url: 'https://api.openweathermap.org/data/2.5',
          description: 'Weather data and forecasts',
          category: 'weather'
        }
      ]
    };
    
    return knownSources[category.toLowerCase()] || [];
  }
}

