import React, { useState, useEffect } from 'react';
import { TrackedPrediction } from '../types/tracking';
import { getAllPredictions, evaluatePrediction, deletePrediction } from '../db/predictionStore';
import { ASSET_PRICE_BASELINES } from '../services/marketDataProvider';
import { CheckCircle2, XCircle, Clock, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';

export const PredictionHistoryPage: React.FC = () => {
  const [predictions, setPredictions] = useState<TrackedPrediction[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'EVALUATED' | 'PENDING'>('ALL');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(false);
    const data = await getAllPredictions();
    setPredictions(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEvaluate = async (pred: TrackedPrediction) => {
    const baseline = ASSET_PRICE_BASELINES[pred.assetId] || { price: pred.startingPrice * 1.015 };
    await evaluatePrediction(pred.id, baseline.price, 'Evaluated against latest market session quote');
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await deletePrediction(id);
    await loadData();
  };

  const filtered = predictions.filter((p) => {
    if (filter === 'EVALUATED') return p.evaluated;
    if (filter === 'PENDING') return !p.evaluated;
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-100">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              Truth Tracking & Verification Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
            Audit trail of all recorded market predictions evaluated against actual market price movements.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-xs font-mono p-1 rounded bg-surface-secondary border border-border">
          {(['ALL', 'EVALUATED', 'PENDING'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1 rounded transition-all ${
                filter === mode
                  ? 'bg-cyan-600 dark:bg-accent-cyan text-white dark:text-black font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="terminal-panel rounded overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-secondary border-b border-border text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Horizon</th>
                <th className="py-2.5 px-3">Starting Price</th>
                <th className="py-2.5 px-3">Predicted Bias</th>
                <th className="py-2.5 px-3">Actual Price</th>
                <th className="py-2.5 px-3">Actual Return</th>
                <th className="py-2.5 px-3">Outcome</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface-secondary transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">{p.symbol}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{p.market}</span>
                  </td>

                  <td className="py-2.5 px-3">
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{p.timeframe}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 text-slate-900 dark:text-white font-bold">
                    {p.startingPrice}
                  </td>

                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        p.predictedDirection === 'BULLISH'
                          ? 'text-emerald-600 dark:text-market-bullish'
                          : p.predictedDirection === 'BEARISH'
                          ? 'text-rose-600 dark:text-market-bearish'
                          : 'text-amber-600 dark:text-market-warning'
                      }`}
                    >
                      {p.predictedDirection}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Up: {p.predictedProbabilities.up}%
                    </span>
                  </td>

                  <td className="py-2.5 px-3">
                    {p.evaluated ? (
                      <span className="text-slate-900 dark:text-white font-bold">{p.actualPriceAtEvaluation}</span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3">
                    {p.evaluated && p.actualReturnPercent !== undefined ? (
                      <span
                        className={`font-bold ${
                          p.actualReturnPercent >= 0 ? 'text-emerald-600 dark:text-market-bullish' : 'text-rose-600 dark:text-market-bearish'
                        }`}
                      >
                        {p.actualReturnPercent > 0 ? '+' : ''}{p.actualReturnPercent}%
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3">
                    {p.evaluated ? (
                      p.outcome === 'CORRECT' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-market-bullish border border-emerald-500/30 font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          CORRECT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-market-bearish border border-rose-500/30 font-bold text-[10px]">
                          <XCircle className="w-3 h-3" />
                          INCORRECT
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-market-warning border border-amber-500/30 font-bold text-[10px]">
                        <Clock className="w-3 h-3" />
                        PENDING
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!p.evaluated && (
                        <button
                          onClick={() => handleEvaluate(p)}
                          className="px-2.5 py-1 rounded bg-cyan-600/15 hover:bg-cyan-600 text-cyan-700 dark:text-cyan-300 hover:text-white border border-cyan-500/30 transition-all font-semibold text-[10px]"
                          title="Evaluate outcome with current session price"
                        >
                          Evaluate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
