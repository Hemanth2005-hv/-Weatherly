import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';
import { formatDay, formatTemperature, formatTempUnit } from '../utils/formatters';
import { getWeatherInfo } from '../utils/weatherCode';

const DailyForecast = ({ daily, unit }) => {
  if (!daily || daily.length === 0) return null;

  return (
    <motion.div
      className="daily-forecast glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <h3 className="section-title">7-Day Forecast</h3>

      <div className="daily-list">
        {daily.map((day, index) => {
          const { condition } = getWeatherInfo(day.weatherCode);

          return (
            <motion.div
              key={day.date}
              className="daily-item"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.04 * index }}
            >
              <span className="daily-day">{formatDay(day.date, index)}</span>

              <div className="daily-icon-condition">
                <WeatherIcon code={day.weatherCode} size="small" />
                <span className="daily-condition">{condition}</span>
              </div>

              <div className="daily-temps">
                <span className="daily-high">
                  {formatTemperature(day.maxTemp, unit)}°
                </span>
                <div className="daily-temp-bar">
                  <div
                    className="temp-bar-fill"
                    style={{
                      width: `${Math.max(12, ((day.maxTemp - day.minTemp) / 18) * 100)}%`,
                    }}
                  ></div>
                </div>
                <span className="daily-low">
                  {formatTemperature(day.minTemp, unit)}°
                </span>
              </div>

              {day.precipitationProbability > 0 && (
                <span className="daily-precip">💧 {day.precipitationProbability}%</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DailyForecast;
