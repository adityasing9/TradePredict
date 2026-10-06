import React from 'react';
import { MLPredictionResult } from '../../types/prediction';
import { Info, ShieldAlert, Cpu } from 'lucide-react';

interface ModelTransparencyProps {
  prediction: MLPredictionResult;
}

export const ModelTransparency: React.FC<ModelTransparencyProps> = ({ prediction }) => {
  const { metadata, featuresUsed, ensembleWeights } = prediction;

  return (
    <div className="w-full bg-background-card rounded-xl border border-background-border p-5 shadow-lg flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-background-border pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Model Transparency & Feature Attribution
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-secondary border border-background-border text-slate-400">
          Version: {metadata.modelVersion}
        </span>
      </div>

      {/* Model Spec Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Model Architecture</span>
          <span className="text-slate-200 font-semibold block mt-0.5 truncate">{metadata.modelType}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Training & Validation</span>
          <span className="text-slate-200 font-semibold block mt-0.5 truncate">{metadata.trainingWindow}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-background-secondary border border-background-border">
          <span className="text-[10px] text-slate-500 uppercase block">Feature Engineering</span>
          <span className="text-slate-200 font-semibold block mt-0.5 truncate">{metadata.featureVersion}</span>
        </div>
      </div>

      {/* Ensemble Weights Breakdown */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
          Ensemble Component Allocations
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {ensembleWeights.map((comp) => (
            <div key={comp.component} className="p-2.5 rounded-lg bg-background-secondary border border-background-border">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">{comp.component}</span>
                <span className="text-brand-400 font-bold">{comp.weight}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{comp.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Feature Weights */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
          Dominant Decision Features
        </h4>
        <div className="space-y-2">
          {featuresUsed.map((feat) => {
            const pct = Math.round(feat.weight * 100);
            return (
              <div key={feat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{feat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">{feat.rawValue}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        feat.impact === 'POSITIVE'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : feat.impact === 'NEGATIVE'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-slate-500/10 text-slate-400'
                      }`}
                    >
                      {feat.impact}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-background-secondary overflow-hidden">
                  <div
                    style={{ width: `${pct * 3.5}%` }}
                    className="h-full bg-brand-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Disclaimer Banner */}
      <div className="p-3 rounded-lg bg-background-secondary/80 border border-background-border flex items-start gap-2.5 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed font-sans text-[11px]">
          {metadata.disclaimer}
        </p>
      </div>
    </div>
  );
};
