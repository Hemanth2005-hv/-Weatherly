// European AQI bands (0–20 good … >100 extremely poor)
export const AQI_BANDS = [
  {
    max: 20,
    label: 'Good',
    color: '#34d399',
    advice: 'Air quality is good — a great time to be outside.',
  },
  {
    max: 40,
    label: 'Fair',
    color: '#a3e635',
    advice: 'Air quality is fair — outdoor activity is fine for most people.',
  },
  {
    max: 60,
    label: 'Moderate',
    color: '#fbbf24',
    advice: 'Sensitive groups may want to limit long or intense outdoor exertion.',
  },
  {
    max: 80,
    label: 'Poor',
    color: '#fb923c',
    advice: 'Reduce prolonged outdoor exertion, especially if you are sensitive.',
  },
  {
    max: 100,
    label: 'Very Poor',
    color: '#f87171',
    advice: 'Avoid intense outdoor activity and keep windows closed where possible.',
  },
  {
    max: Infinity,
    label: 'Extremely Poor',
    color: '#a855f7',
    advice: 'Stay indoors if you can and follow local health guidance.',
  },
];

// Gauge scale: 120+ fills the whole bar
export const AQI_SCALE_MAX = 120;

export const getAqiBand = (aqi) => {
  if (aqi == null || Number.isNaN(aqi)) {
    return {
      label: 'Unknown',
      color: '#94a3b8',
      advice: 'No air quality reading is available right now.',
    };
  }

  return AQI_BANDS.find((band) => aqi <= band.max) || AQI_BANDS[AQI_BANDS.length - 1];
};

export const getAqiPercent = (aqi) => {
  if (aqi == null || Number.isNaN(aqi)) return 0;
  return Math.min(100, Math.max(0, (aqi / AQI_SCALE_MAX) * 100));
};
