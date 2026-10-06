import React, { useState } from 'react';
import { UserSettings } from '../types/settings';
import { exportAllLocalData, importLocalDataBackup } from '../db/settingsStore';
import { clearAllCache } from '../db/cacheStore';
import { Settings, Save, Download, Upload, Trash2, ShieldCheck, Cpu, Check } from 'lucide-react';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => Promise<any>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportData = async () => {
    const jsonStr = await exportAllLocalData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradepredict-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const res = await importLocalDataBackup(text);
      setImportMessage(res.message);
      setTimeout(() => setImportMessage(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear cached market candlesticks and quotes?')) {
      await clearAllCache();
      alert('Market data cache successfully cleared.');
    }
  };

  return (
    <div className="space-y-4 max-w-4xl animate-in fade-in duration-100">
      {/* Title */}
      <div className="border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-accent-cyan" />
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            System & User Settings
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">
          Configure default market preferences, AI engine providers, and manage your browser-local database.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Market Preferences */}
        <div className="terminal-panel p-4 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Market & Interface Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Default Market</label>
              <select
                value={formData.defaultMarket}
                onChange={(e) => setFormData({ ...formData, defaultMarket: e.target.value as any })}
                className="w-full p-2 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
              >
                <option value="NEPSE">🇳🇵 Nepal (NEPSE)</option>
                <option value="NSE">🇮🇳 India (NSE)</option>
                <option value="NASDAQ">🇺🇸 US (NASDAQ/NYSE)</option>
                <option value="CRYPTO">₿ Cryptocurrency</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Default Currency</label>
              <select
                value={formData.defaultCurrency}
                onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value as any })}
                className="w-full p-2 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
              >
                <option value="NPR">NPR (Nepalese Rupee)</option>
                <option value="INR">INR (Indian Rupee)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="USDT">USDT (Tether)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Color Theme</label>
              <select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
                className="w-full p-2 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
              >
                <option value="dark">Dark Financial Terminal</option>
                <option value="light">Institutional Light</option>
                <option value="system">System (Follow OS Preference)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Provider Settings */}
        <div className="terminal-panel p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
              AI Analyst Provider Configuration
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary text-accent-cyan border border-border">
              Configurable Engine
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1.5">Active AI Provider</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'DETERMINISTIC', label: 'Deterministic Local Analyst', desc: '100% offline, zero keys required' },
                  { id: 'OPENROUTER', label: 'OpenRouter API', desc: 'Claude 3.5, GPT-4o, DeepSeek' },
                  { id: 'OLLAMA', label: 'Local Ollama', desc: 'Local self-hosted llama3' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, ai: { ...formData.ai, provider: p.id as any } })}
                    className={`p-3 rounded border text-left transition-colors ${
                      formData.ai.provider === p.id
                        ? 'bg-surface-secondary border-accent-cyan text-white font-bold'
                        : 'bg-surface-secondary border-border text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{p.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* OpenRouter Inputs */}
            {formData.ai.provider === 'OPENROUTER' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">OpenRouter API Key</label>
                  <input
                    type="password"
                    value={formData.ai.openRouterApiKey || ''}
                    onChange={(e) => setFormData({ ...formData, ai: { ...formData.ai, openRouterApiKey: e.target.value } })}
                    placeholder="sk-or-v1-..."
                    className="w-full p-2 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Model Slug</label>
                  <input
                    type="text"
                    value={formData.ai.openRouterModel || 'anthropic/claude-3.5-sonnet'}
                    onChange={(e) => setFormData({ ...formData, ai: { ...formData.ai, openRouterModel: e.target.value } })}
                    placeholder="anthropic/claude-3.5-sonnet"
                    className="w-full p-2 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* Ollama Inputs */}
            {formData.ai.provider === 'OLLAMA' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Ollama Base URL</label>
                  <input
                    type="text"
                    value={formData.ai.ollamaBaseUrl || 'http://localhost:11434'}
                    onChange={(e) => setFormData({ ...formData, ai: { ...formData.ai, ollamaBaseUrl: e.target.value } })}
                    className="w-full p-2 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Model Name</label>
                  <input
                    type="text"
                    value={formData.ai.ollamaModel || 'llama3:8b'}
                    onChange={(e) => setFormData({ ...formData, ai: { ...formData.ai, ollamaModel: e.target.value } })}
                    className="w-full p-2 rounded bg-surface-secondary border border-border text-white focus:outline-none focus:border-accent-cyan font-mono text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Settings Action */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 rounded bg-surface-elevated hover:bg-surface text-accent-cyan border border-border hover:border-accent-cyan/40 text-xs font-mono font-bold transition-colors"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-market-bullish" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Settings Saved!' : 'Save System Settings'}</span>
          </button>
        </div>
      </form>

      {/* Local Data Management */}
      <div className="terminal-panel p-4 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Local Data Ownership & Backup Management
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          All prediction logs, watchlists, backtests, and analysis reports are kept 100% locally in IndexedDB.
        </p>

        {importMessage && (
          <div className="p-2.5 rounded bg-surface-secondary border border-border text-xs font-mono text-accent-cyan">
            {importMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-mono">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-secondary hover:bg-surface text-slate-200 border border-border transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Export Complete JSON Backup</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-secondary hover:bg-surface text-slate-200 border border-border cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-market-bullish" />
            <span>Restore Backup JSON</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <button
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-market-bearish/10 hover:bg-market-bearish/20 text-market-bearish border border-market-bearish/25 transition-colors ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Market Cache</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 rounded terminal-panel flex items-start gap-3 border-l-2 border-l-market-bullish">
        <ShieldCheck className="w-4 h-4 text-market-bullish flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-mono font-bold text-white uppercase tracking-wider">Privacy & Offline Guarantee</h4>
          <p className="text-slate-400 mt-0.5 leading-relaxed font-mono text-[11px]">
            TradePredict AI operates on a local-first paradigm. No mandatory cloud accounts, no third-party tracking databases. Your forecasts and watchlists remain entirely under your personal device control.
          </p>
        </div>
      </div>
    </div>
  );
};
