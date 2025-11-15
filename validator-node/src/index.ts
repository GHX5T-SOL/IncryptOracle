import { ethers } from 'ethers';
import { loadConfig, ValidatorConfig } from './config';
import { OracleValidator } from './validator/OracleValidator';
import { HealthCheck } from './monitoring/healthcheck';
import { Logger } from './monitoring/logger';
import cron from 'node-cron';

class ValidatorService {
  private config: ValidatorConfig;
  private validator: OracleValidator;
  private healthCheck: HealthCheck;
  private logger: Logger;
  private validationInterval?: NodeJS.Timeout;
  private cronJob?: cron.ScheduledTask;

  constructor() {
    // Load configuration
    this.config = loadConfig();
    this.logger = new Logger(this.config.logLevel);
    
    // Initialize components
    this.validator = new OracleValidator(this.config, this.logger);
    this.healthCheck = new HealthCheck(
      this.config.healthCheckPort,
      this.config.validatorAddress,
      this.logger
    );
  }

  async start(): Promise<void> {
    this.logger.info('Starting Incrypt Oracle Validator Node...');
    this.logger.info(`Validator Address: ${this.config.validatorAddress}`);
    this.logger.info(`Oracle Contract: ${this.config.oracleAddress}`);
    this.logger.info(`RPC URL: ${this.config.rpcUrl}`);

    try {
      // Register as validator
      this.logger.info('Registering validator...');
      const registered = await this.validator.register();
      
      if (registered) {
        this.logger.info('Validator registered successfully');
        this.healthCheck.setOracleConnected(true);
        
        // Get validator info
        const validatorInfo = await this.validator.getValidatorInfo();
        if (validatorInfo) {
          this.healthCheck.setValidatorStake(ethers.formatEther(validatorInfo.stake));
        }
      } else {
        this.logger.error('Failed to register validator');
        this.healthCheck.setOracleConnected(false);
        return;
      }

      // Start health check server
      this.healthCheck.start();
      this.logger.info(`Health check server started on port ${this.config.healthCheckPort}`);

      // Start validation loop
      this.startValidationLoop();

      // Setup graceful shutdown
      this.setupGracefulShutdown();

      this.logger.info('Validator node started successfully');
    } catch (error: any) {
      this.logger.error('Failed to start validator node:', error.message);
      process.exit(1);
    }
  }

  private startValidationLoop(): void {
    const intervalSeconds = this.config.validationInterval;
    
    // Use cron for more precise timing
    // Run every N seconds
    const cronPattern = `*/${intervalSeconds} * * * * *`;
    
    this.cronJob = cron.schedule(cronPattern, async () => {
      await this.runValidationCycle();
    });

    this.logger.info(`Validation loop started (every ${intervalSeconds} seconds)`);

    // Run initial validation immediately
    setTimeout(() => {
      this.runValidationCycle();
    }, 5000); // Wait 5 seconds before first run
  }

  private async runValidationCycle(): Promise<void> {
    try {
      this.logger.info('Starting validation cycle...');
      
      const results = await this.validator.validateAllFeeds();
      
      // Update health check
      this.healthCheck.setLastValidation(Date.now());
      
      this.logger.info(
        `Validation cycle complete: ${results.success} succeeded, ${results.failed} failed`
      );
    } catch (error: any) {
      this.logger.error('Validation cycle error:', error.message);
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
      
      if (this.validationInterval) {
        clearInterval(this.validationInterval);
      }
      
      this.logger.info('Validator node stopped');
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}

// Start the service
const service = new ValidatorService();
service.start().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

