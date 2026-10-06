export type MarketRegime = 'TRENDING_BULL' | 'TRENDING_BEAR' | 'RANGING' | 'HIGH_VOLATILITY' | 'LOW_VOLATILITY' | 'COMPRESSION';

export interface QuantitativeMetrics {
  periodDays: number;
  dailyReturnAvg: number;
  logReturnAvg: number;
  annualizedReturn: number;
  dailyVolatility: number;
  annualizedVolatility: number;
  rollingVolatility20d: number;
  beta: number; // vs market benchmark
  benchmarkName: string;
  sharpeRatio: number; // assuming standard risk free rate
  sortinoRatio: number; // downside deviation only
  maxDrawdown: number; // percentage, e.g. -18.4%
  maxDrawdownDurationDays: number;
  currentDrawdown: number;
  downsideDeviation: number;
  valueAtRisk95: number; // 95% 1-day VaR
  expectedShortfall95: number; // 95% CVaR
  historicalWinRate: number; // % of positive days
  profitToLossRatio: number; // avg win / avg loss
  regime: MarketRegime;
  regimeConfidence: number; // 0 - 100
}
