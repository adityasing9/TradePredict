import { NepseFundamentals } from '../../types/fundamental';

export const NEPSE_FUNDAMENTALS_DATABASE: Record<string, NepseFundamentals> = {
  'NEPSE:NABIL': {
    symbol: 'NABIL',
    epsNpr: 28.45,
    bookValuePerShare: 218.4,
    peRatio: 18.2,
    dividendYield: 2.1,
    paidUpCapitalNpr: 27056900000, // 27.05 Arba NPR
    marketCapNpr: 141200000000,
    nonPerformingLoanPercent: 2.98,
    capitalAdequacyRatio: 12.85,
    quarterlyProfitYoY: 8.4,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: '1st in Deposits & Net Profit among Private Commercial Banks',
    isAvailable: true
  },
  'NEPSE:NICA': {
    symbol: 'NICA',
    epsNpr: 19.8,
    bookValuePerShare: 184.2,
    peRatio: 21.6,
    dividendYield: 0.0,
    paidUpCapitalNpr: 14917000000,
    marketCapNpr: 63800000000,
    nonPerformingLoanPercent: 3.42,
    capitalAdequacyRatio: 11.6,
    quarterlyProfitYoY: -12.4,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Top 3 by branch reach and consumer retail deposits',
    isAvailable: true
  },
  'NEPSE:GBIME': {
    symbol: 'GBIME',
    epsNpr: 17.5,
    bookValuePerShare: 162.8,
    peRatio: 13.8,
    dividendYield: 1.5,
    paidUpCapitalNpr: 36128000000, // Highest paid-up commercial bank in Nepal
    marketCapNpr: 87400000000,
    nonPerformingLoanPercent: 4.12,
    capitalAdequacyRatio: 12.2,
    quarterlyProfitYoY: 5.2,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Largest balance sheet and loan book in Nepal',
    isAvailable: true
  },
  'NEPSE:CHCL': {
    symbol: 'CHCL',
    epsNpr: 14.8,
    bookValuePerShare: 148.5,
    peRatio: 28.4,
    dividendYield: 3.8,
    paidUpCapitalNpr: 7980000000,
    marketCapNpr: 33500000000,
    quarterlyProfitYoY: 6.8,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Premier public-private hydropower producer',
    isAvailable: true
  },
  'NEPSE:SHIVM': {
    symbol: 'SHIVM',
    epsNpr: 9.2,
    bookValuePerShare: 198.4,
    peRatio: 52.8,
    dividendYield: 2.2,
    paidUpCapitalNpr: 5280000000,
    marketCapNpr: 25600000000,
    quarterlyProfitYoY: -18.5,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Leading domestic manufacturer of clinker and OPC cement',
    isAvailable: true
  },
  'NEPSE:NTC': {
    symbol: 'NTC',
    epsNpr: 52.4,
    bookValuePerShare: 540.2,
    peRatio: 16.5,
    dividendYield: 4.5,
    paidUpCapitalNpr: 18000000000,
    marketCapNpr: 156000000000,
    quarterlyProfitYoY: -3.2,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Highest dividend-paying state telecommunications utility',
    isAvailable: true
  }
};

export function getNepseFundamentals(assetId: string): NepseFundamentals {
  if (NEPSE_FUNDAMENTALS_DATABASE[assetId]) {
    return NEPSE_FUNDAMENTALS_DATABASE[assetId];
  }

  const symbol = assetId.split(':')[1] || assetId;
  return {
    symbol,
    isAvailable: false,
    unavailabilityReason: 'Quarterly financial report data unavailable for this specific NEPSE security.'
  };
}
