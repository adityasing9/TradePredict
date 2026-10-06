export type Market = 'NEPSE' | 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE' | 'CRYPTO';
export type AssetType = 'STOCK' | 'CRYPTO' | 'INDEX' | 'ETF';
export type Country = 'NP' | 'IN' | 'US' | 'GLOBAL';
export type Currency = 'NPR' | 'INR' | 'USD' | 'USDT';

export interface TradingHours {
  open: string;
  close: string;
  timezone: string;
}

export interface Asset {
  id: string; // e.g., 'NEPSE:NABIL'
  symbol: string; // 'NABIL'
  name: string; // 'Nabil Bank Limited'
  assetType: AssetType;
  market: Market;
  exchange: string;
  country: Country;
  currency: Currency;
  sector: string;
  industry: string;
  tradingHours: TradingHours;
  dataProviders: string[];
  supportedModules: string[];
  description?: string;
}

export interface MarketFilter {
  market?: Market | 'ALL';
  country?: Country | 'ALL';
  assetType?: AssetType | 'ALL';
  sector?: string | 'ALL';
  searchQuery?: string;
}
