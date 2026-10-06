import { NewsItem } from '../../types/sentiment';
import { scoreTextSentiment, classifyNewsEvent } from './sentimentScorer';

const RAW_NEWS_FEED = [
  {
    id: 'news-nepse-01',
    title: 'Nepal Rastra Bank maintains accommodative policy stance as liquidity eases',
    summary: 'Central bank reports interbank rates remain subdued near 3% while commercial bank deposit bases swell to record highs.',
    source: 'ShareSansar / NRB Disclosures',
    symbols: ['NEPSE', 'NABIL', 'GBIME', 'NICA'],
    publishedAt: Date.now() - 3600 * 1000 * 4
  },
  {
    id: 'news-nepse-02',
    title: 'Nabil Bank posts solid Q4 earnings with net interest margin expansion',
    summary: 'Nabil Bank reports improved recovery in retail non-performing assets alongside robust fee income from trade financing.',
    source: 'Bizshala Nepal',
    symbols: ['NABIL'],
    publishedAt: Date.now() - 3600 * 1000 * 12
  },
  {
    id: 'news-nse-01',
    title: 'Reliance Industries accelerates green hydrogen and retail expansion capex',
    summary: 'Chairman outlines aggressive multi-year investments in domestic solar giga-factories and nationwide quick-commerce fulfillment.',
    source: 'Economic Times India',
    symbols: ['RELIANCE', 'NIFTY50'],
    publishedAt: Date.now() - 3600 * 1000 * 6
  },
  {
    id: 'news-nse-02',
    title: 'Indian IT sector sees steady deal wins despite cautious European discretionary budgets',
    summary: 'TCS and Infosys report strong pipeline conversions in cloud modernization and generative AI enterprise integrations.',
    source: 'LiveMint',
    symbols: ['TCS', 'INFY'],
    publishedAt: Date.now() - 3600 * 1000 * 18
  },
  {
    id: 'news-us-01',
    title: 'NVIDIA demonstrates next-generation Blackwell B200 mass shipment momentum',
    summary: 'Hyperscalers Microsoft, Amazon AWS, and Meta confirm full allocation of next-generation GPU clusters for generative AI workloads.',
    source: 'Bloomberg Markets',
    symbols: ['NVDA', 'MSFT', 'AMZN', 'QQQ'],
    publishedAt: Date.now() - 3600 * 1000 * 8
  },
  {
    id: 'news-us-02',
    title: 'Apple Services revenue reaches all-time quarterly high offset by balanced hardware demand',
    summary: 'App Store, Apple Music, and iCloud recurring subscription margins push gross enterprise margins above 46%.',
    source: 'Wall Street Journal',
    symbols: ['AAPL', 'SPY'],
    publishedAt: Date.now() - 3600 * 1000 * 20
  },
  {
    id: 'news-crypto-01',
    title: 'Bitcoin spot ETFs absorb $420M in single-day net institutional inflows',
    summary: 'Institutional asset managers expand treasury allocation as spot exchange reserves hit 5-year lows on major platforms.',
    source: 'CoinDesk',
    symbols: ['BTC/USDT', 'ETH/USDT'],
    publishedAt: Date.now() - 3600 * 1000 * 3
  },
  {
    id: 'news-crypto-02',
    title: 'Ethereum Layer-2 daily active addresses surge to new record high',
    summary: 'Proto-danksharding cost reductions trigger acceleration in decentralized finance transactions and micro-settlements across rollups.',
    source: 'The Block',
    symbols: ['ETH/USDT'],
    publishedAt: Date.now() - 3600 * 1000 * 14
  },
  {
    id: 'news-crypto-03',
    title: 'Solana decentralized exchange weekly volume briefly outpaces competing networks',
    summary: 'High transaction capacity and micro-penny gas fees sustain explosive retail activity across automated market makers.',
    source: 'Decrypt',
    symbols: ['SOL/USDT'],
    publishedAt: Date.now() - 3600 * 1000 * 10
  }
];

export function getProcessedNewsFeed(): NewsItem[] {
  return RAW_NEWS_FEED.map((raw) => {
    const textSentiment = scoreTextSentiment(`${raw.title} ${raw.summary}`);
    const classification = classifyNewsEvent(raw.title, raw.summary);

    return {
      id: raw.id,
      title: raw.title,
      summary: raw.summary,
      source: raw.source,
      publishedAt: raw.publishedAt,
      symbols: raw.symbols,
      category: classification.category,
      sentimentScore: textSentiment.score,
      sentimentLabel: textSentiment.label,
      sentimentStrength: textSentiment.strength,
      impact: classification.impact,
      relevanceScore: 0.95
    };
  });
}
