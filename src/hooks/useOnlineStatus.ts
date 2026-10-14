import { useState, useEffect, useCallback } from 'react';

export interface OnlineStatusState {
  isOnline: boolean;
  wasOffline: boolean;
  offlineSince: Date | null;
  reconnectCount: number;
  triggerManualCheck: () => Promise<boolean>;
}

export function useOnlineStatus(): OnlineStatusState {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [offlineSince, setOfflineSince] = useState<Date | null>(null);
  const [reconnectCount, setReconnectCount] = useState<number>(0);

  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      return false;
    }
    // Perform a lightweight fetch with cache buster to verify true internet reachability
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/favicon.ico?_ping=' + Date.now(), {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);
      const online = res.ok || res.type === 'opaque' || res.status < 500;
      setIsOnline(online);
      return online;
    } catch {
      // If server or fetch failed, fallback to navigator.onLine
      const fallback = typeof navigator !== 'undefined' ? navigator.onLine : true;
      setIsOnline(fallback);
      return fallback;
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      setOfflineSince(null);
      setReconnectCount(c => c + 1);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setOfflineSince(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      setOfflineSince(new Date());
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    wasOffline,
    offlineSince,
    reconnectCount,
    triggerManualCheck: checkConnectivity,
  };
}
