import { motion, AnimatePresence } from 'framer-motion';
import { getSeverityColor } from '../../utils/weatherAlerts';

const AlertToast = ({ alert, onDismiss, onViewDetail }) => {
  if (!alert) return null;

  const severityColor = getSeverityColor(alert.severity);

  const getIcon = () => {
    if (alert.severity === 'critical') return '🚨';
    if (alert.severity === 'severe') return '🌩️';
    if (alert.severity === 'watch') return '⚠️';
    return 'ℹ️';
  };

  const getTitle = () => {
    if (alert.severity === 'critical') return '🚨 Dangerous Weather Alert';
    if (alert.severity === 'severe') return '🌩️ Severe Weather Alert';
    if (alert.severity === 'watch') return '⚠️ Weather Watch';
    return 'ℹ️ Weather Notice';
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`alert-toast ${alert.severity}`}
        initial={{ y: -100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="alert-toast-header">
          <span className="alert-toast-icon">{getIcon()}</span>
          <span className="alert-toast-title">{getTitle()}</span>
          <button className="alert-toast-close" onClick={onDismiss}>
            ✕
          </button>
        </div>
        <p className="alert-toast-message">{alert.message}</p>
        <div className="alert-toast-actions">
          <button
            className="alert-toast-btn primary"
            onClick={onViewDetail}
          >
            View Details
          </button>
          <button
            className="alert-toast-btn primary"
            onClick={onDismiss}
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertToast;
