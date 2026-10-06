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
    <div className="w-full terminal-panel p-3.5 sm:p-4 flex flex-col justify-between gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
        <div>
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            Probabilistic Price Projection Cone
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
            1-sigma (68% CI) & 2-sigma (95% CI) volatility expansion
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-accent-cyan font-semibold">
            <span className="w-2 h-2 rounded bg-accent-cyan/20 border border-accent-cyan inline-block" />
            68% CI (1σ)
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded bg-surface-secondary border border-border inline-block" />
            95% CI (2σ)
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto py-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-44 select-none overflow-visible"
        >
          <defs>
            <linearGradient id="cone95" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="cone68" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* 95% Confidence Band Polygon */}
          <polygon
            points={polygon95}
            fill="url(#cone95)"
            stroke="rgba(34, 211, 238, 0.2)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />

          {/* 68% Confidence Band Polygon */}
          <polygon
            points={polygon68}
            fill="url(#cone68)"
            stroke="rgba(34, 211, 238, 0.45)"
            strokeWidth="1.2"
          />

          {/* Median Trajectory Line */}
          <polyline
            points={medianPts.join(' ')}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current Price Anchor Point */}
          <circle
            cx={paddingLeft}
            cy={getY(currentPrice)}
            r="4"
            fill="#22c55e"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <text
            x={paddingLeft - 8}
            y={getY(currentPrice) + 3}
            fill="#22c55e"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="end"
          >
            {currentPrice}
          </text>

          {/* Future Step Points */}
          {cones.map((c, idx) => {
            const x = getX(idx + 1);
            return (
              <g key={c.step}>
                <line
                  x1={x}
                  y1={getY(c.ci95High)}
                  x2={x}
                  y2={getY(c.ci95Low)}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle cx={x} cy={getY(c.medianProjected)} r="3.5" fill="#22d3ee" stroke="#ffffff" strokeWidth="1.5" />
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2.5 border-t border-border text-[11px] font-mono">
        {cones.slice(0, 5).map((c) => (
          <div key={c.step} className="p-2 rounded bg-surface-secondary border border-border">
            <div className="text-slate-400 font-semibold text-[10px]">{c.label}</div>
            <div className="text-accent-cyan font-bold mt-0.5 text-xs">
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
