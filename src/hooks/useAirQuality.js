import { useState, useEffect } from 'react';
import { getAirQuality } from '../services/airQualityApi';

// Air quality updates hourly upstream; 10 minutes keeps the card feeling live
const REFRESH_INTERVAL = 10 * 60 * 1000;

/**
 * Live air quality for the selected city, refreshed every 10 minutes.
 * Readings are tagged with their coordinates so switching cities never
 * shows the previous city's air quality, and failed silent refreshes keep
 * the last good reading on screen.
 */
export const useAirQuality = (city) => {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);

  const latitude = city?.latitude;
  const longitude = city?.longitude;
  const locationKey = latitude == null ? null : `${latitude},${longitude}`;

  useEffect(() => {
    if (locationKey == null) return;

    let cancelled = false;
    let timerId = null;

    const load = async (isInitial) => {
      if (isInitial) setLoading(true);

      try {
        const data = await getAirQuality(latitude, longitude);
        if (cancelled) return;

        if (data) {
          setEntry({ key: locationKey, data, error: null });
        } else if (isInitial) {
          setEntry({
            key: locationKey,
            data: null,
            error: 'Air quality data is unavailable for this location.',
          });
        }
      } catch (err) {
        if (cancelled) return;
        if (isInitial) {
          setEntry({ key: locationKey, data: null, error: err.message });
        }
      } finally {
        if (isInitial && !cancelled) setLoading(false);
      }
    };

    load(true);
    timerId = setInterval(() => load(false), REFRESH_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(timerId);
    };
  }, [latitude, longitude, locationKey]);

  const current = entry && entry.key === locationKey ? entry : null;

  return {
    airQuality: current?.data ?? null,
    loading,
    error: current?.error ?? null,
  };
};
