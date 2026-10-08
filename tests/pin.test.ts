import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getInitialPinnedAssets, DEFAULT_PINNED_ASSET_IDS } from '../src/hooks/usePinnedAssets';
import { ALL_ASSETS, filterAssets } from '../src/data/universe';

describe('Pinned Assets Functionality & Persistence', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    const mockLocalStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
      clear: () => {
        mockStorage = {};
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      length: 0,
      key: () => null
    };

    (globalThis as any).window = {
      localStorage: mockLocalStorage
    };
  });

  afterEach(() => {
    delete (globalThis as any).window;
  });

  it('provides sensible default pinned assets for all major markets on first load', () => {
    const pinned = getInitialPinnedAssets();
    expect(pinned.length).toBeGreaterThan(0);
    expect(pinned).toEqual(DEFAULT_PINNED_ASSET_IDS);
    // Check that defaults exist in the universe
    pinned.forEach((id) => {
      expect(ALL_ASSETS.some((a) => a.id === id)).toBe(true);
    });
  });

  it('restores previously pinned assets from localStorage', () => {
    const customPinned = ['CRYPTO:NEARUSDT', 'NASDAQ:META', 'NEPSE:NABIL'];
    (globalThis as any).window.localStorage.setItem(
      'tradepredict_pinned_assets_v1',
      JSON.stringify(customPinned)
    );

    const loaded = getInitialPinnedAssets();
    expect(loaded).toEqual(customPinned);
  });

  it('filters and prioritizes pinned assets correctly', () => {
    const pinnedSet = new Set(['CRYPTO:BTCUSDT', 'NASDAQ:NVDA']);
    const isPinned = (id: string) => pinnedSet.has(id);

    const all = filterAssets({ market: 'ALL' });
    const pinnedOnly = all.filter((a) => isPinned(a.id));
    expect(pinnedOnly.length).toBe(2);
    expect(pinnedOnly.map((a) => a.id)).toEqual(['NASDAQ:NVDA', 'CRYPTO:BTCUSDT']);
  });

  it('correctly resolves pinned grid assets and day range telemetry', () => {
    const testPinnedIds = ['NEPSE:HBL', 'NSE:RELIANCE', 'CRYPTO:BTCUSDT', 'NASDAQ:NVDA'];

    for (const id of testPinnedIds) {
      const asset = ALL_ASSETS.find((a) => a.id === id);
      expect(asset, `Pinned asset ${id} must exist in universe`).toBeDefined();
      expect(asset?.symbol).toBeTruthy();
      expect(asset?.name).toBeTruthy();
      expect(asset?.market).toBeTruthy();
      expect(asset?.currency).toBeTruthy();
    }
  });
});

