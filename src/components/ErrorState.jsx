import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

const ErrorState = ({ message, onRetry }) => {
  return (
    <motion.div
      className="error-state glass-card"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="error-icon">
        <FiAlertTriangle />
      </div>
      <h3 className="error-title">Something went wrong</h3>
      <p className="error-message">{message}</p>
      <div className="error-hint">
        <p>• Check your internet connection</p>
        <p>• Try searching for a different city</p>
        <p>• Make sure the city name is spelled correctly</p>
      </div>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          <FiRefreshCw />
          <span>Try Again</span>
        </button>
      )}
    </motion.div>
  );
};

export default ErrorState;
