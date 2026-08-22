import { motion } from 'framer-motion';
import { getWeatherInfo } from '../utils/weatherCode';

const getWeatherMood = (weatherCode, temp, humidity, windSpeed) => {
  const { condition } = getWeatherInfo(weatherCode);

  // Mood based on conditions
  if (weatherCode === 0 || weatherCode === 1) {
    if (temp > 30) return { emoji: '😎', mood: 'Blazing Hot', color: '#f97316' };
    if (temp > 20) return { emoji: '😊', mood: 'Perfect Day', color: '#34d399' };
    return { emoji: '🥶', mood: 'Chilly & Clear', color: '#60a5fa' };
  }
  if (weatherCode === 2 || weatherCode === 3) {
    return { emoji: '😌', mood: 'Cozy Vibes', color: '#a78bfa' };
  }
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return { emoji: '🌧️', mood: 'Rainy Day', color: '#60a5fa' };
  }
  if ([95, 96, 99].includes(weatherCode)) {
    return { emoji: '⚡', mood: 'Storm Watch', color: '#f472b6' };
  }
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return { emoji: '❄️', mood: 'Winter Wonderland', color: '#22d3ee' };
  }
  if (weatherCode === 45 || weatherCode === 48) {
    return { emoji: '🌫️', mood: 'Mysterious Fog', color: '#94a3b8' };
  }
  return { emoji: '🌤️', mood: 'Fair Weather', color: '#fbbf24' };
};

const getOutfitSuggestion = (temp, weatherCode, windSpeed) => {
  const { condition } = getWeatherInfo(weatherCode);

  if ([95, 96, 99].includes(weatherCode)) {
    return { icon: '🧥', suggestion: 'Stay indoors if possible', items: ['Rain jacket', 'Waterproof shoes', 'Umbrella'] };
  }
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return { icon: '🧤', suggestion: 'Bundle up warm', items: ['Heavy coat', 'Scarf & gloves', 'Winter boots'] };
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return { icon: '☔', suggestion: 'Rain gear essential', items: ['Umbrella', 'Rain jacket', 'Waterproof shoes'] };
  }
  if (temp > 35) {
    return { icon: '🩳', suggestion: 'Dress light & stay cool', items: ['Shorts', 'T-shirt', 'Sunscreen', 'Hat'] };
  }
  if (temp > 25) {
    return { icon: '👕', suggestion: 'Light & comfortable', items: ['T-shirt', 'Light pants', 'Sunglasses'] };
  }
  if (temp > 15) {
    return { icon: '🧶', suggestion: 'Layer up', items: ['Light jacket', 'Long pants', 'Closed shoes'] };
  }
  if (temp > 5) {
    return { icon: '🧥', suggestion: 'Keep warm', items: ['Warm jacket', 'Sweater', 'Long pants'] };
  }
  return { icon: '🧣', suggestion: 'Dress for the cold', items: ['Heavy coat', 'Thermal layers', 'Warm boots'] };
};

const getActivities = (weatherCode, temp, isDay) => {
  if (!isDay) {
    return [
      { icon: '🎬', name: 'Movie Night' },
      { icon: '📖', name: 'Read a Book' },
      { icon: '🎮', name: 'Game Time' },
      { icon: '🍽️', name: 'Dinner Out' },
    ];
  }

  if ([95, 96, 99].includes(weatherCode)) {
    return [
      { icon: '🎬', name: 'Indoor Cinema' },
      { icon: '📚', name: 'Library Visit' },
      { icon: '☕', name: 'Cafe Hopping' },
      { icon: '🎲', name: 'Board Games' },
    ];
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return [
      { icon: '🏛️', name: 'Museum Visit' },
      { icon: '🛍️', name: 'Shopping' },
      { icon: '☕', name: 'Coffee Shop' },
      { icon: '🎨', name: 'Art Gallery' },
    ];
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return [
      { icon: '⛷️', name: 'Skiing' },
      { icon: '🛷', name: 'Sledding' },
      { icon: '☃️', name: 'Snowman' },
      { icon: '☕', name: 'Hot Cocoa' },
    ];
  }

  if (temp > 30) {
    return [
      { icon: '🏊', name: 'Swimming' },
      { icon: '🍦', name: 'Ice Cream' },
      { icon: '🌳', name: 'Shade Walk' },
      { icon: '💦', name: 'Water Park' },
    ];
  }

  if (temp > 20 && (weatherCode === 0 || weatherCode === 1)) {
    return [
      { icon: '🚴', name: 'Cycling' },
      { icon: '🏃', name: 'Running' },
      { icon: '🌳', name: 'Park Picnic' },
      { icon: '📸', name: 'Photography' },
    ];
  }

  return [
    { icon: '🚶', name: 'Walking' },
    { icon: '☕', name: 'Cafe Visit' },
    { icon: '🛍️', name: 'Shopping' },
    { icon: '🎵', name: 'Live Music' },
  ];
};

const WeatherMood = ({ weather, unit }) => {
  if (!weather) return null;

  const { current } = weather;
  const mood = getWeatherMood(current.weatherCode, current.temperature, current.humidity, current.windSpeed);
  const outfit = getOutfitSuggestion(current.temperature, current.weatherCode, current.windSpeed);
  const activities = getActivities(current.weatherCode, current.temperature, current.isDay);

  return (
    <motion.div
      className="weather-mood glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <h3 className="section-title">Today's Vibe</h3>

      {/* Mood */}
      <div className="mood-main" style={{ '--mood-color': mood.color }}>
        <span className="mood-emoji">{mood.emoji}</span>
        <div className="mood-info">
          <span className="mood-label">Mood</span>
          <span className="mood-value" style={{ color: mood.color }}>{mood.mood}</span>
        </div>
      </div>

      {/* Outfit */}
      <div className="outfit-section">
        <div className="outfit-header">
          <span className="outfit-icon">{outfit.icon}</span>
          <div className="outfit-info">
            <span className="outfit-label">What to Wear</span>
            <span className="outfit-suggestion">{outfit.suggestion}</span>
          </div>
        </div>
        <div className="outfit-items">
          {outfit.items.map((item, i) => (
            <span key={i} className="outfit-tag">{item}</span>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="activities-section">
        <span className="activities-label">Suggested Activities</span>
        <div className="activities-grid">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.name}
              className="activity-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <span className="activity-icon">{activity.icon}</span>
              <span className="activity-name">{activity.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherMood;
