import React, { useState } from 'react';
import { DocumentRAGModal } from '../components/ai/DocumentRAGModal';
import { BookOpen, FileUp, Sparkles, ShieldCheck, ArrowRight, Bot } from 'lucide-react';

interface ResearchPageProps {
  onOpenChat: () => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({ onOpenChat }) => {
  const [ragModalOpen, setRagModalOpen] = useState(false);

  return (
    <div className="space-y-4 animate-in fade-in duration-100">
      {/* Title */}
      <div className="border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-600 dark:text-accent-cyan" />
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            AI Research Analyst & Document Intelligence Hub
          </h1>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
          Interactive natural language queries and client-side vector retrieval across uploaded company filings and whitepapers.
        </p>
      </div>

      {/* Grid of Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Interactive Chat Analyst */}
        <div className="p-5 rounded terminal-panel border-t-2 border-t-cyan-500 flex flex-col justify-between gap-4 shadow-sm hover:border-slate-500 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">AI Market Research Assistant</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Ask deep contextual questions regarding any analyzed asset. The assistant strictly leverages real telemetry (RSI, moving average alignments, support clusters, and scenarios) without fabricating prices.
            </p>
            <div className="text-xs font-mono text-slate-600 dark:text-slate-400 space-y-1 bg-surface-secondary p-3 rounded border border-border">
              <div>• "Why is NABIL bullish on the 1D timeframe?"</div>
              <div>• "What invalidates NVDA's current forecast?"</div>
              <div>• "Explain RSI divergences like I'm a beginner."</div>
            </div>
          </div>

          <button
            onClick={onOpenChat}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 force-white text-xs font-mono font-bold transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4 force-white" />
            <span className="force-white">Launch Interactive Chat Assistant</span>
          </button>
        </div>

        {/* Card 2: Document RAG */}
        <div className="p-5 rounded terminal-panel border-t-2 border-t-emerald-500 flex flex-col justify-between gap-4 shadow-sm hover:border-slate-500 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
              <FileUp className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">Local Document Research (RAG)</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Upload company quarterly reports, NRB monetary reviews, SEC 10-K filings, or token whitepapers. Documents are chunked and queried 100% locally in your browser with zero cloud uploads.
            </p>
            <div className="text-xs font-mono text-slate-600 dark:text-slate-400 space-y-1 bg-surface-secondary p-3 rounded border border-border">
              <div>• Inverted keyword indexing & TF-IDF search</div>
              <div>• Private IndexedDB client storage</div>
              <div>• Supports TXT, MD, CSV, JSON files</div>
            </div>
          </div>

          <button
            onClick={() => setRagModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-surface-secondary hover:bg-surface-elevated text-slate-900 dark:text-white border border-border text-xs font-mono font-bold transition-all shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Open Document Intelligence Workspace</span>
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded terminal-panel flex items-start gap-3 border-l-4 border-l-emerald-500 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Data Privacy & Confidentiality Architecture
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-mono">
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
