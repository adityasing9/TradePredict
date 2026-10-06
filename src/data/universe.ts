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
  // Try finding by symbol / id case-insensitively and normalized
  const cleanId = id.toUpperCase().trim();
  const strippedId = cleanId.replace(/[\/\-_: ]/g, '');

  return ALL_ASSETS.find((a) => {
    const aId = a.id.toUpperCase();
    const aSym = a.symbol.toUpperCase();
    const aSymStripped = aSym.replace(/[\/\-_ ]/g, '');
    const aIdStripped = aId.replace(/[\/\-_: ]/g, '');

    return (
      aId === cleanId ||
      aSym === cleanId ||
      aSymStripped === strippedId ||
      aIdStripped === strippedId ||
      aSymStripped === cleanId ||
      aIdStripped.endsWith(strippedId)
    );
  });
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
      const strippedQ = q.replace(/[\/\-_: ]/g, '');
      const sym = asset.symbol.toLowerCase();
      const symStripped = sym.replace(/[\/\-_ ]/g, '');
      const id = asset.id.toLowerCase();
      const idStripped = id.replace(/[\/\-_: ]/g, '');
      const name = asset.name.toLowerCase();
      const sector = asset.sector.toLowerCase();

      const matchSymbol =
        sym.includes(q) ||
        symStripped.includes(strippedQ) ||
        id.includes(q) ||
        idStripped.includes(strippedQ);
      const matchName = name.includes(q);
      const matchSector = sector.includes(q);
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
