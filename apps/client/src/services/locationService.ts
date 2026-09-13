import { supabase } from '../lib/supabase';

export interface LocationCoords {
  lat: number;
  lng: number;
}

interface DriverLocationRow {
  driver_id: string;
  latitude: number;
  longitude: number;
  heading?: number;
  updated_at?: string;
}

export class LocationService {
  // 1. التقاط موقع الزبون بدقة عالية عند طلب الطعام
  static getCurrentPosition(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation non supportée par votre navigateur'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  // 2. الاشتراك المباشر لحركة السائق عبر Supabase Realtime
  static subscribeToDriverLocation(
    driverId: string,
    onLocationUpdate: (coords: LocationCoords) => void
  ) {
    const channel = supabase
      .channel(`driver-location-${driverId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'driver_locations',
          filter: `driver_id=eq.${driverId}`,
        },
        (payload) => {
          const newLocation = payload.new as DriverLocationRow | null;
          if (newLocation && typeof newLocation.latitude === 'number' && typeof newLocation.longitude === 'number') {
            onLocationUpdate({
              lat: newLocation.latitude,
              lng: newLocation.longitude,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}
