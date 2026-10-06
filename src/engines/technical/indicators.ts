import { Candle } from '../../types/marketData';
import {
  TechnicalIndicators,
  MovingAverages,
  RSIResult,
  MACDResult,
  BollingerBandsResult,
  StochasticResult,
  ATRResult,
  VolumeMetrics
} from '../../types/technical';

// Simple Moving Average
export function calculateSMA(data: number[], period: number): number {
  if (data.length < period || period <= 0) return data[data.length - 1] || 0;
  const slice = data.slice(-period);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return Number((sum / period).toFixed(2));
}

// Exponential Moving Average
export function calculateEMA(data: number[], period: number): number {
  if (data.length === 0) return 0;
  if (data.length < period) return calculateSMA(data, data.length);
  const k = 2 / (period + 1);
  let ema = calculateSMA(data.slice(0, period), period);
  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  return Number(ema.toFixed(2));
}

// Weighted Moving Average
export function calculateWMA(data: number[], period: number): number {
  if (data.length < period) return calculateSMA(data, data.length);
  const slice = data.slice(-period);
  const denominator = (period * (period + 1)) / 2;
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += slice[i] * (i + 1);
  }
  return Number((sum / denominator).toFixed(2));
}

// Relative Strength Index (RSI 14)
export function calculateRSI(closes: number[], period = 14): RSIResult {
  if (closes.length <= period) {
    return { value: 50, status: 'NEUTRAL', divergence: 'NONE' };
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(diff)) / period;
    }
  }

  if (avgLoss === 0) return { value: 100, status: 'OVERBOUGHT', divergence: 'NONE' };
  const rs = avgGain / avgLoss;
  const rsi = Number((100 - 100 / (1 + rs)).toFixed(1));

  let status: 'OVERBOUGHT' | 'NEUTRAL' | 'OVERSOLD' = 'NEUTRAL';
  if (rsi >= 70) status = 'OVERBOUGHT';
  else if (rsi <= 30) status = 'OVERSOLD';

  // Divergence check over last 15 bars
  let divergence: 'BULLISH' | 'BEARISH' | 'NONE' = 'NONE';
  if (closes.length >= 25) {
    const recentClose = closes[closes.length - 1];
    const prevClose = closes[closes.length - 10];
    if (recentClose < prevClose && rsi > 45) {
      divergence = 'BULLISH';
    } else if (recentClose > prevClose && rsi < 55) {
      divergence = 'BEARISH';
    }
  }

  return { value: rsi, status, divergence };
}

