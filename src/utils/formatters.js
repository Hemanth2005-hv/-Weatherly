export const formatTemperature = (temp, unit = 'celsius') => {
  if (unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32);
  }
  return Math.round(temp);
};

export const formatTempUnit = (unit = 'celsius') => {
  return unit === 'fahrenheit' ? '°F' : '°C';
};

export const formatHour = (isoString) => {
  const date = new Date(isoString);
  const hours = date.getHours();
  if (hours === 0) return '12 AM';
  if (hours === 12) return '12 PM';
  if (hours < 12) return `${hours} AM`;
  return `${hours - 12} PM`;
};

export const formatDay = (isoString, index) => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(isoString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

export const formatShortDay = (isoString) => {
  const date = new Date(isoString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

export const formatWindSpeed = (speed) => {
  return Math.round(speed);
};

export const formatWindDirection = (degree) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
};

export const formatPressure = (hpa) => {
  return Math.round(hpa);
};

export const formatVisibility = (meters) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

export const formatHumidity = (humidity) => {
  return Math.round(humidity);
};

export const formatTime = (isoString) => {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${period}`;
};
