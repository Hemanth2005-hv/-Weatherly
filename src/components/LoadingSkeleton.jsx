import { motion } from 'framer-motion';

const LoadingSkeleton = () => {
  return (
    <div className="loading-skeleton">
      <motion.div
        className="skeleton-current glass-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-subtitle"></div>
        <div className="skeleton-row">
          <div className="skeleton-circle skeleton-icon-large"></div>
          <div className="skeleton-block skeleton-temp"></div>
        </div>
        <div className="skeleton-line skeleton-condition"></div>
        <div className="skeleton-line skeleton-subtitle"></div>
      </motion.div>

      <div className="skeleton-stats">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="skeleton-stat-card glass-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <div className="skeleton-circle skeleton-icon-small"></div>
            <div className="skeleton-line skeleton-label"></div>
            <div className="skeleton-line skeleton-value"></div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="skeleton-hourly glass-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-scroll">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton-hourly-item">
              <div className="skeleton-line skeleton-hour"></div>
              <div className="skeleton-circle skeleton-icon-medium"></div>
              <div className="skeleton-line skeleton-temp-small"></div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="skeleton-daily glass-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <div className="skeleton-line skeleton-title"></div>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="skeleton-daily-row">
            <div className="skeleton-line skeleton-day"></div>
            <div className="skeleton-circle skeleton-icon-small"></div>
            <div className="skeleton-line skeleton-temp-bar"></div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingSkeleton;
