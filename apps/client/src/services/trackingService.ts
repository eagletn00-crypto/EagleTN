/**
 * Eagle.tn - Resilient Location Tracking Service for Motorcycle Drivers 🛵
 * Handles 3G/4G network drops by queuing coordinates locally.
 */

interface GeoCoordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
}

const STORAGE_KEY = 'eagle_offline_coords';

export const queueLocationUpdate = (lat: number, lng: number): void => {
  const coord: GeoCoordinate = {
    latitude: lat,
    longitude: lng,
    timestamp: Date.now()
  };

  const existingData = localStorage.getItem(STORAGE_KEY);
  const queue: GeoCoordinate[] = existingData ? JSON.parse(existingData) : [];
  
  queue.push(coord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

export const syncPendingLocations = async (
  sendBatchCallback: (coords: GeoCoordinate[]) => Promise<boolean>
): Promise<boolean> => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) return true;

  const queue: GeoCoordinate[] = JSON.parse(existingData);
  if (queue.length === 0) return true;

  try {
    const success = await sendBatchCallback(queue);
    if (success) {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to sync offline delivery coordinates:', err);
    return false;
  }
};
