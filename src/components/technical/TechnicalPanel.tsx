import React from 'react';
import { TechnicalAnalysisResult } from '../../types/technical';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

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
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'STRONG_SELL':
      case 'SELL':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'NEUTRAL':
      default:
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="w-full bg-background-card rounded-xl border border-background-border p-5 shadow-lg flex flex-col gap-5">
      {/* Top Banner: Score & Signal */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Technical Analysis Engine
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-2xl font-extrabold font-mono text-white">
              {technicalScore > 0 ? `+${technicalScore}` : technicalScore}
              <span className="text-xs text-slate-500 font-normal"> / 100</span>
            </span>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getSignalBadge(signal)}`}>
              {signal.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">Trend Regime</span>
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
        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">RSI (14-period)</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-white">{indicators.rsi.value}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                indicators.rsi.status === 'OVERBOUGHT'
                  ? 'bg-rose-500/20 text-rose-400'
                  : indicators.rsi.status === 'OVERSOLD'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {indicators.rsi.status}
            </span>
          </div>
        </div>

        {/* MACD */}
        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">MACD (12, 26, 9)</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-white">{indicators.macd.histogram}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                indicators.macd.histogram > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {indicators.macd.trend.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Bollinger Bands %B */}
        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Bollinger %B & Width</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-white">{indicators.bollinger.percentB}</span>
            <span className="text-[10px] text-slate-400">Band: {indicators.bollinger.bandwidth}%</span>
          </div>
        </div>

        {/* Volume & Spike */}
        <div className="p-3 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Volume / 20d Average</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-base font-bold text-white">{indicators.volume.volumeRatio}x</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                indicators.volume.isSpike ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400'
              }`}
            >
              {indicators.volume.isSpike ? 'SPIKE' : 'NORMAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Price Structure: Support & Resistance Clusters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-background-border">
        {/* Supports */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Key Support Clusters
          </h4>
          <div className="space-y-1.5">
            {structure.supports.slice(0, 3).map((sup, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-background-secondary border border-background-border text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{currency} {sup.price}</span>
                  <span className="text-[10px] text-slate-500">({sup.strength})</span>
                </div>
                <span className="text-emerald-400 font-medium">{sup.distancePercent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resistances */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Key Overhead Resistances
          </h4>
          <div className="space-y-1.5">
            {structure.resistances.slice(0, 3).map((res, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-background-secondary border border-background-border text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{currency} {res.price}</span>
                  <span className="text-[10px] text-slate-500">({res.strength})</span>
                </div>
                <span className="text-rose-400 font-medium">+{res.distancePercent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern Detections */}
      {patterns.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-background-border">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
            Detected Technical & Candlestick Patterns
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {patterns.map((pat) => (
              <div
                key={pat.id}
                className={`p-3 rounded-lg border ${
                  pat.type === 'BULLISH'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : pat.type === 'BEARISH'
                    ? 'border-rose-500/30 bg-rose-500/5'
                    : 'border-background-border bg-background-secondary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{pat.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      pat.type === 'BULLISH'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : pat.type === 'BEARISH'
                        ? 'text-rose-400 bg-rose-500/10'
                        : 'text-slate-400 bg-slate-800'
                    }`}
                  >
                    {pat.confidence}% Conf.
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">{pat.supportingData}</p>
                <div className="text-[10px] font-mono text-slate-400 mt-2">
                  Invalidation Level: <span className="text-slate-200">{currency} {pat.invalidationLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
