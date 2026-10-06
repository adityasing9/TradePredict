import { useState, useEffect } from 'react';
import { WatchlistItem, getWatchlist, toggleWatchlist, seedInitialWatchlist } from '../db/watchlistStore';

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    await seedInitialWatchlist();
    const list = await getWatchlist();
    setItems(list);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const toggle = async (assetId: string) => {
    const isNowWatched = await toggleWatchlist(assetId);
    await refresh();
    return isNowWatched;
  };

  const isWatched = (assetId: string) => {
    return items.some((item) => item.assetId === assetId);
  };

  return { items, loading, toggle, isWatched, refresh };
}
