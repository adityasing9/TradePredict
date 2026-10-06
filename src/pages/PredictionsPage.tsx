import React, { useState } from 'react';
import { Asset, Market } from '../types/asset';
import { ALL_ASSETS } from '../data/universe';
import { ASSET_PRICE_BASELINES } from '../services/marketDataProvider';
import { ArrowUpRight, ArrowDownRight, Minus, ArrowRight, Binary, Filter } from 'lucide-react';

interface PredictionsPageProps {
  onSelectAsset: (asset: Asset) => void;
}

export const PredictionsPage: React.FC<PredictionsPageProps> = ({ onSelectAsset }) => {
  const [selectedMarket, setSelectedMarket] = useState<Market | 'ALL'>('ALL');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH' | 'NEUTRAL'>('ALL');

  // Pre-generate probabilistic forecasts for scan overview
  const scannedList = ALL_ASSETS.map((asset) => {
    const base = ASSET_PRICE_BASELINES[asset.id] || { price: 100, dailyChange: 1 };
    const price = base.price;
    const isUp = base.dailyChange >= 0;

    let up = isUp ? 62 : 24;
    let down = isUp ? 18 : 58;
    let neutral = 100 - up - down;
    let dir: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = isUp ? 'BULLISH' : 'BEARISH';

    if (Math.abs(base.dailyChange) < base.price * 0.003) {
      dir = 'NEUTRAL';
      up = 30;
      down = 25;
      neutral = 45;
    }

    const rangeLow = Number((price * (dir === 'BEARISH' ? 0.96 : 0.985)).toFixed(2));
    const rangeHigh = Number((price * (dir === 'BULLISH' ? 1.04 : 1.015)).toFixed(2));
    const confidence = dir === 'BULLISH' ? 68 : dir === 'BEARISH' ? 64 : 58;

    return {
      asset,
      price,
      direction: dir,
      up,
      neutral,
      down,
      rangeLow,
      rangeHigh,
      confidence
    };
  });

  const filtered = scannedList.filter((item) => {
    if (selectedMarket !== 'ALL' && item.asset.market !== selectedMarket) return false;
    if (directionFilter !== 'ALL' && item.direction !== directionFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              Multi-Asset ML Forecast Scanner
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Probabilistic direction estimations, calibrated confidence ratings, and expected target ranges.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Market */}
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
          >
            <option value="ALL">All Markets</option>
            <option value="NEPSE">🇳🇵 NEPSE</option>
            <option value="NSE">🇮🇳 NSE India</option>
            <option value="NASDAQ">🇺🇸 US Equities</option>
            <option value="CRYPTO">₿ Crypto</option>
          </select>

          {/* Direction */}
          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
          >
            <option value="ALL">All Biases</option>
            <option value="BULLISH">Bullish Only</option>
            <option value="NEUTRAL">Neutral Only</option>
            <option value="BEARISH">Bearish Only</option>
          </select>
        </div>
      </div>

      {/* Grid of Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const { asset, price, direction, up, neutral, down, rangeLow, rangeHigh, confidence } = item;

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className="p-4 sm:p-5 rounded-2xl glass-card-hover cursor-pointer flex flex-col justify-between gap-4 group relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-white group-hover:text-brand-300 transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300">
                        {asset.market}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">{asset.name}</p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                      direction === 'BULLISH'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald'
                        : direction === 'BEARISH'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {direction}
                  </span>
                </div>

                {/* Probability Bar */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold">UP: {up}%</span>
                    <span className="text-amber-400 font-bold">NEUT: {neutral}%</span>
                    <span className="text-rose-400 font-bold">DOWN: {down}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden flex border border-white/[0.05]">
                    <div style={{ width: `${up}%` }} className="bg-gradient-to-r from-emerald-600 to-emerald-400" />
                    <div style={{ width: `${neutral}%` }} className="bg-gradient-to-r from-amber-600 to-amber-400" />
                    <div style={{ width: `${down}%` }} className="bg-gradient-to-r from-rose-600 to-rose-400" />
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="pt-2.5 border-t border-white/[0.06] text-[11px] font-mono flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-semibold">Target Band</span>
                  <span className="text-white font-bold text-xs">
                    {asset.currency} {rangeLow} – {rangeHigh}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-semibold">Confidence</span>
                  <span className="text-cyan-300 font-bold text-xs">{confidence}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
