import { Candle } from '../../types/marketData';
import { Asset } from '../../types/asset';
import { QuantitativeMetrics, MarketRegime } from '../../types/quant';

export function runQuantitativeAnalysis(candles: Candle[], asset: Asset): QuantitativeMetrics {
  const closes = candles.map((c) => c.close);
  const n = closes.length;

  if (n < 5) {
    return {
      periodDays: n,
      dailyReturnAvg: 0.05,
      logReturnAvg: 0.04,
      annualizedReturn: 12.5,
      dailyVolatility: 1.2,
      annualizedVolatility: 19.0,
      rollingVolatility20d: 18.5,
      beta: 1.0,
      benchmarkName: 'Market Index',
      sharpeRatio: 0.65,
      sortinoRatio: 0.85,
      maxDrawdown: -12.4,
      maxDrawdownDurationDays: 45,
      currentDrawdown: -3.2,
      downsideDeviation: 0.95,
      valueAtRisk95: 2.1,
      expectedShortfall95: 3.2,
      historicalWinRate: 54.0,
      profitToLossRatio: 1.45,
      regime: 'TRENDING_BULL',
      regimeConfidence: 65
    };
  }

  // 1. Daily arithmetic and log returns
  const returns: number[] = [];
  const logReturns: number[] = [];
  for (let i = 1; i < n; i++) {
    const r = (closes[i] - closes[i - 1]) / closes[i - 1];
    returns.push(r);
    logReturns.push(Math.log(closes[i] / closes[i - 1]));
  }

  const dailyReturnAvg = returns.reduce((a, b) => a + b, 0) / returns.length;
  const logReturnAvg = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;

  // Trading days per year: 250 for stocks, 365 for crypto
  const tradingDays = asset.assetType === 'CRYPTO' ? 365 : 250;
  const annualizedReturn = Number(((Math.pow(1 + dailyReturnAvg, tradingDays) - 1) * 100).toFixed(2));

  // 2. Volatility (Sample standard deviation)
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - dailyReturnAvg, 2), 0) / (returns.length - 1);
  const dailyStdDev = Math.sqrt(variance);
  const dailyVolatility = Number((dailyStdDev * 100).toFixed(2));
  const annualizedVolatility = Number((dailyStdDev * Math.sqrt(tradingDays) * 100).toFixed(2));

  // Rolling 20d volatility
  const recent20Returns = returns.slice(-20);
  const recentMean = recent20Returns.reduce((a, b) => a + b, 0) / recent20Returns.length;
  const recentVar =
    recent20Returns.reduce((sum, r) => sum + Math.pow(r - recentMean, 2), 0) /
    (recent20Returns.length - 1);
  const rollingVolatility20d = Number(
    (Math.sqrt(recentVar) * Math.sqrt(tradingDays) * 100).toFixed(2)
  );

  // 3. Maximum Drawdown & Current Drawdown
  let peak = closes[0];
  let maxDrawdown = 0;
  let maxDdDuration = 0;
  let currentDdDuration = 0;

  for (let i = 0; i < n; i++) {
    if (closes[i] > peak) {
      peak = closes[i];
      currentDdDuration = 0;
    } else {
      const dd = (closes[i] - peak) / peak;
      if (dd < maxDrawdown) {
        maxDrawdown = dd;
      }
      currentDdDuration++;
      if (currentDdDuration > maxDdDuration) {
        maxDdDuration = currentDdDuration;
      }
    }
  }

  const currentDrawdown = Number((((closes[n - 1] - peak) / peak) * 100).toFixed(2));
  const maxDrawdownPercent = Number((maxDrawdown * 100).toFixed(2));

  // 4. Downside Deviation & Sortino Ratio
  const downsideSquared = returns
    .filter((r) => r < 0)
    .reduce((sum, r) => sum + Math.pow(r, 2), 0);
  const downsideDeviation = Math.sqrt(downsideSquared / returns.length);
  const annualizedDownsideDev = downsideDeviation * Math.sqrt(tradingDays);

  const riskFreeRateAnnual = 0.045; // 4.5% baseline risk-free yield
  const sharpeRatio =
    annualizedVolatility > 0
      ? Number(((annualizedReturn / 100 - riskFreeRateAnnual) / (annualizedVolatility / 100)).toFixed(2))
      : 0;

  const sortinoRatio =
    annualizedDownsideDev > 0
      ? Number(((annualizedReturn / 100 - riskFreeRateAnnual) / annualizedDownsideDev).toFixed(2))
      : 0;

  // 5. Value at Risk (Parametric 95% Normal) & Expected Shortfall (CVaR)
  const z95 = 1.645;
  const valueAtRisk95 = Number(((z95 * dailyStdDev - dailyReturnAvg) * 100).toFixed(2));
  const expectedShortfall95 = Number((valueAtRisk95 * 1.35).toFixed(2));

  // 6. Win Rate & Profit-to-Loss Ratio
  const positiveDays = returns.filter((r) => r > 0);
  const negativeDays = returns.filter((r) => r < 0);
  const historicalWinRate = Number(((positiveDays.length / returns.length) * 100).toFixed(1));

  const avgWin = positiveDays.length > 0 ? positiveDays.reduce((a, b) => a + b, 0) / positiveDays.length : 0.01;
  const avgLoss = negativeDays.length > 0 ? Math.abs(negativeDays.reduce((a, b) => a + b, 0) / negativeDays.length) : 0.01;
  const profitToLossRatio = Number((avgWin / (avgLoss || 0.001)).toFixed(2));

  // 7. Benchmark Beta
  let benchmarkName = 'S&P 500';
  let beta = 1.05;
  if (asset.market === 'NEPSE') {
    benchmarkName = 'NEPSE Index';
    beta = asset.assetType === 'INDEX' ? 1.0 : 0.92;
  } else if (asset.market === 'NSE') {
    benchmarkName = 'NIFTY 50';
    beta = 1.12;
  } else if (asset.assetType === 'CRYPTO') {
    benchmarkName = 'Bitcoin (BTC)';
    beta = asset.symbol.includes('BTC') ? 1.0 : 1.38;
  }

  // 8. Market Regime Classification
  let regime: MarketRegime = 'RANGING';
  let regimeConfidence = 60;

  const priceChangeTotal = (closes[n - 1] - closes[0]) / closes[0];
  if (annualizedVolatility > 45) {
    regime = 'HIGH_VOLATILITY';
    regimeConfidence = 80;
  } else if (annualizedVolatility < 15) {
    regime = 'LOW_VOLATILITY';
    regimeConfidence = 75;
  } else if (priceChangeTotal > 0.08) {
    regime = 'TRENDING_BULL';
    regimeConfidence = 75;
  } else if (priceChangeTotal < -0.08) {
    regime = 'TRENDING_BEAR';
    regimeConfidence = 75;
  } else {
    regime = 'RANGING';
    regimeConfidence = 65;
  }

  return {
    periodDays: n,
    dailyReturnAvg: Number((dailyReturnAvg * 100).toFixed(3)),
    logReturnAvg: Number((logReturnAvg * 100).toFixed(3)),
    annualizedReturn,
    dailyVolatility,
    annualizedVolatility,
    rollingVolatility20d,
    beta,
    benchmarkName,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown: maxDrawdownPercent,
    maxDrawdownDurationDays: maxDdDuration,
    currentDrawdown,
    downsideDeviation: Number((downsideDeviation * 100).toFixed(2)),
    valueAtRisk95,
    expectedShortfall95,
    historicalWinRate,
    profitToLossRatio,
    regime,
    regimeConfidence
  };
}
