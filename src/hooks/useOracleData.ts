import { useEffect, useState, useCallback } from 'react';
import { useAccount, usePublicClient, useContractEvent } from 'wagmi';
import { useOracle } from './useContract';

/**
 * Hook for real-time oracle data updates
 * Subscribes to oracle events for live updates
 */
export function useOracleData(feedId?: string) {
  const { address } = useOracle();
  const publicClient = usePublicClient();
  const { address: userAddress } = useAccount();
  const [feedData, setFeedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const ORACLE_ABI = [
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'bytes32', name: 'feedId', type: 'bytes32' },
        { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'confidence', type: 'uint256' },
      ],
      name: 'DataFeedUpdated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'bytes32', name: 'feedId', type: 'bytes32' },
        { indexed: true, internalType: 'address', name: 'validator', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
      ],
      name: 'ValidationSubmitted',
      type: 'event',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'feedId', type: 'bytes32' }],
      name: 'getDataFeed',
      outputs: [
        { internalType: 'string', name: '', type: 'string' },
        { internalType: 'string', name: '', type: 'string' },
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'bool', name: '', type: 'bool' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ] as const;

  const fetchFeedData = useCallback(async () => {
    if (!address || !publicClient || !feedId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await publicClient.readContract({
        address: address as `0x${string}`,
        abi: ORACLE_ABI,
        functionName: 'getDataFeed',
        args: [feedId as `0x${string}`],
      });

      setFeedData({
        name: result[0],
        description: result[1],
        value: result[2],
        timestamp: result[3],
        confidence: result[4],
        isActive: result[5],
      });
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching oracle feed:', err);
    } finally {
      setLoading(false);
    }
  }, [address, publicClient, feedId]);

  useEffect(() => {
    fetchFeedData();
  }, [fetchFeedData]);

  // Watch for updates in real-time
  useContractEvent({
    address: address as `0x${string}`,
    abi: ORACLE_ABI,
    eventName: 'DataFeedUpdated',
    listener: (logs) => {
      if (feedId && logs && logs.length > 0) {
        const relevantLog = logs.find((log: any) => log.args?.feedId === feedId);
        if (relevantLog) {
          // Debounce to avoid excessive calls
          setTimeout(() => fetchFeedData(), 500);
        }
      }
    },
  });

  useContractEvent({
    address: address as `0x${string}`,
    abi: ORACLE_ABI,
    eventName: 'ValidationSubmitted',
    listener: (logs) => {
      if (feedId && logs && logs.length > 0) {
        const relevantLog = logs.find((log: any) => log.args?.feedId === feedId);
        if (relevantLog) {
          setTimeout(() => fetchFeedData(), 500);
        }
      }
    },
  });

  return { feedData, loading, error, refetch: fetchFeedData };
}

