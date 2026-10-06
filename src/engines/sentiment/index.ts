import { Asset } from '../../types/asset';
import { SentimentAnalysisResult } from '../../types/sentiment';
import { getProcessedNewsFeed } from './newsDatabase';

export function runSentimentAnalysis(asset: Asset): SentimentAnalysisResult {
  const allNews = getProcessedNewsFeed();
  const cleanSym = asset.symbol.toUpperCase();

  // Filter news matching this asset or broad market
  const matched = allNews.filter((item) =>
    item.symbols.some((s) => s.toUpperCase() === cleanSym || s.toUpperCase() === asset.market)
  );

  const newsPool = matched.length > 0 ? matched : allNews.slice(0, 3);

  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let weightedScoreSum = 0;
  let totalWeights = 0;

  for (const item of newsPool) {
    if (item.sentimentLabel === 'POSITIVE') positiveCount++;
    else if (item.sentimentLabel === 'NEGATIVE') negativeCount++;
    else neutralCount++;

    const impactWeight = item.impact === 'HIGH' ? 3 : item.impact === 'MEDIUM' ? 2 : 1;
    weightedScoreSum += item.sentimentScore * impactWeight;
    totalWeights += impactWeight;
  }

  const rawScore = totalWeights > 0 ? weightedScoreSum / totalWeights : 0.1;
  const overallScore = Math.round(rawScore * 100);

  let label: SentimentAnalysisResult['label'] = 'NEUTRAL';
  if (overallScore >= 18) label = 'BULLISH';
  else if (overallScore <= -18) label = 'BEARISH';

  const confidence = Math.min(95, Math.max(50, newsPool.length * 20));

  const highImpactEvents = newsPool.filter((n) => n.impact === 'HIGH');

  return {
    overallScore,
    label,
    confidence,
    positiveCount,
    neutralCount,
    negativeCount,
    highImpactEvents,
    recentNews: newsPool,
    summary: `${label} sentiment bias (${overallScore > 0 ? '+' : ''}${overallScore}/100) supported by ${positiveCount} positive catalysts and ${negativeCount} negative risks.`,
    timestamp: Date.now()
  };
}
