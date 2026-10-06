import { NewsItem, NewsCategory, SentimentLabel, ImpactLevel } from '../../types/sentiment';

// Financial sentiment dictionary (Loughran-McDonald inspired)
const BULLISH_LEXICON: Record<string, number> = {
  surge: 0.8,
  breakout: 0.7,
  growth: 0.6,
  profit: 0.6,
  beat: 0.7,
  exceeded: 0.7,
  bullish: 0.8,
  outperform: 0.8,
  upgrade: 0.8,
  dividend: 0.5,
  expansion: 0.6,
  inflows: 0.7,
  adoption: 0.7,
  partnership: 0.6,
  revenue: 0.4,
  rally: 0.7,
  alltimehigh: 0.9,
  acquisition: 0.5,
  approval: 0.8,
  buyback: 0.7
};

const BEARISH_LEXICON: Record<string, number> = {
  drop: -0.6,
  slump: -0.8,
  plunge: -0.8,
  loss: -0.7,
  missed: -0.7,
  downgrade: -0.8,
  bearish: -0.8,
  inflation: -0.5,
  lawsuit: -0.8,
  regulatory: -0.5,
  probe: -0.7,
  outflow: -0.7,
  default: -0.9,
  npl: -0.6,
  ban: -0.9,
  hack: -0.9,
  exploit: -0.9,
  debt: -0.5,
  recession: -0.8,
  investigation: -0.7
};

export function scoreTextSentiment(text: string): {
  score: number; // -1.0 to 1.0
  label: SentimentLabel;
  strength: number; // 0 to 1.0
} {
  const words = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/);
  let totalScore = 0;
  let matches = 0;

  for (const word of words) {
    if (BULLISH_LEXICON[word]) {
      totalScore += BULLISH_LEXICON[word];
      matches += 1;
    } else if (BEARISH_LEXICON[word]) {
      totalScore += BEARISH_LEXICON[word];
      matches += 1;
    }
  }

  if (matches === 0) {
    return { score: 0.05, label: 'NEUTRAL', strength: 0.2 };
  }

  const avgScore = Math.max(-1.0, Math.min(1.0, totalScore / matches));
  const strength = Math.min(1.0, matches * 0.25);

  let label: SentimentLabel = 'NEUTRAL';
  if (avgScore >= 0.2) label = 'POSITIVE';
  else if (avgScore <= -0.2) label = 'NEGATIVE';

  return {
    score: Number(avgScore.toFixed(2)),
    label,
    strength: Number(strength.toFixed(2))
  };
}

export function classifyNewsEvent(title: string, summary: string): {
  category: NewsCategory;
  impact: ImpactLevel;
} {
  const text = `${title} ${summary}`.toLowerCase();

  if (text.includes('earnings') || text.includes('profit') || text.includes('quarterly result')) {
    return { category: 'EARNINGS', impact: 'HIGH' };
  }
  if (text.includes('sec') || text.includes('court') || text.includes('sebon') || text.includes('rbi') || text.includes('nrb') || text.includes('regulatory')) {
    return { category: 'REGULATORY', impact: 'HIGH' };
  }
  if (text.includes('hack') || text.includes('exploit') || text.includes('breach')) {
    return { category: 'HACK_EXPLOIT', impact: 'HIGH' };
  }
  if (text.includes('partner') || text.includes('collaboration') || text.includes('deal')) {
    return { category: 'PARTNERSHIP', impact: 'MEDIUM' };
  }
  if (text.includes('fed') || text.includes('rate cut') || text.includes('rate hike') || text.includes('inflation') || text.includes('gdp')) {
    return { category: 'MACRO', impact: 'HIGH' };
  }
  if (text.includes('halving') || text.includes('tokenomics') || text.includes('burn') || text.includes('unlock')) {
    return { category: 'TOKENOMICS', impact: 'HIGH' };
  }
  if (text.includes('launch') || text.includes('product') || text.includes('upgrade')) {
    return { category: 'PRODUCT', impact: 'MEDIUM' };
  }

  return { category: 'ANNOUNCEMENT', impact: 'LOW' };
}
