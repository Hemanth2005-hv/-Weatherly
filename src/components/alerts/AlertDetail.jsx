import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin, FiClock, FiAlertTriangle, FiShield } from 'react-icons/fi';
import { SEVERITY_CONFIG } from '../../utils/weatherAlerts';
import { generateAlertMessage } from '../../utils/weatherAlerts';

const AlertDetail = ({ alert, show, onClose }) => {
  if (!alert) return null;

  const config = SEVERITY_CONFIG[alert.severity];

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'critical': return 'EXTREME';
      case 'severe': return 'HIGH';
      case 'watch': return 'MODERATE';
      default: return 'LOW';
    }
  };

  const getRecommendedAction = (severity) => {
    switch (severity) {
      case 'critical':
        return [
          'Move indoors immediately',
          'Stay away from windows',
          'Avoid using electrical equipment',
          'Do not go outside until conditions improve',
        ];
      case 'severe':
        return [
          'Consider staying indoors',
          'Avoid exposed areas',
          'Keep emergency supplies ready',
          'Monitor weather updates',
        ];
      case 'watch':
        return [
          'Stay aware of changing conditions',
          'Have a plan to move indoors if needed',
          'Check weather updates regularly',
        ];
      default:
        return [
          'Monitor conditions',
          'Take standard precautions',
        ];
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'Now';
    const d = new Date(isoString);
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
            className="alert-detail glass-card"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="detail-header" style={{ borderLeftColor: config.color }}>
              <button className="detail-close" onClick={onClose}>
                <FiX />
              </button>
              <div className="detail-title-row">
                <span className="detail-icon">{config.icon}</span>
                <div>
                  <h3 className="detail-title">
                    {alert.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <span className="detail-severity" style={{ color: config.color }}>
                    Severity: {getSeverityLabel(alert.severity)}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-body">
              {/* Location */}
              <div className="detail-section">
                <div className="detail-label">
                  <FiMapPin /> Location
                </div>
                <span className="detail-value">
                  Your monitored area
                  {alert.distance > 0 && ` (~${Math.round(alert.distance)} km away)`}
                </span>
              </div>

              {/* Timing */}
              <div className="detail-section">
                <div className="detail-label">
                  <FiClock /> Expected
                </div>
                <span className="detail-value">
                  {alert.isCurrent ? 'Currently occurring' :
                   `Within the next ${alert.hoursAhead || 1} hour${alert.hoursAhead > 1 ? 's' : ''}`}
                </span>
                {!alert.isCurrent && alert.forecastTime && (
                  <span className="detail-sub">
                    Forecast time: {formatTime(alert.forecastTime)}
                  </span>
                )}
              </div>

              {/* Conditions */}
              <div className="detail-section">
                <div className="detail-label">
                  <FiAlertTriangle /> Conditions
                </div>
                <div className="detail-conditions">
                  <span className="condition-tag">
                    ☁️ Weather Code: {alert.weatherCode}
                  </span>
                  {alert.windSpeed > 0 && (
                    <span className="condition-tag">
                      💨 Wind: {Math.round(alert.windSpeed)} km/h
                    </span>
                  )}
                  {alert.precipitationProbability > 0 && (
                    <span className="condition-tag">
                      🌧️ Rain: {alert.precipitationProbability}%
                    </span>
                  )}
                  {alert.temperature !== undefined && (
                    <span className="condition-tag">
                      🌡️ Temp: {Math.round(alert.temperature)}°C
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="detail-section">
                <div className="detail-label">
                  📋 Alert Details
                </div>
                <p className="detail-message">
                  {generateAlertMessage(alert)}
                </p>
              </div>

              {/* Recommended Actions */}
              <div className="detail-section">
                <div className="detail-label">
                  <FiShield /> Recommended Actions
                </div>
                <ul className="detail-actions">
                  {getRecommendedAction(alert.severity).map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="detail-disclaimer">
                <FiAlertTriangle />
                <span>
                  This is an automated weather-condition alert generated from Open-Meteo forecast data.
                  It is not an official emergency warning. For official alerts, consult your local
                  emergency management agency.
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertDetail;
