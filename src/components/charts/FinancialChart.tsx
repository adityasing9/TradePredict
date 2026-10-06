import React, { useRef, useEffect, useState } from 'react';
import { Candle, Timeframe } from '../../types/marketData';
import { SupportResistanceLevel } from '../../types/technical';
import { BarChart3, LineChart as LineChartIcon, Eye, RefreshCw } from 'lucide-react';

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

    // Split height: 75% price, 25% volume
    const priceHeight = height * 0.75;
    const volumeHeight = height * 0.22;
    const volumeTop = height * 0.78;

    ctx.clearRect(0, 0, width, height);

    // Visible slice of bars (last 70 bars for clear spacing)
    const visibleBars = candles.slice(-70);
    const n = visibleBars.length;
    if (n < 2) return;

    // Price scaling
    let minPrice = Math.min(...visibleBars.map((c) => c.low));
    let maxPrice = Math.max(...visibleBars.map((c) => c.high));

    // Pad price range by 3%
    const pricePadding = (maxPrice - minPrice) * 0.05 || 1;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    // Volume scaling
    const maxVolume = Math.max(...visibleBars.map((c) => c.volume)) || 1;

    // Horizontal bar geometry
    const paddingLeft = 10;
    const paddingRight = 65; // space for y-axis price labels
    const chartWidth = width - paddingLeft - paddingRight;
    const barWidth = chartWidth / n;
    const candleWidth = Math.max(2, barWidth * 0.7);

    const getY = (price: number) => priceHeight - ((price - minPrice) / priceRange) * (priceHeight - 20) - 10;

    // 1. Grid Lines
    ctx.strokeStyle = '#1e293b';
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

      // Price text on right margin
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(p.toFixed(p < 10 ? 3 : 1), width - paddingRight + 6, y + 3);
    }
    ctx.setLineDash([]); // reset

    // 2. Support & Resistance Overlays
    if (showLevels) {
      // Support (Green dashed)
      for (const s of supports.slice(0, 2)) {
        if (s.price >= minPrice && s.price <= maxPrice) {
          const y = getY(s.price);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.setLineDash([6, 3]);
          ctx.beginPath();
          ctx.moveTo(paddingLeft, y);
          ctx.lineTo(width - paddingRight, y);
          ctx.stroke();

          ctx.fillStyle = '#10b981';
          ctx.font = '9px monospace';
          ctx.fillText(`SUP ${s.price}`, width - paddingRight + 4, y - 2);
        }
      }

      // Resistance (Rose dashed)
      for (const r of resistances.slice(0, 2)) {
        if (r.price >= minPrice && r.price <= maxPrice) {
          const y = getY(r.price);
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
          ctx.setLineDash([6, 3]);
          ctx.beginPath();
          ctx.moveTo(paddingLeft, y);
          ctx.lineTo(width - paddingRight, y);
          ctx.stroke();

          ctx.fillStyle = '#f43f5e';
          ctx.font = '9px monospace';
          ctx.fillText(`RES ${r.price}`, width - paddingRight + 4, y - 2);
        }
      }
      ctx.setLineDash([]);
    }

    // 3. Volume Bars
    visibleBars.forEach((bar, i) => {
      const x = paddingLeft + i * barWidth + barWidth / 2;
      const vHeight = (bar.volume / maxVolume) * volumeHeight;
      const vy = height - vHeight;
      const isUp = bar.close >= bar.open;

      ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)';
      ctx.fillRect(x - candleWidth / 2, vy, candleWidth, vHeight);
    });

    // 4. Candlesticks or Line Chart
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
      // Line Chart with subtle gradient fill
      ctx.beginPath();
      visibleBars.forEach((bar, i) => {
        const x = paddingLeft + i * barWidth + barWidth / 2;
        const y = getY(bar.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Area fill
      const lastX = paddingLeft + (n - 1) * barWidth + barWidth / 2;
      const firstX = paddingLeft + barWidth / 2;
      ctx.lineTo(lastX, priceHeight);
      ctx.lineTo(firstX, priceHeight);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, 0, 0, priceHeight);
      grad.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      grad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 5. SMA 20 Overlay
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

    // 6. Interactive Crosshair Hover
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < n) {
      const hoverBar = visibleBars[hoverIndex];
      const hx = paddingLeft + hoverIndex * barWidth + barWidth / 2;
      const hy = getY(hoverBar.close);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
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
    }
  }, [candles, chartType, showSMA, showLevels, hoverIndex]);

  // Handle canvas mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const paddingLeft = 10;
    const paddingRight = 65;
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
    <div className="w-full bg-background-card rounded-xl border border-background-border p-4 shadow-lg flex flex-col gap-3">
      {/* Chart Top Bar: Symbol, Timeframes, Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-border pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="font-bold text-white text-sm">{symbol}</span>
            <span className="text-slate-400">({currency})</span>
          </div>

          {/* Timeframe Chips */}
          <div className="flex items-center gap-1 bg-background-secondary p-0.5 rounded-lg border border-background-border text-[11px] font-mono">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => onSelectTimeframe(tf)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  currentTimeframe === tf
                    ? 'bg-brand-500 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
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
            className="flex items-center gap-1 px-2 py-1 rounded bg-background-secondary border border-background-border text-slate-300 hover:text-white"
            title="Toggle Candlestick / Line"
          >
            {chartType === 'CANDLE' ? <BarChart3 className="w-3.5 h-3.5 text-brand-400" /> : <LineChartIcon className="w-3.5 h-3.5 text-brand-400" />}
            <span className="text-[11px] font-mono">{chartType}</span>
          </button>

          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-mono ${
              showSMA
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-background-secondary border-background-border text-slate-400'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>SMA 20</span>
          </button>

          <button
            onClick={() => setShowLevels(!showLevels)}
            className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-mono ${
              showLevels
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-background-secondary border-background-border text-slate-400'
            }`}
          >
            <span>S/R Levels</span>
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1 rounded bg-background-secondary border border-background-border text-slate-400 hover:text-white disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* OHLC Interactive Bar */}
      {activeBar && (
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 bg-background-secondary/60 px-3 py-1.5 rounded-lg border border-background-border">
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

      {/* Canvas Area */}
      <div ref={containerRef} className="relative w-full h-80 sm:h-96 bg-background rounded-lg overflow-hidden">
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
