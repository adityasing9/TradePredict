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
          <BarChart2 className="w-3.5 h-3.5 text-accent-cyan" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Quantitative Risk & Statistical Metrics
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Regime:</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-secondary border border-border text-accent-cyan">
            {quant.regime.replace('_', ' ')} ({quant.regimeConfidence}% Conf.)
          </span>
        </div>
      </div>

      {/* Grid of Quant KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Sharpe Ratio</span>
          <span className="text-lg font-bold text-white block mt-0.5">{quant.sharpeRatio}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Risk-free adj. (4.5%)</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Sortino Ratio</span>
          <span className="text-lg font-bold text-market-bullish block mt-0.5">{quant.sortinoRatio}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Downside dev only</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Benchmark Beta</span>
          <span className="text-lg font-bold text-slate-200 block mt-0.5">{quant.beta}</span>
          <span className="text-[10px] text-slate-500 truncate block mt-0.5">vs {quant.benchmarkName}</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Max Drawdown</span>
          <span className="text-lg font-bold text-market-bearish block mt-0.5">{quant.maxDrawdown}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">{quant.maxDrawdownDurationDays} bars duration</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Value at Risk (95%)</span>
          <span className="text-lg font-bold text-market-warning block mt-0.5">-{quant.valueAtRisk95}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">CVaR: -{quant.expectedShortfall95}%</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Annual Volatility</span>
          <span className="text-lg font-bold text-accent-cyan block mt-0.5">{quant.annualizedVolatility}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">20d: {quant.rollingVolatility20d}%</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Historical Win Rate</span>
          <span className="text-lg font-bold text-market-bullish block mt-0.5">{quant.historicalWinRate}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Positive sessions</span>
        </div>

        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Profit / Loss Factor</span>
          <span className="text-lg font-bold text-white block mt-0.5">{quant.profitToLossRatio}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Avg win / loss</span>
        </div>
      </div>
    </div>
  );
};
