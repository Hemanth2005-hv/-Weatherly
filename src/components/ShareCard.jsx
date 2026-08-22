import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiDownload, FiX } from 'react-icons/fi';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCode';
import { formatTemperature, formatTempUnit } from '../utils/formatters';

const ShareCard = ({ weather, currentCity, unit }) => {
  const [showPreview, setShowPreview] = useState(false);
  const cardRef = useRef(null);

  if (!weather || !currentCity) return null;

  const { current, daily } = weather;
  const { condition, icon } = getWeatherInfo(current.weatherCode);

  const handleShare = async () => {
    const shareText = `🌤️ Weather in ${currentCity.name}\n${icon} ${condition}\n🌡️ ${formatTemperature(current.temperature, unit)}${formatTempUnit(unit)}\nFeels like ${formatTemperature(current.feelsLike, unit)}${formatTempUnit(unit)}\n💧 ${current.humidity}% humidity\n\nPowered by Weatherly`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather in ${currentCity.name}`,
          text: shareText,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Weather info copied to clipboard!');
      } catch {
        setShowPreview(true);
      }
    }
  };

  const today = daily && daily[0];

  return (
    <>
      <motion.div
        className="share-card glass-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <h3 className="section-title">Share Weather</h3>

        <div ref={cardRef} className="share-preview-card">
          <div className="share-card-bg">
            <div className="share-card-content">
              <div className="share-card-top">
                <span className="share-card-city">{currentCity.name}</span>
                <span className="share-card-date">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="share-card-middle">
                <span className="share-card-icon">{icon}</span>
                <span className="share-card-temp">
                  {formatTemperature(current.temperature, unit)}°
                </span>
              </div>
              <div className="share-card-bottom">
                <span className="share-card-condition">{condition}</span>
                <div className="share-card-details">
                  <span>💧 {current.humidity}%</span>
                  <span>🌡️ Feels {formatTemperature(current.feelsLike, unit)}°</span>
                  {today && <span>🌧️ {today.precipitationProbability || 0}%</span>}
                </div>
                <span className="share-card-brand">Weatherly ⛅</span>
              </div>
            </div>
          </div>
        </div>

        <div className="share-actions">
          <button className="share-btn share-native" onClick={handleShare}>
            <FiShare2 />
            <span>Share</span>
          </button>
          <button className="share-btn share-copy" onClick={() => setShowPreview(true)}>
            <FiDownload />
            <span>Preview</span>
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            className="share-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              className="share-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="share-modal-close" onClick={() => setShowPreview(false)}>
                <FiX />
              </button>
              <div className="share-preview-large">
                <div className="share-card-bg large">
                  <div className="share-card-content">
                    <div className="share-card-top">
                      <span className="share-card-city">{currentCity.name}</span>
                      <span className="share-card-date">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="share-card-middle">
                      <span className="share-card-icon large">{icon}</span>
                      <span className="share-card-temp large">
                        {formatTemperature(current.temperature, unit)}°
                      </span>
                    </div>
                    <div className="share-card-bottom">
                      <span className="share-card-condition">{condition}</span>
                      <div className="share-card-details">
                        <span>💧 {current.humidity}%</span>
                        <span>🌡️ Feels {formatTemperature(current.feelsLike, unit)}°</span>
                        {today && <span>🌧️ {today.precipitationProbability || 0}%</span>}
                      </div>
                      <span className="share-card-brand">Weatherly ⛅</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="share-btn share-native" onClick={handleShare} style={{ marginTop: 16, width: '100%' }}>
                <FiShare2 />
                <span>Share Weather</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareCard;
