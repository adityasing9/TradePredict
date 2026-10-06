import React from 'react';
import { PriceProjectionConePoint } from '../../types/prediction';

interface PredictionConeChartProps {
  cones: PriceProjectionConePoint[];
  currentPrice: number;
  currency: string;
}

export const PredictionConeChart: React.FC<PredictionConeChartProps> = ({
  cones,
  currentPrice,
  currency
}) => {
  if (!cones || cones.length === 0) return null;

  // Find min and max across all cones
  const allPrices = cones.flatMap((c) => [c.ci95Low, c.ci95High, c.medianProjected, currentPrice]);
  const minP = Math.min(...allPrices) * 0.995;
  const maxP = Math.max(...allPrices) * 1.005;
  const range = maxP - minP || 1;

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingLeft = 55;
  const paddingRight = 60;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => paddingLeft + (index / (cones.length)) * chartW;
  const getY = (val: number) => paddingTop + chartH - ((val - minP) / range) * chartH;

  // Build SVG polygon points for 95% cone (widest)
  const pts95Top = [`${paddingLeft},${getY(currentPrice)}`];
  const pts95Bottom = [`${paddingLeft},${getY(currentPrice)}`];

  // Build SVG polygon points for 68% cone
  const pts68Top = [`${paddingLeft},${getY(currentPrice)}`];
  const pts68Bottom = [`${paddingLeft},${getY(currentPrice)}`];

  // Median line points
  const medianPts = [`${paddingLeft},${getY(currentPrice)}`];

  cones.forEach((c, idx) => {
    const x = getX(idx + 1);
    pts95Top.push(`${x},${getY(c.ci95High)}`);
    pts95Bottom.unshift(`${x},${getY(c.ci95Low)}`);

    pts68Top.push(`${x},${getY(c.ci68High)}`);
    pts68Bottom.unshift(`${x},${getY(c.ci68Low)}`);

    medianPts.push(`${x},${getY(c.medianProjected)}`);
  });

  const polygon95 = [...pts95Top, ...pts95Bottom].join(' ');
  const polygon68 = [...pts68Top, ...pts68Bottom].join(' ');

  return (
    <div className="w-full glass-card rounded-2xl border border-white/[0.08] p-5 shadow-xl flex flex-col justify-between gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div>
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Probabilistic Price Projection Cone
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Geometric Brownian drift with 1-sigma (68% CI) & 2-sigma (95% CI) volatility expansion
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-indigo-300 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500/30 border border-indigo-400 inline-block shadow-sm" />
            68% CI (1σ)
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-white/[0.05] border border-slate-500 inline-block" />
            95% CI (2σ)
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto py-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-48 select-none overflow-visible"
        >
          <defs>
            <linearGradient id="cone95" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="cone68" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.18" />
            </linearGradient>
          </defs>

          {/* 95% Confidence Band Polygon */}
          <polygon
            points={polygon95}
            fill="url(#cone95)"
            stroke="rgba(99, 102, 241, 0.25)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />

          {/* 68% Confidence Band Polygon */}
          <polygon
            points={polygon68}
            fill="url(#cone68)"
            stroke="rgba(99, 102, 241, 0.55)"
            strokeWidth="1.2"
          />

          {/* Median Trajectory Line */}
          <polyline
            points={medianPts.join(' ')}
            fill="none"
            stroke="#818cf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current Price Anchor Point */}
          <circle
            cx={paddingLeft}
            cy={getY(currentPrice)}
            r="4.5"
            fill="#10b981"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <text
            x={paddingLeft - 8}
            y={getY(currentPrice) + 3}
            fill="#10b981"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="end"
          >
            Now: {currentPrice}
          </text>

          {/* Future Step Points */}
          {cones.map((c, idx) => {
            const x = getX(idx + 1);
            return (
              <g key={c.step}>
                {/* Vertical interval indicator */}
                <line
                  x1={x}
                  y1={getY(c.ci95High)}
                  x2={x}
                  y2={getY(c.ci95Low)}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle cx={x} cy={getY(c.medianProjected)} r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                {/* Step Label on bottom */}
                <text
                  x={x}
                  y={svgHeight - 12}
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {c.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Projection Summary Table */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3 border-t border-white/[0.06] text-[11px] font-mono">
        {cones.slice(0, 5).map((c) => (
          <div key={c.step} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="text-slate-400 font-semibold">{c.label}</div>
            <div className="text-cyan-300 font-bold mt-0.5 text-xs">
              {currency} {c.medianProjected}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              [{c.ci68Low} – {c.ci68High}]
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
