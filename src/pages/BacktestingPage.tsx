import React, { useState } from 'react';
import { Asset } from '../types/asset';
import { ALL_ASSETS } from '../data/universe';
import { BacktestStrategyParams, BacktestResult } from '../types/backtest';
import { runHistoricalBacktest } from '../engines/backtesting/backtestEngine';
import { getMarketCandles } from '../services/marketDataProvider';
import { saveBacktest } from '../db/backtestStore';
import { EquityCurveChart } from '../components/charts/EquityCurveChart';
import { History, Play, CheckCircle2, TrendingUp, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

export const BacktestingPage: React.FC = () => {
  const [selectedAssetId, setSelectedAssetId] = useState('NASDAQ:NVDA');
  const [strategyId, setStrategyId] = useState<BacktestStrategyParams['strategyId']>('ML_ENSEMBLE');
  const [initialCapital, setInitialCapital] = useState(10000);
  const [transactionCostBps, setTransactionCostBps] = useState(10);
  const [stopLossPercent, setStopLossPercent] = useState(3.5);
  const [takeProfitPercent, setTakeProfitPercent] = useState(7.0);

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const handleRunBacktest = async () => {
    const asset = ALL_ASSETS.find((a) => a.id === selectedAssetId) || ALL_ASSETS[0];
    setRunning(true);

    try {
      // Fetch candlestick series
      const { candles } = await getMarketCandles(asset, '1D', false);

      const params: BacktestStrategyParams = {
        assetId: asset.id,
        timeframe: '1D',
        strategyId,
        initialCapital,
        transactionCostBps,
        stopLossPercent,
        takeProfitPercent
      };

      const res = runHistoricalBacktest(candles, params);
      setResult(res);
      await saveBacktest(res);
    } catch (err) {
      console.error('Failed backtest:', err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="border-b border-background-border pb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-brand-400" />
          <h1 className="text-xl font-extrabold text-white font-mono tracking-tight">
            Historical Strategy Backtesting Studio
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Simulate multi-factor ML and quantitative algorithmic models against historical price bars with realistic fee slippage.
        </p>
      </div>

      {/* Configuration Controls Bar */}
      <div className="bg-background-card rounded-xl border border-background-border p-5 shadow-lg space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Strategy Parameters & Capital Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          {/* Asset Selector */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase mb-1">Target Asset</label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full p-2 rounded-lg bg-background-secondary border border-background-border text-white focus:outline-none focus:border-brand-500 font-mono"
            >
              {ALL_ASSETS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.symbol} ({a.market})
                </option>
              ))}
            </select>
          </div>

          {/* Strategy Rule */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase mb-1">Execution Rule</label>
            <select
              value={strategyId}
              onChange={(e) => setStrategyId(e.target.value as any)}
              className="w-full p-2 rounded-lg bg-background-secondary border border-background-border text-white focus:outline-none focus:border-brand-500 font-mono"
            >
              <option value="ML_ENSEMBLE">ML Multi-Factor Ensemble</option>
              <option value="EMA_CROSSOVER">EMA 9/21 Trend Ribbon</option>
              <option value="RSI_MEAN_REVERSION">RSI Oversold Mean Reversion</option>
              <option value="BREAKOUT_VOLATILITY">20-Day Range Breakout</option>
            </select>
          </div>

          {/* Initial Capital */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase mb-1">Virtual Capital ($)</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-background-secondary border border-background-border text-white font-mono focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Slippage / Fee */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase mb-1">Slippage & Fee (bps)</label>
            <input
              type="number"
              value={transactionCostBps}
              onChange={(e) => setTransactionCostBps(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-background-secondary border border-background-border text-white font-mono focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Stop Loss % */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase mb-1">Stop Loss (%)</label>
            <input
              type="number"
              step="0.5"
              value={stopLossPercent}
              onChange={(e) => setStopLossPercent(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-background-secondary border border-background-border text-white font-mono focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Take Profit % */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase mb-1">Take Profit (%)</label>
            <input
              type="number"
              step="0.5"
              value={takeProfitPercent}
              onChange={(e) => setTakeProfitPercent(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-background-secondary border border-background-border text-white font-mono focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleRunBacktest}
            disabled={running}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-mono font-bold transition-all disabled:opacity-50 shadow-md shadow-brand-500/20"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'Executing Simulation...' : 'Run Historical Backtest'}</span>
          </button>
        </div>
      </div>

      {/* Backtest Results Display */}
      {result && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-background-card border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Total Net Return</span>
              <span
                className={`text-xl font-black block mt-0.5 ${
                  result.totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {result.totalReturnPercent > 0 ? '+' : ''}{result.totalReturnPercent}%
              </span>
              <span className="text-[10px] text-slate-400">CAGR: {result.cagr}%</span>
            </div>

            <div className="p-3 rounded-lg bg-background-card border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Win Rate</span>
              <span className="text-xl font-black text-emerald-400 block mt-0.5">
                {result.winRatePercent}%
              </span>
              <span className="text-[10px] text-slate-400">
                {result.winningTrades} W / {result.losingTrades} L
              </span>
            </div>

            <div className="p-3 rounded-lg bg-background-card border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Profit Factor</span>
              <span className="text-xl font-black text-indigo-400 block mt-0.5">
                {result.profitFactor}
              </span>
              <span className="text-[10px] text-slate-400">Gross Win / Gross Loss</span>
            </div>

            <div className="p-3 rounded-lg bg-background-card border border-background-border">
              <span className="text-[10px] text-slate-500 uppercase block">Max Drawdown</span>
              <span className="text-xl font-black text-rose-400 block mt-0.5">
                -{result.maxDrawdownPercent}%
              </span>
              <span className="text-[10px] text-slate-400">Sharpe: {result.sharpeRatio}</span>
            </div>
          </div>

          {/* Cumulative Equity Curve Chart */}
          <EquityCurveChart
            points={result.equityCurve}
            initialCapital={result.params.initialCapital}
          />

          {/* Trade Execution Log */}
          <div className="bg-background-card rounded-xl border border-background-border p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Simulated Trade Execution Log ({result.trades.length} Trades)
              </h3>
            </div>

            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-background-secondary border-b border-background-border text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Entry Time</th>
                    <th className="py-2.5 px-3">Entry Price</th>
                    <th className="py-2.5 px-3">Exit Price</th>
                    <th className="py-2.5 px-3">Holding Bars</th>
                    <th className="py-2.5 px-3">Net PnL ($)</th>
                    <th className="py-2.5 px-3">Return %</th>
                    <th className="py-2.5 px-3 text-right">Exit Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background-border/60">
                  {result.trades.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-background-secondary/50">
                      <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 text-slate-300">{new Date(t.entryTime * 1000).toLocaleDateString()}</td>
                      <td className="py-2 px-3 text-white font-bold">{t.entryPrice}</td>
                      <td className="py-2 px-3 text-white font-bold">{t.exitPrice}</td>
                      <td className="py-2 px-3 text-slate-400">{t.holdingPeriodBars} bars</td>
                      <td className={`py-2 px-3 font-bold ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.pnl > 0 ? '+' : ''}${t.pnl}
                      </td>
                      <td className={`py-2 px-3 font-bold ${t.pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.pnlPercent > 0 ? '+' : ''}{t.pnlPercent}%
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-background-secondary border border-background-border text-slate-400">
                          {t.exitReason.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
