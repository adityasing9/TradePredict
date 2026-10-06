import { Candle } from '../../types/marketData';
import { TechnicalAnalysisResult } from '../../types/technical';
import { FundamentalAnalysisResult } from '../../types/fundamental';
import { SentimentAnalysisResult, MacroContext } from '../../types/sentiment';
import { QuantitativeMetrics } from '../../types/quant';
import { FeatureWeight } from '../../types/prediction';

export interface ExtractedFeatureVector {
  rsi14: number;
  macdHistNormalized: number;
  bollingerPercentB: number;
  atrPercent: number;
  priceToSma20Ratio: number;
  priceToSma50Ratio: number;
  priceToSma200Ratio: number;
  volumeRatio20: number;
  returnLag1d: number;
  returnLag3d: number;
  returnLag5d: number;
  returnLag10d: number;
  annualizedVol: number;
  currentDrawdown: number;
  winRate: number;
  fundamentalScore: number;
  sentimentScore: number;
  macroScore: number;
}

export function extractPredictionFeatures(
  candles: Candle[],
  technical: TechnicalAnalysisResult,
  fundamental: FundamentalAnalysisResult,
  sentiment: SentimentAnalysisResult,
  macro: MacroContext,
  quant: QuantitativeMetrics
): { features: ExtractedFeatureVector; weights: FeatureWeight[] } {
  const closes = candles.map((c) => c.close);
  const n = closes.length;
  const currentPrice = closes[n - 1];

  const pClose = (lag: number) => {
    const idx = Math.max(0, n - 1 - lag);
    return closes[idx] ? ((currentPrice - closes[idx]) / closes[idx]) * 100 : 0;
  };

  const ind = technical.indicators;
  const features: ExtractedFeatureVector = {
    rsi14: ind.rsi.value,
    macdHistNormalized: Number((ind.macd.histogram / (ind.atr.value || 1)).toFixed(3)),
    bollingerPercentB: ind.bollinger.percentB,
    atrPercent: ind.atr.percent,
    priceToSma20Ratio: Number(((currentPrice / (ind.ma.sma20 || currentPrice) - 1) * 100).toFixed(2)),
    priceToSma50Ratio: Number(((currentPrice / (ind.ma.sma50 || currentPrice) - 1) * 100).toFixed(2)),
    priceToSma200Ratio: Number(((currentPrice / (ind.ma.sma200 || currentPrice) - 1) * 100).toFixed(2)),
    volumeRatio20: ind.volume.volumeRatio,
    returnLag1d: Number(pClose(1).toFixed(2)),
    returnLag3d: Number(pClose(3).toFixed(2)),
    returnLag5d: Number(pClose(5).toFixed(2)),
    returnLag10d: Number(pClose(10).toFixed(2)),
    annualizedVol: quant.annualizedVolatility,
    currentDrawdown: quant.currentDrawdown,
    winRate: quant.historicalWinRate,
    fundamentalScore: fundamental.score,
    sentimentScore: sentiment.overallScore,
    macroScore: macro.score
  };

  // Human-readable feature inspection list with impact
  const weights: FeatureWeight[] = [
    {
      name: 'RSI Momentum (14-period)',
      category: 'TECHNICAL',
      weight: 0.18,
      impact: features.rsi14 >= 50 && features.rsi14 <= 70 ? 'POSITIVE' : features.rsi14 < 40 ? 'NEGATIVE' : 'NEUTRAL',
      rawValue: `${features.rsi14}`
    },
    {
      name: 'MACD Signal Divergence (ATR Normalized)',
      category: 'TECHNICAL',
      weight: 0.14,
      impact: features.macdHistNormalized > 0 ? 'POSITIVE' : 'NEGATIVE',
      rawValue: `${features.macdHistNormalized}`
    },
    {
      name: 'Price vs 50-day Moving Average',
      category: 'TECHNICAL',
      weight: 0.12,
      impact: features.priceToSma50Ratio > 0 ? 'POSITIVE' : 'NEGATIVE',
      rawValue: `${features.priceToSma50Ratio > 0 ? '+' : ''}${features.priceToSma50Ratio}%`
    },
    {
      name: 'Volume Expansion vs 20d Average',
      category: 'TECHNICAL',
      weight: 0.10,
      impact: features.volumeRatio20 > 1.2 ? 'POSITIVE' : 'NEUTRAL',
      rawValue: `${features.volumeRatio20}x`
    },
    {
      name: 'Asset Fundamental Valuation Score',
      category: 'FUNDAMENTAL',
      weight: 0.16,
      impact: features.fundamentalScore > 15 ? 'POSITIVE' : features.fundamentalScore < -15 ? 'NEGATIVE' : 'NEUTRAL',
      rawValue: `${features.fundamentalScore}/100`
    },
    {
      name: 'News Event & Market Sentiment',
      category: 'SENTIMENT',
      weight: 0.12,
      impact: features.sentimentScore > 10 ? 'POSITIVE' : features.sentimentScore < -10 ? 'NEGATIVE' : 'NEUTRAL',
      rawValue: `${features.sentimentScore}/100`
    },
    {
      name: 'Global Macro & Liquidity Context',
      category: 'MACRO',
      weight: 0.08,
      impact: features.macroScore > 20 ? 'POSITIVE' : features.macroScore < -20 ? 'NEGATIVE' : 'NEUTRAL',
      rawValue: `${features.macroScore}/100`
    },
    {
      name: 'Short-term Momentum (5-day Lag Return)',
      category: 'QUANT',
      weight: 0.10,
      impact: features.returnLag5d > 0.5 ? 'POSITIVE' : features.returnLag5d < -0.5 ? 'NEGATIVE' : 'NEUTRAL',
      rawValue: `${features.returnLag5d > 0 ? '+' : ''}${features.returnLag5d}%`
    }
  ];

  return { features, weights };
}
