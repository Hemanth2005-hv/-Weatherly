import { motion } from 'framer-motion';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { FiWind, FiDroplet, FiRefreshCw } from 'react-icons/fi';
import WeatherIcon from './WeatherIcon';
import { formatTemperature, formatTempUnit, formatWindSpeed } from '../utils/formatters';
import { getWeatherInfo } from '../utils/weatherCode';

const formatLastUpdated = (date) => {
  if (!date) return '';
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const CurrentWeather = ({ weather, currentCity, unit, isFavorite, onToggleFavorite, lastUpdated, isLive, onRefresh }) => {
  if (!weather || !currentCity) return null;

  const { current } = weather;
  const { condition } = getWeatherInfo(current.weatherCode);

  return (
    <motion.div
      className="current-weather"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="current-weather-main">
        <div className="current-location">
          <motion.h2
            className="city-name"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {currentCity.name}
          </motion.h2>
          {[currentCity.admin1, currentCity.country].filter(Boolean).length > 0 && (
            <p className="city-region">
              {[currentCity.admin1, currentCity.country].filter(Boolean).join(', ')}
            </p>
          )}
          <button
            className={`fav-toggle ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(currentCity)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <BsHeartFill /> : <BsHeart />}
          </button>
        </div>

        <motion.div
          className="current-temp-section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <WeatherIcon code={current.weatherCode} size="large" isDay={current.isDay} />
          <div className="temp-display">
            <span className="temp-value">
              {formatTemperature(current.temperature, unit)}
            </span>
            <span className="temp-unit">{formatTempUnit(unit)}</span>
          </div>
        </motion.div>

        <div className="current-details">
          <p className="weather-condition">{condition}</p>
          <p className="feels-like">
            Feels like {formatTemperature(current.feelsLike, unit)}{formatTempUnit(unit)}
          </p>
        </div>

        {/* Live status bar */}
        <div className="live-status-bar">
          <div className="live-status-left">
            {isLive && (
              <span className="live-indicator">
                <span className="live-dot" />
                LIVE
              </span>
            )}
            {lastUpdated && (
              <span className="last-updated">
                Updated {formatLastUpdated(lastUpdated)}
              </span>
            )}
          </div>
          {onRefresh && (
            <button className="refresh-btn" onClick={onRefresh} title="Refresh now">
              <FiRefreshCw size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="current-weather-secondary">
        <div className="secondary-item">
          <FiDroplet className="secondary-icon" />
          <span className="secondary-label">Humidity</span>
          <span className="secondary-value">{current.humidity}%</span>
        </div>
        <div className="secondary-item">
          <FiWind className="secondary-icon" />
          <span className="secondary-label">Wind</span>
          <span className="secondary-value">{formatWindSpeed(current.windSpeed)} km/h</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;
