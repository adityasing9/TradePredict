import React from 'react';
import { TechnicalAnalysisResult } from '../../types/technical';
import { Layers } from 'lucide-react';

interface TechnicalPanelProps {
  technical: TechnicalAnalysisResult;
  currency: string;
}

export const TechnicalPanel: React.FC<TechnicalPanelProps> = ({ technical, currency }) => {
  const { indicators, structure, patterns, trend, technicalScore, signal } = technical;

  const getSignalBadge = (sig: typeof signal) => {
    switch (sig) {
      case 'STRONG_BUY':
      case 'BUY':
        return 'bg-market-bullish/10 text-market-bullish border-market-bullish/30';
      case 'STRONG_SELL':
      case 'SELL':
        return 'bg-market-bearish/10 text-market-bearish border-market-bearish/30';
      case 'NEUTRAL':
      default:
        return 'bg-market-warning/10 text-market-warning border-market-warning/30';
    }
  };

  return (
    <div className="w-full terminal-panel p-4 flex flex-col gap-4">
      {/* Top Banner: Score & Signal */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-600 dark:text-accent-cyan" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
              Technical Analysis Engine
            </h3>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
              {technicalScore > 0 ? `+${technicalScore}` : technicalScore}
              <span className="text-xs text-slate-500 font-normal"> / 100</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border shadow-sm ${getSignalBadge(signal)}`}>
              {signal.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block tracking-wider font-bold">Trend Regime</span>
          <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-slate-200">
            {trend.direction.replace('_', ' ')} (ADX {indicators.adx.value})
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
            MA: {trend.maAlignment.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Core Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        {/* RSI */}
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">RSI (14)</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-black text-slate-900 dark:text-white">{indicators.rsi.value}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                indicators.rsi.status === 'OVERBOUGHT'
                  ? 'bg-rose-500/15 text-rose-700 dark:text-market-bearish border border-rose-500/30'
                  : indicators.rsi.status === 'OVERSOLD'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-market-bullish border border-emerald-500/30'
                  : 'bg-surface-elevated text-slate-700 dark:text-slate-300 border border-border'
              }`}
            >
              {indicators.rsi.status}
            </span>
          </div>
        </div>

        {/* MACD */}
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">MACD (12, 26, 9)</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-black text-slate-900 dark:text-white">{indicators.macd.histogram}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                indicators.macd.histogram > 0
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-market-bullish border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-700 dark:text-market-bearish border border-rose-500/30'
              }`}
            >
              {indicators.macd.trend.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Bollinger Bands */}
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Bollinger %B</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-black text-slate-900 dark:text-white">{indicators.bollinger.percentB}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">Band: {indicators.bollinger.bandwidth}%</span>
          </div>
        </div>

        {/* Volume Ratio */}
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">Vol / 20d Avg</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-black text-slate-900 dark:text-white">{indicators.volume.volumeRatio}x</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                indicators.volume.isSpike
                  ? 'bg-amber-500/15 text-amber-700 dark:text-market-warning border border-amber-500/30'
                  : 'bg-surface-elevated text-slate-600 dark:text-slate-400 border border-border'
              }`}
            >
              {indicators.volume.isSpike ? 'SPIKE' : 'NORMAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Price Structure: Support & Resistance Clusters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
        {/* Supports */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-mono font-bold text-emerald-600 dark:text-market-bullish uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Key Support Clusters
          </h4>
          <div className="space-y-1.5">
            {structure.supports.slice(0, 3).map((sup, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-surface-secondary border border-border text-xs font-mono border-l-2 border-l-emerald-500"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white font-black">{currency} {sup.price}</span>
                  <span className="text-[10px] text-slate-500 font-medium">({sup.strength})</span>
                </div>
                <span className="text-emerald-600 dark:text-market-bullish font-bold">{sup.distancePercent}% away</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resistances */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-mono font-bold text-rose-600 dark:text-market-bearish uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Key Overhead Resistances
          </h4>
          <div className="space-y-1.5">
            {structure.resistances.slice(0, 3).map((res, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-surface-secondary border border-border text-xs font-mono border-l-2 border-l-rose-500"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white font-black">{currency} {res.price}</span>
                  <span className="text-[10px] text-slate-500 font-medium">({res.strength})</span>
                </div>
                <span className="text-rose-600 dark:text-market-bearish font-bold">+{res.distancePercent}% away</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern Detections */}
      {patterns.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-border">
          <h4 className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-300 uppercase">
            Detected Technical Patterns
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {patterns.map((pat) => (
              <div
                key={pat.id}
                className={`p-2.5 rounded border ${
                  pat.type === 'BULLISH'
                    ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
                    : pat.type === 'BEARISH'
                    ? 'border-rose-500/30 bg-rose-500/[0.04]'
                    : 'border-border bg-surface-secondary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{pat.name}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      pat.type === 'BULLISH'
                        ? 'text-emerald-700 dark:text-market-bullish bg-emerald-500/15 border border-emerald-500/30'
                        : pat.type === 'BEARISH'
                        ? 'text-rose-700 dark:text-market-bearish bg-rose-500/15 border border-rose-500/30'
                        : 'text-slate-700 dark:text-slate-300 bg-surface-elevated'
                    }`}
                  >
                    {pat.confidence}% Conf.
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-sans">{pat.supportingData}</p>
                <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                  Invalidation: <span className="text-slate-900 dark:text-white font-bold">{currency} {pat.invalidationLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
