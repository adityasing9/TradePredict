import { Candle } from '../../types/marketData';
import { TechnicalAnalysisResult, TrendAnalysis } from '../../types/technical';
import { calculateAllIndicators } from './indicators';
import { calculatePriceStructure } from './priceStructure';
import { detectTechnicalPatterns } from './patterns';

export function runTechnicalAnalysis(candles: Candle[], timeframe = '1D'): TechnicalAnalysisResult {
  const indicators = calculateAllIndicators(candles);
  const structure = calculatePriceStructure(candles);
  const patterns = detectTechnicalPatterns(candles, timeframe);

  const currentPrice = candles[candles.length - 1].close;
  const ma = indicators.ma;

  // Trend Analysis
  const isAboveSma20 = currentPrice > ma.sma20;
  const isAboveSma50 = currentPrice > ma.sma50;
  const isAboveSma200 = currentPrice > ma.sma200;
  const isEmaBullish = ma.ema9 > ma.ema21;

  let maAlignment: TrendAnalysis['maAlignment'] = 'MIXED';
  if (isAboveSma20 && isAboveSma50 && isAboveSma200 && isEmaBullish) {
    maAlignment = 'PERFECT_BULLISH';
  } else if (!isAboveSma20 && !isAboveSma50 && !isAboveSma200 && !isEmaBullish) {
    maAlignment = 'PERFECT_BEARISH';
  } else if (isAboveSma50 && isEmaBullish) {
    maAlignment = 'BULLISH';
  } else if (!isAboveSma50 && !isEmaBullish) {
    maAlignment = 'BEARISH';
  }

  // Higher Highs & Higher Lows evaluation
  const recent10 = candles.slice(-10);
  const recent5 = candles.slice(-5);
  const max10 = Math.max(...recent10.map((c) => c.high));
  const max5 = Math.max(...recent5.map((c) => c.high));
  const min10 = Math.min(...recent10.map((c) => c.low));
  const min5 = Math.min(...recent5.map((c) => c.low));

  const higherHighs = max5 >= max10 * 0.995;
  const higherLows = min5 > min10 * 1.005;
  const lowerHighs = max5 < max10 * 0.99;
  const lowerLows = min5 <= min10 * 1.005;

  let direction: TrendAnalysis['direction'] = 'NEUTRAL';
  let score = 0;

  // MA score contribution (+/- 35 points)
  if (maAlignment === 'PERFECT_BULLISH') score += 35;
  else if (maAlignment === 'BULLISH') score += 20;
  else if (maAlignment === 'BEARISH') score -= 20;
  else if (maAlignment === 'PERFECT_BEARISH') score -= 35;

  // RSI score contribution (+/- 25 points)
  const rsiVal = indicators.rsi.value;
  if (rsiVal >= 45 && rsiVal <= 65) score += 10; // Healthy bullish momentum
  else if (rsiVal > 65 && rsiVal < 75) score += 18;
  else if (rsiVal >= 75) score -= 10; // Overbought risk
  else if (rsiVal < 30) score += 5; // Oversold bounce potential
  else if (rsiVal >= 30 && rsiVal < 45) score -= 15; // Bearish momentum

  // MACD contribution (+/- 20 points)
  if (indicators.macd.trend === 'CROSSOVER_BULLISH') score += 20;
  else if (indicators.macd.trend === 'BULLISH') score += 15;
  else if (indicators.macd.trend === 'CROSSOVER_BEARISH') score -= 20;
  else if (indicators.macd.trend === 'BEARISH') score -= 15;

  // Price Structure & Breakouts (+/- 10 points)
  if (structure.breakoutState === 'BREAKOUT_UP') score += 10;
  else if (structure.breakoutState === 'BREAKDOWN_DOWN') score -= 10;

  // Pattern adjustments (+/- 10 points)
  for (const pat of patterns) {
    if (pat.type === 'BULLISH') score += 5;
    else if (pat.type === 'BEARISH') score -= 5;
  }

  // Clamp technicalScore to -100 to +100
  const technicalScore = Math.max(-100, Math.min(100, Math.round(score)));

  if (technicalScore >= 45) direction = 'STRONG_BULLISH';
  else if (technicalScore >= 15) direction = 'BULLISH';
  else if (technicalScore <= -45) direction = 'STRONG_BEARISH';
  else if (technicalScore <= -15) direction = 'BEARISH';
  else direction = 'NEUTRAL';

  let signal: TechnicalAnalysisResult['signal'] = 'NEUTRAL';
  if (technicalScore >= 50) signal = 'STRONG_BUY';
  else if (technicalScore >= 20) signal = 'BUY';
  else if (technicalScore <= -50) signal = 'STRONG_SELL';
  else if (technicalScore <= -20) signal = 'SELL';

  const trend: TrendAnalysis = {
    direction,
    strengthScore: Math.abs(technicalScore),
    higherHighs,
    higherLows,
    lowerHighs,
    lowerLows,
    maAlignment,
    summary: `${direction.replace('_', ' ')} trend with ${indicators.adx.trendStrength.toLowerCase()} strength (ADX ${indicators.adx.value}) and ${maAlignment.toLowerCase().replace('_', ' ')} moving average alignment.`
  };

  return {
    indicators,
    structure,
    patterns,
    trend,
    technicalScore,
    signal,
    timestamp: Date.now()
  };
}
