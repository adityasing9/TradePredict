import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Sidebar, NavItemKey } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { AIChatDrawer } from './components/ai/AIChatDrawer';
import { DashboardPage } from './pages/DashboardPage';
import { MarketsPage } from './pages/MarketsPage';
import { AnalysisPage, AnalysisTabType } from './pages/AnalysisPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { BacktestingPage } from './pages/BacktestingPage';
import { PerformancePage } from './pages/PerformancePage';
import { NewsPage } from './pages/NewsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useSettings } from './hooks/useSettings';
import { useWatchlist } from './hooks/useWatchlist';
import { useMarketData } from './hooks/useMarketData';
import { useAnalysisPipeline } from './hooks/useAnalysisPipeline';
import { ALL_ASSETS } from './data/universe';
import { Asset, Market } from './types/asset';

export function App() {
  const [currentNav, setCurrentNav] = useState<NavItemKey>('dashboard');
  const [analysisTab, setAnalysisTab] = useState<AnalysisTabType>('OVERVIEW');
  const [activeAsset, setActiveAsset] = useState<Asset>(ALL_ASSETS[0]); // NABIL by default
  const [currentMarket, setCurrentMarket] = useState<Market | 'ALL'>('ALL');
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const { isOnline, offlineSince } = useNetworkStatus();
  const { settings, updateSettings } = useSettings();
  const { items: watchlistItems, toggle: toggleWatchlist, isWatched } = useWatchlist();

  // Active asset data bundle for the AI Chat Drawer & analysis
  const { candles } = useMarketData(activeAsset, '1D');
  const { bundle } = useAnalysisPipeline(activeAsset, candles, '1D');

  const handleSelectAsset = (asset: Asset) => {
    setActiveAsset(asset);
    setAnalysisTab('OVERVIEW');
    setCurrentNav('technical'); // open analysis
  };

  const handleNavSelect = (key: NavItemKey) => {
    if (key === 'ai_analyst') {
      setChatOpen(true);
      return;
    }

    if (key === 'technical') {
      setAnalysisTab('TECHNICAL');
      setCurrentNav('technical');
    } else if (key === 'fundamentals') {
      setAnalysisTab('FUNDAMENTAL');
      setCurrentNav('fundamentals');
    } else if (key === 'sentiment') {
      setAnalysisTab('SENTIMENT');
      setCurrentNav('sentiment');
    } else if (key === 'risk') {
      setAnalysisTab('QUANT');
      setCurrentNav('risk');
    } else {
      setCurrentNav(key);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans relative selection:bg-brand-500/30 selection:text-brand-100">
      {/* Top compact header */}
      <Header
        isOnline={isOnline}
        offlineSince={offlineSince}
        currentMarket={currentMarket}
        onSelectMarket={(m) => {
          setCurrentMarket(m);
          setCurrentNav('markets');
        }}
        onSelectAsset={handleSelectAsset}
        onToggleChat={() => setChatOpen(!chatOpen)}
        theme={settings.theme}
        onSelectTheme={(t) => updateSettings({ theme: t })}
        onOpenSettings={() => setCurrentNav('settings')}
        onToggleSidebar={() => setSidebarOpenMobile(!sidebarOpenMobile)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left collapsible Sidebar */}
        <Sidebar
          activeKey={currentNav}
          onSelectNav={handleNavSelect}
          isOpenMobile={sidebarOpenMobile}
          onCloseMobile={() => setSidebarOpenMobile(false)}
          watchlistCount={watchlistItems.length}
        />

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full pb-20 md:pb-6">
          {currentNav === 'dashboard' && (
            <DashboardPage
              onSelectAsset={handleSelectAsset}
              onNavigate={(page) => handleNavSelect(page as NavItemKey)}
              watchlistItems={watchlistItems.map((w) => w.assetId)}
            />
          )}

          {currentNav === 'markets' && (
            <MarketsPage
              onSelectAsset={handleSelectAsset}
              isWatched={isWatched}
              onToggleWatchlist={toggleWatchlist}
            />
          )}

          {currentNav === 'watchlist' && (
            <div className="space-y-4">
              <div className="border-b border-background-border pb-2.5">
                <h1 className="text-xl font-bold text-white font-mono">Monitored Watchlist</h1>
                <p className="text-xs text-slate-400">Locally saved assets on this device.</p>
              </div>
              <MarketsPage
                onSelectAsset={handleSelectAsset}
                isWatched={isWatched}
                onToggleWatchlist={toggleWatchlist}
              />
            </div>
          )}

          {(currentNav === 'technical' ||
            currentNav === 'fundamentals' ||
            currentNav === 'sentiment' ||
            currentNav === 'risk') && (
            <AnalysisPage
              asset={activeAsset}
              isWatched={isWatched(activeAsset.id)}
              onToggleWatchlist={() => toggleWatchlist(activeAsset.id)}
              initialTab={analysisTab}
            />
          )}

          {currentNav === 'prediction' && (
            <PredictionsPage onSelectAsset={handleSelectAsset} />
          )}

          {currentNav === 'backtesting' && <BacktestingPage />}

          {currentNav === 'performance' && <PerformancePage />}

          {currentNav === 'news' && <NewsPage />}

          {currentNav === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentNav}
        onSelectTab={(tab) => {
          if (tab === 'analysis') {
            handleNavSelect('technical');
          } else {
            handleNavSelect(tab as NavItemKey);
          }
        }}
        onOpenAI={() => setChatOpen(true)}
        watchlistCount={watchlistItems.length}
      />

      {/* AI Analyst Assistant Slide-out Drawer */}
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
