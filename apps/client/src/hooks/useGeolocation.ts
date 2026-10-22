import { useState, useEffect, useCallback } from 'react';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface GeolocationState {
  loading: boolean;
  coords: LocationCoords | null;
  error: string | null;
}

export const useGeolocation = (enableHighAccuracy = true) => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    coords: null,
    error: null,
  });

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "La géolocalisation n'est pas prise en charge par votre navigateur.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const options: PositionOptions = {
      enableHighAccuracy: enableHighAccuracy,
      timeout: 10000,
      maximumAge: 0,
    };

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        loading: false,
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        },
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "Erreur lors de la récupération de la position.";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Veuillez activer l'accès à la géolocalisation.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Signal GPS indisponible sur le terrain.";
          break;
        case error.TIMEOUT:
          errorMessage = "Délai d'attente dépassé pour la localisation.";
          break;
      }
      setState({
        loading: false,
        coords: null,
        error: errorMessage,
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, [enableHighAccuracy]);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

  return { ...state, refresh: getPosition };
};

export default useGeolocation;
