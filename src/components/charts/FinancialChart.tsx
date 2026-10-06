import React, { useRef, useEffect, useState } from 'react';
import { Candle, Timeframe } from '../../types/marketData';
import { SupportResistanceLevel } from '../../types/technical';
import { BarChart3, LineChart as LineChartIcon, Eye, RefreshCw, Layers } from 'lucide-react';

interface FinancialChartProps {
  candles: Candle[];
  currency: string;
  symbol: string;
  currentTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  supports?: SupportResistanceLevel[];
  resistances?: SupportResistanceLevel[];
  onRefresh?: () => void;
  loading?: boolean;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({
  candles,
  currency,
  symbol,
  currentTimeframe,
  onSelectTimeframe,
  supports = [],
  resistances = [],
  onRefresh,
  loading = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartType, setChartType] = useState<'CANDLE' | 'LINE'>('CANDLE');
  const [showSMA, setShowSMA] = useState(true);
  const [showLevels, setShowLevels] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const timeframes: Timeframe[] = ['15m', '1H', '4H', '1D', '1W'];

  // Render chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Split height: 75% price, 22% volume
    const priceHeight = height * 0.74;
    const volumeHeight = height * 0.22;

    // 1. Fill aesthetic gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#090e1c');
    bgGrad.addColorStop(1, '#060a14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Visible slice of bars (last 70 bars)
    const visibleBars = candles.slice(-70);
    const n = visibleBars.length;
    if (n < 2) return;

    // Price scaling
    let minPrice = Math.min(...visibleBars.map((c) => c.low));
    let maxPrice = Math.max(...visibleBars.map((c) => c.high));

    // Pad price range by 4%
    const pricePadding = (maxPrice - minPrice) * 0.05 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    // Volume scaling
    const maxVolume = Math.max(...visibleBars.map((c) => c.volume)) || 1;

    // Geometry
    const paddingLeft = 12;
    const paddingRight = 70; // space for y-axis price labels
    const chartWidth = width - paddingLeft - paddingRight;
    const barWidth = chartWidth / n;
    const candleWidth = Math.max(3, barWidth * 0.72);

    const getY = (price: number) => priceHeight - ((price - minPrice) / priceRange) * (priceHeight - 24) - 12;

    // 2. Subtle Grid Lines & Y-Axis Labels
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    const numGridLines = 5;
    for (let i = 0; i <= numGridLines; i++) {
      const p = minPrice + (priceRange / numGridLines) * i;
      const y = getY(p);

      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      // Right axis price text
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(p.toFixed(p < 10 ? 3 : 1), width - paddingRight + 8, y + 3.5);
    }
    ctx.setLineDash([]); // reset

    // 3. Support & Resistance Overlays
    if (showLevels) {
      // Support (Green dashed)
      for (const s of supports.slice(0, 2)) {
        if (s.price >= minPrice && s.price <= maxPrice) {
          const y = getY(s.price);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
          ctx.lineWidth = 1;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(paddingLeft, y);
          ctx.lineTo(width - paddingRight, y);
          ctx.stroke();

          ctx.fillStyle = '#10b981';
          ctx.font = '9px JetBrains Mono, monospace';
          ctx.fillText(`SUP ${s.price}`, width - paddingRight + 6, y - 3);
        }
      }

      // Resistance (Rose dashed)
      for (const r of resistances.slice(0, 2)) {
        if (r.price >= minPrice && r.price <= maxPrice) {
          const y = getY(r.price);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
          ctx.lineWidth = 1;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(paddingLeft, y);
          ctx.lineTo(width - paddingRight, y);
          ctx.stroke();

          ctx.fillStyle = '#f43f5e';
          ctx.font = '9px JetBrains Mono, monospace';
          ctx.fillText(`RES ${r.price}`, width - paddingRight + 6, y - 3);
        }
      }
      ctx.setLineDash([]);
    }

    // 4. Volume Bars (Bottom Subplot)
    visibleBars.forEach((bar, i) => {
      const x = paddingLeft + i * barWidth + barWidth / 2;
      const vHeight = (bar.volume / maxVolume) * volumeHeight;
      const vy = height - vHeight;
      const isUp = bar.close >= bar.open;

      ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.22)' : 'rgba(244, 63, 94, 0.22)';
      ctx.fillRect(x - candleWidth / 2, vy, candleWidth, vHeight);
    });

    // 5. Candlesticks or Line Chart
    if (chartType === 'CANDLE') {
      visibleBars.forEach((bar, i) => {
        const x = paddingLeft + i * barWidth + barWidth / 2;
        const openY = getY(bar.open);
        const closeY = getY(bar.close);
        const highY = getY(bar.high);
        const lowY = getY(bar.low);

        const isUp = bar.close >= bar.open;
        const color = isUp ? '#10b981' : '#f43f5e';

        // High-Low Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Real Body
        ctx.fillStyle = color;
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(2, Math.abs(closeY - openY));
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      });
    } else {
      // Line Chart with smooth area fill
      ctx.beginPath();
      visibleBars.forEach((bar, i) => {
        const x = paddingLeft + i * barWidth + barWidth / 2;
        const y = getY(bar.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Area fill
      const lastX = paddingLeft + (n - 1) * barWidth + barWidth / 2;
      const firstX = paddingLeft + barWidth / 2;
      ctx.lineTo(lastX, priceHeight);
      ctx.lineTo(firstX, priceHeight);
      ctx.closePath();

      const areaGrad = ctx.createLinearGradient(0, 0, 0, priceHeight);
      areaGrad.addColorStop(0, 'rgba(99, 102, 241, 0.28)');
      areaGrad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
      ctx.fillStyle = areaGrad;
      ctx.fill();
    }

    // 6. SMA 20 Overlay
    if (showSMA && visibleBars.length >= 20) {
      ctx.beginPath();
      let started = false;
      for (let i = 19; i < visibleBars.length; i++) {
        const subSlice = visibleBars.slice(i - 19, i + 1);
        const sma = subSlice.reduce((sum, b) => sum + b.close, 0) / 20;
        const x = paddingLeft + i * barWidth + barWidth / 2;
        const y = getY(sma);

        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 7. Latest Price Horizontal Reference Line
    const latestBar = visibleBars[visibleBars.length - 1];
    const latestY = getY(latestBar.close);
    const isLatestUp = latestBar.close >= latestBar.open;
    const latestColor = isLatestUp ? '#10b981' : '#f43f5e';

    ctx.strokeStyle = latestColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(paddingLeft, latestY);
    ctx.lineTo(width - paddingRight, latestY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Latest price tag badge on right axis
    ctx.fillStyle = latestColor;
    ctx.fillRect(width - paddingRight + 4, latestY - 8, 60, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9.5px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(latestBar.close.toFixed(latestBar.close < 10 ? 3 : 1), width - paddingRight + 8, latestY + 3.5);

    // 8. Interactive Crosshair Hover
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < n) {
      const hoverBar = visibleBars[hoverIndex];
      const hx = paddingLeft + hoverIndex * barWidth + barWidth / 2;
      const hy = getY(hoverBar.close);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(hx, 0);
      ctx.lineTo(hx, height);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(paddingLeft, hy);
      ctx.lineTo(width - paddingRight, hy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point marker
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }
  }, [candles, chartType, showSMA, showLevels, hoverIndex]);

  // Handle canvas mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const paddingLeft = 12;
    const paddingRight = 70;
    const chartWidth = rect.width - paddingLeft - paddingRight;

    const visibleBars = candles.slice(-70);
    const n = visibleBars.length;
    const barWidth = chartWidth / n;

    const idx = Math.floor((x - paddingLeft) / barWidth);
    if (idx >= 0 && idx < n) {
      setHoverIndex(idx);
    } else {
      setHoverIndex(null);
    }
  };

  const activeBar =
    hoverIndex !== null && candles.slice(-70)[hoverIndex]
      ? candles.slice(-70)[hoverIndex]
      : candles[candles.length - 1];

  return (
    <div className="w-full glass-card rounded-2xl border border-white/[0.08] p-4 sm:p-5 shadow-xl flex flex-col gap-3.5">
      {/* Chart Top Bar: Symbol, Timeframes, Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="font-extrabold text-white text-base tracking-tight">{symbol}</span>
            <span className="text-slate-400 text-xs">({currency})</span>
          </div>

          {/* Timeframe Chips */}
          <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06] text-[11px] font-mono shadow-inner">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => onSelectTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg transition-all duration-150 ${
                  currentTimeframe === tf
                    ? 'bg-brand-500 text-white font-bold shadow-sm shadow-brand-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setChartType(chartType === 'CANDLE' ? 'LINE' : 'CANDLE')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Toggle Candlestick / Line"
          >
            {chartType === 'CANDLE' ? (
              <BarChart3 className="w-3.5 h-3.5 text-brand-400" />
            ) : (
              <LineChartIcon className="w-3.5 h-3.5 text-brand-400" />
            )}
            <span className="text-[11px] font-mono font-medium">{chartType}</span>
          </button>

          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors ${
              showSMA
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-300'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>SMA 20</span>
          </button>

          <button
            onClick={() => setShowLevels(!showLevels)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors ${
              showLevels
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-300'
            }`}
          >
            <span>S/R Levels</span>
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* OHLC Interactive Bar */}
      {activeBar && (
        <div className="flex flex-wrap items-center gap-3.5 text-[11px] font-mono text-slate-400 bg-white/[0.02] px-3.5 py-1.5 rounded-xl border border-white/[0.05]">
          <div>
            Time:{' '}
            <span className="text-slate-200">
              {new Date(activeBar.time * 1000).toLocaleDateString()}{' '}
              {new Date(activeBar.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div>
            O: <span className="text-slate-200">{activeBar.open}</span>
          </div>
          <div>
            H: <span className="text-emerald-400">{activeBar.high}</span>
          </div>
          <div>
            L: <span className="text-rose-400">{activeBar.low}</span>
          </div>
          <div>
            C:{' '}
            <span className={activeBar.close >= activeBar.open ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {activeBar.close}
            </span>
          </div>
          <div>
            Vol: <span className="text-slate-300">{activeBar.volume.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Canvas Chart Area */}
      <div ref={containerRef} className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-white/[0.06] shadow-inner">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
          className="w-full h-full cursor-crosshair block"
        />
      </div>
    </div>
  );
};
