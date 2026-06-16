import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export default function OrderMap({ driverLocation }: { driverLocation: { lat: number, lng: number } }) {
  const mapStyles = { height: "300px", width: "100%" };
  const defaultCenter = { lat: 36.8065, lng: 10.1815 }; // إحداثيات تونس العاصمة

  return (
    <div className="rounded-3xl overflow-hidden border-2 border-amber-500 shadow-2xl">
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap mapContainerStyle={mapStyles} zoom={15} center={driverLocation || defaultCenter}>
          {driverLocation && <Marker position={driverLocation} label="🏍️" />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
