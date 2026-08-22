import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiMonitor, FiThermometer } from 'react-icons/fi';
import { BsHeartFill } from 'react-icons/bs';

const Header = ({ theme, unit, onThemeChange, onToggleUnit, favoritesCount, children }) => {
  const themes = [
    { value: 'light', icon: <FiSun />, label: 'Light' },
    { value: 'dark', icon: <FiMoon />, label: 'Dark' },
    { value: 'system', icon: <FiMonitor />, label: 'System' },
  ];

  return (
    <motion.header
      className="app-header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="header-left">
        <h1 className="app-logo">
          <span className="logo-icon">⛅</span>
          <span className="logo-text">Weatherly</span>
        </h1>
      </div>

      <div className="header-right">
        {children}

        {favoritesCount > 0 && (
          <motion.div
            className="favorites-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <BsHeartFill className="heart-icon" />
            <span>{favoritesCount}</span>
          </motion.div>
        )}

        <div className="theme-toggle">
          {themes.map((t) => (
            <button
              key={t.value}
              className={`theme-btn ${theme === t.value ? 'active' : ''}`}
              onClick={() => onThemeChange(t.value)}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
        </div>

        <button className="unit-toggle" onClick={onToggleUnit} title="Toggle temperature unit">
          <FiThermometer />
          <span className="unit-label">
            <span className={unit === 'celsius' ? 'active' : ''}>°C</span>
            <span className="unit-divider">|</span>
            <span className={unit === 'fahrenheit' ? 'active' : ''}>°F</span>
          </span>
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
