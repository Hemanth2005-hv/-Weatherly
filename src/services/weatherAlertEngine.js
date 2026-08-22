import {
  SEVERITY,
  THUNDERSTORM_CODES,
  HEAVY_RAIN_CODES,
  ALERT_CATEGORIES,
  evaluateSeverity,
  getAlertCategory,
  createAlertFingerprint,
  isSameAlertEvent,
  hasEscalated,
} from '../utils/weatherAlerts';
import { getMonitoringPoints } from '../utils/distance';

/**
 * Fetch forecast data for a specific lat/lon from Open-Meteo.
 */
const fetchForecastForPoint = async (latitude, longitude) => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: ['temperature_2m', 'weather_code', 'wind_speed_10m', 'is_day'].join(','),
    hourly: ['temperature_2m', 'weather_code', 'precipitation_probability', 'wind_speed_10m', 'is_day'].join(','),
    timezone: 'auto',
    forecast_days: '1',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch forecast');
  return response.json();
};

/**
 * Analyze a single forecast point for potential alerts.
 * Returns an array of detected alerts.
 */
const analyzePoint = (forecastData, pointLat, pointLon, userLat, userLon, radiusKm) => {
  const alerts = [];
  const { current, hourly } = forecastData;

  // Analyze current conditions
  const currentCode = current.weather_code;
  const currentWind = current.wind_speed_10m;
  const currentTemp = current.temperature_2m;

  const currentSeverity = evaluateSeverity({
    weatherCode: currentCode,
    windSpeed: currentWind,
    precipitationProbability: 0,
    temperature: currentTemp,
  });

  if (currentSeverity !== SEVERITY.NORMAL) {
    const category = getAlertCategory(currentCode) || ALERT_CATEGORIES.THUNDERSTORM;
    alerts.push({
      id: `current-${Date.now()}`,
      category,
      severity: currentSeverity,
      weatherCode: currentCode,
      windSpeed: currentWind,
      temperature: currentTemp,
      precipitationProbability: 0,
      forecastTime: new Date().toISOString(),
      isCurrent: true,
      latitude: pointLat,
      longitude: pointLon,
      distance: 0,
    });
  }

  // Analyze hourly forecast for approaching storms
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex((t) => new Date(t) >= now);

  if (currentHourIndex >= 0) {
    // Check next 3 hours
    for (let i = currentHourIndex; i < Math.min(currentHourIndex + 4, hourly.time.length); i++) {
      const hourCode = hourly.weather_code[i];
      const hourWind = hourly.wind_speed_10m[i];
      const hourTemp = hourly.temperature_2m[i];
      const hourPrecip = hourly.precipitation_probability[i];
      const hoursAhead = i - currentHourIndex;

      // Check for thunderstorm codes
      if (THUNDERSTORM_CODES.includes(hourCode)) {
        const severity = evaluateSeverity({
          weatherCode: hourCode,
          windSpeed: hourWind,
          precipitationProbability: hourPrecip,
          temperature: hourTemp,
        });

        // If it's coming soon (within 3 hours), create an approaching alert
        if (hoursAhead <= 3) {
          const category = getAlertCategory(hourCode) || 'thunderstorm';
          alerts.push({
            id: `approaching-${Date.now()}-${i}`,
            category,
            severity: hoursAhead === 0 ? severity : SEVERITY.WATCH,
            weatherCode: hourCode,
            windSpeed: hourWind,
            temperature: hourTemp,
            precipitationProbability: hourPrecip,
            forecastTime: hourly.time[i],
            isCurrent: false,
            hoursAhead,
            latitude: pointLat,
            longitude: pointLon,
            distance: 0,
          });
        }
      }

      // Check for heavy rain approaching
      if (HEAVY_RAIN_CODES.includes(hourCode) && hourPrecip > 60 && hoursAhead <= 3) {
        alerts.push({
          id: `rain-${Date.now()}-${i}`,
          category: 'heavy_rain',
          severity: hourPrecip > 80 ? SEVERITY.SEVERE : SEVERITY.WATCH,
          weatherCode: hourCode,
          windSpeed: hourWind,
          temperature: hourTemp,
          precipitationProbability: hourPrecip,
          forecastTime: hourly.time[i],
          isCurrent: false,
          hoursAhead,
          latitude: pointLat,
          longitude: pointLon,
          distance: 0,
        });
      }

      // Check for strong wind
      if (hourWind > 30 && hoursAhead <= 3) {
        const windSeverity = evaluateSeverity({
          weatherCode: hourCode,
          windSpeed: hourWind,
          precipitationProbability: hourPrecip,
          temperature: hourTemp,
        });

        if (windSeverity !== SEVERITY.NORMAL) {
          alerts.push({
            id: `wind-${Date.now()}-${i}`,
            category: 'strong_wind',
            severity: windSeverity,
            weatherCode: hourCode,
            windSpeed: hourWind,
            temperature: hourTemp,
            precipitationProbability: hourPrecip,
            forecastTime: hourly.time[i],
            isCurrent: false,
            hoursAhead,
            latitude: pointLat,
            longitude: pointLon,
            distance: 0,
          });
        }
      }

      // Check extreme temperature in forecast
      if (hourTemp > 40 || hourTemp < -10) {
        const tempSeverity = evaluateSeverity({
          weatherCode: hourCode,
          windSpeed: hourWind,
          precipitationProbability: hourPrecip,
          temperature: hourTemp,
        });

        if (tempSeverity !== SEVERITY.NORMAL) {
          const category = hourTemp > 40 ? 'extreme_heat' : 'extreme_cold';
          alerts.push({
            id: `temp-${Date.now()}-${i}`,
            category,
            severity: tempSeverity,
            weatherCode: hourCode,
            windSpeed: hourWind,
            temperature: hourTemp,
            precipitationProbability: hourPrecip,
            forecastTime: hourly.time[i],
            isCurrent: false,
            hoursAhead,
            latitude: pointLat,
            longitude: pointLon,
            distance: 0,
          });
        }
      }
    }
  }

  return alerts;
};

