import { NepseFundamentals } from '../../types/fundamental';

export const NEPSE_FUNDAMENTALS_DATABASE: Record<string, NepseFundamentals> = {
  'NEPSE:NABIL': {
    symbol: 'NABIL',
    epsNpr: 28.45,
    bookValuePerShare: 218.4,
    peRatio: 18.7,          // 532.90 / 28.45 = 18.7
    dividendYield: 2.1,
    paidUpCapitalNpr: 27056900000,
    marketCapNpr: 144290000000, // 532.90 × 270.57M shares
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
    peRatio: 15.6,          // 309.00 / 19.8 = 15.6
    dividendYield: 0.0,
    paidUpCapitalNpr: 14917000000,
    marketCapNpr: 46100000000, // 309 × 149.17M shares
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
  },
  'NEPSE:HBL': {
    symbol: 'HBL',
    epsNpr: 14.5,
    bookValuePerShare: 172.5,
    peRatio: 13.3,          // 193.30 / 14.5 = 13.3
    dividendYield: 1.8,
    paidUpCapitalNpr: 21650000000,
    marketCapNpr: 41830000000,  // 193.30 × 216.5M shares
    nonPerformingLoanPercent: 4.85,
    capitalAdequacyRatio: 12.1,
    quarterlyProfitYoY: 6.4,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Top 5 commercial bank by branch footprint following merger',
    isAvailable: true
  },
  'NEPSE:SABBL': {
    symbol: 'SABBL',
    epsNpr: 12.4,
    bookValuePerShare: 142.0,
    peRatio: 70.4,
    dividendYield: 0.0,
    paidUpCapitalNpr: 350000000,
    marketCapNpr: 3050000000,
    nonPerformingLoanPercent: 4.95,
    capitalAdequacyRatio: 14.2,
    quarterlyProfitYoY: 11.2,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Regional rural development bank in Eastern Nepal',
    isAvailable: true
  },
  'NEPSE:SAIL': {
    symbol: 'SAIL',
    epsNpr: 18.2,
    bookValuePerShare: 168.0,
    peRatio: 51.0,
    dividendYield: 0.0,
    paidUpCapitalNpr: 1631250000,
    marketCapNpr: 15150000000,
    quarterlyProfitYoY: 14.5,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Pioneer agro-industrial feed and farming producer in Nepal',
    isAvailable: true
  },
  'NEPSE:GMLI': {
    symbol: 'GMLI',
    epsNpr: 11.8,
    bookValuePerShare: 134.5,
    peRatio: 79.5,
    dividendYield: 0.0,
    paidUpCapitalNpr: 750000000,
    marketCapNpr: 7040000000,
    quarterlyProfitYoY: 22.0,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Specialized low-cost micro life insurance institution',
    isAvailable: true
  },
  'NEPSE:GSY': {
    symbol: 'GSY',
    epsNpr: 1.04,
    bookValuePerShare: 10.42,
    peRatio: 8.8,
    dividendYield: 7.2,
    paidUpCapitalNpr: 1000000000,
    marketCapNpr: 914000000,
    quarterlyProfitYoY: 15.6,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Closed-end capital growth mutual fund scheme',
    isAvailable: true
  },
  'NEPSE:HRL': {
    symbol: 'HRL',
    epsNpr: 16.8,
    bookValuePerShare: 155.0,
    peRatio: 30.3,
    dividendYield: 1.5,
    paidUpCapitalNpr: 10400000000,
    marketCapNpr: 53040000000,
    quarterlyProfitYoY: 28.5,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Only private reinsurance company in Nepal with regional coverage',
    isAvailable: true
  },
  'NEPSE:NMBHF2': {
    symbol: 'NMBHF2',
    epsNpr: 0.98,
    bookValuePerShare: 10.15,
    peRatio: 9.1,
    dividendYield: 6.8,
    paidUpCapitalNpr: 1000000000,
    marketCapNpr: 898000000,
    quarterlyProfitYoY: 12.0,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Balanced closed-end mutual fund scheme',
    isAvailable: true
  },
  'NEPSE:PCIL': {
    symbol: 'PCIL',
    epsNpr: 15.2,
    bookValuePerShare: 184.0,
    peRatio: 40.4,
    dividendYield: 0.0,
    paidUpCapitalNpr: 3250000000,
    marketCapNpr: 19980000000,
    quarterlyProfitYoY: 9.2,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Heavy industrial manufacturer of clinker and OPC cement',
    isAvailable: true
  },
  'NEPSE:SFF': {
    symbol: 'SFF',
    epsNpr: 1.12,
    bookValuePerShare: 10.85,
    peRatio: 9.2,
    dividendYield: 8.0,
    paidUpCapitalNpr: 1000000000,
    marketCapNpr: 1036000000,
    quarterlyProfitYoY: 18.2,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Flexible asset allocation closed-end mutual fund scheme',
    isAvailable: true
  },
  'NEPSE:SKHEL': {
    symbol: 'SKHEL',
    epsNpr: 14.6,
    bookValuePerShare: 128.0,
    peRatio: 50.8,
    dividendYield: 0.0,
    paidUpCapitalNpr: 550000000,
    marketCapNpr: 4081000000,
    quarterlyProfitYoY: 16.4,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Clean run-of-the-river hydropower producer',
    isAvailable: true
  },
  'NEPSE:YMHL': {
    symbol: 'YMHL',
    epsNpr: 12.2,
    bookValuePerShare: 118.5,
    peRatio: 42.1,
    dividendYield: 0.0,
    paidUpCapitalNpr: 720000000,
    marketCapNpr: 3700000000,
    quarterlyProfitYoY: 14.8,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Commercial run-of-the-river hydroelectric generating asset',
    isAvailable: true
  },
  'NEPSE:KAHL': {
    symbol: 'KAHL',
    epsNpr: 15.8,
    bookValuePerShare: 135.0,
    peRatio: 27.6,
    dividendYield: 0.0,
    paidUpCapitalNpr: 1400000000,
    marketCapNpr: 6118000000,
    quarterlyProfitYoY: 21.0,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Major cascade hydropower developer in Western Nepal',
    isAvailable: true
  },
  'NEPSE:SGHL': {
    symbol: 'SGHL',
    epsNpr: 16.2,
    bookValuePerShare: 139.0,
    peRatio: 28.1,
    dividendYield: 0.0,
    paidUpCapitalNpr: 1200000000,
    marketCapNpr: 5462000000,
    quarterlyProfitYoY: 19.5,
    fiscalYear: '2080/81',
    quarter: 'Q4',
    sectorRank: 'Hydroelectric energy facility supplying integrated national grid',
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
