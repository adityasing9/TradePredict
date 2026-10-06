import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Sidebar, PageId } from './components/common/Sidebar';
import { AIChatDrawer } from './components/ai/AIChatDrawer';
import { DashboardPage } from './pages/DashboardPage';
import { MarketsPage } from './pages/MarketsPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { BacktestingPage } from './pages/BacktestingPage';
import { PerformancePage } from './pages/PerformancePage';
import { NewsPage } from './pages/NewsPage';
import { ResearchPage } from './pages/ResearchPage';
import { PredictionHistoryPage } from './pages/PredictionHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useSettings } from './hooks/useSettings';
import { useWatchlist } from './hooks/useWatchlist';
import { useMarketData } from './hooks/useMarketData';
import { useAnalysisPipeline } from './hooks/useAnalysisPipeline';
import { ALL_ASSETS, getAssetById } from './data/universe';
import { Asset, Market } from './types/asset';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [activeAsset, setActiveAsset] = useState<Asset>(ALL_ASSETS[0]); // NABIL by default
  const [currentMarket, setCurrentMarket] = useState<Market | 'ALL'>('ALL');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const { isOnline, offlineSince } = useNetworkStatus();
  const { settings, updateSettings } = useSettings();
  const { items: watchlistItems, toggle: toggleWatchlist, isWatched } = useWatchlist();

  // Active asset data bundle for the AI Chat Drawer
  const { candles } = useMarketData(activeAsset, '1D');
  const { bundle } = useAnalysisPipeline(activeAsset, candles, '1D');

  const handleSelectAsset = (asset: Asset) => {
    setActiveAsset(asset);
    setCurrentPage('analysis');
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans relative selection:bg-brand-500/30 selection:text-brand-100">
      {/* Ambient background light orbs for aesthetic depth */}
      <div className="fixed top-[-10%] right-[-5%] w-[550px] h-[550px] rounded-full bg-brand-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[550px] h-[550px] rounded-full bg-terminal-cyan/8 blur-[140px] pointer-events-none z-0" />

      {/* Header */}
      <Header
        isOnline={isOnline}
        offlineSince={offlineSince}
        currentMarket={currentMarket}
        onSelectMarket={(m) => {
          setCurrentMarket(m);
          if (currentPage !== 'markets') setCurrentPage('markets');
        }}
        onSelectAsset={handleSelectAsset}
        onToggleChat={() => setChatOpen(!chatOpen)}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          watchlistCount={watchlistItems.length}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onSelectAsset={handleSelectAsset}
              onNavigate={(page) => setCurrentPage(page as PageId)}
              watchlistItems={watchlistItems.map((w) => w.assetId)}
            />
          )}

          {currentPage === 'markets' && (
            <MarketsPage
              onSelectAsset={handleSelectAsset}
              isWatched={isWatched}
              onToggleWatchlist={toggleWatchlist}
            />
          )}

          {currentPage === 'watchlist' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="border-b border-background-border pb-3">
                <h1 className="text-xl font-extrabold text-white font-mono">Your Monitored Watchlist</h1>
                <p className="text-xs text-slate-400">Assets tracked locally on your device.</p>
              </div>
              <MarketsPage
                onSelectAsset={handleSelectAsset}
                isWatched={isWatched}
                onToggleWatchlist={toggleWatchlist}
              />
            </div>
          )}

          {currentPage === 'analysis' && (
            <AnalysisPage
              asset={activeAsset}
              isWatched={isWatched(activeAsset.id)}
              onToggleWatchlist={() => toggleWatchlist(activeAsset.id)}
            />
          )}

          {currentPage === 'predictions' && (
            <PredictionsPage onSelectAsset={handleSelectAsset} />
          )}

          {currentPage === 'backtesting' && <BacktestingPage />}

          {currentPage === 'performance' && <PerformancePage />}

          {currentPage === 'news' && <NewsPage />}

          {currentPage === 'research' && (
            <ResearchPage onOpenChat={() => setChatOpen(true)} />
          )}

          {currentPage === 'history' && <PredictionHistoryPage />}

          {currentPage === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          )}
        </main>
      </div>

      {/* AI Research Assistant Slide-out Drawer */}
      <AIChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        bundle={bundle || null}
        settings={settings.ai}
      />
    </div>
  );
}

export default App;
