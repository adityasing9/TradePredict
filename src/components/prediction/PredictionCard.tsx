import React from 'react';
import { MLPredictionResult } from '../../types/prediction';
import { ArrowUpRight, ArrowDownRight, Minus, PlusCircle, CheckCircle, Sparkles } from 'lucide-react';

interface PredictionCardProps {
  prediction: MLPredictionResult;
  currency: string;
  onTrackPrediction?: () => void;
  isTracked?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  currency,
  onTrackPrediction,
  isTracked = false
}) => {
  const p = prediction.directionProbabilities;
  const dir = prediction.direction;

  const getDirStyle = () => {
    switch (dir) {
      case 'BULLISH':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          glow: 'shadow-glow-emerald',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <ArrowUpRight className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
        };
      case 'BEARISH':
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/30',
          glow: 'shadow-glow-rose',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <ArrowDownRight className="w-5 h-5 text-rose-400 stroke-[2.5]" />
        };
      case 'NEUTRAL':
      default:
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/30',
          glow: 'shadow-none',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <Minus className="w-5 h-5 text-amber-400 stroke-[2.5]" />
        };
    }
  };

  const style = getDirStyle();

  return (
    <div className="w-full glass-card rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl flex flex-col justify-between gap-5 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 ${
        dir === 'BULLISH' ? 'bg-emerald-500' : dir === 'BEARISH' ? 'bg-rose-500' : 'bg-amber-500'
      }`} />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Probabilistic ML Forecast
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold">
              {prediction.timeframe} Horizon ({prediction.predictionHorizon})
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1.5">
            <div className={`p-2 rounded-xl border ${style.bg} ${style.glow} transition-all`}>
              {style.icon}
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${style.text}`}>
                {dir} OUTLOOK
              </h3>
              <span className="text-[11px] font-mono text-slate-400 block -mt-0.5">
                Ensemble Decision Trees (Confidence: {prediction.confidenceScore}%)
              </span>
            </div>
          </div>
        </div>

        {onTrackPrediction && (
          <button
            onClick={onTrackPrediction}
            disabled={isTracked}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-md ${
              isTracked
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-500 hover:to-brand-400 hover:shadow-glow-indigo'
            }`}
          >
            {isTracked ? <CheckCircle className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            <span>{isTracked ? 'Prediction Tracked' : 'Track Outcome'}</span>
          </button>
        )}
      </div>

      {/* Probabilities Multi-Bar */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            UP: {p.up}%
          </span>
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            NEUTRAL: {p.neutral}%
          </span>
          <span className="text-rose-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            DOWN: {p.down}%
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-white/[0.04] overflow-hidden flex border border-white/[0.06] p-0.5">
          <div
            style={{ width: `${p.up}%` }}
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full transition-all duration-500"
            title={`Up: ${p.up}%`}
          />
          <div
            style={{ width: `${p.neutral}%` }}
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
            title={`Neutral: ${p.neutral}%`}
          />
          <div
            style={{ width: `${p.down}%` }}
            className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-r-full transition-all duration-500"
            title={`Down: ${p.down}%`}
          />
        </div>
      </div>

      {/* Key Metric Grids */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/[0.06] text-xs font-mono relative z-10">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Expected Price Band</span>
          <span className="text-white font-bold block mt-1 text-sm">
            {currency} {prediction.expectedPriceRange[0]} – {prediction.expectedPriceRange[1]}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Expected Return Band</span>
          <span className="text-brand-300 font-bold block mt-1 text-sm">
            {prediction.expectedReturnRange[0] > 0 ? '+' : ''}{prediction.expectedReturnRange[0]}% to{' '}
            {prediction.expectedReturnRange[1] > 0 ? '+' : ''}{prediction.expectedReturnRange[1]}%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Model Confidence</span>
          <span className="text-cyan-400 font-bold block mt-1 text-sm">
            {prediction.confidenceScore}% / 100
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Volatility Expectation</span>
          <span className="text-amber-400 font-bold block mt-1 text-sm">
            {prediction.volatilityForecast}
          </span>
        </div>
      </div>
    </div>
  );
};
