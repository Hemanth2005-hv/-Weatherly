import { motion } from 'framer-motion';
import {
  FiDroplet,
  FiWind,
  FiNavigation,
  FiBarChart,
  FiEye,
  FiCloudRain,
  FiSun,
} from 'react-icons/fi';
import {
  formatWindSpeed,
  formatWindDirection,
  formatPressure,
  formatVisibility,
  formatHumidity,
} from '../utils/formatters';

const WeatherStats = ({ weather, unit }) => {
  if (!weather) return null;

  const { current, daily } = weather;

  const visibilityKm = current.visibility ? (current.visibility / 1000).toFixed(1) : '10+';

  const stats = [
    {
      icon: <FiDroplet />,
      label: 'Humidity',
      value: formatHumidity(current.humidity),
      unit: '%',
      accent: '#60a5fa',
    },
    {
      icon: <FiWind />,
      label: 'Wind Speed',
      value: formatWindSpeed(current.windSpeed),
      unit: unit === 'fahrenheit' ? 'mph' : 'km/h',
      accent: '#34d399',
    },
    {
      icon: <FiNavigation />,
      label: 'Wind Gusts',
      value: current.windGusts ? formatWindSpeed(current.windGusts) : '--',
      unit: unit === 'fahrenheit' ? 'mph' : 'km/h',
      accent: '#a78bfa',
    },
    {
      icon: <FiBarChart />,
      label: 'Pressure',
      value: formatPressure(current.pressure),
      unit: 'hPa',
      accent: '#f472b6',
    },
    {
      icon: <FiEye />,
      label: 'Visibility',
      value: visibilityKm,
      unit: 'km',
      accent: '#fbbf24',
    },
    {
      icon: <FiSun />,
      label: 'UV Index',
      value: current.uvIndex ? current.uvIndex.toFixed(1) : '--',
      unit: getUVLabel(current.uvIndex),
      accent: '#fb923c',
    },
    {
      icon: <FiCloudRain />,
      label: 'Precipitation',
      value: daily[0]?.precipitationProbability || 0,
      unit: '%',
      accent: '#22d3ee',
    },
    {
      icon: <FiCloudRain />,
      label: 'Cloud Cover',
      value: current.cloudCover ?? '--',
      unit: '%',
      accent: '#94a3b8',
    },
  ];

  return (
    <div className="weather-stats">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="stat-card glass-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 * index, ease: [0.4, 0, 0.2, 1] }}
          style={{ '--accent': stat.accent }}
        >
          <div className="stat-icon" style={{ color: stat.accent }}>
            {stat.icon}
          </div>
          <div className="stat-info">
            <span className="stat-label">{stat.label}</span>
            <div className="stat-value-row">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-unit">{stat.unit}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const getUVLabel = (uv) => {
  if (!uv || uv === '--') return '';
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Mod';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'V.Hi';
  return 'Extreme';
};

export default WeatherStats;
