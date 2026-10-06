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
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              Truth Tracking & Verification Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Audit trail of all recorded market predictions evaluated against actual market price movements.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs font-mono p-1 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          {(['ALL', 'EVALUATED', 'PENDING'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-150 ${
                filter === mode
                  ? 'bg-brand-500 text-white font-bold shadow-sm shadow-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-card rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Horizon</th>
                <th className="py-3 px-4">Starting Price</th>
                <th className="py-3 px-4">Predicted Bias</th>
                <th className="py-3 px-4">Actual Price</th>
                <th className="py-3 px-4">Actual Return</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block text-sm">{p.symbol}</span>
                    <span className="text-[10px] text-slate-500">{p.market}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-slate-200 font-semibold">{p.timeframe}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-white font-bold">
                    {p.startingPrice}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        p.predictedDirection === 'BULLISH'
                          ? 'text-emerald-400'
                          : p.predictedDirection === 'BEARISH'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {p.predictedDirection}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Up: {p.predictedProbabilities.up}%
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {p.evaluated ? (
                      <span className="text-white font-bold">{p.actualPriceAtEvaluation}</span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {p.evaluated && p.actualReturnPercent !== undefined ? (
                      <span
                        className={`font-bold ${
                          p.actualReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {p.actualReturnPercent > 0 ? '+' : ''}{p.actualReturnPercent}%
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {p.evaluated ? (
                      p.outcome === 'CORRECT' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] shadow-glow-emerald">
                          <CheckCircle2 className="w-3 h-3" />
                          CORRECT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[10px] shadow-glow-rose">
                          <XCircle className="w-3 h-3" />
                          INCORRECT
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px]">
                        <Clock className="w-3 h-3" />
                        PENDING
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!p.evaluated && (
                        <button
                          onClick={() => handleEvaluate(p)}
                          className="px-2.5 py-1 rounded-xl bg-brand-500/15 text-brand-300 hover:bg-brand-500 hover:text-white border border-brand-500/30 transition-all font-semibold text-[10px]"
                          title="Evaluate outcome with current session price"
                        >
                          Evaluate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/[0.04] transition-colors"
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
