import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { symbol, market } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing required query parameter: symbol' });
  }

  const cleanSymbol = String(symbol).toUpperCase().trim();

  try {
    // 1. Crypto: Binance Public Endpoint
    if (market === 'CRYPTO' || cleanSymbol.includes('USDT') || cleanSymbol.includes('BTC')) {
      const pair = cleanSymbol.replace('/', '');
      const binanceRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);
      if (binanceRes.ok) {
        const d = await binanceRes.json();
        return res.status(200).json({
          symbol: cleanSymbol,
          price: parseFloat(d.lastPrice),
          change: parseFloat(d.priceChange),
          changePercent: parseFloat(d.priceChangePercent),
          high24h: parseFloat(d.highPrice),
          low24h: parseFloat(d.lowPrice),
          volume24h: parseFloat(d.volume),
          prevClose: parseFloat(d.prevClosePrice),
          timestamp: Date.now(),
          source: 'Binance Public API'
        });
      }
    }

    // Default response for other symbols
    return res.status(200).json({
      symbol: cleanSymbol,
      status: 'PROXY_SUCCESS',
      timestamp: Date.now()
    });
  } catch (error: any) {
    return res.status(502).json({
      error: 'Failed to retrieve external market quote',
      details: error.message
    });
  }
}
