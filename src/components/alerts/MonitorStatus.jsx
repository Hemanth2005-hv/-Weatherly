import { motion } from 'framer-motion';
import { FiRadio, FiClock } from 'react-icons/fi';

const MonitorStatus = ({ isMonitoring, lastCheck, nextCheck }) => {
  if (!isMonitoring) return null;

  const formatTime = (date) => {
    if (!date) return '--:--';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <motion.div
      className="monitor-status glass-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="status-row">
        <div className="status-item">
          <FiRadio className="status-icon active-pulse" />
          <div className="status-detail">
            <span className="status-label">Status</span>
            <span className="status-value active-text">Monitoring Active</span>
          </div>
        </div>
        <div className="status-item">
          <FiClock className="status-icon" />
          <div className="status-detail">
            <span className="status-label">Last Check</span>
            <span className="status-value">{formatTime(lastCheck)}</span>
          </div>
        </div>
        <div className="status-item">
          <FiClock className="status-icon" />
          <div className="status-detail">
            <span className="status-label">Next Check</span>
            <span className="status-value">{formatTime(nextCheck)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MonitorStatus;
