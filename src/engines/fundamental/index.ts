import { Asset } from '../../types/asset';
import { FundamentalAnalysisResult } from '../../types/fundamental';
import { evaluateStockFundamentals } from './stockFundamentals';
import { getNepseFundamentals } from './nepseFundamentals';
import { evaluateCryptoFundamentals } from './cryptoFundamentals';

export function runFundamentalAnalysis(asset: Asset): FundamentalAnalysisResult {
  const timestamp = Date.now();

  if (asset.assetType === 'CRYPTO') {
    const cryptoData = evaluateCryptoFundamentals(asset.id);
    if (!cryptoData) {
      return {
        assetType: 'CRYPTO',
        score: 0,
        status: 'DATA_LIMITED',
        summary: 'On-chain and tokenomics data limited for this cryptocurrency.',
        timestamp
      };
    }

    let score = 0;
    // Tokenomics supply check
    if (cryptoData.tokenomics.circulatingPercent > 85) score += 20;
    if (cryptoData.tokenomics.annualInflationRate < 2.0) score += 15;

    // Protocol & Network activity
    if (cryptoData.network.dailyTransactions > 100000) score += 15;
    if (cryptoData.network.developerCommits30d > 100) score += 10;

    // On-chain net flows
    if (cryptoData.onchain.exchangeNetFlow24hUsd < 0) score += 20; // Outflows = bullish
    else if (cryptoData.onchain.exchangeNetFlow24hUsd > 10000000) score -= 15;

    const clampedScore = Math.max(-100, Math.min(100, score));

    return {
      assetType: 'CRYPTO',
      score: clampedScore,
      status: clampedScore > 20 ? 'EXCELLENT' : clampedScore < -20 ? 'WEAK' : 'FAIR',
      crypto: cryptoData,
      summary: `Crypto fundamentals reflect ${cryptoData.tokenomics.circulatingPercent.toFixed(1)}% circulating float, ${cryptoData.tokenomics.annualInflationRate}% inflation, and ${cryptoData.onchain.exchangeNetFlow24hUsd < 0 ? 'bullish net exchange outflows' : 'mild net exchange inflows'}.`,
      timestamp
    };
  }

  if (asset.market === 'NEPSE') {
    const nepse = getNepseFundamentals(asset.id);
    if (!nepse.isAvailable) {
      return {
        assetType: asset.assetType,
        score: 0,
        status: 'DATA_LIMITED',
        nepse,
        summary: 'Quarterly financial statements and verified NEPSE regulatory filings currently limited.',
        timestamp
      };
    }

    let score = 0;
    if (nepse.peRatio && nepse.peRatio < 20) score += 25;
    else if (nepse.peRatio && nepse.peRatio > 40) score -= 20;

    if (nepse.dividendYield && nepse.dividendYield > 2.0) score += 15;
    if (nepse.quarterlyProfitYoY && nepse.quarterlyProfitYoY > 0) score += 20;
    else if (nepse.quarterlyProfitYoY && nepse.quarterlyProfitYoY < 0) score -= 15;

    // BFI health checks
    if (nepse.nonPerformingLoanPercent !== undefined) {
      if (nepse.nonPerformingLoanPercent < 3.0) score += 15;
      else if (nepse.nonPerformingLoanPercent > 4.5) score -= 25; // High NPL caution
    }

    const clampedScore = Math.max(-100, Math.min(100, score));

    return {
      assetType: asset.assetType,
      score: clampedScore,
      status: clampedScore > 25 ? 'EXCELLENT' : clampedScore < -20 ? 'WEAK' : 'FAIR',
      nepse,
      summary: `NEPSE financial disclosure: EPS NPR ${nepse.epsNpr || 'N/A'}, Book Value ${nepse.bookValuePerShare || 'N/A'}, P/E ${nepse.peRatio || 'N/A'}${nepse.nonPerformingLoanPercent ? `, NPL ratio ${nepse.nonPerformingLoanPercent}%` : ''}.`,
      timestamp
    };
  }

  // Standard Stocks (US / India)
  const stock = evaluateStockFundamentals(asset.id);
  if (stock.valuationStatus === 'DATA_UNAVAILABLE') {
    return {
      assetType: asset.assetType,
      score: 0,
      status: 'DATA_LIMITED',
      stock,
      summary: 'Company financial filings and valuation ratios currently limited for this asset.',
      timestamp
    };
  }

  let score = 0;
  if (stock.valuationStatus === 'UNDERVALUED') score += 30;
  else if (stock.valuationStatus === 'OVERVALUED') score -= 30;

  if (stock.roe && stock.roe > 15) score += 20;
  if (stock.revenueYoY && stock.revenueYoY > 10) score += 20;
  if (stock.debtToEquity && stock.debtToEquity < 0.5) score += 15;
  if (stock.netMargin && stock.netMargin > 15) score += 15;

  const clampedScore = Math.max(-100, Math.min(100, score));

  return {
    assetType: asset.assetType,
    score: clampedScore,
    status: clampedScore > 30 ? 'EXCELLENT' : clampedScore < -20 ? 'WEAK' : 'FAIR',
    stock,
    summary: `Valuation categorized as ${stock.valuationStatus}. Operating margin at ${stock.operatingMargin || 'N/A'}% with revenue YoY growth of ${stock.revenueYoY || 'N/A'}%.`,
    timestamp
  };
}
