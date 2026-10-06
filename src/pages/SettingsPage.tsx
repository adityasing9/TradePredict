import React, { useState } from 'react';
import { UserSettings, AIProviderType } from '../types/settings';
import { exportAllLocalData, importLocalDataBackup } from '../db/settingsStore';
import { clearAllCache } from '../db/cacheStore';
import { Settings, Save, Download, Upload, Trash2, ShieldCheck, Sun, Moon, Cpu, Check } from 'lucide-react';

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
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-150">
      {/* Title */}
      <div className="border-b border-white/[0.07] pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            System & User Settings
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure default market preferences, AI engine providers, and manage your browser-local database.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Market Preferences */}
        <div className="glass-card rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Market & Interface Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Default Market</label>
              <select
                value={formData.defaultMarket}
                onChange={(e) => setFormData({ ...formData, defaultMarket: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
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
                className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
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
                className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
              >
                <option value="dark">Dark Terminal (Recommended)</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Provider Settings */}
        <div className="glass-card rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-400" />
              AI Analyst Provider Configuration
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08]">
              Configurable Engine
            </span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1.5">Active AI Provider</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'DETERMINISTIC', label: 'Deterministic Local Analyst', desc: '100% offline, zero keys required' },
                  { id: 'OPENROUTER', label: 'OpenRouter API', desc: 'Claude 3.5, GPT-4o, DeepSeek' },
                  { id: 'OLLAMA', label: 'Local Ollama', desc: 'Local self-hosted llama3' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, ai: { ...formData.ai, provider: p.id as any } })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      formData.ai.provider === p.id
                        ? 'bg-brand-500/15 border-brand-500 text-white font-bold shadow-glow-indigo'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* OpenRouter Inputs */}
            {formData.ai.provider === 'OPENROUTER' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">OpenRouter API Key</label>
                  <input
                    type="password"
                    value={formData.ai.openRouterApiKey || ''}
                    onChange={(e) => setFormData({ ...formData, ai: { ...formData.ai, openRouterApiKey: e.target.value } })}
                    placeholder="sk-or-v1-..."
                    className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Model Slug</label>
                  <input
                    type="text"
                    value={formData.ai.openRouterModel || 'anthropic/claude-3.5-sonnet'}
                    onChange={(e) => setFormData({ ...formData, ai: { ...formData.ai, openRouterModel: e.target.value } })}
                    placeholder="anthropic/claude-3.5-sonnet"
                    className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Ollama Inputs */}
            {formData.ai.provider === 'OLLAMA' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Ollama Base URL</label>
                  <input
                    type="text"
                    value={formData.ai.ollamaBaseUrl || 'http://localhost:11434'}
                    onChange={(e) => setFormData({ ...formData, ai: { ...formData.ai, ollamaBaseUrl: e.target.value } })}
                    className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Model Name</label>
                  <input
                    type="text"
                    value={formData.ai.ollamaModel || 'llama3:8b'}
                    onChange={(e) => setFormData({ ...formData, ai: { ...formData.ai, ollamaModel: e.target.value } })}
                    className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-brand-500/60 font-mono"
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
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-xs font-mono font-bold transition-all shadow-md hover:shadow-glow-indigo"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Settings Saved!' : 'Save System Settings'}</span>
          </button>
        </div>
      </form>

      {/* Local Data Management & Export / Import */}
      <div className="glass-card rounded-2xl border border-white/[0.08] p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Local Data Ownership & Backup Management
        </h3>
        <p className="text-xs text-slate-400">
          All prediction logs, watchlists, backtests, and analysis reports are kept 100% locally on your device in IndexedDB.
        </p>

        {importMessage && (
          <div className="p-3.5 rounded-xl bg-brand-500/15 border border-brand-500/30 text-xs font-mono text-brand-300">
            {importMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-200 border border-white/[0.08] transition-colors"
          >
            <Download className="w-4 h-4 text-brand-400" />
            <span>Export Complete JSON Backup</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-200 border border-white/[0.08] cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Restore Backup JSON</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Market Cache</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-5 rounded-2xl glass-card flex items-start gap-3.5 border-l-4 border-l-emerald-500">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <h4 className="font-mono font-bold text-white uppercase tracking-wider">Privacy & Offline Guarantee</h4>
          <p className="text-slate-400 mt-1 leading-relaxed">
            TradePredict AI operates on a local-first paradigm. No mandatory cloud accounts, no third-party databases, and no hidden tracking. Your forecasts, watchlists, and research data remain entirely under your personal control.
          </p>
        </div>
      </div>
    </div>
  );
};
