/**
 * Error handling utilities for blockchain interactions
 */

export interface ErrorInfo {
  message: string;
  code?: string;
  action?: string;
}

/**
 * Parse and format blockchain errors for user-friendly messages
 */
export function parseError(error: any): ErrorInfo {
  // Handle different error types
  if (typeof error === 'string') {
    return {
      message: error,
      action: 'Please try again',
    };
  }

  if (error?.message) {
    const message = error.message.toLowerCase();

    // Transaction rejected by user
    if (message.includes('user rejected') || message.includes('user denied')) {
      return {
        message: 'Transaction was cancelled',
        code: 'USER_REJECTED',
        action: 'Please approve the transaction to continue',
      };
    }

    // Insufficient funds
    if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
      return {
        message: 'Insufficient balance',
        code: 'INSUFFICIENT_FUNDS',
        action: 'Please add more tokens to your wallet',
      };
    }

    // Gas estimation failed
    if (message.includes('gas') || message.includes('execution reverted')) {
      return {
        message: 'Transaction failed - likely due to insufficient gas or contract state',
        code: 'GAS_ERROR',
        action: 'Try increasing gas limit or check contract state',
      };
    }

    // Network errors
    if (message.includes('network') || message.includes('rpc')) {
      return {
        message: 'Network connection error',
        code: 'NETWORK_ERROR',
        action: 'Please check your internet connection and try again',
      };
    }

    // Contract-specific errors
    if (message.includes('already submitted')) {
      return {
        message: 'You have already submitted a validation for this feed',
        code: 'ALREADY_SUBMITTED',
        action: 'Wait for other validators or check existing submission',
      };
    }

    if (message.includes('validation window closed')) {
      return {
        message: 'Validation window has closed',
        code: 'WINDOW_CLOSED',
        action: 'This feed can no longer accept validations',
      };
    }

    if (message.includes('not an active validator')) {
      return {
        message: 'You are not registered as a validator',
        code: 'NOT_VALIDATOR',
        action: 'Please register as a validator first',
      };
    }

    if (message.includes('slippage')) {
      return {
        message: 'Price moved too much during transaction',
        code: 'SLIPPAGE',
        action: 'Try again with a larger slippage tolerance',
      };
    }

    // Generic error
    return {
      message: error.message || 'An error occurred',
      code: error.code || 'UNKNOWN',
      action: 'Please try again or contact support',
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN',
    action: 'Please try again',
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: any): string {
  const errorInfo = parseError(error);
  return errorInfo.message;
}

/**
 * Get actionable error message with suggested action
 */
export function getActionableError(error: any): ErrorInfo {
  return parseError(error);
}

