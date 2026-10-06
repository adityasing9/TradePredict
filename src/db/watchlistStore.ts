import { getDB, WatchlistItem } from './index';

export type { WatchlistItem };

export async function getWatchlist(): Promise<WatchlistItem[]> {
  const db = await getDB();
  const items = await db.getAllFromIndex('watchlist', 'by-order');
  return items;
}

export async function isWatched(assetId: string): Promise<boolean> {
  const db = await getDB();
  const item = await db.get('watchlist', assetId);
  return !!item;
}

export async function addToWatchlist(assetId: string, notes?: string): Promise<void> {
  const db = await getDB();
  const count = await db.count('watchlist');
  await db.put('watchlist', {
    assetId,
    addedAt: Date.now(),
    notes,
    order: count + 1
  });
}

export async function removeFromWatchlist(assetId: string): Promise<void> {
  const db = await getDB();
  await db.delete('watchlist', assetId);
}

export async function toggleWatchlist(assetId: string): Promise<boolean> {
  const watched = await isWatched(assetId);
  if (watched) {
    await removeFromWatchlist(assetId);
    return false;
  } else {
    await addToWatchlist(assetId);
    return true;
  }
}

export async function seedInitialWatchlist(): Promise<void> {
  const db = await getDB();
  const count = await db.count('watchlist');
  if (count > 0) return;

  const defaults = [
    'NEPSE:NABIL',
    'NSE:RELIANCE',
    'NASDAQ:NVDA',
    'CRYPTO:BTCUSDT'
  ];

  for (let i = 0; i < defaults.length; i++) {
    await db.put('watchlist', {
      assetId: defaults[i],
      addedAt: Date.now(),
      order: i + 1
    });
  }
}
