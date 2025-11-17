import { ethers } from 'ethers';
import { loadConfig, AIValidatorConfig } from './config';
import { AIValidator } from './ai/AIValidator';
import { HealthCheck } from './monitoring/healthcheck';
import { Logger } from './monitoring/logger';
import cron from 'node-cron';

class AIValidatorService {
  private config: AIValidatorConfig;
  private validator: AIValidator;
  private healthCheck: HealthCheck;
  private logger: Logger;
  private cronJob?: cron.ScheduledTask;

  constructor() {
    // Load configuration
    this.config = loadConfig();
    this.logger = new Logger(this.config.logLevel);
    
    // Initialize components
    this.validator = new AIValidator(this.config, this.logger);
    this.healthCheck = new HealthCheck(
      this.config.healthCheckPort,
      this.config.validatorAddress,
      this.logger
    );
  }

  async start(): Promise<void> {
    this.logger.info('Starting Incrypt Oracle AI Validator Node...');
    this.logger.info(`AI Validator Address: ${this.config.validatorAddress}`);
    this.logger.info(`Oracle Contract: ${this.config.oracleAddress}`);
    this.logger.info(`RPC URL: ${this.config.rpcUrl}`);
    this.logger.info(`Hugging Face Model: ${this.config.huggingFaceModel}`);
    this.logger.info(`API Discovery: ${this.config.enableAPIDiscovery ? 'Enabled' : 'Disabled'}`);

    try {
      // Check registration status
      this.logger.info('Checking AI validator registration...');
      const registered = await this.validator.register();
      
      if (registered) {
        this.logger.info('AI Validator is registered and active');
        this.healthCheck.setOracleConnected(true);
      } else {
        this.logger.warn('AI Validator not yet registered. Owner must call registerAIValidator() first.');
        this.logger.info(`Please register this validator address: ${this.config.validatorAddress}`);
        this.healthCheck.setOracleConnected(false);
      }

      // Start health check server
      this.healthCheck.start();
      this.logger.info(`Health check server started on port ${this.config.healthCheckPort}`);

      // Start validation loop
      this.startValidationLoop();

      // Setup graceful shutdown
      this.setupGracefulShutdown();

      this.logger.info('AI Validator node started successfully');
    } catch (error: any) {
      this.logger.error('Failed to start AI validator node:', error.message);
      process.exit(1);
    }
  }

  private startValidationLoop(): void {
    const intervalSeconds = this.config.validationInterval;
    
    // Use cron for more precise timing
    const cronPattern = `*/${intervalSeconds} * * * * *`;
    
    this.cronJob = cron.schedule(cronPattern, async () => {
      await this.runValidationCycle();
    });

    this.logger.info(`AI Validation loop started (every ${intervalSeconds} seconds)`);

    // Run initial validation immediately
    setTimeout(() => {
      this.runValidationCycle();
    }, 10000); // Wait 10 seconds before first run
  }

  private async runValidationCycle(): Promise<void> {
    try {
      this.logger.info('Starting AI validation cycle...');
      
      const results = await this.validator.validateAllFeeds();
      
      // Update health check
      this.healthCheck.setLastValidation(Date.now());
      
      this.logger.info(
        `AI Validation cycle complete: ${results.success} succeeded, ${results.failed} failed`
      );
    } catch (error: any) {
      this.logger.error('AI Validation cycle error:', error.message);
      this.healthCheck.setOracleConnected(false);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      this.logger.info(`Received ${signal}, shutting down gracefully...`);
      
      // Stop validation loop
      if (this.cronJob) {
        this.cronJob.stop();
      }
      
      this.logger.info('AI Validator node stopped');
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}

// Start the service
const service = new AIValidatorService();
service.start().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

