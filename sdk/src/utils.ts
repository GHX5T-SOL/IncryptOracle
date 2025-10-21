import { ethers } from 'ethers';

/**
 * Utility functions for the Incrypt Oracle SDK
 */

/**
 * Format a number to a specific decimal precision
 */
export function formatNumber(value: number, decimals = 2): string {
  return Number(value).toFixed(decimals);
}

/**
 * Format a large number with K, M, B suffixes
 */
export function formatLargeNumber(value: number, decimals = 1): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}

/**
 * Format percentage with proper sign
 */
export function formatPercentage(value: number, decimals = 2): string {
  const formatted = value.toFixed(decimals);
  return value > 0 ? `+${formatted}%` : `${formatted}%`;
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number, includeTime = true): string {
  const date = new Date(timestamp * 1000);
  
  if (includeTime) {
    return date.toLocaleString();
  }
  
  return date.toLocaleDateString();
}

/**
 * Calculate time ago from timestamp
 */
export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - (timestamp * 1000);
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

/**
 * Shorten an Ethereum address for display
 */
export function shortenAddress(address: string, startChars = 6, endChars = 4): string {
  if (!isValidAddress(address)) {
    return address;
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Convert feed ID to bytes32
 */
export function feedIdToBytes32(feedId: string): string {
  return ethers.id(feedId);
}

/**
 * Convert bytes32 to readable string (if possible)
 */
export function bytes32ToFeedId(bytes32: string): string {
  try {
    return ethers.toUtf8String(bytes32).replace(/\0/g, '');
  } catch {
    return bytes32;
  }
}

/**
 * Calculate confidence level color
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'green';
  if (confidence >= 70) return 'yellow';
  if (confidence >= 50) return 'orange';
  return 'red';
}

/**
 * Calculate price change direction
 */
export function getPriceDirection(current: number, previous: number): 'up' | 'down' | 'neutral' {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'neutral';
}

/**
 * Debounce function for reducing API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Create a promise that times out
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeout = new Promise<T>((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
  });
  
  return Promise.race([promise, timeout]);
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Check if value is within acceptable range
 */
export function isWithinRange(value: number, expected: number, tolerance = 0.05): boolean {
  const diff = Math.abs(value - expected);
  const maxDiff = expected * tolerance;
  return diff <= maxDiff;
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(values: number[], window: number): number[] {
  if (values.length < window) {
    return [];
  }
  
  const result: number[] = [];
  
  for (let i = window - 1; i < values.length; i++) {
    const sum = values.slice(i - window + 1, i + 1).reduce((acc, val) => acc + val, 0);
    result.push(sum / window);
  }
  
  return result;
}

/**
 * Calculate standard deviation
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
  
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: Error): string {
  if (error.message.includes('user rejected')) {
    return 'Transaction was rejected by user';
  }
  
  if (error.message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  
  if (error.message.includes('network')) {
    return 'Network connection error. Please try again.';
  }
  
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  // Return the original message for other errors
  return error.message || 'An unknown error occurred';
}
