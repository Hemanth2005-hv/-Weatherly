/**
 * Weather Alert Code Mapping & Severity Detection
 * Maps WMO codes to alert categories and severity levels.
 */

// Alert severity levels
export const SEVERITY = {
  NORMAL: 'normal',
  WATCH: 'watch',
  SEVERE: 'severe',
  CRITICAL: 'critical',
};

export const SEVERITY_CONFIG = {
  [SEVERITY.NORMAL]: {
    level: 0,
    color: '#34d399',
    icon: '🟢',
    label: 'Normal',
    bgClass: 'alert-normal',
  },
  [SEVERITY.WATCH]: {
    level: 1,
    color: '#fbbf24',
    icon: '🟡',
    label: 'Watch',
    bgClass: 'alert-watch',
  },
  [SEVERITY.SEVERE]: {
    level: 2,
    color: '#fb923c',
    icon: '🟠',
    label: 'Severe',
    bgClass: 'alert-severe',
  },
  [SEVERITY.CRITICAL]: {
    level: 3,
    color: '#ef4444',
    icon: '🔴',
    label: 'Critical',
    bgClass: 'alert-critical',
  },
};

// Alert categories
export const ALERT_CATEGORIES = {
  THUNDERSTORM: 'thunderstorm',
  HEAVY_RAIN: 'heavy_rain',
  STRONG_WIND: 'strong_wind',
  EXTREME_HEAT: 'extreme_heat',
  EXTREME_COLD: 'extreme_cold',
  HIGH_UV: 'high_uv',
  HAIL: 'hail',
};

// WMO codes that indicate thunderstorm conditions
export const THUNDERSTORM_CODES = [95, 96, 99];

// WMO codes that indicate heavy rain
export const HEAVY_RAIN_CODES = [63, 65, 67, 81, 82];

// WMO codes that indicate moderate rain
export const MODERATE_RAIN_CODES = [51, 53, 55, 56, 57, 61, 80];

// WMO codes for snow
export const SNOW_CODES = [71, 73, 75, 77, 85, 86];

// WMO codes for fog
export const FOG_CODES = [45, 48];

/**
 * Get the alert category for a given WMO weather code.
 */
export const getAlertCategory = (weatherCode) => {
  if (THUNDERSTORM_CODES.includes(weatherCode)) return ALERT_CATEGORIES.THUNDERSTORM;
  if (HEAVY_RAIN_CODES.includes(weatherCode)) return ALERT_CATEGORIES.HEAVY_RAIN;
  if (MODERATE_RAIN_CODES.includes(weatherCode)) return ALERT_CATEGORIES.HEAVY_RAIN;
  if (SNOW_CODES.includes(weatherCode)) return ALERT_CATEGORIES.HEAVY_RAIN; // snow can be heavy precip
  return null;
};

/**
 * Determine severity based on weather code, wind, precipitation, temperature.
 */
export const evaluateSeverity = ({ weatherCode, windSpeed, precipitationProbability, temperature }) => {
  // Thunderstorm codes
  if (weatherCode === 99) return SEVERITY.CRITICAL; // Heavy hail
  if (weatherCode === 96) return SEVERITY.SEVERE;   // Slight hail
  if (weatherCode === 95) {
    if (windSpeed > 50) return SEVERITY.CRITICAL;
    if (windSpeed > 30 || precipitationProbability > 80) return SEVERITY.SEVERE;
    return SEVERITY.WATCH;
  }

  // Heavy rain
  if (HEAVY_RAIN_CODES.includes(weatherCode)) {
    if (precipitationProbability > 90 && windSpeed > 40) return SEVERITY.SEVERE;
    if (precipitationProbability > 70) return SEVERITY.WATCH;
  }

  // Strong wind
  if (windSpeed > 60) return SEVERITY.CRITICAL;
  if (windSpeed > 45) return SEVERITY.SEVERE;
  if (windSpeed > 30) return SEVERITY.WATCH;

  // Extreme temperature
  if (temperature > 45) return SEVERITY.CRITICAL;
  if (temperature > 40) return SEVERITY.SEVERE;
  if (temperature > 37) return SEVERITY.WATCH;
  if (temperature < -20) return SEVERITY.CRITICAL;
  if (temperature < -10) return SEVERITY.SEVERE;
  if (temperature < 0) return SEVERITY.WATCH;

  return SEVERITY.NORMAL;
};

/**
 * Generate a smart alert message based on conditions.
 */
