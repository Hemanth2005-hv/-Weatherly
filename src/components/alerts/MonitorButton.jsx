import { motion } from 'framer-motion';
import { FiMapPin, FiRadio } from 'react-icons/fi';

const MonitorButton = ({ isMonitoring, onStart, onStop, onShowSettings }) => {
  return (
    <motion.div
      className="monitor-section glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      {isMonitoring ? (
        <div className="monitor-active">
          <div className="monitor-pulse">
            <span className="pulse-dot"></span>
            <FiRadio className="pulse-icon" />
          </div>
          <div className="monitor-info">
            <span className="monitor-title">Monitoring Active</span>
            <span className="monitor-subtitle">Checking weather every 15 minutes</span>
          </div>
          <div className="monitor-actions">
            <button className="monitor-btn monitor-settings" onClick={onShowSettings}>
              ⚙️ Settings
            </button>
            <button className="monitor-btn monitor-stop" onClick={onStop}>
              ⏹ Stop
            </button>
          </div>
        </div>
      ) : (
        <div className="monitor-inactive">
          <div className="monitor-icon-wrap">
            <FiMapPin />
          </div>
          <div className="monitor-info">
            <span className="monitor-title">Weather Alerts</span>
            <span className="monitor-subtitle">
              Get notified about severe weather near you
            </span>
          </div>
          <button className="monitor-btn monitor-start" onClick={onStart}>
            📍 Monitor My Area
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default MonitorButton;
