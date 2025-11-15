import { useEffect, useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWatchContractEvent } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { usePredictionMarket, useOracle } from './useContract';
import { CONTRACT_ADDRESSES } from '../utils/wagmi';

export interface MarketData {
  id: number;
  question: string;
  description: string;
  category: string;
  endTime: number;
  resolutionTime: number;
  state: number; // MarketState enum: 0=Active, 1=Resolved, 2=Cancelled, 3=Disputed
  outcomePools: [bigint, bigint]; // [No pool, Yes pool]
  creator: string;
  totalLiquidity: bigint;
  yesOdds?: number;
  noOdds?: number;
  resolved: boolean;
}

const PREDICTION_MARKET_ABI = [
  {
    inputs: [],
    name: 'marketCounter',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'marketId', type: 'uint256' }],
    name: 'getMarket',
    outputs: [
      { internalType: 'string', name: '', type: 'string' },
      { internalType: 'string', name: '', type: 'string' },
      { internalType: 'string', name: '', type: 'string' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint8', name: '', type: 'uint8' },
      { internalType: 'uint256[2]', name: '', type: 'uint256[2]' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'marketId', type: 'uint256' }],
    name: 'getOdds',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'marketId', type: 'uint256' }],
    name: 'markets',
    outputs: [
      { internalType: 'string', name: 'question', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'category', type: 'string' },
      { internalType: 'uint256', name: 'endTime', type: 'uint256' },
      { internalType: 'uint256', name: 'resolutionTime', type: 'uint256' },
      { internalType: 'bytes32', name: 'oracleDataFeedId', type: 'bytes32' },
      { internalType: 'uint8', name: 'state', type: 'uint8' },
      { internalType: 'uint8', name: 'winningOutcome', type: 'uint8' },
      { internalType: 'uint256', name: 'totalLiquidity', type: 'uint256' },
      { internalType: 'uint256[2]', name: 'outcomeShares', type: 'uint256[2]' },
      { internalType: 'uint256[2]', name: 'outcomePools', type: 'uint256[2]' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'creationTime', type: 'uint256' },
      { internalType: 'uint256', name: 'fee', type: 'uint256' },
      { internalType: 'bool', name: 'resolved', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'marketId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'string', name: 'question', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'endTime', type: 'uint256' },
      { indexed: false, internalType: 'bytes32', name: 'oracleDataFeedId', type: 'bytes32' },
    ],
    name: 'MarketCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'marketId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'buyer', type: 'address' },
      { indexed: false, internalType: 'uint8', name: 'outcome', type: 'uint8' },
      { indexed: false, internalType: 'uint256', name: 'shares', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'cost', type: 'uint256' },
    ],
    name: 'SharesPurchased',
    type: 'event',
  },
] as const;

export function useMarketCounter() {
  const { address } = usePredictionMarket();
  const publicClient = usePublicClient();

  const [counter, setCounter] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCounter = useCallback(async () => {
    if (!address || !publicClient) return;

    try {
      setLoading(true);
      const result = await publicClient.readContract({
        address: address as `0x${string}`,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'marketCounter',
      });
      setCounter(Number(result));
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching market counter:', err);
    } finally {
      setLoading(false);
    }
  }, [address, publicClient]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  // Watch for new market creation events
  useWatchContractEvent({
    address: address as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'MarketCreated',
    onLogs: () => {
      fetchCounter();
    },
  });

  return { counter, loading, error, refetch: fetchCounter };
}

export function useMarkets() {
  const { counter, loading: counterLoading } = useMarketCounter();
  const { address } = usePredictionMarket();
  const publicClient = usePublicClient();
  const { address: userAddress } = useAccount();

  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMarkets = useCallback(async () => {
    if (!address || !publicClient || counterLoading || counter === 0) {
      if (!counterLoading) setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const marketPromises: Promise<MarketData | null>[] = [];

      // Fetch all markets
      for (let i = 0; i < counter; i++) {
        marketPromises.push(
          (async () => {
            try {
              // Fetch market data
              const marketResult = await publicClient.readContract({
                address: address as `0x${string}`,
                abi: PREDICTION_MARKET_ABI,
                functionName: 'markets',
                args: [BigInt(i)],
              });

              // Fetch odds
              let yesOdds = 0.5;
              let noOdds = 0.5;
              try {
                const oddsResult = await publicClient.readContract({
                  address: address as `0x${string}`,
                  abi: PREDICTION_MARKET_ABI,
                  functionName: 'getOdds',
                  args: [BigInt(i)],
                });
                // Odds are in basis points (10000 = 1.0)
                yesOdds = Number(oddsResult[1]) / 10000;
                noOdds = Number(oddsResult[0]) / 10000;
              } catch (err) {
                console.warn(`Failed to fetch odds for market ${i}:`, err);
              }

              // Calculate resolution time (endTime + 1 hour buffer based on contract)
              const resolutionTime = Number(marketResult[4]) + 3600; // endTime + 1 hour

              return {
                id: i,
                question: marketResult[0] as string,
                description: marketResult[1] as string,
                category: marketResult[2] as string,
                endTime: Number(marketResult[3]),
                resolutionTime,
                state: Number(marketResult[6]),
                outcomePools: marketResult[10] as [bigint, bigint],
                creator: marketResult[11] as string,
                totalLiquidity: marketResult[8] as bigint,
                yesOdds,
                noOdds,
                resolved: marketResult[13] as boolean,
              };
            } catch (err) {
              console.warn(`Failed to fetch market ${i}:`, err);
              return null;
            }
          })()
        );
      }

      const results = await Promise.all(marketPromises);
      const validMarkets = results.filter((m): m is MarketData => m !== null);
      
      // Sort by creation time (most recent first)
      validMarkets.sort((a, b) => b.id - a.id);
      
      setMarkets(validMarkets);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching markets:', err);
    } finally {
      setLoading(false);
    }
  }, [address, publicClient, counter, counterLoading]);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  // Watch for market events to update in real-time
  useWatchContractEvent({
    address: address as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'MarketCreated',
    onLogs: () => {
      // Debounce refetch to avoid excessive calls
      setTimeout(() => fetchMarkets(), 1000);
    },
  });

  useWatchContractEvent({
    address: address as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'SharesPurchased',
    onLogs: () => {
      setTimeout(() => fetchMarkets(), 500);
    },
  });

  useWatchContractEvent({
    address: address as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'SharesSold',
    onLogs: () => {
      setTimeout(() => fetchMarkets(), 500);
    },
  });

  useWatchContractEvent({
    address: address as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    eventName: 'MarketResolved',
    onLogs: () => {
      setTimeout(() => fetchMarkets(), 1000);
    },
  });

  return { markets, loading, error, refetch: fetchMarkets };
}

export function useUserMarkets(userAddress?: string) {
  const { address } = usePredictionMarket();
  const publicClient = usePublicClient();
  const { address: connectedAddress } = useAccount();
  const addressToUse = userAddress || connectedAddress;

  const [userMarketIds, setUserMarketIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserMarkets = useCallback(async () => {
    if (!address || !publicClient || !addressToUse) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await publicClient.readContract({
        address: address as `0x${string}`,
        abi: [
          {
            inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
            name: 'getUserMarkets',
            outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'getUserMarkets',
        args: [addressToUse as `0x${string}`],
      });

      setUserMarketIds(result.map((id: bigint) => Number(id)));
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching user markets:', err);
    } finally {
      setLoading(false);
    }
  }, [address, publicClient, addressToUse]);

  useEffect(() => {
    fetchUserMarkets();
  }, [fetchUserMarkets]);

  return { userMarketIds, loading, error, refetch: fetchUserMarkets };
}

