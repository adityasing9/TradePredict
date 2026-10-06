import React, { useState, useRef, useEffect } from 'react';
import { AnalysisBundle, queryAIAnalyst } from '../../services/aiService';
import { AISettings } from '../../types/settings';
import { ChatMessage } from '../../types/ai';
import { Sparkles, Send, X, Bot, User, ShieldAlert, Cpu } from 'lucide-react';

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

  // Exact prompt chips requested in section 13
  const suggestedPrompts = [
    'Explain current prediction',
    'What invalidates this thesis?',
    'Identify key support and resistance',
    'Compare with sector benchmark'
  ];

  // Initialize greeting on open
  useEffect(() => {
    if (isOpen && messages.length === 0 && bundle) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: `AI Co-Pilot initialized for **${bundle.asset.symbol}** (${bundle.asset.market}).\n\nI have loaded live analytical layers: Technical Trend (${bundle.technical.trend}), Fundamental Health (${bundle.fundamental.status}), and Ensemble Prediction (${bundle.prediction.direction} with ${bundle.prediction.confidenceScore}% confidence).\n\nSelect a prompt chip below or ask any analytical question.`,
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
          content: 'Sorry, I encountered an issue retrieving analytical telemetry for this query.',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background-secondary border-l border-background-border shadow-modal flex flex-col animate-in slide-in-from-right duration-150">
      {/* Header */}
      <div className="p-3 border-b border-background-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-brand-500/15 flex items-center justify-center text-brand-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              AI Market Analyst
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              Provider: {settings.provider}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* TOP ASSET CONTEXT PANEL (Required by section 13) */}
      {bundle && (
        <div className="px-3.5 py-2 bg-background-elevated border-b border-background-border text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-slate-500 text-[10px] uppercase">Analyzing:</span>
            <span className="font-bold text-white truncate">{bundle.asset.symbol} {bundle.timeframe}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] shrink-0">
            <span className="text-slate-400">Score: <span className="text-brand-300 font-bold">{bundle.prediction.confidenceScore}/100</span></span>
            <span className="text-slate-500">•</span>
            <span className={`font-bold ${
              bundle.prediction.direction === 'BULLISH' ? 'text-emerald-400' : bundle.prediction.direction === 'BEARISH' ? 'text-rose-400' : 'text-amber-400'
            }`}>
              {bundle.prediction.direction}
            </span>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white/[0.05] text-brand-300 border border-background-border'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`space-y-1 max-w-[85%]`}>
              {m.role === 'assistant' && (
                <div className="flex items-center gap-1 text-[10px] font-mono text-brand-300">
                  <span className="px-1.5 py-0.2 rounded bg-brand-500/10 border border-brand-500/20 font-bold">
                    AI INTERPRETATION
                  </span>
                </div>
              )}

              <div
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-background-card border border-background-border text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-brand-300 font-mono pl-8">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Analyzing market layers...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips (Required by section 13) */}
      {bundle && (
        <div className="px-3 py-2 border-t border-background-border bg-background-card flex flex-wrap gap-1.5">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[10px] font-mono px-2 py-1 rounded bg-white/[0.03] hover:bg-brand-500/15 hover:text-brand-300 border border-background-border text-slate-400 transition-colors"
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
        className="p-3 border-t border-background-border bg-background-card flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask analytical question..."
          disabled={!bundle || loading}
          className="flex-1 py-1.5 px-3 rounded-lg bg-background-secondary border border-background-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || !bundle || loading}
          className="p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-40 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
