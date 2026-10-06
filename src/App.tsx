import React, { useState, useEffect } from 'react';
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
import { usePinnedAssets } from './hooks/usePinnedAssets';
import { useMarketData } from './hooks/useMarketData';
import { useAnalysisPipeline } from './hooks/useAnalysisPipeline';
import { PinnedTickerBar } from './components/common/PinnedTickerBar';
import { ALL_ASSETS, getAssetById } from './data/universe';
import { Asset, Market } from './types/asset';
import { getInitialRoute, persistRoute } from './utils/router';

export function App() {
  // Initialize route from URL hash, pathname, or sessionStorage
  const [initialRoute] = useState(() => getInitialRoute());
  const [currentNav, setCurrentNav] = useState<NavItemKey>(initialRoute.nav);
  const [analysisTab, setAnalysisTab] = useState<AnalysisTabType>(initialRoute.tab);
  const [activeAsset, setActiveAsset] = useState<Asset>(() => {
    const asset = getAssetById(initialRoute.assetId);
    return asset || ALL_ASSETS[0];
  });

  const [currentMarket, setCurrentMarket] = useState<Market | 'ALL'>('ALL');
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const { isOnline, offlineSince } = useNetworkStatus();
  const { settings, updateSettings } = useSettings();
  const { items: watchlistItems, toggle: toggleWatchlist, isWatched } = useWatchlist();
  const {
    pinnedIds,
    isPinned,
    togglePin,
    isBarVisible,
    toggleBarVisible
  } = usePinnedAssets();

  // Active asset data bundle for the AI Chat Drawer & analysis
  const { candles } = useMarketData(activeAsset, '1D');
  const { bundle } = useAnalysisPipeline(activeAsset, candles, '1D');

  // Sync initial state into URL hash on mount if needed
  useEffect(() => {
    persistRoute(
      {
        nav: currentNav,
        assetId: activeAsset.id,
        tab: analysisTab
      },
      true
    );
  }, []);

  // Listen for browser Back/Forward and hashchange navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const route = getInitialRoute();
      setCurrentNav(route.nav);
      setAnalysisTab(route.tab);
      const asset = getAssetById(route.assetId);
      if (asset) setActiveAsset(asset);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleSelectAsset = (asset: Asset) => {
    setActiveAsset(asset);
    setAnalysisTab('OVERVIEW');
    setCurrentNav('technical');
    persistRoute({
      nav: 'technical',
      assetId: asset.id,
      tab: 'OVERVIEW'
    });
  };

  const handleNavSelect = (key: NavItemKey) => {
    if (key === 'ai_analyst') {
      setChatOpen(true);
      return;
    }

    if (key === 'technical') {
      setAnalysisTab('TECHNICAL');
      setCurrentNav('technical');
      persistRoute({
        nav: 'technical',
        assetId: activeAsset.id,
        tab: 'TECHNICAL'
      });
    } else if (key === 'fundamentals') {
      setAnalysisTab('FUNDAMENTAL');
      setCurrentNav('fundamentals');
      persistRoute({
        nav: 'fundamentals',
        assetId: activeAsset.id,
        tab: 'FUNDAMENTAL'
      });
    } else if (key === 'sentiment') {
      setAnalysisTab('SENTIMENT');
      setCurrentNav('sentiment');
      persistRoute({
        nav: 'sentiment',
        assetId: activeAsset.id,
        tab: 'SENTIMENT'
      });
    } else if (key === 'risk') {
      setAnalysisTab('QUANT');
      setCurrentNav('risk');
      persistRoute({
        nav: 'risk',
        assetId: activeAsset.id,
        tab: 'QUANT'
      });
    } else {
      setCurrentNav(key);
      persistRoute({
        nav: key,
        assetId: activeAsset.id,
        tab: analysisTab
      });
    }
  };

  const handleAnalysisTabChange = (tab: AnalysisTabType) => {
    setAnalysisTab(tab);
    persistRoute({
      nav: currentNav,
      assetId: activeAsset.id,
      tab
    });
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans relative selection:bg-accent-cyan/20 selection:text-cyan-200">
      {/* Top compact header */}
      <Header
        isOnline={isOnline}
        offlineSince={offlineSince}
        currentMarket={currentMarket}
        onSelectMarket={(m) => {
          setCurrentMarket(m);
          handleNavSelect('markets');
        }}
        onSelectAsset={handleSelectAsset}
        onToggleChat={() => setChatOpen(!chatOpen)}
        theme={settings.theme}
        onSelectTheme={(t) => updateSettings({ theme: t })}
        onOpenSettings={() => handleNavSelect('settings')}
        onToggleSidebar={() => setSidebarOpenMobile(!sidebarOpenMobile)}
        isPinned={isPinned}
        onTogglePin={togglePin}
      />

      {/* Pinned Assets Quick-Ticker Bar across top */}
      <PinnedTickerBar
        pinnedIds={pinnedIds}
        activeAsset={activeAsset}
        onSelectAsset={handleSelectAsset}
        onTogglePin={togglePin}
        isPinned={isPinned}
        isVisible={isBarVisible}
        onToggleVisibility={toggleBarVisible}
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
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 max-w-[1600px] mx-auto w-full pb-20 md:pb-6">
          {currentNav === 'dashboard' && (
            <DashboardPage
              onSelectAsset={handleSelectAsset}
              onNavigate={(page) => handleNavSelect(page as NavItemKey)}
              watchlistItems={watchlistItems.map((w) => w.assetId)}
              pinnedItems={pinnedIds}
              onTogglePin={togglePin}
            />
          )}

          {currentNav === 'markets' && (
            <MarketsPage
              onSelectAsset={handleSelectAsset}
              isWatched={isWatched}
              onToggleWatchlist={toggleWatchlist}
              isPinned={isPinned}
              onTogglePin={togglePin}
            />
          )}

          {currentNav === 'watchlist' && (
            <div className="space-y-4">
              <div className="border-b border-border pb-2.5">
                <h1 className="text-xl font-bold text-white font-mono">Monitored Watchlist</h1>
                <p className="text-xs text-slate-400">Locally saved assets on this device.</p>
              </div>
              <MarketsPage
                onSelectAsset={handleSelectAsset}
                isWatched={isWatched}
                onToggleWatchlist={toggleWatchlist}
                isPinned={isPinned}
                onTogglePin={togglePin}
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
              isPinned={isPinned(activeAsset.id)}
              onTogglePin={() => togglePin(activeAsset.id)}
              pinnedIds={pinnedIds}
              initialTab={analysisTab}
              onTabChange={handleAnalysisTabChange}
              onSelectAsset={handleSelectAsset}
            />
          )}

          {currentNav === 'prediction' && (
            <PredictionsPage
              onSelectAsset={handleSelectAsset}
              isPinned={isPinned}
              onTogglePin={togglePin}
            />
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
