import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { symbol, timeframe = '1D', limit = '100' } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing required query parameter: symbol' });
  }

  const cleanSymbol = String(symbol).toUpperCase().trim();
  const pair = cleanSymbol.replace('/', '');

  try {
    // Crypto Binance Kline endpoint
    const intervalMap: Record<string, string> = {
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '1H': '1h',
      '4H': '4h',
      '1D': '1d',
      '1W': '1w'
    };

    const interval = intervalMap[String(timeframe)] || '1d';
    const binanceRes = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`
    );

    if (binanceRes.ok) {
      const data = await binanceRes.json();
      const candles = data.map((item: any[]) => ({
        time: Math.floor(item[0] / 1000), // convert ms to seconds
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5])
      }));

      return res.status(200).json({
        symbol: cleanSymbol,
        timeframe,
        candles,
        source: 'Binance Klines API',
        timestamp: Date.now()
      });
    }

    return res.status(404).json({ error: 'Market data not available for requested symbol/timeframe' });
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to fetch historical candlestick series',
      details: error.message
    });
  }
}
