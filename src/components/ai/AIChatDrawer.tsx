import React, { useState, useRef, useEffect } from 'react';
import { AnalysisBundle, queryAIAnalyst } from '../../services/aiService';
import { AISettings } from '../../types/settings';
import { ChatMessage } from '../../types/ai';
import { Sparkles, Send, X, Bot, User } from 'lucide-react';

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

  const suggestedPrompts = [
    'Explain current prediction setup',
    'What specific boundary invalidates this thesis?',
    'Identify key institutional support and resistance',
    'Generate quantitative risk summary'
  ];

  // Initialize greeting on open
  useEffect(() => {
    if (isOpen && messages.length === 0 && bundle) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: `AI Co-Pilot initialized for **${bundle.asset.symbol}** (${bundle.asset.market}).\n\nI have loaded live analytical layers: Technical Trend (${bundle.technical.trend.direction.replace('_', ' ')}), Fundamental Health (${bundle.fundamental.status}), and Ensemble Prediction (${bundle.prediction.direction} with ${bundle.prediction.confidenceScore}% confidence).\n\nSelect a prompt chip below or ask any analytical question.`,
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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background-deep border-l border-border shadow-modal flex flex-col animate-in slide-in-from-right duration-150">
      {/* Header */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-surface-secondary">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-surface-elevated border border-border flex items-center justify-center text-accent-cyan">
            <Sparkles className="w-3 h-3" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              AI Market Analyst
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              Engine: {settings.provider}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-surface-elevated transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* TOP ASSET CONTEXT PANEL */}
      {bundle && (
        <div className="px-3 py-2 bg-surface border-b border-border text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-slate-500 text-[10px] uppercase">Active:</span>
            <span className="font-bold text-white truncate">{bundle.asset.symbol} {bundle.timeframe}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] shrink-0">
            <span className="text-slate-400">Score: <span className="text-accent-cyan font-bold">{bundle.prediction.confidenceScore}%</span></span>
            <span className="text-slate-600">•</span>
            <span className={`font-bold ${
              bundle.prediction.direction === 'BULLISH' ? 'text-market-bullish' : bundle.prediction.direction === 'BEARISH' ? 'text-market-bearish' : 'text-market-warning'
            }`}>
              {bundle.prediction.direction}
            </span>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-background-deep">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                m.role === 'user'
                  ? 'bg-surface-elevated border border-border text-slate-200'
                  : 'bg-surface border border-border text-accent-cyan'
              }`}
            >
              {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
            </div>

            <div className="space-y-1 max-w-[85%]">
              {m.role === 'assistant' && (
                <div className="flex items-center gap-1 text-[9px] font-mono text-accent-cyan">
                  <span className="px-1 py-0.2 rounded bg-surface border border-border font-bold">
                    MODEL SYNTHESIS
                  </span>
                </div>
              )}

              <div
                className={`p-2.5 rounded text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-surface-elevated border border-border text-white'
                    : 'bg-surface border border-border text-slate-200 whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-accent-cyan font-mono pl-7">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            Synthesizing market telemetry...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      {bundle && (
        <div className="px-3 py-2 border-t border-border bg-surface flex flex-wrap gap-1">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary hover:bg-surface-elevated hover:text-accent-cyan border border-border text-slate-400 transition-colors"
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
        className="p-2.5 border-t border-border bg-surface-secondary flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask analytical question..."
          disabled={!bundle || loading}
          className="flex-1 py-1.5 px-2.5 rounded bg-surface border border-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-cyan/50 font-mono"
        />
        <button
          type="submit"
          disabled={!input.trim() || !bundle || loading}
          className="p-1.5 rounded bg-surface-elevated text-accent-cyan border border-border hover:bg-surface hover:text-cyan-300 disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
