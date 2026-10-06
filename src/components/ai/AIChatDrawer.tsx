import React, { useState, useRef, useEffect } from 'react';
import { AnalysisBundle, queryAIAnalyst } from '../../services/aiService';
import { AISettings } from '../../types/settings';
import { ChatMessage } from '../../types/ai';
import { Sparkles, Send, X, Bot, User, CornerDownLeft } from 'lucide-react';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bundle: AnalysisBundle | null;
  settings: AISettings;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  bundle,
  settings
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts
  const suggestedPrompts = [
    `Why is ${bundle?.asset.symbol || 'this asset'} showing this forecast?`,
    `What triggers invalidate this outlook?`,
    `Explain the quantitative risk profile.`,
    `How does the 14-period RSI affect this?`
  ];

  // Initialize greeting on open
  useEffect(() => {
    if (isOpen && messages.length === 0 && bundle) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: `Hello! I am your AI Market Research Assistant. I have loaded the live multi-factor analysis bundle for **${bundle.asset.name} (${bundle.asset.symbol})** trading at **${bundle.asset.currency} ${bundle.currentPrice}**.\n\nAsk me anything about its technical patterns, fundamental valuation, scenarios, or risk parameters.`,
          timestamp: Date.now()
        }
      ]);
    }
  }, [isOpen, bundle]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || !bundle) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await queryAIAnalyst(query, bundle, settings, messages);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue retrieving analytical data for this query.',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background-secondary/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.07] flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-300 shadow-glow-indigo">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              AI Analyst Assistant
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Context: <span className="text-brand-300 font-semibold">{bundle?.asset.symbol || 'No asset loaded'}</span>
            </p>
          </div>
        </div>

        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm'
                  : 'bg-white/[0.04] text-brand-300 border border-white/[0.08]'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-tr-none shadow-md'
                  : 'bg-white/[0.03] border border-white/[0.07] text-slate-200 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-brand-300 font-mono pl-9">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
            Synthesizing analytical telemetry...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {bundle && (
        <div className="px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.01] flex flex-wrap gap-1.5">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-brand-500/15 hover:border-brand-500/40 hover:text-brand-300 border border-white/[0.06] text-slate-400 text-left transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3.5 border-t border-white/[0.07] bg-white/[0.02] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Analyst about this asset..."
          disabled={!bundle || loading}
          className="flex-1 py-2.5 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/60 font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || !bundle || loading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-500 hover:to-brand-400 disabled:opacity-40 transition-all shadow-md hover:shadow-glow-indigo"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
