import React from 'react';
import { MLPredictionResult } from '../../types/prediction';
import { ArrowUpRight, ArrowDownRight, Minus, PlusCircle, CheckCircle } from 'lucide-react';

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
          icon: <ArrowUpRight className="w-5 h-5 text-emerald-400" />
        };
      case 'BEARISH':
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/30',
          icon: <ArrowDownRight className="w-5 h-5 text-rose-400" />
        };
      case 'NEUTRAL':
      default:
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/30',
          icon: <Minus className="w-5 h-5 text-amber-400" />
        };
    }
  };

  const style = getDirStyle();

  return (
    <div className="w-full bg-background-card rounded-xl border border-background-border p-5 shadow-lg flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Probabilistic ML Forecast
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-elevated text-brand-400 border border-background-border">
              {prediction.timeframe} Horizon ({prediction.predictionHorizon})
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`p-1.5 rounded-lg border ${style.bg}`}>{style.icon}</div>
            <h3 className={`text-xl font-extrabold tracking-tight ${style.text}`}>
              {dir} FORECAST
            </h3>
          </div>
        </div>

        {onTrackPrediction && (
          <button
            onClick={onTrackPrediction}
            disabled={isTracked}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              isTracked
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/20'
            }`}
          >
            {isTracked ? <CheckCircle className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            <span>{isTracked ? 'Prediction Tracked' : 'Track Outcome'}</span>
          </button>
        )}
      </div>

      {/* Probabilities Triple Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-400 font-bold">UP: {p.up}%</span>
          <span className="text-amber-400 font-bold">NEUTRAL: {p.neutral}%</span>
          <span className="text-rose-400 font-bold">DOWN: {p.down}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-background-secondary overflow-hidden flex border border-background-border">
          <div
            style={{ width: `${p.up}%` }}
            className="h-full bg-emerald-500 transition-all duration-500"
            title={`Up: ${p.up}%`}
          />
          <div
            style={{ width: `${p.neutral}%` }}
            className="h-full bg-amber-500 transition-all duration-500"
            title={`Neutral: ${p.neutral}%`}
          />
          <div
            style={{ width: `${p.down}%` }}
            className="h-full bg-rose-500 transition-all duration-500"
            title={`Down: ${p.down}%`}
          />
        </div>
      </div>

      {/* Key Metric Grids */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-background-border text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-400 block uppercase">Expected Price Band</span>
          <span className="text-white font-bold block mt-0.5">
            {currency} {prediction.expectedPriceRange[0]} – {prediction.expectedPriceRange[1]}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-400 block uppercase">Expected Return Band</span>
          <span className="text-brand-400 font-bold block mt-0.5">
            {prediction.expectedReturnRange[0] > 0 ? '+' : ''}{prediction.expectedReturnRange[0]}% to{' '}
            {prediction.expectedReturnRange[1] > 0 ? '+' : ''}{prediction.expectedReturnRange[1]}%
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-400 block uppercase">Model Confidence</span>
          <span className="text-indigo-400 font-bold block mt-0.5">
            {prediction.confidenceScore}% / 100
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-400 block uppercase">Volatility Expectation</span>
          <span className="text-amber-400 font-bold block mt-0.5">
            {prediction.volatilityForecast}
          </span>
        </div>
      </div>
    </div>
  );
};
