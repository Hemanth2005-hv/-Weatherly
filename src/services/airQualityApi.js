const AIR_QUALITY_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const CURRENT_FIELDS = [
  'european_aqi',
  'us_aqi',
  'pm2_5',
  'pm10',
  'ozone',
  'nitrogen_dioxide',
  'sulphur_dioxide',
  'carbon_monoxide',
].join(',');

/**
 * Fetch current air quality for a location (Open-Meteo, no API key)
 */
export const getAirQuality = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: CURRENT_FIELDS,
      timezone: 'auto',
    });

    const response = await fetch(`${AIR_QUALITY_BASE}?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch air quality data');
    }

    const data = await response.json();

    return parseAirQuality(data);
  } catch (error) {
    console.error('Air quality fetch error:', error);
    throw new Error('Failed to fetch air quality data.');
  }
};

/**
 * Parse raw Open-Meteo air quality response into app data structure
 */
const parseAirQuality = (data) => {
  const current = data.current;

  if (!current || (current.european_aqi == null && current.us_aqi == null)) {
    return null;
  }

  return {
    aqi: current.european_aqi ?? null,
    usAqi: current.us_aqi ?? null,
    pollutants: [
      { key: 'pm2_5', label: 'PM2.5', value: current.pm2_5 ?? null, unit: 'µg/m³' },
      { key: 'pm10', label: 'PM10', value: current.pm10 ?? null, unit: 'µg/m³' },
      { key: 'ozone', label: 'O₃', value: current.ozone ?? null, unit: 'µg/m³' },
      { key: 'nitrogen_dioxide', label: 'NO₂', value: current.nitrogen_dioxide ?? null, unit: 'µg/m³' },
      { key: 'sulphur_dioxide', label: 'SO₂', value: current.sulphur_dioxide ?? null, unit: 'µg/m³' },
      { key: 'carbon_monoxide', label: 'CO', value: current.carbon_monoxide ?? null, unit: 'µg/m³' },
    ],
    time: current.time,
    fetchedAt: new Date().toISOString(),
  };
};
