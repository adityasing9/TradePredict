import React, { useState } from 'react';
import { MLPredictionResult } from '../../types/prediction';
import { Asset } from '../../types/asset';
import { TrackedPrediction } from '../../types/tracking';
import { savePrediction } from '../../db/predictionStore';
import { CheckCircle2, X, ShieldCheck } from 'lucide-react';

interface TrackPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: MLPredictionResult;
  asset: Asset;
  onTrackedSuccess: () => void;
}

export const TrackPredictionModal: React.FC<TrackPredictionModalProps> = ({
  isOpen,
  onClose,
  prediction,
  asset,
  onTrackedSuccess
}) => {
  const [horizonHours, setHorizonHours] = useState(24);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setSaving(true);
    const now = Date.now();
    const evaluateAt = now + horizonHours * 3600 * 1000;

    const record: TrackedPrediction = {
      id: `tracked-${asset.symbol.toLowerCase()}-${now}`,
      assetId: asset.id,
      symbol: asset.symbol,
      market: asset.market,
      timeframe: prediction.timeframe,
      createdAt: now,
      evaluateAt,
      startingPrice: prediction.currentPrice,
      predictedDirection: prediction.direction,
      predictedProbabilities: prediction.directionProbabilities,
      predictedPriceRange: prediction.expectedPriceRange,
      predictedReturnRange: prediction.expectedReturnRange,
      predictedConfidence: prediction.confidenceScore,
      modelVersion: prediction.metadata.modelVersion,
      evaluated: false,
      notes: notes.trim() || undefined
    };

    try {
      await savePrediction(record);
      onTrackedSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to track prediction:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="w-full max-w-md bg-surface border border-border rounded-lg shadow-modal p-4 flex flex-col gap-3.5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent-cyan" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Track Prediction For Verification
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Forecast Details Snapshot */}
        <div className="p-2.5 rounded bg-surface-secondary border border-border space-y-1 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Asset:</span>
            <span className="text-white font-bold">{asset.symbol} ({asset.name})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Starting Price:</span>
            <span className="text-white font-bold">{asset.currency} {prediction.currentPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Predicted Bias:</span>
            <span className={`font-bold ${
              prediction.direction === 'BULLISH'
                ? 'text-market-bullish'
                : prediction.direction === 'BEARISH'
                ? 'text-market-bearish'
                : 'text-market-warning'
            }`}>
              {prediction.direction} ({prediction.directionProbabilities.up}% UP / {prediction.directionProbabilities.down}% DOWN)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Target Range:</span>
            <span className="text-slate-300">
              {asset.currency} {prediction.expectedPriceRange[0]} – {prediction.expectedPriceRange[1]}
            </span>
          </div>
        </div>

        {/* Target Horizon Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-300 block">
            Evaluation Target Horizon:
          </label>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
            {[4, 12, 24, 72].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setHorizonHours(hours)}
                className={`py-1 rounded border transition-colors ${
                  horizonHours === hours
                    ? 'bg-surface-elevated text-accent-cyan border-accent-cyan font-bold'
                    : 'bg-surface-secondary text-slate-400 border-border hover:text-white'
                }`}
              >
                {hours >= 24 ? `${hours / 24} Day` : `${hours}h`}
              </button>
            ))}
          </div>
        </div>

        {/* User Notes */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-slate-300 block">
            Research Thesis Notes (Optional):
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Watching breakout above 50 SMA..."
            rows={2}
            className="w-full p-2 rounded bg-surface-secondary border border-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-cyan resize-none font-mono"
          />
        </div>

        {/* Storage Notice */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-market-bullish flex-shrink-0" />
          <span>Permanently recorded into local IndexedDB. Zero cloud telemetry.</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="px-3.5 py-1 rounded text-xs font-mono font-bold bg-surface-elevated hover:bg-surface text-accent-cyan border border-border hover:border-accent-cyan/40 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Recording...' : 'Save to Prediction Log'}
          </button>
        </div>
      </div>
    </div>
  );
};
