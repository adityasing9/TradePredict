import React, { useState } from 'react';
import { getProcessedNewsFeed } from '../engines/sentiment/newsDatabase';
import { NewsCategory, SentimentLabel } from '../types/sentiment';
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

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
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-background-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-extrabold text-white font-mono tracking-tight">
              Financial News & Sentiment Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Deduplicated news flow with algorithmic event classification and impact scoring.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="p-1.5 rounded-lg bg-background-card border border-background-border text-white focus:outline-none focus:border-brand-500 font-mono"
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
            className="p-1.5 rounded-lg bg-background-card border border-background-border text-white focus:outline-none focus:border-brand-500 font-mono"
          >
            <option value="ALL">All Sentiments</option>
            <option value="POSITIVE">Positive Only</option>
            <option value="NEUTRAL">Neutral Only</option>
            <option value="NEGATIVE">Negative Only</option>
          </select>
        </div>
      </div>

      {/* News Stream Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isPos = item.sentimentLabel === 'POSITIVE';
          const isNeg = item.sentimentLabel === 'NEGATIVE';

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-background-card border border-background-border shadow-md flex flex-col justify-between gap-3"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                  <span className="text-slate-400">{item.source}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-background-secondary border border-background-border text-slate-300">
                      {item.category}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold border ${
                        isPos
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isNeg
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {item.sentimentLabel} ({item.sentimentScore > 0 ? '+' : ''}{item.sentimentScore})
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mt-2 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.summary}</p>
              </div>

              {/* Tag Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-background-border/60 text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-1">
                  <span>Assets:</span>
                  {item.symbols.map((s) => (
                    <span key={s} className="px-1.5 py-0.2 rounded bg-background-secondary text-brand-400">
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
