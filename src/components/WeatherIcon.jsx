import { getWeatherInfo } from '../utils/weatherCode';

const WeatherIcon = ({ code, size = 'large', isDay = true }) => {
  const { icon, condition } = getWeatherInfo(code);

  const sizeClasses = {
    small: 'weather-icon-small',
    medium: 'weather-icon-medium',
    large: 'weather-icon-large',
  };

  return (
    <div className={`weather-icon ${sizeClasses[size] || 'weather-icon-large'}`} title={condition}>
      <span className="weather-emoji" role="img" aria-label={condition}>
        {icon}
      </span>
    </div>
  );
};

export default WeatherIcon;
