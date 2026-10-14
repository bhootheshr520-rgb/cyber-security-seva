import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PushAdvisory, 
  INITIAL_PUSH_ADVISORIES, 
  UPCOMING_THREAT_POOL 
} from '../data/pushNotificationsData';
import { playUrgentAdvisoryChime, playNotificationPing } from '../services/soundEffects';

export function usePushNotifications() {
  const [notifications, setNotifications] = useState<PushAdvisory[]>(INITIAL_PUSH_ADVISORIES);
  const [isAppBackgrounded, setIsAppBackgrounded] = useState<boolean>(false);
  const [activeHeadsUp, setActiveHeadsUp] = useState<PushAdvisory | null>(null);
  const [selectedAdvisory, setSelectedAdvisory] = useState<PushAdvisory | null>(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  
  // Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });
  const [autoFeedInterval, setAutoFeedInterval] = useState<'off' | '45s' | '90s'>('90s');
  
  // Scheduled countdown for simulation
  const [scheduledSecondsRemaining, setScheduledSecondsRemaining] = useState<number | null>(null);
  const scheduledTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const poolIndexRef = useRef<number>(0);

  // Request browser Web Notification permission
  const requestBrowserPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setBrowserPermission(permission);
        if (permission === 'granted') {
          // Play confirmation chime
          playNotificationPing();
          // Send sample test browser notification
          new Notification('🛡️ Cyber Security Seva Active', {
            body: 'Background cyber threat surveillance enabled. You will receive urgent advisories.',
            icon: '/favicon.ico',
          });
        }
      } catch (e) {
        console.error('Error requesting notification permission:', e);
      }
    }
  }, []);

  // Dispatch an actual browser push notification if permitted and tab is hidden or backgrounded
  const dispatchBrowserNotification = useCallback((advisory: PushAdvisory) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const n = new Notification(advisory.title, {
          body: `${advisory.agency}: ${advisory.body}`,
          icon: '/favicon.ico',
          tag: advisory.id,
          requireInteraction: advisory.severity === 'Critical',
        });
        n.onclick = () => {
          window.focus();
          setIsAppBackgrounded(false);
          setSelectedAdvisory(advisory);
          n.close();
        };
      } catch (err) {
        console.error('Failed to show browser notification:', err);
      }
    }
  }, []);

  // Trigger an advisory push notification
  const triggerPushNotification = useCallback((customAdvisory?: Partial<PushAdvisory>) => {
    // Pick next advisory from upcoming threat pool or use custom
    const poolItem = UPCOMING_THREAT_POOL[poolIndexRef.current % UPCOMING_THREAT_POOL.length];
    poolIndexRef.current += 1;

    const newAdvisory: PushAdvisory = {
      id: 'push-' + Date.now(),
      title: customAdvisory?.title || poolItem.title,
      body: customAdvisory?.body || poolItem.body,
      severity: customAdvisory?.severity || poolItem.severity,
      agency: customAdvisory?.agency || poolItem.agency,
      advisoryCode: customAdvisory?.advisoryCode || poolItem.advisoryCode,
      timestamp: 'Just now',
      createdAt: Date.now(),
      read: false,
      threatType: customAdvisory?.threatType || poolItem.threatType,
      immediateAction: customAdvisory?.immediateAction || poolItem.immediateAction,
      fullDetails: customAdvisory?.fullDetails || poolItem.fullDetails,
    };

    // Update state
    setNotifications((prev) => [newAdvisory, ...prev]);

    // Play chime if enabled
    if (soundEnabled) {
      playUrgentAdvisoryChime();
    }

    // If app is NOT backgrounded (in foreground), show heads-up banner
    if (!isAppBackgrounded) {
      setActiveHeadsUp(newAdvisory);
    }

    // Always attempt browser push if tab is hidden OR app is in background mode
    if (document.hidden || isAppBackgrounded) {
      dispatchBrowserNotification(newAdvisory);
    }
  }, [soundEnabled, isAppBackgrounded, dispatchBrowserNotification]);

  // Schedule background alert delivery in X seconds
  const scheduleBackgroundPush = useCallback((seconds: number) => {
    if (scheduledTimerRef.current) clearTimeout(scheduledTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setScheduledSecondsRemaining(seconds);

    countdownIntervalRef.current = setInterval(() => {
      setScheduledSecondsRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    scheduledTimerRef.current = setTimeout(() => {
      triggerPushNotification();
      setScheduledSecondsRemaining(null);
    }, seconds * 1000);
  }, [triggerPushNotification]);

  // Simulate minimizing app to background (with optional countdown delay)
  const simulateBackground = useCallback((delaySeconds?: number) => {
    setIsAppBackgrounded(true);
    if (delaySeconds && delaySeconds > 0) {
      scheduleBackgroundPush(delaySeconds);
    }
  }, [scheduleBackgroundPush]);

  // Return app to foreground
  const returnToApp = useCallback((openAdvisory?: PushAdvisory) => {
    setIsAppBackgrounded(false);
    if (openAdvisory) {
      // Mark as read
      setNotifications((prev) =>
        prev.map((n) => (n.id === openAdvisory.id ? { ...n, read: true } : n))
      );
      setSelectedAdvisory(openAdvisory);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Handle opening an advisory
  const handleOpenAdvisory = useCallback((advisory: PushAdvisory) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === advisory.id ? { ...n, read: true } : n))
    );
    setActiveHeadsUp(null);
    setIsAppBackgrounded(false);
    setSelectedAdvisory(advisory);
  }, []);

  // Real document visibility listener: if user switches away from the browser tab,
  // we can detect when they return, and if an alert was triggered while they were away,
  // it greeted them via Web Notification API!
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab was placed into background by the browser
      } else {
        // Tab returned to focus
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Auto simulated feed timer
  useEffect(() => {
    if (autoFeedInterval === 'off') return;

    const intervalMs = autoFeedInterval === '45s' ? 45000 : 90000;
    const timer = setInterval(() => {
      triggerPushNotification();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoFeedInterval, triggerPushNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scheduledTimerRef.current) clearTimeout(scheduledTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  return {
    notifications,
    isAppBackgrounded,
    activeHeadsUp,
    selectedAdvisory,
    isNotificationCenterOpen,
    soundEnabled,
    browserPermission,
    autoFeedInterval,
    scheduledSecondsRemaining,
    setIsNotificationCenterOpen,
    setSelectedAdvisory,
    setActiveHeadsUp,
    setSoundEnabled,
    setAutoFeedInterval,
    triggerPushNotification,
    scheduleBackgroundPush,
    simulateBackground,
    returnToApp,
    markAllAsRead,
    clearAll,
    handleOpenAdvisory,
    requestBrowserPermission,
  };
}
