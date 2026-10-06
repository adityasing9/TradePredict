import React, { useState } from 'react';
import { getProcessedNewsFeed } from '../engines/sentiment/newsDatabase';
import { NewsCategory, SentimentLabel } from '../types/sentiment';
import { Newspaper } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'ALL'>('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentLabel | 'ALL'>('ALL');

  const allNews = getProcessedNewsFeed();

  const filtered = allNews.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (selectedSentiment !== 'ALL' && item.sentimentLabel !== selectedSentiment) return false;
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-cyan-600 dark:text-accent-cyan" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              Financial News & Sentiment Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
            Deduplicated news flow with algorithmic event classification and impact scoring.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-2.5 py-1.5 rounded bg-white dark:bg-surface-secondary border border-border text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono text-xs shadow-sm font-semibold"
          >
            <option value="ALL">All Event Categories</option>
            <option value="EARNINGS">Earnings Results</option>
            <option value="REGULATORY">Regulatory & Policy</option>
            <option value="MACRO">Macroeconomic Data</option>
            <option value="PRODUCT">Product & Expansion</option>
            <option value="TOKENOMICS">Crypto Tokenomics</option>
          </select>

          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value as any)}
            className="px-2.5 py-1.5 rounded bg-white dark:bg-surface-secondary border border-border text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono text-xs shadow-sm font-semibold"
          >
            <option value="ALL">All Sentiments</option>
            <option value="POSITIVE">Positive Only</option>
            <option value="NEUTRAL">Neutral Only</option>
            <option value="NEGATIVE">Negative Only</option>
          </select>
        </div>
      </div>

      {/* News Stream Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => {
          const isPos = item.sentimentLabel === 'POSITIVE';
          const isNeg = item.sentimentLabel === 'NEGATIVE';

          const cardBorderTop = isPos
            ? 'border-t-2 border-t-emerald-500'
            : isNeg
            ? 'border-t-2 border-t-rose-500'
            : 'border-t-2 border-t-amber-500';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded terminal-panel ${cardBorderTop} flex flex-col justify-between gap-2.5 hover:border-slate-500 hover:shadow-md transition-all`}
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                  <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">{item.source}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-surface-secondary text-slate-700 dark:text-slate-300 border border-border font-semibold">
                      {item.category}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        isPos
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-market-bullish border border-emerald-500/30'
                          : isNeg
                          ? 'bg-rose-500/15 text-rose-700 dark:text-market-bearish border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-market-warning border border-amber-500/30'
                      }`}
                    >
                      {item.sentimentLabel} ({item.sentimentScore > 0 ? '+' : ''}{item.sentimentScore})
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">{item.title}</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-sans">{item.summary}</p>
              </div>

              {/* Tag Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-400">Assets:</span>
                  {item.symbols.map((s) => (
                    <span key={s} className="px-1.5 py-0.2 rounded bg-surface-secondary text-cyan-600 dark:text-accent-cyan border border-border font-bold">
                      {s}
                    </span>
                  ))}
                </div>
                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
