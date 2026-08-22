import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertTriangle } from 'react-icons/fi';
import { SEVERITY_CONFIG } from '../../utils/weatherAlerts';

const AlertBanner = ({ alert, show, onDismiss, onViewDetail }) => {
  if (!alert) return null;

  const config = SEVERITY_CONFIG[alert.severity];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`alert-banner alert-banner-${alert.severity}`}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="banner-content">
            <div className="banner-left">
              <span className="banner-icon">{config.icon}</span>
              <div className="banner-text">
                <span className="banner-title">
                  {alert.severity === 'critical' ? 'Dangerous Weather' :
                   alert.severity === 'severe' ? 'Severe Weather Alert' :
                   'Weather Watch'} Nearby
                </span>
                <span className="banner-subtitle">
                  {alert.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} conditions detected within your monitoring area
                </span>
              </div>
            </div>
            <div className="banner-actions">
              <button className="banner-btn banner-view" onClick={() => onViewDetail(alert)}>
                View Alert
              </button>
              {alert.severity !== 'critical' && (
                <button className="banner-btn banner-dismiss" onClick={onDismiss}>
                  <FiX />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertBanner;
