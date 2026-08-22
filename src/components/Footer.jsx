import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiHeart, FiExternalLink, FiSun, FiCloud, FiMapPin } from 'react-icons/fi';

const Footer = ({ unit, theme }) => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="app-footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="footer-divider" />

      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">⛅</span>
            <span className="footer-logo-text">Weatherly</span>
          </div>
          <p className="footer-tagline">
            Real-time weather intelligence with multi-model accuracy.
            Powered by community-driven weather data.
          </p>
        </div>

        {/* Features */}
        <div className="footer-section">
          <h4 className="footer-section-title">Features</h4>
          <ul className="footer-links">
            <li><FiSun className="footer-link-icon" /> Live Weather Updates</li>
            <li><FiCloud className="footer-link-icon" /> 7-Day Forecast</li>
            <li><FiMapPin className="footer-link-icon" /> Location Alerts</li>
          </ul>
        </div>

        {/* Data Source */}
        <div className="footer-section">
          <h4 className="footer-section-title">Data Source</h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Open-Meteo API <FiExternalLink className="footer-link-ext" />
              </a>
            </li>
            <li>
              <a
                href="https://open-meteo.com/en/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                API Documentation <FiExternalLink className="footer-link-ext" />
              </a>
            </li>
            <li>
              <a
                href="https://open-meteo.com/en/license"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                License (CC BY 4.0) <FiExternalLink className="footer-link-ext" />
              </a>
            </li>
          </ul>
        </div>

        {/* Settings Info */}
        <div className="footer-section">
          <h4 className="footer-section-title">Current Settings</h4>
          <div className="footer-settings">
            <span className="footer-setting-badge">
              {unit === 'celsius' ? '°C' : '°F'}
            </span>
            <span className="footer-setting-badge">
              {theme === 'system' ? '🖥 System' : theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} Weatherly. Built with{' '}
          <FiHeart className="footer-heart" /> using React + Vite
        </p>
        <div className="footer-bottom-links">
          <span className="footer-credit">
            Weather data from{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open-Meteo
            </a>
          </span>
          <span className="footer-separator">•</span>
          <span className="footer-credit">No API key needed</span>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
