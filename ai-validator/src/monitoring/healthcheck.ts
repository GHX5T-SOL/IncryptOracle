import express, { Express, Request, Response } from 'express';
import { Logger } from './logger';

export class HealthCheck {
  private app: Express;
  private port: number;
  private logger: Logger;
  private validatorAddress: string;
  private oracleConnected: boolean = false;
  private lastValidation: number = 0;
  private validatorStake: string = '0';

  constructor(port: number, validatorAddress: string, logger?: Logger) {
    this.port = port;
    this.validatorAddress = validatorAddress;
    this.logger = logger || new Logger();
    this.app = express();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/health', (req: Request, res: Response) => {
      const health = this.calculateHealth();
      res.status(health.status === 'healthy' ? 200 : 503).json(health);
    });

    this.app.get('/ready', (req: Request, res: Response) => {
      const ready = this.oracleConnected && this.lastValidation > 0;
      res.status(ready ? 200 : 503).json({ ready });
    });

    this.app.get('/metrics', (req: Request, res: Response) => {
      res.set('Content-Type', 'text/plain');
      res.send(this.getPrometheusMetrics());
    });

    this.app.get('/status', (req: Request, res: Response) => {
      res.json({
        validatorAddress: this.validatorAddress,
        oracleConnected: this.oracleConnected,
        lastValidation: this.lastValidation ? new Date(this.lastValidation).toISOString() : null,
        validatorStake: this.validatorStake,
        uptime: process.uptime()
      });
    });
  }

  private calculateHealth(): { status: string; checks: any } {
    const checks: any = {
      oracle: this.oracleConnected ? 'healthy' : 'unhealthy',
      validator: this.lastValidation > 0 ? 'healthy' : 'degraded'
    };

    const allHealthy = Object.values(checks).every(status => status === 'healthy');
    const anyUnhealthy = Object.values(checks).some(status => status === 'unhealthy');

    return {
      status: allHealthy ? 'healthy' : (anyUnhealthy ? 'unhealthy' : 'degraded'),
      checks
    };
  }

  private getPrometheusMetrics(): string {
    return `# HELP validator_oracle_connected Whether validator is connected to oracle
# TYPE validator_oracle_connected gauge
validator_oracle_connected ${this.oracleConnected ? 1 : 0}

# HELP validator_last_validation_timestamp Timestamp of last validation
# TYPE validator_last_validation_timestamp gauge
validator_last_validation_timestamp ${this.lastValidation}

# HELP validator_uptime_seconds Validator uptime in seconds
# TYPE validator_uptime_seconds gauge
validator_uptime_seconds ${process.uptime()}
`;
  }

  start(): void {
    this.app.listen(this.port, () => {
      this.logger.info(`AI Validator health check server started on port ${this.port}`);
    });
  }

  setOracleConnected(connected: boolean): void {
    this.oracleConnected = connected;
  }

  setLastValidation(timestamp: number): void {
    this.lastValidation = timestamp;
  }

  setValidatorStake(stake: string): void {
    this.validatorStake = stake;
  }
}

