import { useState, useEffect, useCallback, useRef } from 'react';
import { searchCities, getWeather, refreshWeather } from '../services/weatherApi';

const FAVORITES_KEY = 'weather_favorites';
const THEME_KEY = 'weather_theme';
const UNIT_KEY = 'weather_unit';

// Auto-refresh interval: 5 minutes
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage not available
  }
};

const loadTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) || 'system';
  } catch {
    return 'system';
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage not available
  }
};

const loadUnit = () => {
  try {
    return localStorage.getItem(UNIT_KEY) || 'celsius';
  } catch {
    return 'celsius';
  }
};

const saveUnit = (unit) => {
  try {
    localStorage.setItem(UNIT_KEY, unit);
  } catch {
    // localStorage not available
  }
};

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  const [favorites, setFavorites] = useState(loadFavorites);
  const [theme, setTheme] = useState(loadTheme);
  const [unit, setUnit] = useState(loadUnit);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLive, setIsLive] = useState(false);

  // Refs for auto-refresh
  const refreshTimerRef = useRef(null);
  const weatherRef = useRef(null);
  const currentCityRef = useRef(null);
  const unitRef = useRef(unit);

  // Keep refs in sync
  useEffect(() => {
    weatherRef.current = weather;
  }, [weather]);

  useEffect(() => {
    currentCityRef.current = currentCity;
  }, [currentCity]);

  useEffect(() => {
    unitRef.current = unit;
  }, [unit]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode) => {
      root.classList.remove('light', 'dark');

      if (mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(prefersDark ? 'dark' : 'light');
      } else {
        root.classList.add(mode);
      }
    };

    applyTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  // Save favorites when changed
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  /**
   * Silent background refresh — updates data without loading spinner
   */
  const backgroundRefresh = useCallback(async () => {
    const city = currentCityRef.current;
    if (!city) return;

    try {
      const data = await refreshWeather(city.latitude, city.longitude, unitRef.current);
      if (data) {
        setWeather(data);
        setLastUpdated(new Date());
      }
    } catch {
      // Silent fail — keep existing data
    }
  }, []);

  /**
   * Start auto-refresh timer
   */
  const startAutoRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    setIsLive(true);
    refreshTimerRef.current = setInterval(() => {
      backgroundRefresh();
    }, AUTO_REFRESH_INTERVAL);
  }, [backgroundRefresh]);

  /**
   * Stop auto-refresh timer
   */
  const stopAutoRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    setIsLive(false);
  }, []);

  /**
   * Manual refresh — shows brief loading state
   */
  const manualRefresh = useCallback(async () => {
    await backgroundRefresh();
  }, [backgroundRefresh]);

  // Cleanup auto-refresh on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  const handleSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchCities(query);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const selectCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    setCurrentCity(city);
    setSearchResults([]);

    try {
      const data = await getWeather(city.latitude, city.longitude, unit);
      setWeather(data);
      setLastUpdated(new Date());
      startAutoRefresh();
    } catch (err) {
      setError(err.message);
      setWeather(null);
      stopAutoRefresh();
    } finally {
      setLoading(false);
    }
  }, [unit, startAutoRefresh, stopAutoRefresh]);

  const fetchWeatherByCoords = useCallback(async (latitude, longitude, name = null) => {
    setLoading(true);
    setError(null);

    const city = {
      id: `${latitude}-${longitude}`,
      name: name || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      country: '',
      admin1: '',
      latitude,
      longitude,
    };

    setCurrentCity(city);

    try {
      const data = await getWeather(latitude, longitude, unit);
      setWeather(data);
      setLastUpdated(new Date());
      startAutoRefresh();
    } catch (err) {
      setError(err.message);
      setWeather(null);
      stopAutoRefresh();
    } finally {
      setLoading(false);
    }
  }, [unit, startAutoRefresh, stopAutoRefresh]);

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please enable location access or search for a city.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable. Please try searching for a city.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An error occurred while getting your location. Please try searching for a city.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchWeatherByCoords]);

  const toggleFavorite = useCallback((city) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === city.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== city.id);
      }
      return [...prev, city];
    });
  }, []);

  const isFavorite = useCallback((cityId) => {
    return favorites.some((fav) => fav.id === cityId);
  }, [favorites]);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const newUnit = prev === 'celsius' ? 'fahrenheit' : 'celsius';
      saveUnit(newUnit);
      return newUnit;
    });
  }, []);

  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  }, []);

  // Refetch weather when unit changes
  useEffect(() => {
    if (currentCity) {
      const refetch = async () => {
        setLoading(true);
        try {
          const data = await getWeather(currentCity.latitude, currentCity.longitude, unit);
          setWeather(data);
          setLastUpdated(new Date());
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      refetch();
    }
  }, [unit]);

  return {
    weather,
    loading,
    error,
    searchResults,
    searching,
    currentCity,
    favorites,
    theme,
    unit,
    lastUpdated,
    isLive,
    handleSearch,
    selectCity,
    fetchWeatherByCoords,
    useMyLocation,
    toggleFavorite,
    isFavorite,
    toggleUnit,
    changeTheme,
    setError,
    manualRefresh,
    startAutoRefresh,
    stopAutoRefresh,
  };
};
