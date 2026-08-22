export const WMO_CODES = {
  0: { condition: 'Clear Sky', icon: '☀️', background: 'clear' },
  1: { condition: 'Mainly Clear', icon: '🌤️', background: 'clear' },
  2: { condition: 'Partly Cloudy', icon: '⛅', background: 'cloudy' },
  3: { condition: 'Overcast', icon: '☁️', background: 'cloudy' },
  45: { condition: 'Foggy', icon: '🌫️', background: 'cloudy' },
  48: { condition: 'Depositing Rime Fog', icon: '🌫️', background: 'cloudy' },
  51: { condition: 'Light Drizzle', icon: '🌦️', background: 'rain' },
  53: { condition: 'Moderate Drizzle', icon: '🌦️', background: 'rain' },
  55: { condition: 'Dense Drizzle', icon: '🌧️', background: 'rain' },
  56: { condition: 'Light Freezing Drizzle', icon: '🌧️', background: 'rain' },
  57: { condition: 'Dense Freezing Drizzle', icon: '🌧️', background: 'rain' },
  61: { condition: 'Slight Rain', icon: '🌦️', background: 'rain' },
  63: { condition: 'Moderate Rain', icon: '🌧️', background: 'rain' },
  65: { condition: 'Heavy Rain', icon: '🌧️', background: 'rain' },
  66: { condition: 'Light Freezing Rain', icon: '🌧️', background: 'rain' },
  67: { condition: 'Heavy Freezing Rain', icon: '🌧️', background: 'rain' },
  71: { condition: 'Slight Snowfall', icon: '🌨️', background: 'snow' },
  73: { condition: 'Moderate Snowfall', icon: '❄️', background: 'snow' },
  75: { condition: 'Heavy Snowfall', icon: '❄️', background: 'snow' },
  77: { condition: 'Snow Grains', icon: '❄️', background: 'snow' },
  80: { condition: 'Slight Rain Showers', icon: '🌦️', background: 'rain' },
  81: { condition: 'Moderate Rain Showers', icon: '🌧️', background: 'rain' },
  82: { condition: 'Violent Rain Showers', icon: '⛈️', background: 'thunderstorm' },
  85: { condition: 'Slight Snow Showers', icon: '🌨️', background: 'snow' },
  86: { condition: 'Heavy Snow Showers', icon: '❄️', background: 'snow' },
  95: { condition: 'Thunderstorm', icon: '⛈️', background: 'thunderstorm' },
  96: { condition: 'Thunderstorm with Slight Hail', icon: '⛈️', background: 'thunderstorm' },
  99: { condition: 'Thunderstorm with Heavy Hail', icon: '⛈️', background: 'thunderstorm' },
};

export const getWeatherInfo = (code) => {
  return WMO_CODES[code] || { condition: 'Unknown', icon: '❓', background: 'clear' };
};

export const isNight = (hour) => {
  return hour < 6 || hour >= 20;
};
