import type { VercelRequest, VercelResponse } from '@vercel/node';

const YAHOO_SYMBOL_MAP: Record<string, string> = {
  'AAPL': 'AAPL',
  'MSFT': 'MSFT',
  'NVDA': 'NVDA',
  'META': 'META',
  'AMZN': 'AMZN',
  'TSLA': 'TSLA',
  'PYPL': 'PYPL',
  'SPCX': 'SPCX',
  'SPY': 'SPY',
  'QQQ': 'QQQ',
  'GOOGL': 'GOOGL',
  'NIFTY50': '^NSEI',
  'NIFTY': '^NSEI',
  'BANKNIFTY': '^NSEBANK',
  'RELIANCE': 'RELIANCE.NS',
  'TCS': 'TCS.NS',
  'HDFCBANK': 'HDFCBANK.NS',
  'INFY': 'INFY.NS',
  'ICICIBANK': 'ICICIBANK.NS',
  'TATAMOTORS': 'TMCV.NS',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { symbol, market, timeframe = '1D', limit = '120' } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing required query parameter: symbol' });
  }

  const rawSymbol = String(symbol).trim();
  const cleanSymbol = rawSymbol.includes(':') ? rawSymbol.split(':')[1].toUpperCase() : rawSymbol.toUpperCase();

  try {
    // 1. Crypto: Binance Kline endpoint
    if (market === 'CRYPTO' || cleanSymbol.includes('USDT') || cleanSymbol.includes('BTC') || rawSymbol.startsWith('CRYPTO:')) {
      const pair = cleanSymbol.replace('/', '');
      const intervalMap: Record<string, string> = {
        '1m': '1m', '5m': '5m', '15m': '15m', '1H': '1h', '4H': '4h', '1D': '1d', '1W': '1w'
      };
      const interval = intervalMap[String(timeframe)] || '1d';
      const binanceRes = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`,
        { signal: AbortSignal.timeout(5000) }
      );

      if (binanceRes.ok) {
        const data = await binanceRes.json();
        const candles = data.map((item: any[]) => ({
          time: Math.floor(item[0] / 1000),
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
          volume: parseFloat(item[5])
        }));

        return res.status(200).json({
          symbol: rawSymbol,
          timeframe,
          candles,
          source: 'Binance Klines Real-Time',
          timestamp: Date.now()
        });
      }
    }

    // 2. US Stocks & Indian NSE: Yahoo Finance Chart
    const yahooTicker = YAHOO_SYMBOL_MAP[cleanSymbol] || cleanSymbol;
    
    // Map timeframe to Yahoo interval & range
    let interval = '1d';
    let range = '6mo';
    if (timeframe === '1m') { interval = '1m'; range = '1d'; }
    else if (timeframe === '5m') { interval = '5m'; range = '5d'; }
    else if (timeframe === '15m') { interval = '15m'; range = '5d'; }
    else if (timeframe === '1H') { interval = '1h'; range = '1mo'; }
    else if (timeframe === '4H') { interval = '1h'; range = '3mo'; }
    else if (timeframe === '1W') { interval = '1wk'; range = '2y'; }

    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=${interval}&range=${range}`;

    const yahooRes = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(5000)
    });

    if (yahooRes.ok) {
      const data = await yahooRes.json();
      const resData = data.chart?.result?.[0];
      if (resData && resData.timestamp && resData.indicators?.quote?.[0]) {
        const timestamps: number[] = resData.timestamp;
        const quotes = resData.indicators.quote[0];
        const candles: Array<{ time: number; open: number; high: number; low: number; close: number; volume: number }> = [];

        for (let i = 0; i < timestamps.length; i++) {
          const c = quotes.close?.[i];
          const o = quotes.open?.[i] ?? c;
          const h = quotes.high?.[i] ?? c;
          const l = quotes.low?.[i] ?? c;
          const v = quotes.volume?.[i] ?? 0;

          if (c !== null && c !== undefined && !isNaN(c)) {
            candles.push({
              time: timestamps[i],
              open: Number(Number(o).toFixed(2)),
              high: Number(Number(h).toFixed(2)),
              low: Number(Number(l).toFixed(2)),
              close: Number(Number(c).toFixed(2)),
              volume: Math.round(v)
            });
          }
        }

        if (candles.length > 0) {
          return res.status(200).json({
            symbol: rawSymbol,
            timeframe,
            candles,
            source: 'Yahoo Finance Real-Time Series',
            timestamp: Date.now()
          });
        }
      }
    }

    return res.status(404).json({ error: 'Market data not available for requested symbol/timeframe' });
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to fetch historical candlestick series',
      details: error.message
    });
  }
}
