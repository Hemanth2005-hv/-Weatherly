const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1';
const FORECAST_BASE = 'https://api.open-meteo.com/v1';

// Open-Meteo model URLs for multi-model accuracy
const MODEL_ENDPOINTS = [
  'https://api.open-meteo.com/v1/forecast',
  'https://api.open-meteo.com/v1/gem',
  'https://api.open-meteo.com/v1/icon',
];

const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'surface_pressure',
  'cloud_cover',
  'uv_index',
  'visibility',
  'is_day',
].join(',');

const HOURLY_FIELDS = [
  'temperature_2m',
  'weather_code',
  'precipitation_probability',
  'precipitation',
  'wind_speed_10m',
  'wind_gusts_10m',
  'uv_index',
  'is_day',
  'visibility',
].join(',');

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'precipitation_hours',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'uv_index_max',
  'sunrise',
  'sunset',
  'daylight_duration',
].join(',');

/**
 * Search cities using Open-Meteo Geocoding API
 */
export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${GEOCODING_BASE}/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error('Failed to search cities');
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map((city) => ({
      id: city.id,
      name: city.name,
      country: city.country || '',
      admin1: city.admin1 || '',
      latitude: city.latitude,
      longitude: city.longitude,
      countryCode: city.country_code || '',
      elevation: city.elevation || 0,
      population: city.population || 0,
      timezone: city.timezone || 'auto',
    }));
  } catch (error) {
    console.error('City search error:', error);
    throw new Error('Failed to search cities. Please check your connection.');
  }
};

/**
 * Reverse geocode coordinates to get city name
 * Uses Open-Meteo timezone data + fallback naming
 */
export const getReverseGeocode = async (latitude, longitude) => {
  try {
    // Use the timezone endpoint to get a location name hint
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m',
      timezone: 'auto',
    });

    const response = await fetch(`${FORECAST_BASE}/forecast?${params.toString()}`);
    const data = await response.json();

    const timezone = data.timezone || 'UTC';
    const cityName = timezone.split('/').pop().replace(/_/g, ' ');

    return {
      name: cityName || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      country: '',
      admin1: '',
      timezone,
    };
  } catch {
    return {
      name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      country: '',
      admin1: '',
    };
  }
};

/**
 * Primary weather fetch — single best-accuracy call with all fields
 * Uses Open-Meteo's default model (best_match) which automatically
 * selects the best model for the user's coordinates
 */
export const getWeather = async (latitude, longitude, unit = 'celsius') => {
  try {
    const temperatureUnit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
    const windSpeedUnit = unit === 'fahrenheit' ? 'mph' : 'kmh';

    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: CURRENT_FIELDS,
      hourly: HOURLY_FIELDS,
      daily: DAILY_FIELDS,
      timezone: 'auto',
      temperature_unit: temperatureUnit,
      wind_speed_unit: windSpeedUnit,
      forecast_days: '7',
      models: 'best_match',
    });

    const response = await fetch(`${FORECAST_BASE}/forecast?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return parseWeatherData(data);
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw new Error('Failed to fetch weather data. Please try again.');
  }
};

/**
 * Fetch weather from multiple models for cross-validation
 * Returns the primary + comparison data
 */
export const getWeatherMultiModel = async (latitude, longitude, unit = 'celsius') => {
  const temperatureUnit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  const windSpeedUnit = unit === 'fahrenheit' ? 'mph' : 'kmh';

  const baseParams = {
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: CURRENT_FIELDS,
    hourly: HOURLY_FIELDS,
    daily: DAILY_FIELDS,
    timezone: 'auto',
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit,
    forecast_days: '7',
  };

  // Fetch primary (best_match) + one regional model for comparison
  const modelParams = [
    { ...baseParams, models: 'best_match' },
    { ...baseParams, models: 'gfs_seamless' },
  ];

  const results = await Promise.allSettled(
    modelParams.map((params) => {
      const url = `${FORECAST_BASE}/forecast?${new URLSearchParams(params).toString()}`;
      return fetch(url).then((r) => r.json());
    })
  );

  // Primary data is always from best_match
  const primary = results[0].status === 'fulfilled' ? results[0].value : null;
  const secondary = results[1].status === 'fulfilled' ? results[1].value : null;

  if (!primary) {
    throw new Error('Failed to fetch weather data from all models');
  }

  const parsed = parseWeatherData(primary);

  // Add model metadata
  parsed.modelInfo = {
    primary: primary.model || 'best_match',
    secondary: secondary?.model || null,
    forecastDays: 7,
    lastModelUpdate: new Date().toISOString(),
  };

  return parsed;
};

/**
 * Parse raw Open-Meteo response into clean app data structure
 */
const parseWeatherData = (data) => {
  const current = data.current;
  const hourly = data.hourly;
  const daily = data.daily;

  // Find current hour index for hourly data
  const now = new Date();
  const currentHourStr = now.toISOString().slice(0, 13); // YYYY-MM-DDTHH
  let currentHourIndex = 0;
  if (hourly.time) {
    for (let i = 0; i < hourly.time.length; i++) {
      if (hourly.time[i].startsWith(currentHourStr)) {
        currentHourIndex = i;
        break;
      }
    }
  }

  return {
    current: {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      weatherCode: current.weather_code,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      windGusts: current.wind_gusts_10m || 0,
      pressure: current.surface_pressure,
      cloudCover: current.cloud_cover || 0,
      uvIndex: current.uv_index || 0,
      visibility: current.visibility || 10000,
      isDay: current.is_day === 1,
    },
    hourly: hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, i) => ({
      time,
      temperature: hourly.temperature_2m[currentHourIndex + i],
      weatherCode: hourly.weather_code[currentHourIndex + i],
      precipitationProbability: hourly.precipitation_probability[currentHourIndex + i],
      precipitation: hourly.precipitation?.[currentHourIndex + i] || 0,
      windSpeed: hourly.wind_speed_10m?.[currentHourIndex + i] || 0,
      windGusts: hourly.wind_gusts_10m?.[currentHourIndex + i] || 0,
      uvIndex: hourly.uv_index?.[currentHourIndex + i] || 0,
      visibility: hourly.visibility?.[currentHourIndex + i] || 10000,
      isDay: hourly.is_day[currentHourIndex + i] === 1,
    })),
    daily: daily.time.map((time, i) => ({
      date: time,
      weatherCode: daily.weather_code[i],
      maxTemp: daily.temperature_2m_max[i],
      minTemp: daily.temperature_2m_min[i],
      apparentMaxTemp: daily.apparent_temperature_max?.[i],
      apparentMinTemp: daily.apparent_temperature_min?.[i],
      precipitationProbability: daily.precipitation_probability_max[i],
      precipitationSum: daily.precipitation_sum?.[i] || 0,
      precipitationHours: daily.precipitation_hours?.[i] || 0,
      windSpeedMax: daily.wind_speed_10m_max?.[i] || 0,
      windGustsMax: daily.wind_gusts_10m_max?.[i] || 0,
      uvIndexMax: daily.uv_index_max?.[i] || 0,
      sunrise: daily.sunrise[i],
      sunset: daily.sunset[i],
      daylightDuration: daily.daylight_duration?.[i] || 0,
    })),
    timezone: data.timezone,
    fetchedAt: new Date().toISOString(),
  };
};

/**
 * Refresh weather data silently (no loading state)
 */
export const refreshWeather = async (latitude, longitude, unit = 'celsius') => {
  try {
    return await getWeather(latitude, longitude, unit);
  } catch {
    // Silent fail — keep old data
    return null;
  }
};
