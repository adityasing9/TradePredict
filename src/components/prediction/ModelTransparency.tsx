import React from 'react';
import { MLPredictionResult } from '../../types/prediction';
import { ShieldAlert, Cpu } from 'lucide-react';

interface ModelTransparencyProps {
  prediction: MLPredictionResult;
}

export const ModelTransparency: React.FC<ModelTransparencyProps> = ({ prediction }) => {
  const { metadata, featuresUsed, ensembleWeights } = prediction;

  return (
    <div className="w-full terminal-panel p-4 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-600 dark:text-accent-cyan" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Model Transparency & Feature Attribution
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary border border-border text-slate-500 dark:text-slate-400 font-semibold">
          Version: {metadata.modelVersion}
        </span>
      </div>

      {/* Model Spec Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Model Architecture</span>
          <span className="text-slate-900 dark:text-slate-200 font-bold block mt-0.5 truncate">{metadata.modelType}</span>
        </div>
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Training & Validation</span>
          <span className="text-slate-900 dark:text-slate-200 font-bold block mt-0.5 truncate">{metadata.trainingWindow}</span>
        </div>
        <div className="p-2.5 rounded bg-surface-secondary border border-border">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Feature Engineering</span>
          <span className="text-slate-900 dark:text-slate-200 font-bold block mt-0.5 truncate">{metadata.featureVersion}</span>
        </div>
      </div>

      {/* Ensemble Weights Breakdown */}
      <div className="space-y-1.5">
        <h4 className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-300 uppercase">
          Ensemble Component Allocations
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {ensembleWeights.map((comp) => (
            <div key={comp.component} className="p-2.5 rounded bg-surface-secondary border border-border">
              <div className="flex items-center justify-between">
                <span className="text-slate-900 dark:text-slate-200 font-bold">{comp.component}</span>
                <span className="text-cyan-600 dark:text-accent-cyan font-black">{comp.weight}%</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{comp.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Feature Weights */}
      <div className="space-y-1.5">
        <h4 className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-300 uppercase">
          Dominant Decision Features
        </h4>
        <div className="space-y-1.5">
          {featuresUsed.map((feat) => {
            const pct = Math.round(feat.weight * 100);
            return (
              <div key={feat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-900 dark:text-slate-200 font-semibold">{feat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400 font-semibold text-[11px]">{feat.rawValue}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        feat.impact === 'POSITIVE'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-market-bullish border border-emerald-500/30'
                          : feat.impact === 'NEGATIVE'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-market-bearish border border-rose-500/30'
                          : 'bg-surface-elevated text-slate-600 dark:text-slate-400 border border-border'
                      }`}
                    >
                      {feat.impact}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded bg-surface-secondary overflow-hidden border border-border">
                  <div
                    style={{ width: `${pct * 3.5}%` }}
                    className="h-full bg-cyan-500 dark:bg-accent-cyan"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Disclaimer Banner */}
      <div className="p-2.5 rounded bg-surface-secondary border border-border flex items-start gap-2 text-xs text-slate-400">
        <ShieldAlert className="w-3.5 h-3.5 text-market-warning flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed font-mono text-[10px]">
          {metadata.disclaimer}
        </p>
      </div>
    </div>
  );
};
