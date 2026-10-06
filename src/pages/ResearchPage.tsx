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
      <div className="border-b border-background-border pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-400" />
          <h1 className="text-xl font-extrabold text-white font-mono tracking-tight">
            AI Research Analyst & Document Intelligence Hub
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Interactive natural language queries and client-side vector retrieval across uploaded company filings and whitepapers.
        </p>
      </div>

      {/* Grid of Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Interactive Chat Analyst */}
        <div className="p-5 rounded-2xl bg-background-card border border-background-border shadow-xl flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">AI Market Research Assistant</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask deep contextual questions regarding any analyzed asset. The assistant strictly leverages real telemetry (RSI, moving average alignments, support clusters, and scenarios) without fabricating prices.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
              <div>• "Why is NABIL bullish?"</div>
              <div>• "What invalidates NVDA's current forecast?"</div>
              <div>• "Explain RSI like I'm a beginner."</div>
            </div>
          </div>

          <button
            onClick={onOpenChat}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-mono font-bold transition-all shadow-md shadow-brand-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Interactive Chat Assistant</span>
          </button>
        </div>

        {/* Card 2: Document RAG */}
        <div className="p-5 rounded-2xl bg-background-card border border-background-border shadow-xl flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileUp className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Local Document Research (RAG)</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Upload company quarterly reports, NRB monetary reviews, SEC 10-K filings, or token whitepapers. Documents are chunked and queried 100% locally in your browser with zero cloud uploads.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
              <div>• Inverted keyword indexing & TF-IDF search</div>
              <div>• Private IndexedDB client storage</div>
              <div>• Supports TXT, MD, CSV, JSON files</div>
            </div>
          </div>

          <button
            onClick={() => setRagModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-background-elevated hover:bg-slate-700 text-slate-200 border border-background-border text-xs font-mono font-bold transition-all"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Open Document Intelligence Workspace</span>
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-xl bg-background-secondary border border-background-border flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-mono font-bold text-white uppercase">
            Data Privacy & Confidentiality Architecture
          </h4>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
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
