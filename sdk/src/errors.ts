export class IncryptOracleError extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'IncryptOracleError';
    this.code = code;
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IncryptOracleError);
    }
  }
}

export class NetworkError extends IncryptOracleError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

export class ContractError extends IncryptOracleError {
  constructor(message: string, details?: any) {
    super(message, 'CONTRACT_ERROR', details);
    this.name = 'ContractError';
  }
}

export class DataError extends IncryptOracleError {
  constructor(message: string, details?: any) {
    super(message, 'DATA_ERROR', details);
    this.name = 'DataError';
  }
}

export class ValidationError extends IncryptOracleError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class SubscriptionError extends IncryptOracleError {
  constructor(message: string, details?: any) {
    super(message, 'SUBSCRIPTION_ERROR', details);
    this.name = 'SubscriptionError';
  }
}