export const generateAlertMessage = (alert) => {
  const { category, severity, weatherCode, windSpeed, precipitationProbability, temperature } = alert;

  const templates = {
    [ALERT_CATEGORIES.THUNDERSTORM]: {
      [SEVERITY.WATCH]: `Thunderstorms may develop near your area. Stay aware of changing conditions.`,
      [SEVERITY.SEVERE]: `Heavy thunderstorms are expected near your location. Consider staying indoors.`,
      [SEVERITY.CRITICAL]: `Severe thunderstorms with heavy precipitation detected near your area. Move indoors and avoid exposed areas.`,
    },
    [ALERT_CATEGORIES.HEAVY_RAIN]: {
      [SEVERITY.WATCH]: `A period of rain may occur near your location soon. Carry an umbrella.`,
      [SEVERITY.SEVERE]: `Heavy rain expected. Allow extra travel time and be cautious on roads.`,
      [SEVERITY.CRITICAL]: `Extremely heavy precipitation detected. Avoid travel if possible.`,
    },
    [ALERT_CATEGORIES.STRONG_WIND]: {
      [SEVERITY.WATCH]: `Wind speeds increasing. Secure loose outdoor objects.`,
      [SEVERITY.SEVERE]: `Strong winds detected. Avoid being near trees or power lines.`,
      [SEVERITY.CRITICAL]: `Dangerous wind speeds detected. Stay indoors and away from windows.`,
    },
    [ALERT_CATEGORIES.EXTREME_HEAT]: {
      [SEVERITY.WATCH]: `Temperatures rising. Stay hydrated and limit sun exposure.`,
      [SEVERITY.SEVERE]: `Extreme heat detected. Avoid outdoor activities during peak hours.`,
      [SEVERITY.CRITICAL]: `Dangerous heat levels. Risk of heat stroke. Stay in air-conditioned spaces.`,
    },
    [ALERT_CATEGORIES.EXTREME_COLD]: {
      [SEVERITY.WATCH]: `Temperatures dropping. Dress warmly in layers.`,
      [SEVERITY.SEVERE]: `Extreme cold detected. Limit outdoor exposure.`,
      [SEVERITY.CRITICAL]: `Dangerous cold levels. Risk of frostbite. Stay indoors.`,
    },
  };

  const categoryTemplates = templates[category];
  if (categoryTemplates && categoryTemplates[severity]) {
    return categoryTemplates[severity];
  }

  return `Weather conditions may affect your area. Monitor conditions and take appropriate precautions.`;
};

/**
 * Create an alert fingerprint to avoid duplicate notifications.
 */
export const createAlertFingerprint = (alert) => {
  return `${alert.category}-${alert.weatherCode}-${alert.severity}-${alert.forecastTime}`;
};

/**
 * Check if two alerts are the same event (for deduplication).
 */
export const isSameAlertEvent = (existing, newAlert) => {
  return existing.category === newAlert.category &&
    existing.forecastTime === newAlert.forecastTime;
};

/**
 * Check if severity has escalated.
 */
export const hasEscalated = (existing, newAlert) => {
  return SEVERITY_CONFIG[newAlert.severity].level > SEVERITY_CONFIG[existing.severity].level;
};

/**
 * Get the color for a severity level.
 */
export const getSeverityColor = (severity) => {
  return SEVERITY_CONFIG[severity]?.color || SEVERITY_CONFIG[SEVERITY.NORMAL].color;
};

/**
 * Get the icon for a severity level.
 */
export const getSeverityIcon = (severity) => {
  return SEVERITY_CONFIG[severity]?.icon || 'ℹ️';
};

/**
 * Get the label for a severity level.
 */
export const getSeverityLabel = (severity) => {
  return SEVERITY_CONFIG[severity]?.label || 'Unknown';
};

/**
 * Get a human-readable category name.
 */
export const getCategoryLabel = (category) => {
  const labels = {
    [ALERT_CATEGORIES.THUNDERSTORM]: 'Thunderstorm',
    [ALERT_CATEGORIES.HEAVY_RAIN]: 'Heavy Rain',
    [ALERT_CATEGORIES.STRONG_WIND]: 'Strong Wind',
    [ALERT_CATEGORIES.EXTREME_HEAT]: 'Extreme Heat',
    [ALERT_CATEGORIES.EXTREME_COLD]: 'Extreme Cold',
    [ALERT_CATEGORIES.HIGH_UV]: 'High UV',
    [ALERT_CATEGORIES.HAIL]: 'Hail',
  };
  return labels[category] || category?.replace(/_/g, ' ') || 'Unknown';
};