/**
 * Main alert check function.
 * Monitors weather across multiple points within the radius.
 */
export const checkWeatherAlerts = async (latitude, longitude, radiusKm = 10, alertSettings = {}) => {
  const points = getMonitoringPoints(latitude, longitude, radiusKm);
  const allAlerts = [];

  // Fetch forecasts for all monitoring points
  const forecasts = await Promise.allSettled(
    points.map((point) => fetchForecastForPoint(point.latitude, point.longitude))
  );

  // Analyze each point
  forecasts.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const point = points[index];
      const pointAlerts = analyzePoint(
        result.value,
        point.latitude,
        point.longitude,
        latitude,
        longitude,
        radiusKm
      );

      // Set distance from user
      pointAlerts.forEach((alert) => {
        alert.distance = point.distance;
      });

      allAlerts.push(...pointAlerts);
    }
  });

  // Deduplicate and find highest severity per category
  const deduplicatedAlerts = deduplicateAlerts(allAlerts);

  // Filter by user settings
  const filteredAlerts = filterBySettings(deduplicatedAlerts, alertSettings);

  // Sort by severity (highest first)
  filteredAlerts.sort((a, b) => {
    const severityDiff = SEVERITY_CONFIG_MAP[b.severity] - SEVERITY_CONFIG_MAP[a.severity];
    if (severityDiff !== 0) return severityDiff;
    return a.distance - b.distance;
  });

  return filteredAlerts;
};

const SEVERITY_CONFIG_MAP = {
  [SEVERITY.NORMAL]: 0,
  [SEVERITY.WATCH]: 1,
  [SEVERITY.SEVERE]: 2,
  [SEVERITY.CRITICAL]: 3,
};

/**
 * Deduplicate alerts by category, keeping the highest severity.
 */
const deduplicateAlerts = (alerts) => {
  const map = new Map();

  alerts.forEach((alert) => {
    const key = alert.category;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, alert);
    } else if (SEVERITY_CONFIG_MAP[alert.severity] > SEVERITY_CONFIG_MAP[existing.severity]) {
      map.set(key, alert);
    } else if (
      SEVERITY_CONFIG_MAP[alert.severity] === SEVERITY_CONFIG_MAP[existing.severity] &&
      alert.distance < existing.distance
    ) {
      map.set(key, alert);
    }
  });

  return Array.from(map.values());
};

/**
 * Filter alerts based on user settings.
 */
const filterBySettings = (alerts, settings) => {
  if (!settings || Object.keys(settings).length === 0) return alerts;

  return alerts.filter((alert) => {
    // Check if category is enabled
    if (settings.categories) {
      const categoryMap = {
        thunderstorm: settings.categories.thunderstorm !== false,
        heavy_rain: settings.categories.heavyRain !== false,
        strong_wind: settings.categories.strongWind !== false,
        extreme_heat: settings.categories.extremeHeat !== false,
        extreme_cold: settings.categories.extremeCold !== false,
      };
      if (categoryMap[alert.category] === false) return false;
    }

    // Check severe-only filter
    if (settings.severeOnly && alert.severity === SEVERITY.WATCH) {
      return false;
    }

    return true;
  });
};

/**
 * Check if we should notify based on fingerprint deduplication.
 */
export const shouldNotify = (alert, recentAlerts = []) => {
  const fingerprint = createAlertFingerprint(alert);

  for (const recent of recentAlerts) {
    const recentFingerprint = createAlertFingerprint(recent);
    if (fingerprint === recentFingerprint) {
      return false; // Already notified for this exact event
    }

    // If it's the same event but escalated, notify
    if (isSameAlertEvent(recent, alert) && hasEscalated(recent, alert)) {
      return true;
    }

    // Same category, same event, no escalation = skip
    if (isSameAlertEvent(recent, alert)) {
      return false;
    }
  }

  return true;
};

/**
 * Send a browser notification for an alert.
 */
export const sendBrowserNotification = (alert, isQuietHours = false) => {
  if (isQuietHours && alert.severity !== SEVERITY.CRITICAL) {
    return false;
  }

  if (!('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  const severityConfig = {
    [SEVERITY.WATCH]: { icon: '⚠️', title: 'Weather Watch' },
    [SEVERITY.SEVERE]: { icon: '🌩️', title: 'Severe Weather Alert' },
    [SEVERITY.CRITICAL]: { icon: '🚨', title: 'Dangerous Weather Alert' },
  };

  const config = severityConfig[alert.severity] || severityConfig[SEVERITY.WATCH];

  try {
    new Notification(`${config.icon} ${config.title}`, {
      body: `${alert.category.replace(/_/g, ' ')} conditions detected near your location. Open Weather App for details.`,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: `weather-alert-${alert.category}`,
      requireInteraction: alert.severity === SEVERITY.CRITICAL,
    });
    return true;
  } catch {
    return false;
  }
};
