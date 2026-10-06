import React, { useState } from 'react';
import { ALL_ASSETS } from '../data/universe';
import { BacktestStrategyParams, BacktestResult } from '../types/backtest';
import { runHistoricalBacktest } from '../engines/backtesting/backtestEngine';
import { getMarketCandles } from '../services/marketDataProvider';
import { saveBacktest } from '../db/backtestStore';
import { EquityCurveChart } from '../components/charts/EquityCurveChart';
import { History, Play, Layers } from 'lucide-react';

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
    <div className="space-y-4 animate-in fade-in duration-100">
      {/* Title */}
      <div className="border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-accent-cyan" />
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            Historical Strategy Backtesting Studio
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">
          Simulate multi-factor ML and quantitative models against historical bars with fee slippage.
        </p>
      </div>

      {/* Configuration Controls Bar */}
      <div className="terminal-panel p-3.5 space-y-2.5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-accent-cyan" />
          Strategy Parameters & Capital Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs font-mono">
          {/* Asset Selector */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Target Asset</label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full p-2 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
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
              className="w-full p-2 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
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
              className="w-full p-1.5 rounded bg-surface-secondary border border-border text-white font-mono text-xs focus:outline-none focus:border-accent-cyan"
            />
          </div>

          {/* Slippage / Fee */}
          <div>
            <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Fee & Slippage (bps)</label>
            <input
              type="number"
              value={transactionCostBps}
              onChange={(e) => setTransactionCostBps(Number(e.target.value))}
              className="w-full p-1.5 rounded bg-surface-secondary border border-border text-white font-mono text-xs focus:outline-none focus:border-accent-cyan"
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
              className="w-full p-1.5 rounded bg-surface-secondary border border-border text-white font-mono text-xs focus:outline-none focus:border-accent-cyan"
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
              className="w-full p-1.5 rounded bg-surface-secondary border border-border text-white font-mono text-xs focus:outline-none focus:border-accent-cyan"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleRunBacktest}
            disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-surface-elevated hover:bg-surface text-accent-cyan border border-border hover:border-accent-cyan/40 text-xs font-mono font-bold transition-colors disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'Running Simulation...' : 'Execute Backtest'}</span>
          </button>
        </div>
      </div>

      {/* Results Viewport */}
      {result && (
        <div className="space-y-4">
          {/* Summary KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 font-mono">
            <div className="p-2.5 rounded terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Return</span>
              <span
                className={`text-lg font-black block mt-0.5 ${
                  result.totalReturnPercent >= 0 ? 'text-market-bullish' : 'text-market-bearish'
                }`}
              >
                {result.totalReturnPercent >= 0 ? '+' : ''}{result.totalReturnPercent}%
              </span>
            </div>

            <div className="p-2.5 rounded terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Win Rate</span>
              <span className="text-lg font-black text-accent-cyan block mt-0.5">
                {result.winRatePercent}%
              </span>
              <span className="text-[10px] text-slate-500">
                {result.winningTrades}W / {result.losingTrades}L
              </span>
            </div>

            <div className="p-2.5 rounded terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Sharpe Ratio</span>
              <span className="text-lg font-black text-white block mt-0.5">{result.sharpeRatio}</span>
            </div>

            <div className="p-2.5 rounded terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Max Drawdown</span>
              <span className="text-lg font-black text-market-bearish block mt-0.5">
                -{result.maxDrawdownPercent}%
              </span>
            </div>

            <div className="p-2.5 rounded terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Profit Factor</span>
              <span className="text-lg font-black text-market-bullish block mt-0.5">
                {result.profitFactor}
              </span>
            </div>

            <div className="p-2.5 rounded terminal-panel">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Trades</span>
              <span className="text-lg font-black text-slate-200 block mt-0.5">{result.totalTrades}</span>
            </div>
          </div>

          {/* Cumulative Equity Curve Chart */}
          <EquityCurveChart points={result.equityCurve} initialCapital={initialCapital} />

          {/* Closed Trades List */}
          <div className="terminal-panel overflow-hidden">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Simulated Execution Log ({result.trades.length} Trades)
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Sorted by Entry Sequence
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-surface-secondary border-b border-border text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Entry Date</th>
                    <th className="py-2 px-3">Exit Date</th>
                    <th className="py-2 px-3 text-right">Entry Price</th>
                    <th className="py-2 px-3 text-right">Exit Price</th>
                    <th className="py-2 px-3 text-right">Return %</th>
                    <th className="py-2 px-3">Exit Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.trades.map((t) => (
                    <tr key={t.id} className="hover:bg-surface-secondary">
                      <td className="py-2 px-3">
                        <span className="text-market-bullish font-bold">{t.direction}</span>
                      </td>
                      <td className="py-2 px-3 text-slate-300">
                        {new Date(t.entryTime * 1000).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 text-slate-300">
                        {new Date(t.exitTime * 1000).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-200">${t.entryPrice}</td>
                      <td className="py-2 px-3 text-right text-slate-200">${t.exitPrice}</td>
                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          t.pnlPercent >= 0 ? 'text-market-bullish' : 'text-market-bearish'
                        }`}
                      >
                        {t.pnlPercent >= 0 ? '+' : ''}{t.pnlPercent}%
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-secondary text-slate-300 border border-border">
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
