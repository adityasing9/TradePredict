import React, { useState } from 'react';
import { DocumentRAGModal } from '../components/ai/DocumentRAGModal';
import { BookOpen, FileUp, Sparkles, ShieldCheck, ArrowRight, Bot } from 'lucide-react';

interface ResearchPageProps {
  onOpenChat: () => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({ onOpenChat }) => {
  const [ragModalOpen, setRagModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="border-b border-white/[0.07] pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            AI Research Analyst & Document Intelligence Hub
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Interactive natural language queries and client-side vector retrieval across uploaded company filings and whitepapers.
        </p>
      </div>

      {/* Grid of Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Interactive Chat Analyst */}
        <div className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-5 shadow-xl hover:-translate-y-0.5 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-300 shadow-glow-indigo">
              <Bot className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white font-mono">AI Market Research Assistant</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Ask deep contextual questions regarding any analyzed asset. The assistant strictly leverages real telemetry (RSI, moving average alignments, support clusters, and scenarios) without fabricating prices.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-400 space-y-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
              <div>• "Why is NABIL bullish on the 1D timeframe?"</div>
              <div>• "What invalidates NVDA's current forecast?"</div>
              <div>• "Explain RSI divergences like I'm a beginner."</div>
            </div>
          </div>

          <button
            onClick={onOpenChat}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-mono font-bold transition-all shadow-md hover:shadow-glow-indigo"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Interactive Chat Assistant</span>
          </button>
        </div>

        {/* Card 2: Document RAG */}
        <div className="p-6 rounded-2xl glass-card flex flex-col justify-between gap-5 shadow-xl hover:-translate-y-0.5 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-glow-emerald">
              <FileUp className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white font-mono">Local Document Research (RAG)</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Upload company quarterly reports, NRB monetary reviews, SEC 10-K filings, or token whitepapers. Documents are chunked and queried 100% locally in your browser with zero cloud uploads.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-400 space-y-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
              <div>• Inverted keyword indexing & TF-IDF search</div>
              <div>• Private IndexedDB client storage</div>
              <div>• Supports TXT, MD, CSV, JSON files</div>
            </div>
          </div>

          <button
            onClick={() => setRagModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-xs font-mono font-bold transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Open Document Intelligence Workspace</span>
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-5 rounded-2xl glass-card flex items-start gap-3.5 border-l-4 border-l-emerald-500">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Data Privacy & Confidentiality Architecture
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Your uploaded research documents and prediction histories remain stored strictly within your browser's IndexedDB. No proprietary documents or portfolio details are ever transmitted to third-party databases.
          </p>
        </div>
      </div>

      <DocumentRAGModal
        isOpen={ragModalOpen}
        onClose={() => setRagModalOpen(false)}
      />
    </div>
  );
};
