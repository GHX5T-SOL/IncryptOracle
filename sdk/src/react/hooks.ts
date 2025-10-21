// React hooks for Incrypt Oracle
// Note: These hooks require React to be available in the environment

import { useState, useEffect, useRef, useCallback } from 'react';
import { IncryptOracle } from '../IncryptOracle';
import type { OracleConfig, PriceData, DataFeed, Subscription } from '../types';

/**
 * Hook for managing IncryptOracle instance
 */
export function useIncryptOracle(config: OracleConfig) {
  const [oracle, setOracle] = useState<IncryptOracle | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let oracleInstance: IncryptOracle;

    try {
      oracleInstance = new IncryptOracle(config);
      
      oracleInstance.on('connected', () => setIsConnected(true));
      oracleInstance.on('disconnected', () => setIsConnected(false));
      oracleInstance.on('error', setError);
      
      setOracle(oracleInstance);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }

    return () => {
      if (oracleInstance) {
        oracleInstance.disconnect();
      }
    };
  }, [config.network, config.contractAddress, config.rpcUrl]);

  return { oracle, isConnected, error };
}

/**
 * Hook for subscribing to a single price feed
 */
export function usePriceData(
  oracle: IncryptOracle | null, 
  feedId: string | null,
  options: {
    enabled?: boolean;
    pollingInterval?: number;
    onError?: (error: Error) => void;
  } = {}
) {
  const { enabled = true, onError } = options;
  
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);

  const fetchPrice = useCallback(async () => {
    if (!oracle || !feedId || !enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const priceData = await oracle.getPrice(feedId);
      setData(priceData);
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [oracle, feedId, enabled, onError]);

  useEffect(() => {
    if (!oracle || !feedId || !enabled) {
      return;
    }

    // Subscribe to real-time updates
    try {
      subscriptionRef.current = oracle.subscribe(feedId, {
        onData: (priceData) => {
          setData(priceData);
          setLoading(false);
          setError(null);
        },
        onError: (err) => {
          setError(err);
          onError?.(err);
        },
        onConnected: () => {
          setLoading(false);
        }
      });
      
      // Initial fetch
      fetchPrice();
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [oracle, feedId, enabled, fetchPrice, onError]);

  const refetch = useCallback(() => {
    fetchPrice();
  }, [fetchPrice]);

  return { 
    data, 
    loading, 
    error, 
    refetch 
  };
}

/**
 * Hook for subscribing to multiple price feeds
 */
export function useMultiplePriceData(
  oracle: IncryptOracle | null,
  feedIds: string[],
  options: {
    enabled?: boolean;
    onError?: (feedId: string, error: Error) => void;
  } = {}
) {
  const { enabled = true, onError } = options;
  
  const [data, setData] = useState<Record<string, PriceData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, Error>>({});
  const subscriptionsRef = useRef<Record<string, Subscription>>({});

  useEffect(() => {
    if (!oracle || !enabled || feedIds.length === 0) {
      return;
    }

    // Clean up existing subscriptions
    Object.values(subscriptionsRef.current).forEach(sub => sub.unsubscribe());
    subscriptionsRef.current = {};

    // Initialize loading states
    const initialLoading: Record<string, boolean> = {};
    feedIds.forEach(feedId => {
      initialLoading[feedId] = true;
    });
    setLoading(initialLoading);

    // Subscribe to each feed
    feedIds.forEach(feedId => {
      try {
        subscriptionsRef.current[feedId] = oracle.subscribe(feedId, {
          onData: (priceData) => {
            setData(prev => ({ ...prev, [feedId]: priceData }));
            setLoading(prev => ({ ...prev, [feedId]: false }));
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[feedId];
              return newErrors;
            });
          },
          onError: (error) => {
            setErrors(prev => ({ ...prev, [feedId]: error }));
            setLoading(prev => ({ ...prev, [feedId]: false }));
            onError?.(feedId, error);
          }
        });
      } catch (error) {
        setErrors(prev => ({ ...prev, [feedId]: error as Error }));
        setLoading(prev => ({ ...prev, [feedId]: false }));
        onError?.(feedId, error as Error);
      }
    });

    return () => {
      Object.values(subscriptionsRef.current).forEach(sub => sub.unsubscribe());
    };
  }, [oracle, enabled, feedIds.join(','), onError]);

  return { data, loading, errors };
}

/**
 * Hook for managing oracle data feeds
 */
export function useDataFeeds(oracle: IncryptOracle | null) {
  const [feeds, setFeeds] = useState<DataFeed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeeds = useCallback(async () => {
    if (!oracle) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const feedsData = await oracle.getAllFeeds();
      setFeeds(feedsData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [oracle]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  return { feeds, loading, error, refetch: fetchFeeds };
}

/**
 * Hook for price history data
 */
export function usePriceHistory(
  oracle: IncryptOracle | null,
  feedId: string | null,
  timeframe: '1h' | '24h' | '7d' | '30d' = '24h'
) {
  const [history, setHistory] = useState<Array<{ timestamp: number; value: number; confidence: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!oracle || !feedId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Note: This would need to be implemented with a proper data feed manager
      // For now, returning empty array
      setHistory([]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [oracle, feedId, timeframe]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refetch: fetchHistory };
}

/**
 * Hook for validator information
 */
export function useValidator(oracle: IncryptOracle | null, address: string | null) {
  const [validator, setValidator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchValidator = useCallback(async () => {
    if (!oracle || !address) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const validatorInfo = await oracle.getValidator(address);
      setValidator(validatorInfo);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [oracle, address]);

  useEffect(() => {
    fetchValidator();
  }, [fetchValidator]);

  return { validator, loading, error, refetch: fetchValidator };
}
