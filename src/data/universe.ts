import { Asset, Market, MarketFilter } from '../types/asset';
import { NEPSE_ASSETS } from './assets/nepse';
import { NSE_ASSETS } from './assets/nse';
import { US_ASSETS } from './assets/us';
import { CRYPTO_ASSETS } from './assets/crypto';

export const ALL_ASSETS: Asset[] = [
  ...NEPSE_ASSETS,
  ...NSE_ASSETS,
  ...US_ASSETS,
  ...CRYPTO_ASSETS
];

export const ASSET_MAP = new Map<string, Asset>(
  ALL_ASSETS.map((asset) => [asset.id, asset])
);

export function getAssetById(id: string): Asset | undefined {
  if (ASSET_MAP.has(id)) {
    return ASSET_MAP.get(id);
  }
  // Try finding by symbol
  const cleanId = id.toUpperCase().trim();
  return ALL_ASSETS.find(
    (a) =>
      a.id.toUpperCase() === cleanId ||
      a.symbol.toUpperCase() === cleanId ||
      a.symbol.replace('/', '').toUpperCase() === cleanId
  );
}

export function filterAssets(filter: MarketFilter): Asset[] {
  return ALL_ASSETS.filter((asset) => {
    if (filter.market && filter.market !== 'ALL' && asset.market !== filter.market) {
      return false;
    }
    if (filter.country && filter.country !== 'ALL' && asset.country !== filter.country) {
      return false;
    }
    if (filter.assetType && filter.assetType !== 'ALL' && asset.assetType !== filter.assetType) {
      return false;
    }
    if (filter.sector && filter.sector !== 'ALL' && asset.sector !== filter.sector) {
      return false;
    }
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchSymbol = asset.symbol.toLowerCase().includes(q);
      const matchName = asset.name.toLowerCase().includes(q);
      const matchSector = asset.sector.toLowerCase().includes(q);
      if (!matchSymbol && !matchName && !matchSector) {
        return false;
      }
    }
    return true;
  });
}

export function getAssetsByMarket(market: Market): Asset[] {
  return ALL_ASSETS.filter((a) => a.market === market);
}

export const SUPPORTED_MARKETS: { key: Market; label: string; flag: string; currency: string }[] = [
  { key: 'NEPSE', label: 'Nepal (NEPSE)', flag: '🇳🇵', currency: 'NPR' },
  { key: 'NSE', label: 'India (NSE)', flag: '🇮🇳', currency: 'INR' },
  { key: 'NASDAQ', label: 'US (NASDAQ/NYSE)', flag: '🇺🇸', currency: 'USD' },
  { key: 'CRYPTO', label: 'Cryptocurrency', flag: '₿', currency: 'USDT' }
];
