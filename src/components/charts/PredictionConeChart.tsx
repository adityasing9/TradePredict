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
  const paddingLeft = 50;
  const paddingRight = 60;
  const paddingTop = 20;
  const paddingBottom = 30;

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
    <div className="w-full bg-background-card rounded-xl border border-background-border p-4 shadow-lg flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Probabilistic Price Projection Cone
          </h4>
          <p className="text-[11px] text-slate-400">
            Geometric Brownian drift with 1-sigma (68% CI) & 2-sigma (95% CI) volatility expansion
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-indigo-400">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500/20 border border-indigo-400 inline-block" />
            68% Confidence
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-slate-500/10 border border-slate-600 inline-block" />
            95% Confidence
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-48 select-none"
        >
          {/* 95% Confidence Band Polygon */}
          <polygon
            points={polygon95}
            fill="rgba(99, 102, 241, 0.08)"
            stroke="rgba(99, 102, 241, 0.2)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* 68% Confidence Band Polygon */}
          <polygon
            points={polygon68}
            fill="rgba(99, 102, 241, 0.18)"
            stroke="rgba(99, 102, 241, 0.45)"
            strokeWidth="1"
          />

          {/* Median Trajectory Line */}
          <polyline
            points={medianPts.join(' ')}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Current Price Anchor Point */}
          <circle
            cx={paddingLeft}
            cy={getY(currentPrice)}
            r="4"
            fill="#10b981"
          />
          <text
            x={paddingLeft - 5}
            y={getY(currentPrice) - 8}
            fill="#10b981"
            fontSize="9"
            fontFamily="monospace"
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
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <circle cx={x} cy={getY(c.medianProjected)} r="3.5" fill="#6366f1" />
                {/* Step Label on bottom */}
                <text
                  x={x}
                  y={svgHeight - 10}
                  fill="#94a3b8"
                  fontSize="9"
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-background-border text-[11px] font-mono">
        {cones.slice(0, 5).map((c) => (
          <div key={c.step} className="p-2 rounded bg-background-secondary border border-background-border">
            <div className="text-slate-400 font-semibold">{c.label}</div>
            <div className="text-brand-400 font-bold mt-0.5">
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
