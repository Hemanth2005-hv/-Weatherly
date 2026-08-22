import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiVolume2, FiVolumeX, FiMoon } from 'react-icons/fi';

const AlertSettings = ({ show, onClose, settings, onUpdateSettings, onToggleSound }) => {
  if (!show) return null;

  const handleCategoryToggle = (category) => {
    onUpdateSettings({
      categories: {
        ...settings.categories,
        [category]: !settings.categories[category],
      },
    });
  };

  const handleRadiusChange = (radius) => {
    onUpdateSettings({ radius });
  };

  const handleSevereOnlyToggle = () => {
    onUpdateSettings({ severeOnly: !settings.severeOnly });
  };

  const categories = [
    { key: 'thunderstorm', label: 'Thunderstorms', icon: '⛈️' },
    { key: 'heavyRain', label: 'Heavy Rain', icon: '🌧️' },
    { key: 'strongWind', label: 'Strong Wind', icon: '💨' },
    { key: 'extremeHeat', label: 'Extreme Heat', icon: '🔥' },
    { key: 'extremeCold', label: 'Extreme Cold', icon: '❄️' },
  ];

  const radii = [5, 10, 25];

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="alert-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="alert-settings glass-card"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="settings-header">
              <h3>Alert Settings</h3>
              <button className="settings-close" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <div className="settings-body">
              {/* Alert Categories */}
              <div className="settings-section">
                <h4 className="settings-section-title">Alert Types</h4>
                <div className="settings-categories">
                  {categories.map((cat) => (
                    <label key={cat.key} className="settings-toggle-item">
                      <div className="toggle-left">
                        <span className="toggle-icon">{cat.icon}</span>
                        <span className="toggle-label">{cat.label}</span>
                      </div>
                      <div
                        className={`toggle-switch ${settings.categories[cat.key] ? 'on' : 'off'}`}
                        onClick={() => handleCategoryToggle(cat.key)}
                      >
                        <div className="toggle-thumb" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Monitoring Radius */}
              <div className="settings-section">
                <h4 className="settings-section-title">Alert Radius</h4>
                <div className="settings-radii">
                  {radii.map((r) => (
                    <button
                      key={r}
                      className={`radius-option ${settings.radius === r ? 'active' : ''}`}
                      onClick={() => handleRadiusChange(r)}
                    >
                      {r} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="settings-section">
                <h4 className="settings-section-title">Notifications</h4>

                <label className="settings-toggle-item">
                  <div className="toggle-left">
                    <span className="toggle-icon">🔔</span>
                    <span className="toggle-label">Alert Sound</span>
                  </div>
                  <div
                    className={`toggle-switch ${settings.sound ? 'on' : 'off'}`}
                    onClick={onToggleSound}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </label>

                <label className="settings-toggle-item">
                  <div className="toggle-left">
                    <span className="toggle-icon">⚠️</span>
                    <span className="toggle-label">Severe Alerts Only</span>
                  </div>
                  <div
                    className={`toggle-switch ${settings.severeOnly ? 'on' : 'off'}`}
                    onClick={handleSevereOnlyToggle}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </label>
              </div>

              {/* Quiet Hours */}
              <div className="settings-section">
                <h4 className="settings-section-title">
                  <FiMoon /> Quiet Hours
                </h4>
                <p className="settings-note">
                  During quiet hours ({settings.quietHoursStart}:00 – {settings.quietHoursEnd}:00),
                  sounds are silenced. Critical alerts will still come through.
                </p>
              </div>

              {/* Disclaimer */}
              <div className="settings-disclaimer">
                Weather alerts are generated from available forecast data and may not represent
                real-time storm movement or official emergency warnings.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertSettings;
