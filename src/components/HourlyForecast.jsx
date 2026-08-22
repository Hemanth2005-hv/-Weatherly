import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import WeatherIcon from './WeatherIcon';
import { formatHour } from '../utils/formatters';

const HourlyForecast = ({ hourly, unit }) => {
  const scrollRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const now = new Date();
  const currentHour = now.getHours();
  const startIdx = hourly.findIndex((h) => {
    const date = new Date(h.time);
    return date.getHours() >= currentHour && date.getDate() === now.getDate();
  });

  const displayHours = [];
  const start = startIdx >= 0 ? startIdx : 0;
  for (let i = start; i < Math.min(start + 24, hourly.length); i++) {
    displayHours.push(hourly[i]);
  }

  return (
    <motion.div
      className="hourly-forecast glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="section-header">
        <h3>Next 24 Hours</h3>
        <div className="scroll-controls">
          <button onClick={() => scroll('left')} className="scroll-btn">
            <FiChevronLeft />
          </button>
          <button onClick={() => scroll('right')} className="scroll-btn">
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="hourly-scroll" ref={scrollRef}>
        {displayHours.map((hour, index) => {
          const isNow = index === 0;

          return (
            <motion.div
              key={hour.time}
              className={`hourly-item ${isNow ? 'now' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.02 * index }}
            >
              <span className="hourly-time">
                {isNow ? 'Now' : formatHour(hour.time)}
              </span>
              <WeatherIcon code={hour.weatherCode} size="small" isDay={hour.isDay} />
              <span className="hourly-temp">
                {Math.round(hour.temperature)}°
              </span>
              {hour.precipitationProbability > 0 && (
                <span className="hourly-precip">
                  💧{hour.precipitationProbability}%
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HourlyForecast;
