import React from 'react';
import { QuantitativeMetrics } from '../../types/quant';
import { BarChart2 } from 'lucide-react';

interface QuantPanelProps {
  quant: QuantitativeMetrics;
}

export const QuantPanel: React.FC<QuantPanelProps> = ({ quant }) => {
  return (
    <div className="w-full terminal-panel p-4 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-600 dark:text-accent-cyan" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
            Quantitative Risk & Statistical Metrics
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold">Regime:</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-secondary border border-border text-cyan-600 dark:text-accent-cyan">
            {quant.regime.replace('_', ' ')} ({quant.regimeConfidence}% Conf.)
          </span>
        </div>
      </div>

      {/* Grid of Quant KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Sharpe Ratio</span>
          <span className="text-lg font-black text-slate-900 dark:text-white block mt-0.5">{quant.sharpeRatio}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Risk-free adj. (4.5%)</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Sortino Ratio</span>
          <span className="text-lg font-black text-emerald-600 dark:text-market-bullish block mt-0.5">{quant.sortinoRatio}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Downside dev only</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Benchmark Beta</span>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{quant.beta}</span>
          <span className="text-[10px] text-slate-500 truncate block mt-0.5 font-medium">vs {quant.benchmarkName}</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Max Drawdown</span>
          <span className="text-lg font-black text-rose-600 dark:text-market-bearish block mt-0.5">-{quant.maxDrawdown}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">{quant.maxDrawdownDurationDays} bars duration</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Value at Risk (95%)</span>
          <span className="text-lg font-black text-amber-600 dark:text-market-warning block mt-0.5">-{quant.valueAtRisk95}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">CVaR: -{quant.expectedShortfall95}%</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Annual Volatility</span>
          <span className="text-lg font-black text-cyan-600 dark:text-accent-cyan block mt-0.5">{quant.annualizedVolatility}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block font-medium">20d: {quant.rollingVolatility20d}%</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Historical Win Rate</span>
          <span className="text-lg font-black text-emerald-600 dark:text-market-bullish block mt-0.5">{quant.historicalWinRate}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Positive sessions</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Profit / Loss Factor</span>
          <span className="text-lg font-black text-slate-900 dark:text-white block mt-0.5">{quant.profitToLossRatio}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Avg win / loss</span>
        </div>
      </div>
    </div>
  );
};
