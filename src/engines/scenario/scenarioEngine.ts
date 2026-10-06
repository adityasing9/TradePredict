import { Scenario, DirectionProbability } from '../../types/prediction';
import { PriceStructure } from '../../types/technical';

export function generateScenarios(
  currentPrice: number,
  probabilities: DirectionProbability,
  structure: PriceStructure,
  expectedReturnRange: [number, number]
): { bull: Scenario; base: Scenario; bear: Scenario } {
  const r1 = structure.resistances[0]?.price || currentPrice * 1.03;
  const r2 = structure.resistances[1]?.price || currentPrice * 1.06;
  const s1 = structure.supports[0]?.price || currentPrice * 0.97;
  const s2 = structure.supports[1]?.price || currentPrice * 0.94;

  const bullTarget = Number(r1.toFixed(2));
  const bearTarget = Number(s1.toFixed(2));

  const bull: Scenario = {
    type: 'BULL',
    probability: probabilities.up,
    title: 'Upward Expansion / Resistance Test',
    expectedReturnRange: [
      Math.max(0.5, expectedReturnRange[0]),
      Math.max(2.5, expectedReturnRange[1])
    ],
    targetPrice: bullTarget,
    supportingFactors: [
      `Momentum support above dynamic pivot ($${structure.pivotPoints.pivot})`,
      `Accumulation structure defending primary support at $${s1.toFixed(2)}`,
      `Favorable risk/reward on breakout continuation towards $${r2.toFixed(2)}`
    ],
    invalidationCondition: `A 4H/Daily candle close below structural support at $${s1.toFixed(2)} invalidates bullish thesis.`,
    invalidationLevel: Number(s1.toFixed(2))
  };

  const base: Scenario = {
    type: 'BASE',
    probability: probabilities.neutral,
    title: 'Range Consolidation & Equilibrium',
    expectedReturnRange: [-1.2, +1.2],
    targetPrice: Number(currentPrice.toFixed(2)),
    supportingFactors: [
      `Price contained between immediate support ($${s1.toFixed(2)}) and resistance ($${r1.toFixed(2)})`,
      `Mean-reverting oscillators indicating balanced supply and demand`,
      `Absence of high-magnitude macro catalysts over the immediate horizon`
    ],
    invalidationCondition: `A clean directional breakout beyond the $${s1.toFixed(2)} - $${r1.toFixed(2)} band.`,
    invalidationLevel: Number(((s1 + r1) / 2).toFixed(2))
  };

  const bear: Scenario = {
    type: 'BEAR',
    probability: probabilities.down,
    title: 'Downside Mean-Reversion / Support Retest',
    expectedReturnRange: [
      Math.min(-0.8, -Math.abs(expectedReturnRange[0])),
      Math.min(-2.8, -Math.abs(expectedReturnRange[1]))
    ],
    targetPrice: bearTarget,
    supportingFactors: [
      `Overhead selling liquidity capping upside attempts at $${r1.toFixed(2)}`,
      `Loss of short-term moving average support`,
      `Exhaustion of aggressive buying volume at range highs`
    ],
    invalidationCondition: `A decisive push and hold above key overhead resistance at $${r1.toFixed(2)}.`,
    invalidationLevel: Number(r1.toFixed(2))
  };

  return { bull, base, bear };
}
