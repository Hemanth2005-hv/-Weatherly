/**
 * Calculate distance between two points using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg) => deg * (Math.PI / 180);

/**
 * Check if a coordinate is within a given radius of a center point.
 * @param {number} centerLat
 * @param {number} centerLon
 * @param {number} pointLat
 * @param {number} pointLon
 * @param {number} radiusKm - Radius in kilometers
 * @returns {boolean}
 */
export const isWithinRadius = (centerLat, centerLon, pointLat, pointLon, radiusKm) => {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon);
  return distance <= radiusKm;
};

/**
 * Get approximate grid points around a center location for monitoring.
 * Returns an array of lat/lon points spread within the radius.
 * @param {number} lat - Center latitude
 * @param {number} lon - Center longitude
 * @param {number} radiusKm - Monitoring radius
 * @param {number} numPoints - Number of sample points
 * @returns {Array<{latitude: number, longitude: number, distance: number}>}
 */
export const getMonitoringPoints = (lat, lon, radiusKm, numPoints = 9) => {
  const points = [];
  const latOffset = radiusKm / 111; // ~111 km per degree latitude
  const lonOffset = radiusKm / (111 * Math.cos(toRad(lat))); // Adjust for longitude

  // Center point
  points.push({ latitude: lat, longitude: lon, distance: 0 });

  // Cardinal directions
  points.push({ latitude: lat + latOffset, longitude: lon, distance: radiusKm });
  points.push({ latitude: lat - latOffset, longitude: lon, distance: radiusKm });
  points.push({ latitude: lat, longitude: lon + lonOffset, distance: radiusKm });
  points.push({ latitude: lat, longitude: lon - lonOffset, distance: radiusKm });

  // Diagonal points (half radius)
  const halfLat = latOffset * 0.5;
  const halfLon = lonOffset * 0.5;
  const halfDist = radiusKm * 0.707;
  points.push({ latitude: lat + halfLat, longitude: lon + halfLon, distance: halfDist });
  points.push({ latitude: lat + halfLat, longitude: lon - halfLon, distance: halfDist });
  points.push({ latitude: lat - halfLat, longitude: lon + halfLon, distance: halfDist });
  points.push({ latitude: lat - halfLat, longitude: lon - halfLon, distance: halfDist });

  return points;
};
