import { useState, useEffect } from 'react';
import { Asset } from '../types/asset';
import { Candle, Quote, DataQuality } from '../types/marketData';
import { getMarketCandles, getMarketQuote, subscribeToLiveQuote } from '../services/marketDataProvider';

export function useMarketData(asset: Asset, timeframe = '1D') {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [dataQuality, setDataQuality] = useState<DataQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [lastTickTime, setLastTickTime] = useState<number>(Date.now());

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const [candleRes, quoteRes] = await Promise.all([
        getMarketCandles(asset, timeframe, forceRefresh),
        getMarketQuote(asset, forceRefresh)
      ]);
      setCandles(candleRes.candles);
      setDataQuality(candleRes.dataQuality);
      setQuote(quoteRes);
      if (quoteRes.isLiveStreaming) {
        setIsLiveStreaming(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Connect to real-time tick streaming (Binance sub-second WS for Crypto, low-latency exchange polling for Stocks)
    const unsubscribe = subscribeToLiveQuote(
      asset,
      (liveQuote) => {
        setQuote(liveQuote);
        setIsLiveStreaming(true);
        setLastTickTime(Date.now());

        // Update the active candle in real-time
        setCandles((prevCandles) => {
          if (!prevCandles || prevCandles.length === 0) return prevCandles;
          const last = prevCandles[prevCandles.length - 1];
          const updatedLast: Candle = {
            ...last,
            close: liveQuote.price,
            high: Math.max(last.high, liveQuote.price),
            low: Math.min(last.low, liveQuote.price),
            volume: last.volume + 1
          };
          return [...prevCandles.slice(0, -1), updatedLast];
        });
      },
      (streamErr) => {
        console.warn('Real-time stream warning:', streamErr);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [asset.id, timeframe]);

  return {
    candles,
    quote,
    dataQuality,
    loading,
    error,
    isLiveStreaming,
    lastTickTime,
    refetch: () => fetchData(true)
  };
}
