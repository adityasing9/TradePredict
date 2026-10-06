import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface OfflineBadgeProps {
  isOnline: boolean;
  offlineSince?: number | null;
  lastUpdated?: number;
}

export const OfflineBadge: React.FC<OfflineBadgeProps> = ({ isOnline, offlineSince, lastUpdated }) => {
  const formatTime = (ts?: number | null) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
        <WifiOff className="w-3.5 h-3.5 animate-pulse" />
        <span>Offline — showing cached data {offlineSince ? `since ${formatTime(offlineSince)}` : ''}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      <Wifi className="w-3.5 h-3.5" />
      <span>Live {lastUpdated ? `• updated ${formatTime(lastUpdated)}` : ''}</span>
    </div>
  );
};
