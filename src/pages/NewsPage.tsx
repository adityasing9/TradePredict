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
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              Financial News & Sentiment Telemetry
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deduplicated news flow with algorithmic event classification and impact scoring.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
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
            className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
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
              className="p-4 rounded-lg terminal-panel flex flex-col justify-between gap-3 hover:border-slate-600 transition-colors"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                  <span className="text-slate-400 font-semibold">{item.source}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300">
                      {item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        isPos
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isNeg
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {item.sentimentLabel} ({item.sentimentScore > 0 ? '+' : ''}{item.sentimentScore})
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mt-2 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.summary}</p>
              </div>

              {/* Tag Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06] text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Assets:</span>
                  {item.symbols.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold">
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
