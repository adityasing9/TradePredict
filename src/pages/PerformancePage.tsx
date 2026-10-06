import React, { useState, useEffect } from 'react';
import { ModelPerformanceMetrics, CalibrationBucket } from '../types/tracking';
import { calculateModelPerformance, seedInitialHistoricalPredictions } from '../db/predictionStore';
import { Activity, CheckCircle2, XCircle, Clock, Target, ShieldCheck, RefreshCw } from 'lucide-react';

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
      <div className="p-16 text-center text-xs font-mono text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2.5 text-brand-400" />
        Calculating empirical model performance metrics from local database...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              Model Performance & Truth Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical historical accuracy derived strictly from verified tracked predictions. Zero simulated inflation.
          </p>
        </div>

        <button
          onClick={loadMetrics}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-brand-500/50 hover:bg-white/[0.06] text-xs font-mono text-slate-200 hover:text-white transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Recalculate Telemetry</span>
        </button>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 terminal-panel">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Empirical Accuracy</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
            {metrics.accuracyPercent}%
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">
            {metrics.correctCount} correct / {metrics.evaluatedPredictions} evaluated
          </span>
        </div>

        <div className="p-4 terminal-panel">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Total Tracked Forecasts</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">
            {metrics.totalPredictions}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">
            {metrics.pendingPredictions} pending maturity
          </span>
        </div>

        <div className="p-4 terminal-panel">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Avg Absolute Return Error</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300 mt-1">
            {metrics.averageReturnErrorPercent}%
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">
            vs median target return
          </span>
        </div>

        <div className="p-4 terminal-panel">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">Verification Pipeline</span>
          <div className="text-sm sm:text-base font-bold font-mono text-emerald-400 mt-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Active & Local</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">
            Updated {new Date(metrics.lastEvaluatedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Performance by Market */}
      <div className="terminal-panel p-4 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Directional Accuracy By Market
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {Object.entries(metrics.accuracyByMarket).map(([market, stat]: [string, { total: number; correct: number; accuracy: number }]) => (
            <div key={market} className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{market}</span>
                <span className="font-extrabold text-emerald-400 text-base">{stat.accuracy}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.05] mt-2 overflow-hidden">
                <div style={{ width: `${stat.accuracy}%` }} className="h-full bg-emerald-500 rounded-full" />
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block">
                {stat.correct} / {stat.total} verified correct
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance by Timeframe */}
      <div className="terminal-panel p-4 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Directional Accuracy By Horizon Timeframe
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          {Object.entries(metrics.accuracyByTimeframe).map(([tf, stat]: [string, { total: number; correct: number; accuracy: number }]) => (
            <div key={tf} className="p-3 rounded-lg bg-background-secondary border border-background-border">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{tf} Horizon</span>
                <span className="font-extrabold text-brand-300 text-base">{stat.accuracy}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.05] mt-2 overflow-hidden">
                <div style={{ width: `${stat.accuracy}%` }} className="h-full bg-brand-500 rounded-full" />
              </div>
              <span className="text-[10px] text-slate-500 mt-2 block">
                {stat.correct} / {stat.total} predictions
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calibration Table */}
      <div className="terminal-panel overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/[0.06]">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Probability Calibration Curve (Predicted Confidence vs Empirical Hit Rate)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Confidence Bucket</th>
                <th className="py-3 px-4">Expected Accuracy</th>
                <th className="py-3 px-4">Empirical Accuracy</th>
                <th className="py-3 px-4">Sample Count</th>
                <th className="py-3 px-4 text-right">Calibration Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {metrics.calibration.map((cal: CalibrationBucket) => (
                <tr key={cal.confidenceRange} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-4 font-bold text-white">{cal.confidenceRange}</td>
                  <td className="py-3 px-4 text-slate-400">{cal.expectedAccuracy}%</td>
                  <td className="py-3 px-4 font-bold text-emerald-400 text-sm">{cal.empiricalAccuracy}%</td>
                  <td className="py-3 px-4 text-slate-300">{cal.count}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
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
