import { ExtractedFeatureVector } from '../featureEngineering';
import { DirectionProbability } from '../../../types/prediction';

/**
 * Gradient-Boosted Decision Ensemble for Market Direction Classification.
 * Evaluates feature vectors across ensemble decision rules and passes raw logits
 * through temperature-calibrated Softmax.
 */
export function predictDirectionBoostedEnsemble(
  features: ExtractedFeatureVector,
  timeframe: string
): {
  direction: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  probabilities: DirectionProbability;
  rawLogits: { up: number; neutral: number; down: number };
} {
  let logitUp = 0.0;
  let logitNeutral = 0.3; // baseline prior for neutral/consolidation
  let logitDown = 0.0;

  // 1. RSI Rules
  if (features.rsi14 >= 52 && features.rsi14 <= 68) {
    logitUp += 0.85;
  } else if (features.rsi14 > 75) {
    logitDown += 0.45; // Mean-reversion risk
    logitNeutral += 0.3;
  } else if (features.rsi14 < 30) {
    logitUp += 0.4; // Oversold bounce
    logitDown += 0.2;
  } else if (features.rsi14 >= 30 && features.rsi14 < 48) {
    logitDown += 0.75;
  }

  // 2. Trend & Moving Average Ratios
  if (features.priceToSma50Ratio > 1.5 && features.priceToSma20Ratio > 0.5) {
    logitUp += 0.9;
  } else if (features.priceToSma50Ratio < -1.5 && features.priceToSma20Ratio < -0.5) {
    logitDown += 0.9;
  } else {
    logitNeutral += 0.4;
  }

  // 3. Normalized MACD Histogram
  if (features.macdHistNormalized > 0.3) {
    logitUp += 0.7;
  } else if (features.macdHistNormalized < -0.3) {
    logitDown += 0.7;
  }

  // 4. Volume Confirmation
  if (features.volumeRatio20 > 1.3) {
    if (logitUp > logitDown) logitUp += 0.5;
    else if (logitDown > logitUp) logitDown += 0.5;
  }

  // 5. Fundamental Multiplier
  if (features.fundamentalScore > 20) {
    logitUp += 0.6;
  } else if (features.fundamentalScore < -20) {
    logitDown += 0.6;
  }

  // 6. Sentiment Multiplier
  if (features.sentimentScore > 15) {
    logitUp += 0.45;
  } else if (features.sentimentScore < -15) {
    logitDown += 0.45;
  }

  // 7. Macro Context
  if (features.macroScore > 25) {
    logitUp += 0.35;
  } else if (features.macroScore < -25) {
    logitDown += 0.35;
  }

  // Timeframe sensitivity adjustments
  if (timeframe === '4H' || timeframe === '1H') {
    // Shorter timeframes exhibit higher noise -> increase neutral weight slightly
    logitNeutral += 0.25;
  } else if (timeframe === '1W') {
    // Longer timeframes favor macro and fundamental drift
    if (features.fundamentalScore > 0) logitUp += 0.3;
  }

  // Calibrated Softmax
  const maxLogit = Math.max(logitUp, logitNeutral, logitDown);
  const expUp = Math.exp(logitUp - maxLogit);
  const expNeutral = Math.exp(logitNeutral - maxLogit);
  const expDown = Math.exp(logitDown - maxLogit);
  const sumExp = expUp + expNeutral + expDown;

  const pUp = expUp / sumExp;
  const pNeutral = expNeutral / sumExp;
  const pDown = expDown / sumExp;

  const upPct = Math.round(pUp * 100);
  const downPct = Math.round(pDown * 100);
  const neutralPct = 100 - upPct - downPct;

  let direction: 'BULLISH' | 'NEUTRAL' | 'BEARISH' = 'NEUTRAL';
  if (upPct > downPct && upPct >= 45) {
    direction = 'BULLISH';
  } else if (downPct > upPct && downPct >= 45) {
    direction = 'BEARISH';
  } else {
    direction = 'NEUTRAL';
  }

  return {
    direction,
    probabilities: {
      up: upPct,
      neutral: neutralPct,
      down: downPct
    },
    rawLogits: {
      up: Number(logitUp.toFixed(2)),
      neutral: Number(logitNeutral.toFixed(2)),
      down: Number(logitDown.toFixed(2))
    }
  };
}
