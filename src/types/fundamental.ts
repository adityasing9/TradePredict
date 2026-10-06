export interface StockFundamentals {
  peRatio?: number;
  forwardPE?: number;
  pbRatio?: number;
  psRatio?: number;
  evToEbitda?: number;
  eps?: number;
  dividendYield?: number;
  marketCap?: number;
  debtToEquity?: number;
  roe?: number;
  roa?: number;
  currentRatio?: number;
  operatingMargin?: number;
  netMargin?: number;
  revenueYoY?: number;
  earningsYoY?: number;
  freeCashFlow?: number;
  valuationStatus: 'UNDERVALUED' | 'FAIR' | 'OVERVALUED' | 'DATA_UNAVAILABLE';
  valuationBasis?: string;
  quarterEnded?: string;
}

export interface NepseFundamentals {
  symbol: string;
  epsNpr?: number;
  bookValuePerShare?: number;
  peRatio?: number;
  dividendYield?: number;
  paidUpCapitalNpr?: number;
  marketCapNpr?: number;
  nonPerformingLoanPercent?: number; // NPL for BFIs
  capitalAdequacyRatio?: number; // CAR for BFIs
  quarterlyProfitYoY?: number;
  fiscalYear?: string;
  quarter?: string;
  sectorRank?: string;
  isAvailable: boolean;
  unavailabilityReason?: string;
}

export interface CryptoTokenomics {
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number | null;
  circulatingPercent: number;
  fdv: number;
  fdvToMarketCapRatio: number;
  annualInflationRate: number;
  nextHalvingOrUnlockDate?: string;
  emissionSchedule: string;
}

export interface CryptoProtocolEconomics {
  fees24h: number;
  revenue30d: number;
  tvl?: number;
  marketCapToTvl?: number;
  treasuryBalance?: number;
}

export interface CryptoNetworkMetrics {
  activeAddresses24h: number;
  dailyTransactions: number;
  developerCommits30d: number;
  validatorCount?: number;
  consensusMechanism: string;
}

export interface OnChainMetricItem {
  metric: string;
  value: string | number;
  observation: string; // Direct factual observation
  interpretation: string; // Analytical hypothesis (clearly separated)
  signal: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
}

export interface OnChainAnalysis {
  exchangeNetFlow24hUsd: number; // positive = net inflows (selling pressure potential), negative = outflows
  whaleTransactions24h: number; // > $100k
  top10HoldersPercent: number;
  top100HoldersPercent: number;
  mvrvZScore?: number;
  nvtRatio?: number;
  metrics: OnChainMetricItem[];
}

export interface FundamentalAnalysisResult {
  assetType: 'STOCK' | 'CRYPTO' | 'INDEX' | 'ETF';
  score: number; // -100 to +100
  status: 'EXCELLENT' | 'FAIR' | 'WEAK' | 'DATA_LIMITED' | 'NOT_APPLICABLE';
  stock?: StockFundamentals;
  nepse?: NepseFundamentals;
  crypto?: {
    tokenomics: CryptoTokenomics;
    protocol: CryptoProtocolEconomics;
    network: CryptoNetworkMetrics;
    onchain: OnChainAnalysis;
  };
  summary: string;
  timestamp: number;
}
