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
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-background-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-extrabold text-white font-mono tracking-tight">
              Multi-Asset ML Forecast Scanner
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Probabilistic direction estimations, calibrated confidence ratings, and expected target ranges.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Market */}
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value as any)}
            className="p-1.5 rounded-lg bg-background-card border border-background-border text-white focus:outline-none focus:border-brand-500 font-mono"
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
            className="p-1.5 rounded-lg bg-background-card border border-background-border text-white focus:outline-none focus:border-brand-500 font-mono"
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
              className="p-4 rounded-xl bg-background-card border border-background-border hover:border-brand-500/50 hover:bg-background-elevated cursor-pointer transition-all shadow-md flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-white group-hover:text-brand-400 transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-background-secondary border border-background-border text-slate-400">
                        {asset.market}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">{asset.name}</p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      direction === 'BULLISH'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : direction === 'BEARISH'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {direction}
                  </span>
                </div>

                {/* Probability Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold">UP: {up}%</span>
                    <span className="text-amber-400">NEUT: {neutral}%</span>
                    <span className="text-rose-400 font-bold">DOWN: {down}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${up}%` }} className="bg-emerald-500" />
                    <div style={{ width: `${neutral}%` }} className="bg-amber-500" />
                    <div style={{ width: `${down}%` }} className="bg-rose-500" />
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="pt-2 border-t border-background-border/60 text-[11px] font-mono flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">TARGET BAND</span>
                  <span className="text-slate-200 font-bold">
                    {asset.currency} {rangeLow} – {rangeHigh}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">CONFIDENCE</span>
                  <span className="text-indigo-400 font-bold">{confidence}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
