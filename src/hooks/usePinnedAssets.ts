import { useState, useEffect, useCallback } from 'react';

const PINNED_STORAGE_KEY = 'tradepredict_pinned_assets_v1';
const PINNED_BAR_VISIBILITY_KEY = 'tradepredict_pinned_bar_visible_v1';

export const DEFAULT_PINNED_ASSET_IDS: string[] = [
  'CRYPTO:BTCUSDT',
  'NASDAQ:NVDA',
  'NSE:RELIANCE',
  'NEPSE:NABIL'
];

export function getInitialPinnedAssets(): string[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return DEFAULT_PINNED_ASSET_IDS;
    }
    const saved = window.localStorage.getItem(PINNED_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse pinned assets from localStorage:', err);
  }
  return DEFAULT_PINNED_ASSET_IDS;
}

export function usePinnedAssets() {
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => getInitialPinnedAssets());
  const [isBarVisible, setIsBarVisible] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(PINNED_BAR_VISIBILITY_KEY);
        if (saved !== null) {
          return saved === 'true';
        }
      }
    } catch {
      // fallback
    }
    return true; // default visible
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinnedIds));
      }
    } catch (err) {
      console.warn('Failed to save pinned assets to localStorage:', err);
    }
  }, [pinnedIds]);

  const toggleBarVisible = useCallback(() => {
    setIsBarVisible((prev) => {
      const next = !prev;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(PINNED_BAR_VISIBILITY_KEY, String(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isPinned = useCallback(
    (assetId: string) => {
      return pinnedIds.includes(assetId);
    },
    [pinnedIds]
  );

  const pinAsset = useCallback((assetId: string) => {
    setPinnedIds((prev) => {
      if (prev.includes(assetId)) return prev;
      return [...prev, assetId];
    });
  }, []);

  const unpinAsset = useCallback((assetId: string) => {
    setPinnedIds((prev) => prev.filter((id) => id !== assetId));
  }, []);

  const togglePin = useCallback((assetId: string) => {
    let result = false;
    setPinnedIds((prev) => {
      if (prev.includes(assetId)) {
        result = false;
        return prev.filter((id) => id !== assetId);
      } else {
        result = true;
        return [...prev, assetId];
      }
    });
    return result;
  }, []);

  const reorderPinned = useCallback((newOrder: string[]) => {
    setPinnedIds(newOrder);
  }, []);

  const clearAllPinned = useCallback(() => {
    setPinnedIds([]);
  }, []);

  return {
    pinnedIds,
    isPinned,
    pinAsset,
    unpinAsset,
    togglePin,
    reorderPinned,
    clearAllPinned,
    isBarVisible,
    toggleBarVisible
  };
}
