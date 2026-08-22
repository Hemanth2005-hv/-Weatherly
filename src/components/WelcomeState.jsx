import { motion } from 'framer-motion';
import { FiSearch, FiMapPin } from 'react-icons/fi';

const WelcomeState = ({ onUseMyLocation }) => {
  return (
    <motion.div
      className="welcome-state glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="welcome-icon">🌤️</div>
      <h2 className="welcome-title">What's the weather?</h2>
      <p className="welcome-subtitle">
        Search for any city or use your current location to see real-time weather data
      </p>

      <div className="welcome-actions">
        <div className="welcome-action">
          <FiSearch className="welcome-action-icon" />
          <span>Search any city in the world</span>
        </div>
        <button className="welcome-location-btn" onClick={onUseMyLocation}>
          <FiMapPin />
          <span>Use My Location</span>
        </button>
      </div>
    </motion.div>
  );
};

export default WelcomeState;
