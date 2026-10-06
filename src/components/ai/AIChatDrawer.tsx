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
    `Why is ${bundle?.asset.symbol || 'this asset'} showing this prediction?`,
    `What would invalidate the current scenario?`,
    `Explain the risk profile and suggested stop level.`,
    `How does the 14-period RSI affect this forecast?`
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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background-secondary border-l border-background-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-background-border flex items-center justify-between bg-background-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              AI Analyst Assistant
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Context: {bundle?.asset.symbol || 'No asset loaded'}
            </p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-background-elevated text-brand-400 border border-background-border'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                m.role === 'user'
                  ? 'bg-brand-500 text-white rounded-tr-none'
                  : 'bg-background-card border border-background-border text-slate-200 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pl-8">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
            Synthesizing analytical telemetry...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {bundle && (
        <div className="px-4 py-2 border-t border-background-border/60 bg-background/50 flex flex-wrap gap-1.5">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[10px] font-mono px-2 py-1 rounded bg-background-elevated hover:bg-brand-500/10 hover:text-brand-400 border border-background-border text-slate-400 text-left transition-colors"
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
          placeholder="Ask AI Analyst about this asset..."
          disabled={!bundle || loading}
          className="flex-1 py-2 px-3 rounded-lg bg-background-secondary border border-background-border text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || !bundle || loading}
          className="p-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
