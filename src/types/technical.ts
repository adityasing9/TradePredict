export interface MovingAverages {
  sma10: number;
  sma20: number;
  sma50: number;
  sma100: number;
  sma200: number;
  ema9: number;
  ema12: number;
  ema21: number;
  ema26: number;
  ema50: number;
  ema200: number;
  wma20: number;
}

export interface RSIResult {
  value: number;
  status: 'OVERBOUGHT' | 'NEUTRAL' | 'OVERSOLD';
  divergence?: 'BULLISH' | 'BEARISH' | 'NONE';
}

export interface MACDResult {
  macd: number;
  signal: number;
  histogram: number;
  trend: 'BULLISH' | 'BEARISH' | 'CROSSOVER_BULLISH' | 'CROSSOVER_BEARISH';
}

export interface BollingerBandsResult {
  upper: number;
  middle: number;
  lower: number;
  bandwidth: number;
  percentB: number;
}

export interface StochasticResult {
  k: number;
  d: number;
  status: 'OVERBOUGHT' | 'NEUTRAL' | 'OVERSOLD';
}

export interface VolumeMetrics {
  current: number;
  avg20: number;
  volumeRatio: number; // current / avg20
  isSpike: boolean;
  obv: number;
  vwap?: number;
}

export interface ATRResult {
  value: number;
  percent: number; // ATR / currentPrice * 100
  regime: 'LOW' | 'NORMAL' | 'ELEVATED' | 'EXTREME';
}

export interface TechnicalIndicators {
  ma: MovingAverages;
  rsi: RSIResult;
  macd: MACDResult;
  bollinger: BollingerBandsResult;
  stochastic: StochasticResult;
  roc: number; // Rate of change %
  atr: ATRResult;
  volume: VolumeMetrics;
  adx: { value: number; plusDI: number; minusDI: number; trendStrength: 'WEAK' | 'MODERATE' | 'STRONG' };
}

export interface SupportResistanceLevel {
  price: number;
  type: 'SUPPORT' | 'RESISTANCE';
  strength: 'MAJOR' | 'MODERATE' | 'MINOR';
  touches: number;
  distancePercent: number; // % from current price
}

export interface PriceStructure {
  supports: SupportResistanceLevel[];
  resistances: SupportResistanceLevel[];
  channel?: { upper: number; lower: number; slope: number };
  breakoutState: 'BREAKOUT_UP' | 'BREAKDOWN_DOWN' | 'IN_RANGE';
  pivotPoints: {
    pivot: number;
    r1: number;
    r2: number;
    r3: number;
    s1: number;
    s2: number;
    s3: number;
  };
}

export type PatternType = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export interface DetectedPattern {
  id: string;
  name: string;
  type: PatternType;
  category: 'CHART' | 'CANDLESTICK';
  timeframe: string;
  confidence: number; // 0 - 100 %
  supportingData: string;
  invalidationLevel: number;
}

export interface TrendAnalysis {
  direction: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
  strengthScore: number; // 0 - 100
  higherHighs: boolean;
  higherLows: boolean;
  lowerHighs: boolean;
  lowerLows: boolean;
  maAlignment: 'PERFECT_BULLISH' | 'BULLISH' | 'MIXED' | 'BEARISH' | 'PERFECT_BEARISH';
  summary: string;
}

export interface TechnicalAnalysisResult {
  indicators: TechnicalIndicators;
  structure: PriceStructure;
  patterns: DetectedPattern[];
  trend: TrendAnalysis;
  technicalScore: number; // -100 (extreme bear) to +100 (extreme bull)
  signal: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
  timestamp: number;
}
