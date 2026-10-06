import { PriceProjectionConePoint } from '../../../types/prediction';

/**
 * Autoregressive / Volatility Projection Cone.
 * Models probable price paths using geometric drift and sqrt(time) volatility expansion.
 * Calculates both 1-sigma (68% CI) and 2-sigma (95% CI) cones.
 */
export function calculateProjectionCones(
  currentPrice: number,
  dailyVolatilityPercent: number,
  expectedDirectionScore: number, // -100 to +100
  timeframe = '1D'
): {
  cones: PriceProjectionConePoint[];
  expectedReturnRange: [number, number];
  expectedPriceRange: [number, number];
} {
  const steps = [1, 2, 3, 5, 10]; // Intervals into the future
  const cones: PriceProjectionConePoint[] = [];

  const now = Date.now();
  let stepDurationMs = 24 * 3600 * 1000;
  let labelPrefix = 'Day';

  if (timeframe === '1H') {
    stepDurationMs = 3600 * 1000;
    labelPrefix = 'Hour';
  } else if (timeframe === '4H') {
    stepDurationMs = 4 * 3600 * 1000;
    labelPrefix = '4H Bar';
  } else if (timeframe === '1W') {
    stepDurationMs = 7 * 24 * 3600 * 1000;
    labelPrefix = 'Week';
  }

  // Daily volatility as fraction
  const dailySigma = dailyVolatilityPercent / 100;
  
  // Drift parameter derived from ensemble direction score (bounded to realistic drift)
  const driftPerStep = (expectedDirectionScore / 100) * (dailySigma * 0.4);

  for (const step of steps) {
    const timeDelta = Math.sqrt(step);
    const stepSigma = dailySigma * timeDelta;

    const medianProjected = currentPrice * Math.exp(driftPerStep * step);
    const ci68Low = medianProjected * Math.exp(-1.0 * stepSigma);
    const ci68High = medianProjected * Math.exp(1.0 * stepSigma);
    const ci95Low = medianProjected * Math.exp(-1.96 * stepSigma);
    const ci95High = medianProjected * Math.exp(1.96 * stepSigma);

    cones.push({
      step,
      timestamp: now + step * stepDurationMs,
      label: `+${step} ${labelPrefix}${step > 1 ? 's' : ''}`,
      currentPrice,
      medianProjected: Number(medianProjected.toFixed(2)),
      ci68Low: Number(ci68Low.toFixed(2)),
      ci68High: Number(ci68High.toFixed(2)),
      ci95Low: Number(ci95Low.toFixed(2)),
      ci95High: Number(ci95High.toFixed(2))
    });
  }

  // Expected range corresponds to 3-step 68% confidence interval
  const targetStep = cones[2] || cones[0];
  const expectedPriceRange: [number, number] = [targetStep.ci68Low, targetStep.ci68High];
  const returnLow = Number((((targetStep.ci68Low - currentPrice) / currentPrice) * 100).toFixed(2));
  const returnHigh = Number((((targetStep.ci68High - currentPrice) / currentPrice) * 100).toFixed(2));

  return {
    cones,
    expectedReturnRange: [returnLow, returnHigh],
    expectedPriceRange
  };
}
