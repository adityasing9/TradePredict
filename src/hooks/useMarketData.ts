import { useState, useEffect } from 'react';
import { Asset } from '../types/asset';
import { Candle, Quote, DataQuality } from '../types/marketData';
import { getMarketCandles, getMarketQuote } from '../services/marketDataProvider';

export function useMarketData(asset: Asset, timeframe = '1D') {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [dataQuality, setDataQuality] = useState<DataQuality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      setError(err.message || 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [asset.id, timeframe]);

  return { candles, quote, dataQuality, loading, error, refetch: () => fetchData(true) };
}
