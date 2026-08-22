import { motion } from 'framer-motion';
import { getWeatherInfo } from '../utils/weatherCode';

const getHealthTips = (weatherCode, temp, humidity, windSpeed) => {
  const tips = [];

  // Temperature-based tips
  if (temp > 35) {
    tips.push({ icon: '💦', text: 'Stay hydrated — drink water every 30 minutes', priority: 'high' });
    tips.push({ icon: '躲避', text: 'Avoid direct sun between 12-3 PM', priority: 'high' });
    tips.push({ icon: '🧴', text: 'Apply SPF 50+ sunscreen every 2 hours', priority: 'medium' });
  } else if (temp > 30) {
    tips.push({ icon: '💧', text: 'Drink plenty of water throughout the day', priority: 'medium' });
    tips.push({ icon: '🧴', text: 'Wear sunscreen when outdoors', priority: 'medium' });
  } else if (temp < 5) {
    tips.push({ icon: '🧣', text: 'Bundle up — risk of frostbite in extreme cold', priority: 'high' });
    tips.push({ icon: '🏠', text: 'Limit outdoor exposure to 15-20 minutes', priority: 'high' });
    tips.push({ icon: '🔥', text: 'Warm up indoors before going outside', priority: 'medium' });
  } else if (temp < 10) {
    tips.push({ icon: '🧥', text: 'Dress in layers to stay warm', priority: 'medium' });
    tips.push({ icon: '🧤', text: 'Protect extremities — gloves and warm socks', priority: 'low' });
  }

  // Humidity tips
  if (humidity > 80) {
    tips.push({ icon: '💨', text: 'High humidity — take it easy outdoors', priority: 'medium' });
    tips.push({ icon: '🌬️', text: 'Use a dehumidifier indoors if possible', priority: 'low' });
  } else if (humidity < 30) {
    tips.push({ icon: '💧', text: 'Dry air — use moisturizer and lip balm', priority: 'medium' });
    tips.push({ icon: '🌿', text: 'Keep a water bottle handy', priority: 'low' });
  }

  // Rain tips
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    tips.push({ icon: '☂️', text: 'Carry an umbrella — rain expected', priority: 'medium' });
    tips.push({ icon: '🚗', text: 'Allow extra travel time — roads may be slippery', priority: 'low' });
  }

  // Storm tips
  if ([95, 96, 99].includes(weatherCode)) {
    tips.push({ icon: '⚡', text: 'Thunderstorm alert — stay indoors', priority: 'high' });
    tips.push({ icon: '🔌', text: 'Unplug sensitive electronics', priority: 'medium' });
    tips.push({ icon: '📱', text: 'Keep phone charged for emergency updates', priority: 'medium' });
  }

  // Wind tips
  if (windSpeed > 40) {
    tips.push({ icon: '💨', text: 'Strong winds — secure loose objects', priority: 'medium' });
    tips.push({ icon: '🌳', text: 'Stay away from trees and power lines', priority: 'high' });
  }

  // Snow tips
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    tips.push({ icon: '⛷️', text: 'Snowy conditions — drive slowly', priority: 'high' });
    tips.push({ icon: '🧊', text: 'Watch for black ice on roads', priority: 'high' });
    tips.push({ icon: '🏠', text: 'Keep emergency supplies ready', priority: 'medium' });
  }

  // Default if no tips
  if (tips.length === 0) {
    tips.push({ icon: '😊', text: 'Great weather for outdoor activities!', priority: 'low' });
    tips.push({ icon: '🧴', text: 'Always wear sunscreen — UV rays penetrate clouds', priority: 'low' });
    tips.push({ icon: '💧', text: 'Stay hydrated throughout the day', priority: 'low' });
  }

  return tips;
};

const HealthTips = ({ weather }) => {
  if (!weather) return null;

  const { current } = weather;
  const tips = getHealthTips(current.weatherCode, current.temperature, current.humidity, current.windSpeed);

  const priorityColors = {
    high: '#fb7185',
    medium: '#fbbf24',
    low: '#34d399',
  };

  return (
    <motion.div
      className="health-tips glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <h3 className="section-title">Health & Safety Tips</h3>

      <div className="tips-list">
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            className="tip-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <span className="tip-priority" style={{ background: priorityColors[tip.priority] }}></span>
            <span className="tip-icon">{tip.icon}</span>
            <span className="tip-text">{tip.text}</span>
          </motion.div>
        ))}
      </div>

      <div className="tips-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: priorityColors.high }}></span>
          Important
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: priorityColors.medium }}></span>
          Advisory
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: priorityColors.low }}></span>
          General
        </span>
      </div>
    </motion.div>
  );
};

export default HealthTips;
