import React from 'react';
import { QuantitativeMetrics } from '../../types/quant';
import { BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';

interface QuantPanelProps {
  quant: QuantitativeMetrics;
}

export const QuantPanel: React.FC<QuantPanelProps> = ({ quant }) => {
  return (
    <div className="w-full bg-background-card rounded-xl border border-background-border p-5 shadow-lg flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-border pb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Quantitative Risk & Statistical Metrics
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-slate-500">Regime:</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/30 text-brand-400">
            {quant.regime.replace('_', ' ')} ({quant.regimeConfidence}% Conf.)
          </span>
        </div>
      </div>

      {/* Grid of Quant KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Sharpe Ratio</span>
          <span className="text-base font-bold text-white block mt-0.5">{quant.sharpeRatio}</span>
          <span className="text-[10px] text-slate-500">Risk-free adj. (4.5%)</span>
        </div>

        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Sortino Ratio</span>
          <span className="text-base font-bold text-emerald-400 block mt-0.5">{quant.sortinoRatio}</span>
          <span className="text-[10px] text-slate-500">Downside dev only</span>
        </div>

        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Benchmark Beta</span>
          <span className="text-base font-bold text-slate-200 block mt-0.5">{quant.beta}</span>
          <span className="text-[10px] text-slate-500 truncate block">vs {quant.benchmarkName}</span>
        </div>

        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Max Drawdown</span>
          <span className="text-base font-bold text-rose-400 block mt-0.5">{quant.maxDrawdown}%</span>
          <span className="text-[10px] text-slate-500">{quant.maxDrawdownDurationDays} bars duration</span>
        </div>

        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Value at Risk (95% 1-d)</span>
          <span className="text-base font-bold text-amber-400 block mt-0.5">-{quant.valueAtRisk95}%</span>
          <span className="text-[10px] text-slate-500">CVaR: -{quant.expectedShortfall95}%</span>
        </div>

        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Annualized Volatility</span>
          <span className="text-base font-bold text-slate-200 block mt-0.5">{quant.annualizedVolatility}%</span>
          <span className="text-[10px] text-slate-500">20d: {quant.rollingVolatility20d}%</span>
        </div>

        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Historical Win Rate</span>
          <span className="text-base font-bold text-emerald-400 block mt-0.5">{quant.historicalWinRate}%</span>
          <span className="text-[10px] text-slate-500">Positive sessions</span>
        </div>

        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Profit / Loss Factor</span>
          <span className="text-base font-bold text-white block mt-0.5">{quant.profitToLossRatio}</span>
          <span className="text-[10px] text-slate-500">Avg win / loss</span>
        </div>
      </div>
    </div>
  );
};
