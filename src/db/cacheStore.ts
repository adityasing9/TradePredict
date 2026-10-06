import { getDB, CachedMarketData } from './index';
import { Candle, Quote } from '../types/marketData';

export async function setCachedCandles(
  assetId: string,
  timeframe: string,
  candles: Candle[],
  ttlMinutes = 15
): Promise<void> {
  const db = await getDB();
  const key = `${assetId}:${timeframe}`;
  const now = Date.now();
  const data: CachedMarketData = {
    key,
    assetId,
    timeframe,
    dataType: 'CANDLES',
    candles,
    timestamp: now,
    expiresAt: now + ttlMinutes * 60 * 1000
  };
  await db.put('marketCache', data);
}

export async function getCachedCandles(
  assetId: string,
  timeframe: string
): Promise<{ candles: Candle[]; timestamp: number; isExpired: boolean } | null> {
  const db = await getDB();
  const key = `${assetId}:${timeframe}`;
  const cached = await db.get('marketCache', key);
  if (!cached || !cached.candles) return null;

  const isExpired = Date.now() > cached.expiresAt;
  return {
    candles: cached.candles,
    timestamp: cached.timestamp,
    isExpired
  };
}

export async function setCachedQuote(
  assetId: string,
  quote: Quote,
  ttlMinutes = 5
): Promise<void> {
  const db = await getDB();
  const key = `${assetId}:quote`;
  const now = Date.now();
  const data: CachedMarketData = {
    key,
    assetId,
    dataType: 'QUOTE',
    quote,
    timestamp: now,
    expiresAt: now + ttlMinutes * 60 * 1000
  };
  await db.put('marketCache', data);
}

export async function getCachedQuote(
  assetId: string
): Promise<{ quote: Quote; timestamp: number; isExpired: boolean } | null> {
  const db = await getDB();
  const key = `${assetId}:quote`;
  const cached = await db.get('marketCache', key);
  if (!cached || !cached.quote) return null;

  return {
    quote: cached.quote,
    timestamp: cached.timestamp,
    isExpired: Date.now() > cached.expiresAt
  };
}

export async function clearExpiredCache(): Promise<void> {
  const db = await getDB();
  const now = Date.now();
  const all = await db.getAll('marketCache');
  const tx = db.transaction('marketCache', 'readwrite');
  for (const item of all) {
    if (now > item.expiresAt) {
      await tx.store.delete(item.key);
    }
  }
  await tx.done;
}

export async function clearAllCache(): Promise<void> {
  const db = await getDB();
  await db.clear('marketCache');
}
