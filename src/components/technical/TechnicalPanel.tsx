import React from 'react';
import { TechnicalAnalysisResult } from '../../types/technical';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

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
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald';
      case 'STRONG_SELL':
      case 'SELL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose';
      case 'NEUTRAL':
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="w-full glass-card rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl flex flex-col gap-6">
      {/* Top Banner: Score & Signal */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Technical Analysis Engine
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {technicalScore > 0 ? `+${technicalScore}` : technicalScore}
              <span className="text-xs text-slate-500 font-normal"> / 100</span>
            </span>
            <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${getSignalBadge(signal)}`}>
              {signal.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider font-semibold">Trend Regime</span>
          <span className="text-xs font-mono font-bold text-slate-200">
            {trend.direction.replace('_', ' ')} (ADX {indicators.adx.value})
          </span>
          <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
            MA: {trend.maAlignment.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Core Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        {/* RSI */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">RSI (14-period)</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-lg font-black text-white">{indicators.rsi.value}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                indicators.rsi.status === 'OVERBOUGHT'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : indicators.rsi.status === 'OVERSOLD'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.05] text-slate-300 border border-white/[0.08]'
              }`}
            >
              {indicators.rsi.status}
            </span>
          </div>
        </div>

        {/* MACD */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">MACD (12, 26, 9)</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-lg font-black text-white">{indicators.macd.histogram}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                indicators.macd.histogram > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {indicators.macd.trend.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Bollinger Bands */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Bollinger %B & Width</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-lg font-black text-white">{indicators.bollinger.percentB}</span>
            <span className="text-[10px] text-slate-400">Band: {indicators.bollinger.bandwidth}%</span>
          </div>
        </div>

        {/* Volume Ratio */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Volume / 20d Average</span>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-lg font-black text-white">{indicators.volume.volumeRatio}x</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                indicators.volume.isSpike
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/[0.05] text-slate-400'
              }`}
            >
              {indicators.volume.isSpike ? 'SPIKE' : 'NORMAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Price Structure: Support & Resistance Clusters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
        {/* Supports */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-emerald" />
            Key Support Clusters
          </h4>
          <div className="space-y-2">
            {structure.supports.slice(0, 3).map((sup, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono border-l-2 border-l-emerald-500"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{currency} {sup.price}</span>
                  <span className="text-[10px] text-slate-500">({sup.strength})</span>
                </div>
                <span className="text-emerald-400 font-semibold">{sup.distancePercent}% away</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resistances */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-glow-rose" />
            Key Overhead Resistances
          </h4>
          <div className="space-y-2">
            {structure.resistances.slice(0, 3).map((res, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono border-l-2 border-l-rose-500"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{currency} {res.price}</span>
                  <span className="text-[10px] text-slate-500">({res.strength})</span>
                </div>
                <span className="text-rose-400 font-semibold">+{res.distancePercent}% away</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern Detections */}
      {patterns.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
            Detected Technical & Candlestick Patterns
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {patterns.map((pat) => (
              <div
                key={pat.id}
                className={`p-3.5 rounded-xl border backdrop-blur-md ${
                  pat.type === 'BULLISH'
                    ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
                    : pat.type === 'BEARISH'
                    ? 'border-rose-500/30 bg-rose-500/[0.04]'
                    : 'border-white/[0.08] bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{pat.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      pat.type === 'BULLISH'
                        ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/30'
                        : pat.type === 'BEARISH'
                        ? 'text-rose-300 bg-rose-500/20 border border-rose-500/30'
                        : 'text-slate-300 bg-white/[0.05]'
                    }`}
                  >
                    {pat.confidence}% Conf.
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">{pat.supportingData}</p>
                <div className="text-[10px] font-mono text-slate-400 mt-2">
                  Invalidation Level: <span className="text-white font-bold">{currency} {pat.invalidationLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
