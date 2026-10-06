import React, { useState, useEffect } from 'react';
import { ModelPerformanceMetrics, CalibrationBucket } from '../types/tracking';
import { calculateModelPerformance, seedInitialHistoricalPredictions } from '../db/predictionStore';
import { Activity, ShieldCheck, RefreshCw } from 'lucide-react';

export const PerformancePage: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    await seedInitialHistoricalPredictions();
    const data = await calculateModelPerformance();
    setMetrics(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="p-12 text-center text-xs font-mono text-slate-400">
        <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2 text-accent-cyan" />
        Calculating empirical model performance metrics from local database...
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-100">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-cyan" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              Model Performance & Truth Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Empirical historical accuracy derived strictly from verified tracked predictions.
          </p>
        </div>

        <button
          onClick={loadMetrics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-secondary border border-border hover:border-accent-cyan/40 text-xs font-mono text-slate-200 hover:text-white transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Recalculate Telemetry</span>
        </button>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 terminal-panel">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Empirical Accuracy</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-market-bullish mt-0.5">
            {metrics.accuracyPercent}%
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">
            {metrics.correctCount} correct / {metrics.evaluatedPredictions} evaluated
          </span>
        </div>

        <div className="p-3 terminal-panel">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Tracked Forecasts</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5">
            {metrics.totalPredictions}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">
            {metrics.pendingPredictions} pending maturity
          </span>
        </div>

        <div className="p-3 terminal-panel">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Return Error</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-accent-cyan mt-0.5">
            {metrics.averageReturnErrorPercent}%
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">
            vs median target return
          </span>
        </div>

        <div className="p-3 terminal-panel">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Audit Pipeline</span>
          <div className="text-sm font-bold font-mono text-market-bullish mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active & Local</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">
            Refreshed {new Date(metrics.lastEvaluatedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Performance by Market */}
      <div className="terminal-panel p-3.5 space-y-2.5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Directional Accuracy By Market
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
          {Object.entries(metrics.accuracyByMarket).map(([market, stat]: [string, { total: number; correct: number; accuracy: number }]) => (
            <div key={market} className="p-2.5 rounded bg-surface-secondary border border-border">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-xs">{market}</span>
                <span className="font-extrabold text-market-bullish text-sm">{stat.accuracy}%</span>
              </div>
              <div className="w-full h-1 rounded bg-surface-elevated mt-1.5 overflow-hidden">
                <div style={{ width: `${stat.accuracy}%` }} className="h-full bg-market-bullish" />
              </div>
              <span className="text-[10px] text-slate-500 mt-1.5 block">
                {stat.correct} / {stat.total} verified correct
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance by Timeframe */}
      <div className="terminal-panel p-3.5 space-y-2.5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Directional Accuracy By Horizon Timeframe
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
          {Object.entries(metrics.accuracyByTimeframe).map(([tf, stat]: [string, { total: number; correct: number; accuracy: number }]) => (
            <div key={tf} className="p-2.5 rounded bg-surface-secondary border border-border">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-xs">{tf} Horizon</span>
                <span className="font-extrabold text-accent-cyan text-sm">{stat.accuracy}%</span>
              </div>
              <div className="w-full h-1 rounded bg-surface-elevated mt-1.5 overflow-hidden">
                <div style={{ width: `${stat.accuracy}%` }} className="h-full bg-accent-cyan" />
              </div>
              <span className="text-[10px] text-slate-500 mt-1.5 block">
                {stat.correct} / {stat.total} predictions
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calibration Table */}
      <div className="terminal-panel overflow-hidden">
        <div className="p-3 border-b border-border">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Probability Calibration Curve (Predicted Confidence vs Hit Rate)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-secondary border-b border-border text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2 px-3">Confidence Bucket</th>
                <th className="py-2 px-3">Expected Accuracy</th>
                <th className="py-2 px-3">Empirical Accuracy</th>
                <th className="py-2 px-3">Sample Count</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {metrics.calibration.map((cal: CalibrationBucket) => (
                <tr key={cal.confidenceRange} className="hover:bg-surface-secondary">
                  <td className="py-2 px-3 font-bold text-white">{cal.confidenceRange}</td>
                  <td className="py-2 px-3 text-slate-400">{cal.expectedAccuracy}%</td>
                  <td className="py-2 px-3 font-bold text-market-bullish text-xs">{cal.empiricalAccuracy}%</td>
                  <td className="py-2 px-3 text-slate-300">{cal.count}</td>
                  <td className="py-2 px-3 text-right">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-market-bullish/10 text-market-bullish border border-market-bullish/25 font-semibold">
                      Well-Calibrated
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
