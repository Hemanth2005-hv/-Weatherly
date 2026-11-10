import { motion } from 'framer-motion';
import { FiWind } from 'react-icons/fi';
import { getAqiBand, getAqiPercent } from '../utils/airQuality';
import { formatTime } from '../utils/formatters';

const AirQuality = ({ airQuality, loading, error }) => {
  const aqi = airQuality?.aqi ?? null;
  const band = getAqiBand(aqi);

  return (
    <motion.section
      className="air-quality glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="section-header">
        <h3>
          <FiWind className="title-icon" /> Air Quality
        </h3>
        {airQuality && (
          <span className="aqi-live">
            <span className="aqi-live-dot" /> LIVE
            {airQuality.time && <span className="aqi-live-time">· {formatTime(airQuality.time)}</span>}
          </span>
        )}
      </div>

      {loading && !airQuality && (
        <div className="aqi-placeholder">
          <span className="aqi-loading-dot" /> Measuring air quality…
        </div>
      )}

      {!loading && error && !airQuality && (
        <div className="aqi-placeholder aqi-placeholder-error">{error}</div>
      )}

      {airQuality && (
        <div className="aqi-body">
          <div className="aqi-hero">
            <div className="aqi-value-row">
              <span className="aqi-value" style={{ color: band.color }}>
                {aqi ?? '--'}
              </span>
              <div className="aqi-meta">
                <span
                  className="aqi-band"
                  style={{ color: band.color, background: `${band.color}24` }}
                >
                  {band.label}
                </span>
                <span className="aqi-caption">
                  European AQI
                  {airQuality.usAqi != null && ` · US AQI ${Math.round(airQuality.usAqi)}`}
                </span>
              </div>
            </div>

            <div className="aqi-gauge">
              <div className="aqi-gauge-track" />
              <span
                className="aqi-gauge-marker"
                style={{ left: `${getAqiPercent(aqi)}%` }}
                aria-hidden="true"
              />
              <div className="aqi-gauge-labels">
                <span>0</span>
                <span>40</span>
                <span>80</span>
                <span>120+</span>
              </div>
            </div>

            <p className="aqi-advice">{band.advice}</p>
          </div>

          <div className="aqi-pollutants">
            {airQuality.pollutants.map((pollutant) => (
              <div className="aqi-pollutant" key={pollutant.key}>
                <span className="aqi-pollutant-label">{pollutant.label}</span>
                <span className="aqi-pollutant-value">
                  {pollutant.value != null ? Math.round(pollutant.value) : '--'}
                  <small>{pollutant.unit}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default AirQuality;
