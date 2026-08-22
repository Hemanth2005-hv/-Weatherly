import { useEffect, useState } from 'react';

const WeatherBackground = ({ weatherCode, isDay }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getBackgroundClass = () => {
    if (!isDay) return 'bg-night';

    if (weatherCode === 0 || weatherCode === 1) return 'bg-clear';
    if (weatherCode === 2 || weatherCode === 3 || weatherCode === 45 || weatherCode === 48) return 'bg-cloudy';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return 'bg-rain';
    if ([95, 96, 99].includes(weatherCode)) return 'bg-thunderstorm';
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return 'bg-snow';

    return 'bg-clear';
  };

  const bgClass = getBackgroundClass();

  return (
    <div className={`weather-background ${bgClass} ${mounted ? 'mounted' : ''}`}>
      {bgClass === 'bg-clear' && isDay && (
        <div className="weather-particles">
          <div className="sun">
            <div className="sun-rays"></div>
          </div>
        </div>
      )}

      {bgClass === 'bg-cloudy' && (
        <div className="weather-particles">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
        </div>
      )}

      {bgClass === 'bg-rain' && (
        <div className="weather-particles">
          <div className="rain-container">
            {Array.from({ length: 50 }, (_, i) => (
              <div key={i} className="raindrop" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}></div>
            ))}
          </div>
        </div>
      )}

      {bgClass === 'bg-thunderstorm' && (
        <div className="weather-particles">
          <div className="lightning"></div>
          <div className="rain-container">
            {Array.from({ length: 60 }, (_, i) => (
              <div key={i} className="raindrop" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.3 + Math.random() * 0.4}s`,
              }}></div>
            ))}
          </div>
        </div>
      )}

      {bgClass === 'bg-snow' && (
        <div className="weather-particles">
          {Array.from({ length: 40 }, (_, i) => (
            <div key={i} className="snowflake" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}>❄</div>
          ))}
        </div>
      )}

      {bgClass === 'bg-night' && (
        <div className="weather-particles">
          <div className="moon"></div>
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherBackground;
