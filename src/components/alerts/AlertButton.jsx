import { motion } from 'framer-motion';
import { FiBell } from 'react-icons/fi';
import { SEVERITY_CONFIG } from '../../utils/weatherAlerts';

const AlertButton = ({ onClick, activeAlerts, highestSeverity }) => {
  const count = activeAlerts.length;
  const config = SEVERITY_CONFIG[highestSeverity];

  return (
    <motion.button
      className={`alert-header-btn ${count > 0 ? 'has-alerts' : ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      title="Weather Alerts"
    >
      <FiBell />
      {count > 0 && (
        <motion.span
          className="alert-badge"
          style={{ background: config?.color || '#ef4444' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
};

export default AlertButton;
