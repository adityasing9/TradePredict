export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1H' | '4H' | '1D' | '1W' | '1M';

export interface Candle {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover?: number;
}

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  turnover24h?: number;
  timestamp: number;
  prevClose: number;
  bid?: number;
  ask?: number;
  marketCap?: number;
}

export type DataQualityStatus = 'HIGH' | 'MEDIUM' | 'LIMITED' | 'STALE';

export interface DataQuality {
  status: DataQualityStatus;
  completeness: number; // 0 - 100 percentage
  lastUpdated: number; // Unix timestamp in ms
  sources: string[];
  staleReason?: string;
  isCached: boolean;
}
