import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiBell, FiClock, FiTrash2, FiSettings } from 'react-icons/fi';
import { SEVERITY_CONFIG } from '../../utils/weatherAlerts';

const AlertCenter = ({
  show,
  onClose,
  alerts,
  history,
  onClearHistory,
  onViewDetail,
  onShowSettings,
  isMonitoring,
  lastCheck,
  notificationPermission,
}) => {
  const activeAlerts = alerts.filter((a) => a.severity !== 'normal');
  const recentHistory = history.slice(0, 10);

  const formatTime = (date) => {
    if (!date) return 'Never';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatAlertTime = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
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
            className="alert-center glass-card"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="alert-center-header">
              <div className="alert-center-title">
                <FiBell />
                <span>Weather Alerts</span>
              </div>
              <button className="alert-center-close" onClick={onClose}>
                <FiX />
              </button>
            </div>

            {/* Status */}
            <div className="alert-center-status">
              <div className={`status-indicator ${isMonitoring ? 'active' : 'inactive'}`}>
                <span className="status-dot"></span>
                <span>{isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}</span>
              </div>
              {lastCheck && (
                <span className="status-time">Last checked: {formatTime(lastCheck)}</span>
              )}
            </div>

            {/* Notification status */}
            {notificationPermission === 'default' && (
              <div className="notification-prompt-inline">
                <span>🔔 Enable notifications for weather alerts</span>
              </div>
            )}

            {/* Active Alerts */}
            <div className="alert-center-section">
              <h4 className="alert-section-title">
                {activeAlerts.length > 0 ? `${activeAlerts.length} Active Alert${activeAlerts.length > 1 ? 's' : ''}` : 'No Current Alerts'}
              </h4>
              {activeAlerts.length > 0 ? (
                <div className="alert-list">
                  {activeAlerts.map((alert, i) => {
                    const config = SEVERITY_CONFIG[alert.severity];
                    return (
                      <motion.button
                        key={`active-${i}`}
                        className={`alert-item alert-item-${alert.severity}`}
                        onClick={() => onViewDetail(alert)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <span className="alert-item-icon">{config.icon}</span>
                        <div className="alert-item-info">
                          <span className="alert-item-title">
                            {alert.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="alert-item-severity" style={{ color: config.color }}>
                            {config.label}
                          </span>
                        </div>
                        <span className="alert-item-distance">
                          {alert.distance ? `~${Math.round(alert.distance)} km` : 'Here'}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="alert-empty">
                  <span className="alert-empty-icon">🟢</span>
                  <span>No severe weather detected nearby.</span>
                </div>
              )}
            </div>

            {/* History */}
            <div className="alert-center-section">
              <div className="alert-section-header">
                <h4 className="alert-section-title">
                  <FiClock /> Recent History
                </h4>
                {recentHistory.length > 0 && (
                  <button className="alert-clear-btn" onClick={onClearHistory}>
                    <FiTrash2 /> Clear
                  </button>
                )}
              </div>
              {recentHistory.length > 0 ? (
                <div className="alert-history-list">
                  {recentHistory.map((entry, i) => {
                    const config = SEVERITY_CONFIG[entry.severity] || SEVERITY_CONFIG.normal;
                    return (
                      <motion.div
                        key={entry.id || `hist-${i}`}
                        className="history-item"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <span className="history-icon">{config.icon}</span>
                        <div className="history-info">
                          <span className="history-title">
                            {entry.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="history-time">{formatAlertTime(entry.timestamp)}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="alert-empty">
                  <span>No recent alerts.</span>
                </div>
              )}
            </div>

            {/* Settings button */}
            <button className="alert-center-settings" onClick={onShowSettings}>
              <FiSettings /> Alert Settings
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertCenter;
