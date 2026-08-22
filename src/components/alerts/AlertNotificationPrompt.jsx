import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX } from 'react-icons/fi';

const AlertNotificationPrompt = ({ show, onEnable, onDismiss }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="notification-prompt glass-card"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <button className="prompt-close" onClick={onDismiss}>
            <FiX />
          </button>
          <div className="prompt-icon">
            <FiBell />
          </div>
          <h4 className="prompt-title">Enable Weather Alerts?</h4>
          <p className="prompt-text">
            Receive browser notifications when potentially severe weather
            is detected near your location.
          </p>
          <div className="prompt-actions">
            <button className="prompt-btn prompt-enable" onClick={onEnable}>
              <FiBell /> Enable Alerts
            </button>
            <button className="prompt-btn prompt-dismiss" onClick={onDismiss}>
              Not Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertNotificationPrompt;
