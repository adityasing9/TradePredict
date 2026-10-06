import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [offlineSince, setOfflineSince] = useState<number | null>(null);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setOfflineSince(null);
    }

    function handleOffline() {
      setIsOnline(false);
      setOfflineSince(Date.now());
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, offlineSince };
}
