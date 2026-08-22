import { motion } from 'framer-motion';
import { FiSunrise, FiSunset } from 'react-icons/fi';

const formatTime = (isoString) => {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${period}`;
};

const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

const SunriseSunset = ({ daily }) => {
  if (!daily || daily.length === 0) return null;

  const today = daily[0];
  if (!today || !today.sunrise || !today.sunset) return null;

  const now = new Date();
  const sunrise = new Date(today.sunrise);
  const sunset = new Date(today.sunset);

  // Validate dates
  if (isNaN(sunrise.getTime()) || isNaN(sunset.getTime())) return null;

  const totalDaylightMs = sunset.getTime() - sunrise.getTime();
  const totalDaylightMinutes = Math.round(totalDaylightMs / (1000 * 60));
  const elapsed = now.getTime() - sunrise.getTime();
  const progress = Math.min(Math.max(elapsed / totalDaylightMs, 0), 1);

  const isCurrentlyDay = now >= sunrise && now <= sunset;
  const isBeforeSunrise = now < sunrise;
  const isAfterSunset = now > sunset;

  // Calculate remaining daylight
  let remainingLabel = '';
  if (isBeforeSunrise) {
    const diff = Math.round((sunrise.getTime() - now.getTime()) / (1000 * 60));
    remainingLabel = `Sunrise in ${formatDuration(diff)}`;
  } else if (isCurrentlyDay) {
    const remaining = Math.round((sunset.getTime() - now.getTime()) / (1000 * 60));
    remainingLabel = `${formatDuration(remaining)} until sunset`;
  } else {
    remainingLabel = 'Sun has set';
  }

  // SVG arc path: a nice semicircular arc
  const arcWidth = 180;
  const arcHeight = 80;
  const startX = 10;
  const startY = 90;
  const endX = startX + arcWidth;
  const endY = 90;
  const midX = startX + arcWidth / 2;
  const midY = startY - arcHeight;

  // Sun position on the arc (parametric)
  const sunX = startX + progress * arcWidth;
  const sunY = startY - Math.sin(progress * Math.PI) * arcHeight;

  // Glow size based on height
  const glowSize = isCurrentlyDay ? 10 + progress * 6 : 0;

  return (
    <motion.div
      className="sunrise-sunset glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className="section-title">☀ Sunrise & Sunset</h3>

      <div className="sun-arc-container">
        <svg viewBox={`0 0 ${arcWidth + 20} 105`} className="sun-arc-svg">
          {/* Subtle glow behind active portion */}
          {isCurrentlyDay && (
            <defs>
              <linearGradient id="daylightGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset={`${progress * 100}%`} stopColor="#fbbf24" stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <radialGradient id="sunGlow">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>
          )}

          {/* Background arc (dashed) */}
          <path
            d={`M ${startX} ${startY} Q ${midX} ${midY - 10} ${endX} ${endY}`}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          {/* Daylight progress arc */}
          {isCurrentlyDay && (
            <path
              d={`M ${startX} ${startY} Q ${midX} ${midY - 10} ${endX} ${endY}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray={`${progress * 250} 250`}
              strokeLinecap="round"
              opacity="0.6"
            />
          )}

          {/* Sunrise marker */}
          <circle cx={startX} cy={startY} r="4" fill="#fbbf24" opacity="0.5" />

          {/* Sunset marker */}
          <circle cx={endX} cy={endY} r="4" fill="#f97316" opacity="0.5" />

          {/* Horizon line */}
          <line
            x1={startX - 5}
            y1={startY}
            x2={endX + 5}
            y2={endY}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />

          {/* Sun position (only during daylight) */}
          {isCurrentlyDay && (
            <>
              {/* Sun glow */}
              <circle
                cx={sunX}
                cy={sunY}
                r={glowSize}
                fill="url(#sunGlow)"
              />
              {/* Sun dot */}
              <circle
                cx={sunX}
                cy={sunY}
                r="6"
                fill="#fbbf24"
                className="sun-position-dot"
              />
              <circle
                cx={sunX}
                cy={sunY}
                r="9"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1"
                opacity="0.3"
              />
            </>
          )}

          {/* Night indicator (moon at top) */}
          {isAfterSunset && (
            <text
              x={midX}
              y={midY + 10}
              textAnchor="middle"
              fontSize="14"
              opacity="0.4"
            >
              🌙
            </text>
          )}
        </svg>

        {/* Remaining daylight */}
        <p className="sun-remaining">{remainingLabel}</p>

        {/* Time display */}
        <div className="sun-times">
          <div className="sun-time">
            <div className="sun-icon-circle sunrise">
              <FiSunrise className="sun-icon-inner" />
            </div>
            <div className="sun-time-info">
              <span className="sun-label">Sunrise</span>
              <span className="sun-value">{formatTime(today.sunrise)}</span>
            </div>
          </div>

          <div className="sun-daylight-badge">
            <span className="daylight-value">{formatDuration(totalDaylightMinutes)}</span>
            <span className="daylight-label">daylight</span>
          </div>

          <div className="sun-time">
            <div className="sun-icon-circle sunset">
              <FiSunset className="sun-icon-inner" />
            </div>
            <div className="sun-time-info">
              <span className="sun-label">Sunset</span>
              <span className="sun-value">{formatTime(today.sunset)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SunriseSunset;
