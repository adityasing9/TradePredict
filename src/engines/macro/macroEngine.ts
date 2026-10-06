import { MacroContext, MacroIndicator } from '../../types/sentiment';

export const GLOBAL_MACRO_INDICATORS: MacroIndicator[] = [
  {
    id: 'macro-fed-rate',
    name: 'US Federal Reserve Policy Rate',
    region: 'US',
    currentValue: 4.85,
    previousValue: 5.25,
    unit: '%',
    lastUpdated: 'Recent FOMC Decision',
    impactOnRisk: 'RISK_ON',
    notes: 'Easing cycle commenced; lowers international capital hurdle rates.'
  },
  {
    id: 'macro-us-cpi',
    name: 'US Headline CPI Inflation',
    region: 'US',
    currentValue: 2.5,
    previousValue: 2.9,
    unit: '% YoY',
    lastUpdated: 'Bureau of Labor Statistics',
    impactOnRisk: 'RISK_ON',
    notes: 'Disinflation trajectory continues towards central bank 2.0% objective.'
  },
  {
    id: 'macro-us-10y',
    name: 'US 10-Year Treasury Yield',
    region: 'US',
    currentValue: 3.85,
    previousValue: 4.25,
    unit: '%',
    lastUpdated: 'CBOE Treasury Yield Index',
    impactOnRisk: 'RISK_ON',
    notes: 'Lower long-term yields expand equity and risk asset valuation multiples.'
  },
  {
    id: 'macro-rbi-rate',
    name: 'RBI Monetary Repo Rate',
    region: 'INDIA',
    currentValue: 6.5,
    previousValue: 6.5,
    unit: '%',
    lastUpdated: 'Reserve Bank of India MPC',
    impactOnRisk: 'NEUTRAL',
    notes: 'Stance remains focused on withdrawal of accommodation to anchor food inflation.'
  },
  {
    id: 'macro-india-cpi',
    name: 'India Retail CPI Inflation',
    region: 'INDIA',
    currentValue: 4.85,
    previousValue: 5.1,
    unit: '% YoY',
    lastUpdated: 'Ministry of Statistics & PI',
    impactOnRisk: 'RISK_ON',
    notes: 'Well within RBI target tolerance corridor (4% +/- 2%).'
  },
  {
    id: 'macro-nrb-rate',
    name: 'Nepal Rastra Bank Policy Rate',
    region: 'NEPAL',
    currentValue: 5.0,
    previousValue: 5.5,
    unit: '%',
    lastUpdated: 'NRB Monetary Policy Review',
    impactOnRisk: 'RISK_ON',
    notes: 'Accommodative monetary stance to spur credit demand and commercial activity.'
  },
  {
    id: 'macro-nepal-cpi',
    name: 'Nepal Consumer Inflation',
    region: 'NEPAL',
    currentValue: 4.2,
    previousValue: 4.8,
    unit: '% YoY',
    lastUpdated: 'Nepal Rastra Bank Economic Report',
    impactOnRisk: 'RISK_ON',
    notes: 'Subdued inflation coupled with high banking liquidity supports stock market liquidity.'
  },
  {
    id: 'macro-dxy',
    name: 'US Dollar Index (DXY)',
    region: 'GLOBAL',
    currentValue: 101.2,
    previousValue: 104.5,
    unit: 'Index Points',
    lastUpdated: 'Intercontinental Exchange',
    impactOnRisk: 'RISK_ON',
    notes: 'Softening dollar relieves pressure on emerging markets and cryptocurrency assets.'
  }
];

export function runMacroAnalysis(): MacroContext {
  const indicators = GLOBAL_MACRO_INDICATORS;

  let riskOnCount = 0;
  let riskOffCount = 0;

  for (const ind of indicators) {
    if (ind.impactOnRisk === 'RISK_ON') riskOnCount++;
    else if (ind.impactOnRisk === 'RISK_OFF') riskOffCount++;
  }

  const score = Math.round(((riskOnCount - riskOffCount) / indicators.length) * 100);

  let regime: MacroContext['regime'] = 'NEUTRAL';
  if (score >= 35) regime = 'RISK_ON';
  else if (score <= -35) regime = 'RISK_OFF';
  else regime = 'TRANSITIONAL';

  return {
    regime,
    score,
    indicators,
    summary: `Global macroeconomic environment is currently in a ${regime} phase (score +${score}/100) supported by global monetary rate-cutting cycles and easing inflation.`,
    timestamp: Date.now()
  };
}
