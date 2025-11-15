import express, { Express, Request, Response } from 'express';
import { Logger } from './logger';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: number;
  uptime: number;
  validator: {
    address: string;
    active: boolean;
    stake: string;
  };
  oracle: {
    connected: boolean;
    lastValidation: number | null;
  };
  dataSources: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    lastFetch: number | null;
  }[];
}

export class HealthCheck {
  private app: Express;
  private port: number;
  private logger: Logger;
  private status: HealthStatus;

  constructor(port: number, validatorAddress: string, logger?: Logger) {
    this.port = port;
    this.logger = logger || new Logger();
    this.app = express();

    this.status = {
      status: 'healthy',
      timestamp: Date.now(),
      uptime: process.uptime(),
      validator: {
        address: validatorAddress,
        active: true,
        stake: '0',
      },
      oracle: {
        connected: false,
        lastValidation: null,
      },
      dataSources: [],
    };

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/health', (req: Request, res: Response) => {
      this.status.timestamp = Date.now();
      this.status.uptime = process.uptime();
      res.json(this.status);
    });

    this.app.get('/ready', (req: Request, res: Response) => {
      if (this.status.oracle.connected && this.status.validator.active) {
        res.status(200).json({ ready: true });
      } else {
        res.status(503).json({ ready: false });
      }
    });

    this.app.get('/metrics', (req: Request, res: Response) => {
      // Prometheus-style metrics
      const metrics = [
        `validator_uptime_seconds ${this.status.uptime}`,
        `validator_last_validation_timestamp ${this.status.oracle.lastValidation || 0}`,
        `validator_active ${this.status.validator.active ? 1 : 0}`,
      ].join('\n');

      res.set('Content-Type', 'text/plain');
      res.send(metrics);
    });
  }

  updateStatus(updates: Partial<HealthStatus>): void {
    this.status = { ...this.status, ...updates };
  }

  setOracleConnected(connected: boolean): void {
    this.status.oracle.connected = connected;
    this.updateOverallStatus();
  }

  setLastValidation(timestamp: number): void {
    this.status.oracle.lastValidation = timestamp;
  }

  setValidatorStake(stake: string): void {
    this.status.validator.stake = stake;
  }

  addDataSource(name: string): void {
    const exists = this.status.dataSources.find(ds => ds.name === name);
    if (!exists) {
      this.status.dataSources.push({
        name,
        status: 'operational',
        lastFetch: null,
      });
    }
  }

  updateDataSourceStatus(name: string, status: 'operational' | 'degraded' | 'down', lastFetch?: number): void {
    const source = this.status.dataSources.find(ds => ds.name === name);
    if (source) {
      source.status = status;
      if (lastFetch !== undefined) {
        source.lastFetch = lastFetch;
      }
    }
    this.updateOverallStatus();
  }

  private updateOverallStatus(): void {
    const hasDownSource = this.status.dataSources.some(ds => ds.status === 'down');
    const hasDegradedSource = this.status.dataSources.some(ds => ds.status === 'degraded');
    const oracleConnected = this.status.oracle.connected;

    if (hasDownSource || !oracleConnected) {
      this.status.status = 'unhealthy';
    } else if (hasDegradedSource) {
      this.status.status = 'degraded';
    } else {
      this.status.status = 'healthy';
    }
  }

  start(): void {
    this.app.listen(this.port, () => {
      this.logger.info(`Health check server started on port ${this.port}`);
    });
  }

  getStatus(): HealthStatus {
    return { ...this.status };
  }
}