// Moving Average Convergence Divergence (MACD 12, 26, 9)
export function calculateMACD(
  closes: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MACDResult {
  if (closes.length < slowPeriod) {
    return { macd: 0, signal: 0, histogram: 0, trend: 'BULLISH' };
  }

  // Calculate series of MACD line
  const macdValues: number[] = [];
  const kFast = 2 / (fastPeriod + 1);
  const kSlow = 2 / (slowPeriod + 1);

  let fastEma = calculateSMA(closes.slice(0, fastPeriod), fastPeriod);
  let slowEma = calculateSMA(closes.slice(0, slowPeriod), slowPeriod);

  for (let i = slowPeriod; i < closes.length; i++) {
    fastEma = closes[i] * kFast + fastEma * (1 - kFast);
    slowEma = closes[i] * kSlow + slowEma * (1 - kSlow);
    macdValues.push(fastEma - slowEma);
  }

  const currentMacd = macdValues[macdValues.length - 1] || 0;
  const currentSignal = calculateEMA(macdValues, signalPeriod);
  const histogram = Number((currentMacd - currentSignal).toFixed(2));

  let trend: 'BULLISH' | 'BEARISH' | 'CROSSOVER_BULLISH' | 'CROSSOVER_BEARISH' = 'BULLISH';
  if (histogram > 0) {
    trend = histogram > 0.5 ? 'BULLISH' : 'CROSSOVER_BULLISH';
  } else {
    trend = histogram < -0.5 ? 'BEARISH' : 'CROSSOVER_BEARISH';
  }

  return {
    macd: Number(currentMacd.toFixed(2)),
    signal: Number(currentSignal.toFixed(2)),
    histogram,
    trend
  };
}

// Bollinger Bands (20, 2)
export function calculateBollingerBands(
  closes: number[],
  period = 20,
  stdDevMultiplier = 2
): BollingerBandsResult {
  if (closes.length < period) {
    const last = closes[closes.length - 1] || 0;
    return { upper: last * 1.05, middle: last, lower: last * 0.95, bandwidth: 10, percentB: 0.5 };
  }

  const slice = closes.slice(-period);
  const middle = calculateSMA(slice, period);

  // Standard deviation
  const variance = slice.reduce((sum, val) => sum + Math.pow(val - middle, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  const upper = Number((middle + stdDevMultiplier * stdDev).toFixed(2));
  const lower = Number((middle - stdDevMultiplier * stdDev).toFixed(2));
  const bandwidth = Number((((upper - lower) / middle) * 100).toFixed(2));

  const current = closes[closes.length - 1];
  const percentB = upper !== lower ? Number(((current - lower) / (upper - lower)).toFixed(2)) : 0.5;

  return { upper, middle, lower, bandwidth, percentB };
}

// Stochastic Oscillator (14, 3)
export function calculateStochastic(
  candles: Candle[],
  period = 14,
  smooth = 3
): StochasticResult {
  if (candles.length < period) {
    return { k: 50, d: 50, status: 'NEUTRAL' };
  }

  const kValues: number[] = [];
  for (let i = period - 1; i < candles.length; i++) {
    const sub = candles.slice(i - period + 1, i + 1);
    const highest = Math.max(...sub.map((c) => c.high));
    const lowest = Math.min(...sub.map((c) => c.low));
    const currentClose = candles[i].close;

    const k = highest !== lowest ? ((currentClose - lowest) / (highest - lowest)) * 100 : 50;
    kValues.push(k);
  }

  const currentK = Number(calculateSMA(kValues.slice(-smooth), smooth).toFixed(1));
  const currentD = Number(calculateSMA(kValues.slice(-smooth * 2), smooth).toFixed(1));

  let status: 'OVERBOUGHT' | 'NEUTRAL' | 'OVERSOLD' = 'NEUTRAL';
  if (currentK >= 80) status = 'OVERBOUGHT';
  else if (currentK <= 20) status = 'OVERSOLD';

  return { k: currentK, d: currentD, status };
}

// Average True Range (ATR 14)
export function calculateATR(candles: Candle[], period = 14): ATRResult {
  if (candles.length < 2) {
    const val = candles[0]?.close * 0.02 || 1;
    return { value: val, percent: 2, regime: 'NORMAL' };
  }

  const trs: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const prev = candles[i - 1];
    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - prev.close),
      Math.abs(current.low - prev.close)
    );
    trs.push(tr);
  }

  const atrValue = Number(calculateEMA(trs, period).toFixed(2));
  const currentPrice = candles[candles.length - 1].close;
  const percent = Number(((atrValue / currentPrice) * 100).toFixed(2));

  let regime: 'LOW' | 'NORMAL' | 'ELEVATED' | 'EXTREME' = 'NORMAL';
  if (percent < 1.0) regime = 'LOW';
  else if (percent > 4.5) regime = 'EXTREME';
  else if (percent > 2.5) regime = 'ELEVATED';

  return { value: atrValue, percent, regime };
}

// Volume Metrics (OBV, 20 SMA, Spike)
export function calculateVolumeMetrics(candles: Candle[]): VolumeMetrics {
  const volumes = candles.map((c) => c.volume);
  const current = volumes[volumes.length - 1] || 0;
  const avg20 = calculateSMA(volumes, 20);
  const volumeRatio = avg20 > 0 ? Number((current / avg20).toFixed(2)) : 1.0;
  const isSpike = volumeRatio >= 2.0;

  // On-Balance Volume (OBV)
  let obv = 0;
  for (let i = 1; i < candles.length; i++) {
    if (candles[i].close > candles[i - 1].close) {
      obv += candles[i].volume;
    } else if (candles[i].close < candles[i - 1].close) {
      obv -= candles[i].volume;
    }
  }

  // VWAP
  let cumulativeTPV = 0;
  let cumulativeVol = 0;
  for (const c of candles) {
    const typicalPrice = (c.high + c.low + c.close) / 3;
    cumulativeTPV += typicalPrice * c.volume;
    cumulativeVol += c.volume;
  }
  const vwap = cumulativeVol > 0 ? Number((cumulativeTPV / cumulativeVol).toFixed(2)) : undefined;

  return {
    current,
    avg20,
    volumeRatio,
    isSpike,
    obv: Math.round(obv),
    vwap
  };
}

