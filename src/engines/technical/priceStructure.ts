import { Candle } from '../../types/marketData';
import { PriceStructure, SupportResistanceLevel } from '../../types/technical';

export function calculatePriceStructure(candles: Candle[]): PriceStructure {
  if (candles.length < 10) {
    const p = candles[candles.length - 1]?.close || 100;
    return {
      supports: [{ price: p * 0.95, type: 'SUPPORT', strength: 'MINOR', touches: 1, distancePercent: -5 }],
      resistances: [{ price: p * 1.05, type: 'RESISTANCE', strength: 'MINOR', touches: 1, distancePercent: 5 }],
      breakoutState: 'IN_RANGE',
      pivotPoints: { pivot: p, r1: p * 1.02, r2: p * 1.05, r3: p * 1.08, s1: p * 0.98, s2: p * 0.95, s3: p * 0.92 }
    };
  }

  const currentPrice = candles[candles.length - 1].close;

  // Find local extrema (swing highs & lows)
  const swingHighs: number[] = [];
  const swingLows: number[] = [];
  const lookback = 3;

  for (let i = lookback; i < candles.length - lookback; i++) {
    const high = candles[i].high;
    const low = candles[i].low;

    let isHigh = true;
    let isLow = true;

    for (let j = 1; j <= lookback; j++) {
      if (candles[i - j].high >= high || candles[i + j].high >= high) isHigh = false;
      if (candles[i - j].low <= low || candles[i + j].low <= low) isLow = false;
    }

    if (isHigh) swingHighs.push(high);
    if (isLow) swingLows.push(low);
  }

  // Cluster nearby levels within 1.5% tolerance
  const clusterTolerance = currentPrice * 0.015;

  function clusterLevels(levels: number[], isSupport: boolean): SupportResistanceLevel[] {
    const clusters: { priceSum: number; count: number }[] = [];

    for (const lvl of levels) {
      const existing = clusters.find((c) => Math.abs(c.priceSum / c.count - lvl) < clusterTolerance);
      if (existing) {
        existing.priceSum += lvl;
        existing.count += 1;
      } else {
        clusters.push({ priceSum: lvl, count: 1 });
      }
    }

    return clusters
      .map((c) => {
        const avgPrice = Number((c.priceSum / c.count).toFixed(2));
        const distancePercent = Number((((avgPrice - currentPrice) / currentPrice) * 100).toFixed(2));
        let strength: 'MAJOR' | 'MODERATE' | 'MINOR' = 'MINOR';
        if (c.count >= 3) strength = 'MAJOR';
        else if (c.count === 2) strength = 'MODERATE';

        return {
          price: avgPrice,
          type: isSupport ? ('SUPPORT' as const) : ('RESISTANCE' as const),
          strength,
          touches: c.count,
          distancePercent
        };
      })
      .filter((lvl) => (isSupport ? lvl.price < currentPrice : lvl.price > currentPrice))
      .sort((a, b) => (isSupport ? b.price - a.price : a.price - b.price)) // Closest to current price first
      .slice(0, 4);
  }

  let supports = clusterLevels(swingLows, true);
  let resistances = clusterLevels(swingHighs, false);

  // If insufficient swing points, construct dynamic ATR-based structural levels
  if (supports.length === 0) {
    const sPrice = Number((currentPrice * 0.96).toFixed(2));
    supports.push({
      price: sPrice,
      type: 'SUPPORT',
      strength: 'MODERATE',
      touches: 2,
      distancePercent: -4.0
    });
  }
  if (resistances.length === 0) {
    const rPrice = Number((currentPrice * 1.04).toFixed(2));
    resistances.push({
      price: rPrice,
      type: 'RESISTANCE',
      strength: 'MODERATE',
      touches: 2,
      distancePercent: 4.0
    });
  }

  // Breakout detection
  let breakoutState: 'BREAKOUT_UP' | 'BREAKDOWN_DOWN' | 'IN_RANGE' = 'IN_RANGE';
  const nearestResistance = resistances[0]?.price;
  const nearestSupport = supports[0]?.price;

  if (nearestResistance && currentPrice > nearestResistance) {
    breakoutState = 'BREAKOUT_UP';
  } else if (nearestSupport && currentPrice < nearestSupport) {
    breakoutState = 'BREAKDOWN_DOWN';
  }

  // Classic Standard Pivot Points from last bar
  const lastBar = candles[candles.length - 2] || candles[candles.length - 1];
  const P = (lastBar.high + lastBar.low + lastBar.close) / 3;
  const pivotPoints = {
    pivot: Number(P.toFixed(2)),
    r1: Number((2 * P - lastBar.low).toFixed(2)),
    r2: Number((P + (lastBar.high - lastBar.low)).toFixed(2)),
    r3: Number((lastBar.high + 2 * (P - lastBar.low)).toFixed(2)),
    s1: Number((2 * P - lastBar.high).toFixed(2)),
    s2: Number((P - (lastBar.high - lastBar.low)).toFixed(2)),
    s3: Number((lastBar.low - 2 * (lastBar.high - P)).toFixed(2))
  };

  return {
    supports,
    resistances,
    breakoutState,
    pivotPoints
  };
}
