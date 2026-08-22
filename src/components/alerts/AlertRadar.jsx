import { motion } from 'framer-motion';
import { SEVERITY_CONFIG } from '../../utils/weatherAlerts';

const AlertRadar = ({ alerts, radius, isMonitoring }) => {
  if (!isMonitoring) return null;

  const activeAlerts = alerts.filter((a) => a.severity !== 'normal');
  const highestSeverity = activeAlerts.length > 0
    ? activeAlerts.reduce((prev, curr) => {
        const prevLevel = { normal: 0, watch: 1, severe: 2, critical: 3 }[prev.severity] || 0;
        const currLevel = { normal: 0, watch: 1, severe: 2, critical: 3 }[curr.severity] || 0;
        return currLevel > prevLevel ? curr : prev;
      }).severity
    : 'normal';

  const radarColor = SEVERITY_CONFIG[highestSeverity]?.color || '#34d399';

  // Generate storm positions (simulated based on alerts)
  const stormPositions = activeAlerts.map((alert, i) => {
    const angle = (i * 120 + 30) * (Math.PI / 180);
    const dist = alert.distance ? Math.min(alert.distance / radius, 0.8) : 0.3;
    const x = 50 + Math.cos(angle) * dist * 40;
    const y = 50 + Math.sin(angle) * dist * 40;
    return { ...alert, x, y };
  });

  return (
    <motion.div
      className="alert-radar glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <h3 className="section-title">Radar View</h3>

      <div className="radar-container">
        <svg viewBox="0 0 100 100" className="radar-svg">
          {/* Radar rings */}
          <circle cx="50" cy="50" r="40" fill="none" stroke={radarColor} strokeWidth="0.5" opacity="0.2" />
          <circle cx="50" cy="50" r="28" fill="none" stroke={radarColor} strokeWidth="0.5" opacity="0.15" />
          <circle cx="50" cy="50" r="16" fill="none" stroke={radarColor} strokeWidth="0.5" opacity="0.1" />

          {/* Radar sweep */}
          {isMonitoring && (
            <g className="radar-sweep-group">
              <path
                d="M50 50 L50 10 A40 40 0 0 1 77 25 Z"
                fill={`url(#sweepGradient-${highestSeverity})`}
                opacity="0.3"
                className="radar-sweep"
              />
            </g>
          )}

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="sweepGradient-normal">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sweepGradient-watch">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sweepGradient-severe">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sweepGradient-critical">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Storm indicators */}
          {stormPositions.map((storm, i) => {
            const config = SEVERITY_CONFIG[storm.severity];
            return (
              <g key={i} className="storm-indicator">
                <circle
                  cx={storm.x}
                  cy={storm.y}
                  r="3"
                  fill={config.color}
                  className="storm-pulse"
                />
                <circle
                  cx={storm.x}
                  cy={storm.y}
                  r="6"
                  fill="none"
                  stroke={config.color}
                  strokeWidth="0.5"
                  className="storm-ring"
                />
                <text
                  x={storm.x}
                  y={storm.y - 5}
                  textAnchor="middle"
                  fontSize="4"
                  fill={config.color}
                >
                  {config.icon}
                </text>
              </g>
            );
          })}

          {/* User location */}
          <circle cx="50" cy="50" r="2.5" fill="#60a5fa" />
          <circle cx="50" cy="50" r="4" fill="none" stroke="#60a5fa" strokeWidth="0.5" opacity="0.5" />
          <text x="50" y="57" textAnchor="middle" fontSize="4" fill="#60a5fa" fontWeight="bold">
            YOU
          </text>
        </svg>

        {/* Radius label */}
        <div className="radar-radius-label">
          Monitoring: {radius} km radius
        </div>
      </div>

      {/* Legend */}
      <div className="radar-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#60a5fa' }}></span>
          <span>You</span>
        </div>
        {activeAlerts.length > 0 && (
          <>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#fbbf24' }}></span>
              <span>Watch</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#fb923c' }}></span>
              <span>Severe</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#ef4444' }}></span>
              <span>Critical</span>
            </div>
          </>
        )}
        {activeAlerts.length === 0 && (
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#34d399' }}></span>
            <span>Clear</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AlertRadar;
