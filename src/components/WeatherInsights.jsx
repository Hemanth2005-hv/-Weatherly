import { motion } from 'framer-motion';
import { getWeatherInfo } from '../utils/weatherCode';
import { formatTemperature, formatTempUnit } from '../utils/formatters';

const getComfortIndex = (temp, humidity) => {
  // Simple heat index approximation
  if (temp < 10) return { score: Math.max(20, 60 + (temp - 10) * 4), label: 'Cold', color: '#60a5fa' };
  if (temp < 20) return { score: 60 + (temp - 10) * 4, label: 'Cool', color: '#22d3ee' };
  if (temp < 26) return { score: 90 + (temp - 20) * 1.5, label: 'Comfortable', color: '#34d399' };
  if (temp < 32) return { score: 100 - (temp - 26) * 3, label: 'Warm', color: '#fbbf24' };
  return { score: Math.max(20, 82 - (temp - 32) * 4), label: 'Hot', color: '#f97316' };
};

const getSunSafety = (weatherCode, hour) => {
  const isSunny = weatherCode === 0 || weatherCode === 1;
  const peakHours = hour >= 10 && hour <= 16;

  if (isSunny && peakHours) return { level: 'High', advice: 'Wear sunscreen & hat', icon: '🧴', color: '#f97316' };
  if (isSunny) return { level: 'Moderate', advice: 'Some sun protection', icon: '🕶️', color: '#fbbf24' };
  if (weatherCode === 2 || weatherCode === 3) return { level: 'Low', advice: 'UV filtered by clouds', icon: '☁️', color: '#34d399' };
  return { level: 'Minimal', advice: 'Little UV exposure', icon: '🌙', color: '#94a3b8' };
};

const getWindChill = (temp, windSpeed) => {
  if (temp > 10) return null;
  const windChill = Math.round(13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16));
  return windChill;
};

const getDewPointDesc = (dewPoint) => {
  if (dewPoint > 24) return 'Oppressive';
  if (dewPoint > 21) return 'Very Humid';
  if (dewPoint > 18) return 'Humid';
  if (dewPoint > 15) return 'Comfortable';
  if (dewPoint > 10) return 'Dry';
  return 'Very Dry';
};

const WeatherInsights = ({ weather, unit }) => {
  if (!weather) return null;

  const { current } = weather;
  const comfort = getComfortIndex(current.temperature, current.humidity);
  const now = new Date().getHours();
  const sunSafety = getSunSafety(current.weatherCode, now);
  const windChill = getWindChill(current.temperature, current.windSpeed);

  // Calculate dew point approximation
  const dewPoint = current.temperature - ((100 - current.humidity) / 5);
  const dewPointDesc = getDewPointDesc(dewPoint);

  return (
    <motion.div
      className="weather-insights glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <h3 className="section-title">Weather Insights</h3>

      {/* Comfort Index */}
      <div className="insight-card">
        <div className="insight-header">
          <span className="insight-icon">🌡️</span>
          <span className="insight-label">Comfort Index</span>
        </div>
        <div className="comfort-bar-container">
          <div className="comfort-bar">
            <motion.div
              className="comfort-fill"
              style={{ background: comfort.color }}
              initial={{ width: 0 }}
              animate={{ width: `${comfort.score}%` }}
              transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <div className="comfort-info">
            <span className="comfort-value" style={{ color: comfort.color }}>{comfort.score.toFixed(0)}%</span>
            <span className="comfort-label">{comfort.label}</span>
          </div>
        </div>
      </div>

      {/* Sun Safety */}
      <div className="insight-card">
        <div className="insight-header">
          <span className="insight-icon">{sunSafety.icon}</span>
          <span className="insight-label">Sun Safety</span>
        </div>
        <div className="insight-detail">
          <span className="insight-tag" style={{ background: `${sunSafety.color}20`, color: sunSafety.color }}>
            {sunSafety.level}
          </span>
          <span className="insight-advice">{sunSafety.advice}</span>
        </div>
      </div>

      {/* Dew Point */}
      <div className="insight-card">
        <div className="insight-header">
          <span className="insight-icon">💧</span>
          <span className="insight-label">Dew Point</span>
        </div>
        <div className="insight-detail">
          <span className="insight-big-value">
            {formatTemperature(dewPoint, unit)}{formatTempUnit(unit)}
          </span>
          <span className="insight-advice">{dewPointDesc}</span>
        </div>
      </div>

      {/* Wind Chill */}
      {windChill !== null && (
        <div className="insight-card">
          <div className="insight-header">
            <span className="insight-icon">🥶</span>
            <span className="insight-label">Feels Like (Wind)</span>
          </div>
          <div className="insight-detail">
            <span className="insight-big-value">
              {formatTemperature(windChill, unit)}{formatTempUnit(unit)}
            </span>
            <span className="insight-advice">Wind makes it feel colder</span>
          </div>
        </div>
      )}

      {/* Temperature Trend */}
      {weather.daily && weather.daily.length >= 2 && (
        <div className="insight-card">
          <div className="insight-header">
            <span className="insight-icon">📊</span>
            <span className="insight-label">Tomorrow vs Today</span>
          </div>
          <div className="trend-compare">
            <div className="trend-day">
              <span className="trend-label">Today</span>
              <span className="trend-temp">
                {formatTemperature(weather.daily[0].maxTemp, unit)}°
              </span>
            </div>
            <span className="trend-arrow">
              {weather.daily[1].maxTemp > weather.daily[0].maxTemp ? '📈' : '📉'}
            </span>
            <div className="trend-day">
              <span className="trend-label">Tomorrow</span>
              <span className="trend-temp">
                {formatTemperature(weather.daily[1].maxTemp, unit)}°
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherInsights;
