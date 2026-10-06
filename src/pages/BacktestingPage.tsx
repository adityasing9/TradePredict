import React, { useState } from 'react';
import { Asset } from '../types/asset';
import { ALL_ASSETS } from '../data/universe';
import { BacktestStrategyParams, BacktestResult } from '../types/backtest';
import { runHistoricalBacktest } from '../engines/backtesting/backtestEngine';
import { getMarketCandles } from '../services/marketDataProvider';
import { saveBacktest } from '../db/backtestStore';
import { EquityCurveChart } from '../components/charts/EquityCurveChart';
import { History, Play, CheckCircle2, TrendingUp, TrendingDown, Clock, ShieldCheck, Layers } from 'lucide-react';

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
      <div className="border-b border-white/[0.07] pb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-brand-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            Historical Strategy Backtesting Studio
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Simulate multi-factor ML and quantitative algorithmic models against historical price bars with realistic fee slippage.
        </p>
      </div>

      {/* Configuration Controls Bar */}
      <div className="terminal-panel p-4 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          Strategy Parameters & Capital Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          {/* Asset Selector */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Target Asset</label>
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
            <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Execution Rule</label>
            <select
              value={strategyId}
              onChange={(e) => setStrategyId(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
            >
              <option value="ML_ENSEMBLE">ML Multi-Factor Ensemble</option>
              <option value="EMA_CROSSOVER">EMA 9/21 Trend Ribbon</option>
              <option value="RSI_MEAN_REVERSION">RSI Oversold Mean Reversion</option>
              <option value="BREAKOUT_VOLATILITY">20-Day Range Breakout</option>
            </select>
          </div>

          {/* Initial Capital */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Virtual Capital ($)</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-brand-500/60"
            />
          </div>

          {/* Slippage / Fee */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Fee & Slippage (bps)</label>
            <input
              type="number"
              value={transactionCostBps}
              onChange={(e) => setTransactionCostBps(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-brand-500/60"
            />
          </div>

          {/* Stop Loss % */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Stop Loss (%)</label>
            <input
              type="number"
              step="0.5"
              value={stopLossPercent}
              onChange={(e) => setStopLossPercent(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-brand-500/60"
            />
          </div>

          {/* Take Profit % */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Take Profit (%)</label>
            <input
              type="number"
              step="0.5"
              value={takeProfitPercent}
              onChange={(e) => setTakeProfitPercent(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white font-mono focus:outline-none focus:border-brand-500/60"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleRunBacktest}
            disabled={running}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-mono font-bold text-xs shadow-md hover:shadow-glow-indigo transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'Running Simulation...' : 'Execute Backtest'}</span>
          </button>
        </div>
      </div>

      {/* Results Viewport */}
      {result && (
        <div className="space-y-6">
          {/* Summary KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono">
            <div className="p-3 rounded-lg terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Return</span>
              <span
                className={`text-xl font-black block mt-1 ${
                  result.totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {result.totalReturnPercent >= 0 ? '+' : ''}{result.totalReturnPercent}%
              </span>
            </div>

            <div className="p-3 rounded-lg terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Win Rate</span>
              <span className="text-xl font-black text-cyan-300 block mt-1">
                {result.winRatePercent}%
              </span>
              <span className="text-[10px] text-slate-500">
                {result.winningTrades}W / {result.losingTrades}L
              </span>
            </div>

            <div className="p-3 rounded-lg terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Sharpe Ratio</span>
              <span className="text-xl font-black text-white block mt-1">{result.sharpeRatio}</span>
            </div>

            <div className="p-3 rounded-lg terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Max Drawdown</span>
              <span className="text-xl font-black text-rose-400 block mt-1">
                -{result.maxDrawdownPercent}%
              </span>
            </div>

            <div className="p-3 rounded-lg terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Profit Factor</span>
              <span className="text-xl font-black text-emerald-400 block mt-1">
                {result.profitFactor}
              </span>
            </div>

            <div className="p-3 rounded-lg terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Trades</span>
              <span className="text-xl font-black text-slate-200 block mt-1">{result.totalTrades}</span>
            </div>
          </div>

          {/* Cumulative Equity Curve Chart */}
          <EquityCurveChart points={result.equityCurve} initialCapital={initialCapital} />

          {/* Closed Trades List */}
          <div className="terminal-panel overflow-hidden">
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Simulated Execution Log ({result.trades.length} Trades)
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Sorted by Entry Sequence
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Entry Date</th>
                    <th className="py-2.5 px-3">Exit Date</th>
                    <th className="py-2.5 px-3 text-right">Entry Price</th>
                    <th className="py-2.5 px-3 text-right">Exit Price</th>
                    <th className="py-2.5 px-3 text-right">Return %</th>
                    <th className="py-2.5 px-3">Exit Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {result.trades.map((t) => (
                    <tr key={t.id} className="hover:bg-white/[0.03]">
                      <td className="py-2.5 px-3">
                        <span className="text-emerald-400 font-bold">{t.direction}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {new Date(t.entryTime * 1000).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {new Date(t.exitTime * 1000).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-200">${t.entryPrice}</td>
                      <td className="py-2.5 px-3 text-right text-slate-200">${t.exitPrice}</td>
                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          t.pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {t.pnlPercent >= 0 ? '+' : ''}{t.pnlPercent}%
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                          {t.exitReason}
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
