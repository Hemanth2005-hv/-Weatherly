import { useState, useEffect, useCallback, useRef } from 'react';
import {
  checkWeatherAlerts,
  shouldNotify,
  sendBrowserNotification,
} from '../services/weatherAlertEngine';
import { SEVERITY } from '../utils/weatherAlerts';

const SETTINGS_KEY = 'weather_alert_settings';
const HISTORY_KEY = 'weather_alert_history';
const LAST_ALERTS_KEY = 'weather_last_alerts';
const MONITORING_KEY = 'weather_monitoring';

const DEFAULT_SETTINGS = {
  enabled: false,
  radius: 10,
  sound: true,
  severeOnly: false,
  quietHoursStart: 23,
  quietHoursEnd: 6,
  categories: {
    thunderstorm: true,
    heavyRain: true,
    strongWind: true,
    extremeHeat: true,
    extremeCold: true,
  },
};

const loadSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch { /* noop */ }
};

const loadHistory = () => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveHistory = (history) => {
  try {
    // Limit to 20 alerts
    const limited = history.slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limited));
  } catch { /* noop */ }
};

const loadLastAlerts = () => {
  try {
    const stored = localStorage.getItem(LAST_ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLastAlerts = (alerts) => {
  try {
    localStorage.setItem(LAST_ALERTS_KEY, JSON.stringify(alerts));
  } catch { /* noop */ }
};

const loadMonitoring = () => {
  try {
    const stored = localStorage.getItem(MONITORING_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveMonitoring = (data) => {
  try {
    if (data) {
      localStorage.setItem(MONITORING_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(MONITORING_KEY);
    }
  } catch { /* noop */ }
};

export const useAlerts = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [location, setLocation] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerAlert, setBannerAlert] = useState(null);
  const [settings, setSettings] = useState(loadSettings);
  const [history, setHistory] = useState(loadHistory);
  const [lastCheck, setLastCheck] = useState(null);
  const [nextCheck, setNextCheck] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'unavailable'
  );
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCenter, setShowCenter] = useState(false);
  const [alertSoundEnabled, setAlertSoundEnabled] = useState(settings.sound);
  const intervalRef = useRef(null);
  const lastAlertsRef = useRef(loadLastAlerts());

  // Check if currently in quiet hours
  const isQuietHours = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();
    const start = settings.quietHoursStart;
    const end = settings.quietHoursEnd;

    if (start > end) {
      // Crosses midnight
      return hour >= start || hour < end;
    }
    return hour >= start && hour < end;
  }, [settings.quietHoursStart, settings.quietHoursEnd]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(loc);
        setIsMonitoring(true);
        setShowBanner(false);
        saveMonitoring(loc);

        // Update settings
        const newSettings = { ...settings, enabled: true };
        setSettings(newSettings);
        saveSettings(newSettings);

        // Initial check
        performCheck(loc, newSettings);

        // Set up interval (every 15 minutes)
        intervalRef.current = setInterval(() => {
          performCheck(loc, newSettings);
        }, 15 * 60 * 1000);

        setNextCheck(new Date(Date.now() + 15 * 60 * 1000));
      },
      (err) => {
        console.error('Location error:', err);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            alert('Location permission is needed for weather alerts. Please enable location access.');
            break;
          case err.POSITION_UNAVAILABLE:
            alert('Location information unavailable. Please try again.');
            break;
          case err.TIMEOUT:
            alert('Location request timed out. Please try again.');
            break;
          default:
            alert('Could not get your location. Please try again.');
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, [settings]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    setLocation(null);
    setAlerts([]);
    setActiveAlert(null);
    setShowBanner(false);
    setBannerAlert(null);
    setLastCheck(null);
    setNextCheck(null);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const newSettings = { ...settings, enabled: false };
    setSettings(newSettings);
    saveSettings(newSettings);
    saveMonitoring(null);
  }, [settings]);

  // Perform a weather check
  const performCheck = useCallback(async (loc, currentSettings) => {
    try {
      const detectedAlerts = await checkWeatherAlerts(
        loc.latitude,
        loc.longitude,
        currentSettings.radius,
        currentSettings
      );

      setLastCheck(new Date());
      setNextCheck(new Date(Date.now() + 15 * 60 * 1000));

      // Filter new alerts that should trigger notifications
      const newAlerts = detectedAlerts.filter((alert) =>
        shouldNotify(alert, lastAlertsRef.current)
      );

      // Handle new notifications
      if (newAlerts.length > 0) {
        const quietHours = isQuietHours();

        newAlerts.forEach((alert) => {
          // Send browser notification
          if (!quietHours || alert.severity === SEVERITY.CRITICAL) {
            sendBrowserNotification(alert, quietHours);
          }

          // Play sound if enabled
          if (currentSettings.sound && !quietHours) {
            playAlertSound();
          }

          // Add to history
          const historyEntry = {
            ...alert,
            timestamp: new Date().toISOString(),
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          };
          setHistory((prev) => {
            const updated = [historyEntry, ...prev];
            saveHistory(updated);
            return updated;
          });
        });

        // Update last alerts for deduplication
        lastAlertsRef.current = [...newAlerts, ...lastAlertsRef.current].slice(0, 50);
        saveLastAlerts(lastAlertsRef.current);

        // Show banner for highest severity alert
        const highestAlert = newAlerts.reduce((prev, curr) => {
          const prevLevel = { normal: 0, watch: 1, severe: 2, critical: 3 }[prev.severity] || 0;
          const currLevel = { normal: 0, watch: 1, severe: 2, critical: 3 }[curr.severity] || 0;
          return currLevel > prevLevel ? curr : prev;
        });

        setBannerAlert(highestAlert);
        setShowBanner(true);
      }

      setAlerts(detectedAlerts);
    } catch (err) {
      console.error('Alert check failed:', err);
    }
  }, [isQuietHours]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      setNotificationPermission('unavailable');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setShowNotificationPrompt(false);
    } catch {
      setNotificationPermission('denied');
    }
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);

    // If monitoring, restart with new settings
    if (isMonitoring && location) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        performCheck(location, updated);
      }, 15 * 60 * 1000);
      setNextCheck(new Date(Date.now() + 15 * 60 * 1000));
    }
  }, [settings, isMonitoring, location, performCheck]);

  // Toggle alert sound
  const toggleAlertSound = useCallback(() => {
    const newValue = !alertSoundEnabled;
    setAlertSoundEnabled(newValue);
    updateSettings({ sound: newValue });
  }, [alertSoundEnabled, updateSettings]);

  // Clear alert history
  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  // Dismiss banner
  const dismissBanner = useCallback(() => {
    setShowBanner(false);
    setBannerAlert(null);
  }, []);

  // Get active alerts (non-normal)
  const getActiveAlerts = useCallback(() => {
    return alerts.filter((a) => a.severity !== SEVERITY.NORMAL);
  }, [alerts]);

  // Get highest severity
  const getHighestSeverity = useCallback(() => {
    const active = getActiveAlerts();
    if (active.length === 0) return SEVERITY.NORMAL;
    return active.reduce((prev, curr) => {
      const prevLevel = { normal: 0, watch: 1, severe: 2, critical: 3 }[prev.severity] || 0;
      const currLevel = { normal: 0, watch: 1, severe: 2, critical: 3 }[curr.severity] || 0;
      return currLevel > prevLevel ? curr : prev;
    }).severity;
  }, [getActiveAlerts]);

  // Restore monitoring from localStorage on mount
  useEffect(() => {
    const savedMonitoring = loadMonitoring();
    if (savedMonitoring && settings.enabled) {
      setLocation(savedMonitoring);
      setIsMonitoring(true);
      performCheck(savedMonitoring, settings);

      intervalRef.current = setInterval(() => {
        performCheck(savedMonitoring, settings);
      }, 15 * 60 * 1000);

      setNextCheck(new Date(Date.now() + 15 * 60 * 1000));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    // State
    isMonitoring,
    location,
    alerts,
    activeAlert,
    showBanner,
    bannerAlert,
    settings,
    history,
    lastCheck,
    nextCheck,
    notificationPermission,
    showNotificationPrompt,
    showDetail,
    showSettings,
    showHistory,
    showCenter,
    alertSoundEnabled,

    // Actions
    startMonitoring,
    stopMonitoring,
    performCheck: () => location && performCheck(location, settings),
    requestNotificationPermission,
    updateSettings,
    toggleAlertSound,
    clearHistory,
    dismissBanner,
    setActiveAlert,
    setShowDetail,
    setShowSettings,
    setShowHistory,
    setShowCenter,
    setShowNotificationPrompt,
    getActiveAlerts,
    getHighestSeverity,
    isQuietHours,
  };
};

// Simple alert sound using Web Audio API
const playAlertSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Play two short beeps
    const playBeep = (startTime, frequency) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime + startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + 0.3);

      oscillator.start(audioCtx.currentTime + startTime);
      oscillator.stop(audioCtx.currentTime + startTime + 0.3);
    };

    playBeep(0, 880);
    playBeep(0.4, 1100);
  } catch {
    // Audio not available
  }
};
