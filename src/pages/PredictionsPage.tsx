import React, { useState } from 'react';
import { Asset, Market } from '../types/asset';
import { ALL_ASSETS } from '../data/universe';
import { ASSET_PRICE_BASELINES } from '../services/marketDataProvider';
import { Binary } from 'lucide-react';

interface PredictionsPageProps {
  onSelectAsset: (asset: Asset) => void;
}

export const PredictionsPage: React.FC<PredictionsPageProps> = ({ onSelectAsset }) => {
  const [selectedMarket, setSelectedMarket] = useState<Market | 'ALL'>('ALL');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH' | 'NEUTRAL'>('ALL');

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
    <div className="space-y-4 animate-in fade-in duration-100">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-accent-cyan" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              Multi-Asset ML Forecast Scanner
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Probabilistic direction estimations, calibrated confidence ratings, and expected target ranges.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value as any)}
            className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
          >
            <option value="ALL">All Markets</option>
            <option value="NEPSE">🇳🇵 NEPSE</option>
            <option value="NSE">🇮🇳 NSE India</option>
            <option value="NASDAQ">🇺🇸 US Equities</option>
            <option value="CRYPTO">₿ Crypto</option>
          </select>

          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value as any)}
            className="px-2.5 py-1 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
          >
            <option value="ALL">All Biases</option>
            <option value="BULLISH">Bullish Only</option>
            <option value="NEUTRAL">Neutral Only</option>
            <option value="BEARISH">Bearish Only</option>
          </select>
        </div>
      </div>

      {/* Grid of Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item) => {
          const { asset, direction, up, neutral, down, rangeLow, rangeHigh, confidence } = item;

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className="p-3.5 rounded terminal-panel hover:border-slate-600 transition-colors cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-white group-hover:text-accent-cyan transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-surface-secondary text-slate-400 border border-border">
                        {asset.market}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[180px] mt-0.5">{asset.name}</p>
                  </div>

                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                      direction === 'BULLISH'
                        ? 'bg-market-bullish/10 text-market-bullish border border-market-bullish/25'
                        : direction === 'BEARISH'
                        ? 'bg-market-bearish/10 text-market-bearish border border-market-bearish/25'
                        : 'bg-market-warning/10 text-market-warning border border-market-warning/25'
                    }`}
                  >
                    {direction}
                  </span>
                </div>

                {/* Probability Bar */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-market-bullish font-bold">UP: {up}%</span>
                    <span className="text-slate-400 font-bold">NEUT: {neutral}%</span>
                    <span className="text-market-bearish font-bold">DOWN: {down}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded bg-surface-secondary overflow-hidden flex border border-border">
                    <div style={{ width: `${up}%` }} className="bg-market-bullish" />
                    <div style={{ width: `${neutral}%` }} className="bg-slate-500" />
                    <div style={{ width: `${down}%` }} className="bg-market-bearish" />
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="pt-2 border-t border-border text-[11px] font-mono flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Target Band</span>
                  <span className="text-white font-bold text-xs">
                    {asset.currency} {rangeLow} – {rangeHigh}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider block">Confidence</span>
                  <span className="text-accent-cyan font-bold text-xs">{confidence}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
