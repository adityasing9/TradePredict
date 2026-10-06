export interface BacktestTrade {
  id: string;
  entryTime: number;
  exitTime: number;
  entryPrice: number;
  exitPrice: number;
  direction: 'LONG' | 'SHORT';
  pnl: number;
  pnlPercent: number;
  holdingPeriodBars: number;
  exitReason: 'TAKE_PROFIT' | 'STOP_LOSS' | 'SIGNAL_REVERSAL' | 'TIME_EXIT';
}

export interface EquityPoint {
  time: number;
  equity: number;
  benchmarkEquity?: number;
  drawdownPercent: number;
}

export interface BacktestStrategyParams {
  assetId: string;
  timeframe: string;
  strategyId: 'ML_ENSEMBLE' | 'EMA_CROSSOVER' | 'RSI_MEAN_REVERSION' | 'BREAKOUT_VOLATILITY';
  initialCapital: number;
  transactionCostBps: number; // e.g. 10 bps (0.1%)
  stopLossPercent: number;
  takeProfitPercent: number;
  startDate?: string;
  endDate?: string;
}

export interface BacktestResult {
  id: string;
  params: BacktestStrategyParams;
  executedAt: number;
  totalReturnPercent: number;
  cagr: number;
  annualizedVolatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdownPercent: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRatePercent: number;
  profitFactor: number;
  averageTradeReturnPercent: number;
  equityCurve: EquityPoint[];
  trades: BacktestTrade[];
}
