import React, { useState } from 'react';
import { MLPredictionResult } from '../../types/prediction';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PredictionCardProps {
  prediction: MLPredictionResult;
  currency: string;
  onTrackPrediction?: () => void;
  isTracked?: boolean;
}

const FACTOR_EXPLANATIONS: Record<string, string> = {
  RSI: 'Relative Strength Index (14): Measures momentum on a scale of 0-100. Values below 30 denote oversold conditions; values above 70 denote overbought conditions.',
  MACD: 'Moving Average Convergence Divergence: Gauges trend momentum and directional acceleration when lines cross.',
  EMA: 'Exponential Moving Average: Weights recent prices higher to detect trend direction and dynamic support/resistance.',
  VOLATILITY: 'Econometric Volatility Ratio: Gauges whether price action is compressing before a breakout or expanding into exhaustion.',
  VOLUME: 'Volume Flow Pressure: Compares volume expansion on up-bars vs down-bars to detect institutional participation.',
  VALUATION: 'Fundamental Valuation Multiple: Assesses asset earnings or revenue yield compared to its historical sector average.',
  MACRO: 'Macroeconomic & Liquidity Regime: Assesses central bank policy, interest rate trajectory, and global risk appetite.'
};

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  currency,
  onTrackPrediction,
  isTracked = false
}) => {
  const [activeFactorInfo, setActiveFactorInfo] = useState<string | null>(null);
  const [showWhyFactors, setShowWhyFactors] = useState(true);

  const p = prediction.directionProbabilities;
  const dir = prediction.direction;

  const currentPrice = prediction.currentPrice;
  const [targetLow, targetHigh] = prediction.expectedPriceRange;

  // Visual Slider Support / Resistance anchors
  const supportAnchor = Math.min(targetLow * 0.96, currentPrice * 0.95);
  const resistanceAnchor = Math.max(targetHigh * 1.04, currentPrice * 1.05);
  const totalSpan = Math.max(0.1, resistanceAnchor - supportAnchor);

  const getPercentPos = (val: number) => {
    return Math.min(100, Math.max(0, ((val - supportAnchor) / totalSpan) * 100));
  };

  const currentPos = getPercentPos(currentPrice);
  const targetLowPos = getPercentPos(targetLow);
  const targetHighPos = getPercentPos(targetHigh);

  // Invalidation condition from scenarios
  const invalidationText =
    dir === 'BULLISH'
      ? prediction.scenarios.bull.invalidationCondition
      : dir === 'BEARISH'
      ? prediction.scenarios.bear.invalidationCondition
      : prediction.scenarios.base.invalidationCondition;

  return (
    <div className="terminal-panel p-3.5 sm:p-4 space-y-3.5">
      {/* 1. TOP HEADER: Outlook, Confidence & Track Button */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Probabilistic ML Forecast
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary text-accent-cyan font-semibold border border-accent-cyan-border">
              {prediction.timeframe} • {prediction.predictionHorizon}
            </span>
          </div>

          <div className="flex items-center gap-2.5 mt-1">
            <div
              className={`p-1 rounded border font-mono ${
                dir === 'BULLISH'
                  ? 'bg-market-bullish/10 text-market-bullish border-market-bullish/30'
                  : dir === 'BEARISH'
                  ? 'bg-market-bearish/10 text-market-bearish border-market-bearish/30'
                  : 'bg-market-warning/10 text-market-warning border-market-warning/30'
              }`}
            >
              {dir === 'BULLISH' ? (
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              ) : dir === 'BEARISH' ? (
                <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Minus className="w-4 h-4 stroke-[2.5]" />
              )}
            </div>

            <div>
              <h3
                className={`text-base sm:text-lg font-bold font-mono tracking-tight ${
                  dir === 'BULLISH'
                    ? 'text-market-bullish'
                    : dir === 'BEARISH'
                    ? 'text-market-bearish'
                    : 'text-market-warning'
                }`}
              >
                {dir} BIAS
              </h3>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block -mt-0.5">
                Confidence: <span className="text-slate-900 dark:text-white font-black">{prediction.confidenceScore}%</span> • Volatility: {prediction.volatilityForecast}
              </span>
            </div>
          </div>
        </div>

        {onTrackPrediction && (
          <button
            onClick={onTrackPrediction}
            disabled={isTracked}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors ${
              isTracked
                ? 'bg-market-bullish/10 text-market-bullish border border-market-bullish/30 cursor-default'
                : 'bg-surface-elevated hover:bg-surface-secondary text-cyan-600 dark:text-accent-cyan border border-accent-cyan-border shadow-sm'
            }`}
          >
            {isTracked ? <CheckCircle className="w-3 h-3" /> : <PlusCircle className="w-3 h-3" />}
            <span>{isTracked ? 'Tracked in DB' : 'Track Outcome'}</span>
          </button>
        )}
      </div>

      {/* ACTIONABLE TRADE SIGNAL & POINT EXECUTION BANNER */}
      {prediction.tradeRecommendation && (
        <div
          className={`p-3.5 rounded-lg border shadow-xs space-y-3 ${
            prediction.tradeRecommendation.action === 'STRONG BUY' || prediction.tradeRecommendation.action === 'BUY'
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : prediction.tradeRecommendation.action === 'STRONG SELL' || prediction.tradeRecommendation.action === 'SELL'
              ? 'bg-rose-500/10 border-rose-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          {/* Header with Call & Timing */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-black tracking-wider flex items-center gap-1.5 shadow-xs ${
                  prediction.tradeRecommendation.action === 'STRONG BUY' || prediction.tradeRecommendation.action === 'BUY'
                    ? 'bg-emerald-600 text-white force-white'
                    : prediction.tradeRecommendation.action === 'STRONG SELL' || prediction.tradeRecommendation.action === 'SELL'
                    ? 'bg-rose-600 text-white force-white'
                    : 'bg-amber-500 text-slate-950 font-black'
                }`}
              >
                {prediction.tradeRecommendation.action}
              </span>
              <span
                className={`text-xs font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${
                  prediction.tradeRecommendation.isNow
                    ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/40'
                    : 'bg-surface text-slate-700 dark:text-slate-300 border-border'
                }`}
              >
                {prediction.tradeRecommendation.timing}
              </span>
            </div>

            <div className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300">
              Risk/Reward{' '}
              <span className="text-slate-900 dark:text-white font-black">
                1 : {prediction.tradeRecommendation.riskRewardRatio}
              </span>
            </div>
          </div>

          {/* Execution Entry Point Description */}
          <div className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 flex items-baseline gap-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Execution Point:
            </span>
            <span className="text-cyan-700 dark:text-accent-cyan font-black">
              {prediction.tradeRecommendation.entryZone.label}
            </span>
          </div>

          {/* 4-Grid Execution Points Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-surface border border-border shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Entry Point</span>
              <span className="font-mono font-black text-slate-900 dark:text-white text-xs block mt-0.5">
                {currency} {prediction.tradeRecommendation.entryZone.targetEntry.toLocaleString()}
              </span>
            </div>

            <div className="p-2 rounded bg-surface border border-rose-500/30 shadow-2xs">
              <span className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-bold block">
                Stop Loss Point
              </span>
              <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-xs block mt-0.5">
                {currency} {prediction.tradeRecommendation.stopLoss.price.toLocaleString()} (
                {prediction.tradeRecommendation.stopLoss.percent}%)
              </span>
            </div>

            <div className="p-2 rounded bg-surface border border-emerald-500/30 shadow-2xs">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold block">
                Target 1 (TP1)
              </span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs block mt-0.5">
                {currency} {prediction.tradeRecommendation.takeProfit1.price.toLocaleString()} (+
                {prediction.tradeRecommendation.takeProfit1.percent}%)
              </span>
            </div>

            <div className="p-2 rounded bg-surface border border-emerald-500/30 shadow-2xs">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold block">
                Target 2 (TP2)
              </span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs block mt-0.5">
                {currency} {prediction.tradeRecommendation.takeProfit2.price.toLocaleString()} (+
                {prediction.tradeRecommendation.takeProfit2.percent}%)
              </span>
            </div>
          </div>

          {/* Rationale & Invalidation */}
          <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300 space-y-1 pt-1.5 border-t border-border/50">
            {prediction.tradeRecommendation.rationale.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                <span>{r}</span>
              </div>
            ))}
            <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
              <span>
                Invalidation Trigger: {prediction.tradeRecommendation.invalidationTrigger}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. DIRECTIONAL PROBABILITIES */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-market-bullish font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-market-bullish" />
            Bull: {p.up}%
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Neutral: {p.neutral}%
          </span>
          <span className="text-market-bearish font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-market-bearish" />
            Bear: {p.down}%
          </span>
        </div>

        <div className="w-full h-2 rounded bg-surface-secondary overflow-hidden flex border border-border">
          <div style={{ width: `${p.up}%` }} className="h-full bg-market-bullish transition-all" />
          <div style={{ width: `${p.neutral}%` }} className="h-full bg-slate-400 dark:bg-slate-500 transition-all" />
          <div style={{ width: `${p.down}%` }} className="h-full bg-market-bearish transition-all" />
        </div>
      </div>

      {/* 3. EXPECTED PRICE RANGE SLIDER BAND */}
      <div className="p-3 rounded bg-surface-secondary border border-border space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
            Expected Range Horizon
          </span>
          <span className="text-cyan-600 dark:text-accent-cyan font-black text-xs">
            {currency} {targetLow.toFixed(1)} – {targetHigh.toFixed(1)} (
            {prediction.expectedReturnRange[0] > 0 ? '+' : ''}{prediction.expectedReturnRange[0]}% to{' '}
            {prediction.expectedReturnRange[1] > 0 ? '+' : ''}{prediction.expectedReturnRange[1]}%)
          </span>
        </div>

        {/* Visual Slider Bar */}
        <div className="relative pt-3 pb-1">
          <div className="w-full h-1.5 rounded bg-surface-elevated relative">
            <div
              className="absolute top-0 bottom-0 bg-cyan-500/25 dark:bg-accent-cyan/30 border-y border-cyan-500/50 rounded"
              style={{
                left: `${targetLowPos}%`,
                width: `${Math.max(2, targetHighPos - targetLowPos)}%`
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-cyan-500 shadow-md"
              style={{ left: `calc(${currentPos}% - 6px)` }}
              title={`Current Price: ${currency} ${currentPrice}`}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2">
            <div>
              <span className="block text-slate-400">Support</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{currency} {supportAnchor.toFixed(1)}</span>
            </div>
            <div className="text-center font-bold">
              <span className="block text-slate-400">Current</span>
              <span className="text-slate-900 dark:text-white font-extrabold">{currency} {currentPrice.toFixed(1)}</span>
            </div>
            <div className="text-right">
              <span className="block text-slate-400">Resistance</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{currency} {resistanceAnchor.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INVALIDATION CONDITION BANNER */}
      {invalidationText && (
        <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-xs font-mono flex items-start gap-2 text-rose-800 dark:text-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-market-bearish shrink-0 mt-0.5" />
          <div>
            <span className="font-black uppercase text-[9px] tracking-wider block text-rose-700 dark:text-market-bearish">
              Invalidation Trigger
            </span>
            <span className="text-[11px] leading-relaxed block mt-0.5 font-medium">{invalidationText}</span>
          </div>
        </div>
      )}

      {/* 5. "WHY?" SECTION: Clickable Factor Popovers */}
      <div className="border-t border-border pt-2.5 space-y-1.5">
        <button
          onClick={() => setShowWhyFactors(!showWhyFactors)}
          className="w-full flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-400">
            <HelpCircle className="w-3 h-3 text-cyan-600 dark:text-accent-cyan" />
            <span>Why This Prediction? (Primary Drivers)</span>
          </div>
          {showWhyFactors ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showWhyFactors && (
          <div className="space-y-1 pt-0.5">
            {prediction.featuresUsed && prediction.featuresUsed.length > 0 ? (
              prediction.featuresUsed.slice(0, 4).map((f, idx) => {
                const isSelected = activeFactorInfo === f.name;
                const explanation =
                  FACTOR_EXPLANATIONS[f.name.toUpperCase()] ||
                  FACTOR_EXPLANATIONS[f.category] ||
                  `${f.name} weighted at ${(f.weight * 100).toFixed(0)}% in ensemble tree gradient model.`;

                return (
                  <div key={idx} className="rounded bg-surface-secondary border border-border overflow-hidden">
                    <button
                      onClick={() => setActiveFactorInfo(isSelected ? null : f.name)}
                      className="w-full p-2 flex items-center justify-between text-left text-xs font-mono hover:bg-surface-elevated transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            f.impact === 'POSITIVE'
                              ? 'bg-market-bullish'
                              : f.impact === 'NEGATIVE'
                              ? 'bg-market-bearish'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span className="font-bold text-slate-900 dark:text-white text-[11px]">{f.name}</span>
                        <span className="text-[10px] text-slate-500">({f.category})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">{f.rawValue}</span>
                        <span className="text-[9px] text-cyan-600 dark:text-accent-cyan px-1 rounded bg-accent-cyan-subtle font-bold">
                          {(f.weight * 100).toFixed(0)}% wt
                        </span>
                        <Info className="w-3 h-3 text-slate-400 hover:text-cyan-600 dark:hover:text-accent-cyan" />
                      </div>
                    </button>

                    {isSelected && (
                      <div className="p-2 bg-surface-elevated border-t border-border text-[10px] font-sans text-slate-700 dark:text-slate-300 space-y-1 animate-in fade-in duration-100">
                        <div className="font-mono text-[9px] text-cyan-600 dark:text-accent-cyan font-bold uppercase">
                          Driver Interpretation:
                        </div>
                        <p>{explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-500 font-mono py-1">
                Ensemble technical indicators and volume delta features active.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
