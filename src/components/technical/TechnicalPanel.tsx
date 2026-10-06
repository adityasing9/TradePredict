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
            <Layers className="w-3.5 h-3.5 text-accent-cyan" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Technical Analysis Engine
            </h3>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="text-2xl font-black font-mono text-white tracking-tight">
              {technicalScore > 0 ? `+${technicalScore}` : technicalScore}
              <span className="text-xs text-slate-500 font-normal"> / 100</span>
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getSignalBadge(signal)}`}>
              {signal.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider font-semibold">Trend Regime</span>
          <span className="text-xs font-mono font-bold text-slate-200">
            {trend.direction.replace('_', ' ')} (ADX {indicators.adx.value})
          </span>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
            MA: {trend.maAlignment.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Core Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        {/* RSI */}
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">RSI (14)</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-white">{indicators.rsi.value}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                indicators.rsi.status === 'OVERBOUGHT'
                  ? 'bg-market-bearish/10 text-market-bearish border border-market-bearish/30'
                  : indicators.rsi.status === 'OVERSOLD'
                  ? 'bg-market-bullish/10 text-market-bullish border border-market-bullish/30'
                  : 'bg-surface-elevated text-slate-300 border border-border'
              }`}
            >
              {indicators.rsi.status}
            </span>
          </div>
        </div>

        {/* MACD */}
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">MACD (12, 26, 9)</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-white">{indicators.macd.histogram}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                indicators.macd.histogram > 0
                  ? 'bg-market-bullish/10 text-market-bullish border border-market-bullish/30'
                  : 'bg-market-bearish/10 text-market-bearish border border-market-bearish/30'
              }`}
            >
              {indicators.macd.trend.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Bollinger Bands */}
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Bollinger %B</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-white">{indicators.bollinger.percentB}</span>
            <span className="text-[10px] text-slate-400">Band: {indicators.bollinger.bandwidth}%</span>
          </div>
        </div>

        {/* Volume Ratio */}
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Vol / 20d Avg</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-white">{indicators.volume.volumeRatio}x</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                indicators.volume.isSpike
                  ? 'bg-market-warning/10 text-market-warning border border-market-warning/30'
                  : 'bg-surface-elevated text-slate-400 border border-border'
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
          <h4 className="text-[11px] font-mono font-bold text-market-bullish uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-market-bullish" />
            Key Support Clusters
          </h4>
          <div className="space-y-1.5">
            {structure.supports.slice(0, 3).map((sup, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-surface-secondary border border-border text-xs font-mono border-l-2 border-l-market-bullish"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{currency} {sup.price}</span>
                  <span className="text-[10px] text-slate-500">({sup.strength})</span>
                </div>
                <span className="text-market-bullish font-semibold">{sup.distancePercent}% away</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resistances */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-mono font-bold text-market-bearish uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-market-bearish" />
            Key Overhead Resistances
          </h4>
          <div className="space-y-1.5">
            {structure.resistances.slice(0, 3).map((res, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-surface-secondary border border-border text-xs font-mono border-l-2 border-l-market-bearish"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{currency} {res.price}</span>
                  <span className="text-[10px] text-slate-500">({res.strength})</span>
                </div>
                <span className="text-market-bearish font-semibold">+{res.distancePercent}% away</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern Detections */}
      {patterns.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-border">
          <h4 className="text-[11px] font-mono font-bold text-slate-300 uppercase">
            Detected Technical Patterns
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {patterns.map((pat) => (
              <div
                key={pat.id}
                className={`p-2.5 rounded border ${
                  pat.type === 'BULLISH'
                    ? 'border-market-bullish/30 bg-market-bullish/[0.03]'
                    : pat.type === 'BEARISH'
                    ? 'border-market-bearish/30 bg-market-bearish/[0.03]'
                    : 'border-border bg-surface-secondary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{pat.name}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      pat.type === 'BULLISH'
                        ? 'text-market-bullish bg-market-bullish/10 border border-market-bullish/20'
                        : pat.type === 'BEARISH'
                        ? 'text-market-bearish bg-market-bearish/10 border border-market-bearish/20'
                        : 'text-slate-300 bg-surface-elevated'
                    }`}
                  >
                    {pat.confidence}% Conf.
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">{pat.supportingData}</p>
                <div className="text-[9px] font-mono text-slate-400 mt-1.5">
                  Invalidation: <span className="text-white font-bold">{currency} {pat.invalidationLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
