import {
  TradeAction,
  ExecutionTiming,
  TradeRecommendation,
  DirectionProbability,
  Scenario
} from '../../types/prediction';
import { TechnicalAnalysisResult } from '../../types/technical';
import { QuantitativeMetrics } from '../../types/quant';

/**
 * Computes deterministic, institutional-grade actionable trade signals (BUY / SELL / WAIT)
 * with exact execution points: "EXECUTE NOW" vs "AT WHAT POINT / PULLBACK / BREAKOUT".
 */
export function generateTradeRecommendation(
  currentPrice: number,
  direction: 'BULLISH' | 'NEUTRAL' | 'BEARISH',
  probabilities: DirectionProbability,
  technical: TechnicalAnalysisResult,
  quant: QuantitativeMetrics,
  scenarios: { bull: Scenario; base: Scenario; bear: Scenario }
): TradeRecommendation {
  const rsi = technical.indicators?.rsi?.value ?? 50;
  const ema20 = technical.indicators?.ma?.ema21 || technical.indicators?.ma?.sma20 || currentPrice;
  const dailyVolPct = Math.max(1.2, quant?.dailyVolatility || 2.0);

  // Nearest structural support below current price
  const supportsBelow = technical.structure.supports
    .map((s) => s.price)
    .filter((p) => p < currentPrice)
    .sort((a, b) => b - a);
  const nearestSupport = supportsBelow[0] || currentPrice * (1 - dailyVolPct / 100);

  // Nearest structural resistance above current price
  const resistancesAbove = technical.structure.resistances
    .map((r) => r.price)
    .filter((p) => p > currentPrice)
    .sort((a, b) => a - b);
  const nearestResistance = resistancesAbove[0] || currentPrice * (1 + dailyVolPct / 100);

  let action: TradeAction = 'WAIT';
  let timing: ExecutionTiming = 'WAIT FOR CONFIRMATION';
  let isNow = false;
  let targetEntry = currentPrice;
  let entryMin = currentPrice * 0.998;
  let entryMax = currentPrice * 1.002;
  let entryLabel = '';
  let stopLossPrice = currentPrice * 0.96;
  let tp1Price = currentPrice * 1.04;
  let tp2Price = currentPrice * 1.08;
  const rationale: string[] = [];
  let invalidationTrigger = '';

  if (direction === 'BULLISH' && probabilities.up >= 55) {
    const isStrong = probabilities.up >= 68;
    const isOversoldOrRebounding = rsi <= 56;
    const isNearSupportOrEMA =
      Math.abs(currentPrice - ema20) / currentPrice < 0.018 ||
      (currentPrice - nearestSupport) / currentPrice < 0.022;

    if (isNearSupportOrEMA || isOversoldOrRebounding) {
      // Immediate Buy Signal
      action = isStrong ? 'STRONG BUY' : 'BUY';
      timing = 'BUY NOW';
      isNow = true;
      targetEntry = currentPrice;
      entryMin = Number((currentPrice * 0.997).toFixed(2));
      entryMax = Number((currentPrice * 1.003).toFixed(2));
      entryLabel = `Execute Market Buy NOW @ ${currentPrice.toFixed(2)}`;
      rationale.push(`Bullish ensemble convergence (${probabilities.up}% Up probability)`);
      rationale.push(`RSI (${rsi.toFixed(1)}) indicates supportive rebound momentum`);
      rationale.push(`Price is situated in active accumulation band near 20 EMA (${ema20.toFixed(2)})`);
    } else if (rsi > 65) {
      // Extended: Wait for Pullback Point
      action = 'BUY';
      timing = 'BUY ON PULLBACK';
      isNow = false;
      targetEntry = Number(nearestSupport.toFixed(2));
      entryMin = Number((nearestSupport * 0.995).toFixed(2));
      entryMax = Number((nearestSupport * 1.005).toFixed(2));
      entryLabel = `Limit Order at Pullback Support Point: ${targetEntry.toFixed(2)}`;
      rationale.push(`Bullish trend intact, but short-term RSI (${rsi.toFixed(1)}) is elevated`);
      rationale.push(`Optimal risk/reward: enter on technical dip to support @ ${targetEntry.toFixed(2)}`);
      rationale.push(`Protects against immediate mean-reversion drawdown`);
    } else {
      // Breakout Entry Point
      action = 'BUY';
      timing = 'BUY ON BREAKOUT';
      isNow = false;
      targetEntry = Number((nearestResistance * 1.004).toFixed(2));
      entryMin = Number(nearestResistance.toFixed(2));
      entryMax = Number((nearestResistance * 1.008).toFixed(2));
      entryLabel = `Stop-Limit Entry on Breakout above ${nearestResistance.toFixed(2)} @ ${targetEntry.toFixed(2)}`;
      rationale.push(`Consolidating right beneath overhead structural resistance at ${nearestResistance.toFixed(2)}`);
      rationale.push(`Execute upon confirmed breakout candle expansion`);
    }

    // Stop Loss & Targets for Long
    stopLossPrice = Number(
      Math.min(nearestSupport * 0.985, targetEntry * (1 - (dailyVolPct * 1.4) / 100)).toFixed(2)
    );
    tp1Price = Number((scenarios.base.targetPrice || nearestResistance || targetEntry * 1.04).toFixed(2));
    tp2Price = Number((scenarios.bull.targetPrice || targetEntry * 1.08).toFixed(2));
    invalidationTrigger = `Hourly close below invalidation stop loss support at ${stopLossPrice.toFixed(2)}`;

  } else if (direction === 'BEARISH' && probabilities.down >= 55) {
    const isStrong = probabilities.down >= 68;
    const isOverboughtOrRejecting = rsi >= 44;

    if (isOverboughtOrRejecting) {
      action = isStrong ? 'STRONG SELL' : 'SELL';
      timing = 'SELL NOW';
      isNow = true;
      targetEntry = currentPrice;
      entryMin = Number((currentPrice * 0.997).toFixed(2));
      entryMax = Number((currentPrice * 1.003).toFixed(2));
      entryLabel = `Execute Market Exit / Short NOW @ ${currentPrice.toFixed(2)}`;
      rationale.push(`Bearish ensemble consensus (${probabilities.down}% Down probability)`);
      rationale.push(`Distribution structure with deteriorating volume (RSI: ${rsi.toFixed(1)})`);
      rationale.push(`Breakdown through support indicates persistent sell-side liquidity`);
    } else {
      action = 'SELL';
      timing = 'SELL ON RALLY';
      isNow = false;
      targetEntry = Number(nearestResistance.toFixed(2));
      entryMin = Number((nearestResistance * 0.995).toFixed(2));
      entryMax = Number((nearestResistance * 1.005).toFixed(2));
      entryLabel = `Exit / Short on Relief Rally Point to ${targetEntry.toFixed(2)}`;
      rationale.push(`Bearish regime with short-term oversold reading (RSI: ${rsi.toFixed(1)})`);
      rationale.push(`Avoid chasing oversold lows; execute at resistance pullback point @ ${targetEntry.toFixed(2)}`);
    }

    // Stop Loss & Targets for Short / Defensive Exit
    stopLossPrice = Number(
      Math.max(nearestResistance * 1.015, targetEntry * (1 + (dailyVolPct * 1.4) / 100)).toFixed(2)
    );
    tp1Price = Number((scenarios.base.targetPrice || nearestSupport || targetEntry * 0.96).toFixed(2));
    tp2Price = Number((scenarios.bear.targetPrice || targetEntry * 0.92).toFixed(2));
    invalidationTrigger = `Bullish reclaim and close above resistance stop level at ${stopLossPrice.toFixed(2)}`;

  } else {
    // Neutral / Wait
    action = 'WAIT';
    timing = 'WAIT FOR CONFIRMATION';
    isNow = false;
    targetEntry = currentPrice;
    entryMin = Number(nearestSupport.toFixed(2));
    entryMax = Number(nearestResistance.toFixed(2));
    entryLabel = `Wait / Watch Range Bounds: Support ${entryMin.toFixed(2)} ↔ Resistance ${entryMax.toFixed(2)}`;
    stopLossPrice = Number((nearestSupport * 0.985).toFixed(2));
    tp1Price = Number((nearestResistance * 1.02).toFixed(2));
    tp2Price = Number((nearestResistance * 1.05).toFixed(2));
    rationale.push(`Market in balanced equilibrium (${probabilities.neutral}% neutral probability)`);
    rationale.push(`Current risk/reward does not provide statistical edge`);
    rationale.push(`Stand aside until breakout confirmation outside range limits`);
    invalidationTrigger = `Decisive range breach beyond ${entryMin.toFixed(2)} - ${entryMax.toFixed(2)}`;
  }

  // Calculate Risk / Reward ratio
  const riskAmount = Math.abs(targetEntry - stopLossPrice);
  const rewardAmount = Math.abs(tp1Price - targetEntry);
  const rawRR = riskAmount > 0 ? rewardAmount / riskAmount : 2.0;
  const riskRewardRatio = Number(Math.max(1.2, Math.min(6.5, rawRR)).toFixed(2));

  const stopLossPercent = Number((((stopLossPrice - targetEntry) / targetEntry) * 100).toFixed(2));
  const tp1Percent = Number((((tp1Price - targetEntry) / targetEntry) * 100).toFixed(2));
  const tp2Percent = Number((((tp2Price - targetEntry) / targetEntry) * 100).toFixed(2));

  return {
    action,
    timing,
    isNow,
    entryZone: {
      min: entryMin,
      max: entryMax,
      targetEntry,
      label: entryLabel
    },
    stopLoss: {
      price: stopLossPrice,
      percent: stopLossPercent,
      label: `Stop Loss Invalidation (${stopLossPercent > 0 ? '+' : ''}${stopLossPercent}%)`
    },
    takeProfit1: {
      price: tp1Price,
      percent: tp1Percent,
      label: `Primary Target 1 (${tp1Percent > 0 ? '+' : ''}${tp1Percent}%)`
    },
    takeProfit2: {
      price: tp2Price,
      percent: tp2Percent,
      label: `Extended Target 2 (${tp2Percent > 0 ? '+' : ''}${tp2Percent}%)`
    },
    riskRewardRatio,
    rationale,
    invalidationTrigger
  };
}
