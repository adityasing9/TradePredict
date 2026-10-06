import React from 'react';
import { QuantitativeMetrics } from '../../types/quant';
import { BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';

interface QuantPanelProps {
  quant: QuantitativeMetrics;
}

export const QuantPanel: React.FC<QuantPanelProps> = ({ quant }) => {
  return (
    <div className="w-full glass-card rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
        <div className="flex items-center gap-2.5">
          <BarChart2 className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Quantitative Risk & Statistical Metrics
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Regime:</span>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-brand-500/15 border border-brand-500/35 text-brand-300 shadow-sm">
            {quant.regime.replace('_', ' ')} ({quant.regimeConfidence}% Conf.)
          </span>
        </div>
      </div>

      {/* Grid of Quant KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Sharpe Ratio</span>
          <span className="text-xl font-black text-white block mt-1">{quant.sharpeRatio}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Risk-free adj. (4.5%)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Sortino Ratio</span>
          <span className="text-xl font-black text-emerald-400 block mt-1">{quant.sortinoRatio}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Downside dev only</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Benchmark Beta</span>
          <span className="text-xl font-black text-slate-200 block mt-1">{quant.beta}</span>
          <span className="text-[10px] text-slate-500 truncate block mt-0.5">vs {quant.benchmarkName}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Max Drawdown</span>
          <span className="text-xl font-black text-rose-400 block mt-1">{quant.maxDrawdown}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">{quant.maxDrawdownDurationDays} bars duration</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Value at Risk (95% 1-d)</span>
          <span className="text-xl font-black text-amber-400 block mt-1">-{quant.valueAtRisk95}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">CVaR: -{quant.expectedShortfall95}%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Annualized Volatility</span>
          <span className="text-xl font-black text-cyan-300 block mt-1">{quant.annualizedVolatility}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">20d: {quant.rollingVolatility20d}%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Historical Win Rate</span>
          <span className="text-xl font-black text-emerald-400 block mt-1">{quant.historicalWinRate}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Positive sessions</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Profit / Loss Factor</span>
          <span className="text-xl font-black text-white block mt-1">{quant.profitToLossRatio}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Avg win / loss</span>
        </div>
      </div>
    </div>
  );
};
