import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiClock } from 'react-icons/fi';
import { SEVERITY_CONFIG } from '../../utils/weatherAlerts';

const AlertHistory = ({ show, onClose, history, onClear }) => {
  if (!show) return null;

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (isToday) return `Today · ${timeStr}`;

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return `Yesterday · ${timeStr}`;
    }

    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${timeStr}`;
  };

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
            className="alert-history-panel glass-card"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="history-header">
              <div className="history-title">
                <FiClock />
                <span>Alert History</span>
              </div>
              <button className="history-close" onClick={onClose}>
                <FiX />
              </button>
            </div>

            {history.length > 0 && (
              <button className="history-clear-all" onClick={onClear}>
                <FiTrash2 /> Clear Alert History
              </button>
            )}

            <div className="history-body">
              {history.length > 0 ? (
                history.map((entry, i) => {
                  const config = SEVERITY_CONFIG[entry.severity] || SEVERITY_CONFIG.normal;
                  return (
                    <motion.div
                      key={entry.id || `hist-${i}`}
                      className="history-entry"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <span className="history-entry-icon">{config.icon}</span>
                      <div className="history-entry-info">
                        <span className="history-entry-title">
                          {entry.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="history-entry-time">
                          {formatTime(entry.timestamp)}
                        </span>
                      </div>
                      <span
                        className="history-entry-severity"
                        style={{ color: config.color }}
                      >
                        {config.label}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div className="history-empty">
                  <span className="history-empty-icon">📭</span>
                  <span>No alert history yet.</span>
                  <span className="history-empty-sub">
                    Alerts will appear here when severe weather is detected.
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertHistory;
