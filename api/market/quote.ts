import type { VercelRequest, VercelResponse } from '@vercel/node';

// Symbol mapping for Yahoo Finance
const YAHOO_SYMBOL_MAP: Record<string, string> = {
  // US Equities & ETFs
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

  // India NSE
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
  res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=10');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { symbol, market } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing required query parameter: symbol' });
  }

  const rawSymbol = String(symbol).trim();
  const cleanSymbol = rawSymbol.includes(':') ? rawSymbol.split(':')[1].toUpperCase() : rawSymbol.toUpperCase();

  try {
    // 1. Crypto: Binance Public Real-Time Endpoint
    if (market === 'CRYPTO' || cleanSymbol.includes('USDT') || cleanSymbol.includes('BTC') || rawSymbol.startsWith('CRYPTO:')) {
      const pair = cleanSymbol.replace('/', '');
      const binanceRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(4000)
      });
      if (binanceRes.ok) {
        const d = await binanceRes.json();
        return res.status(200).json({
          symbol: rawSymbol,
          price: parseFloat(d.lastPrice),
          change: parseFloat(d.priceChange),
          changePercent: parseFloat(d.priceChangePercent),
          high24h: parseFloat(d.highPrice),
          low24h: parseFloat(d.lowPrice),
          volume24h: parseFloat(d.volume),
          prevClose: parseFloat(d.prevClosePrice),
          timestamp: Date.now(),
          source: 'Binance Direct Real-Time'
        });
      }
    }

    // 2. US Stocks & Indian NSE: Yahoo Finance Query
    const yahooTicker = YAHOO_SYMBOL_MAP[cleanSymbol] || cleanSymbol;
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooTicker)}?interval=1d&range=1d`;
    
    const yahooRes = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(4000)
    });

    if (yahooRes.ok) {
      const data = await yahooRes.json();
      const meta = data.chart?.result?.[0]?.meta;
      if (meta && typeof meta.regularMarketPrice === 'number') {
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose || price;
        const change = Number((price - prevClose).toFixed(2));
        const changePercent = prevClose ? Number(((change / prevClose) * 100).toFixed(2)) : 0;
        const high24h = meta.regularMarketDayHigh || price;
        const low24h = meta.regularMarketDayLow || price;
        const volume24h = meta.regularMarketVolume || 0;

        return res.status(200).json({
          symbol: rawSymbol,
          price,
          change,
          changePercent,
          high24h,
          low24h,
          volume24h,
          prevClose,
          currency: meta.currency,
          exchangeName: meta.exchangeName,
          timestamp: Date.now(),
          source: 'Yahoo Finance Real-Time'
        });
      }
    }

    // 3. Fallback for NEPSE / Unsupported Symbols
    return res.status(200).json({
      symbol: rawSymbol,
      status: 'FALLBACK_CALIBRATED',
      timestamp: Date.now()
    });
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to retrieve external market quote',
      details: error.message
    });
  }
}