// ADX & Directional Movement
export function calculateADX(candles: Candle[], period = 14): {
  value: number;
  plusDI: number;
  minusDI: number;
  trendStrength: 'WEAK' | 'MODERATE' | 'STRONG';
} {
  if (candles.length < period * 2) {
    return { value: 22, plusDI: 20, minusDI: 18, trendStrength: 'MODERATE' };
  }

  const plusDMs: number[] = [];
  const minusDMs: number[] = [];
  const trs: number[] = [];

  for (let i = 1; i < candles.length; i++) {
    const cur = candles[i];
    const prev = candles[i - 1];

    const upMove = cur.high - prev.high;
    const downMove = prev.low - cur.low;

    plusDMs.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDMs.push(downMove > upMove && downMove > 0 ? downMove : 0);

    const tr = Math.max(
      cur.high - cur.low,
      Math.abs(cur.high - prev.close),
      Math.abs(cur.low - prev.close)
    );
    trs.push(tr);
  }

  const smoothTR = calculateEMA(trs, period);
  const smoothPlusDM = calculateEMA(plusDMs, period);
  const smoothMinusDM = calculateEMA(minusDMs, period);

  const plusDI = smoothTR > 0 ? Number(((smoothPlusDM / smoothTR) * 100).toFixed(1)) : 20;
  const minusDI = smoothTR > 0 ? Number(((smoothMinusDM / smoothTR) * 100).toFixed(1)) : 20;

  const dx = plusDI + minusDI > 0 ? (Math.abs(plusDI - minusDI) / (plusDI + minusDI)) * 100 : 20;
  const adx = Number(dx.toFixed(1));

  let trendStrength: 'WEAK' | 'MODERATE' | 'STRONG' = 'MODERATE';
  if (adx < 20) trendStrength = 'WEAK';
  else if (adx > 35) trendStrength = 'STRONG';

  return { value: adx, plusDI, minusDI, trendStrength };
}

// All indicators calculation
export function calculateAllIndicators(candles: Candle[]): TechnicalIndicators {
  const closes = candles.map((c) => c.close);
  const lastClose = closes[closes.length - 1];

  const ma: MovingAverages = {
    sma10: calculateSMA(closes, 10),
    sma20: calculateSMA(closes, 20),
    sma50: calculateSMA(closes, 50),
    sma100: calculateSMA(closes, 100),
    sma200: calculateSMA(closes, 200),
    ema9: calculateEMA(closes, 9),
    ema12: calculateEMA(closes, 12),
    ema21: calculateEMA(closes, 21),
    ema26: calculateEMA(closes, 26),
    ema50: calculateEMA(closes, 50),
    ema200: calculateEMA(closes, 200),
    wma20: calculateWMA(closes, 20)
  };

  const rsi = calculateRSI(closes, 14);
  const macd = calculateMACD(closes);
  const bollinger = calculateBollingerBands(closes, 20, 2);
  const stochastic = calculateStochastic(candles, 14, 3);
  const atr = calculateATR(candles, 14);
  const volume = calculateVolumeMetrics(candles);
  const adx = calculateADX(candles, 14);

  // Rate of Change (10 bars)
  const prev10 = closes[Math.max(0, closes.length - 11)];
  const roc = prev10 ? Number((((lastClose - prev10) / prev10) * 100).toFixed(2)) : 0;

  return {
    ma,
    rsi,
    macd,
    bollinger,
    stochastic,
    roc,
    atr,
    volume,
    adx
  };
}
