import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// -----------------------------------------------------------------------------
// STRICT INTERFACES
// -----------------------------------------------------------------------------
interface Coordinate { lat: number; lng: number; }

interface LiveOrderMapProps {
  partnerLoc: Coordinate;
  clientLoc: Coordinate;
  status?: string;
}

// -----------------------------------------------------------------------------
// CINEMATIC MARKER INJECTION (Sovereign 2026)
// -----------------------------------------------------------------------------
const createCinematicIcon = (emoji: string, isPrimary: boolean) => L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div class="relative flex items-center justify-center w-11 h-11 rounded-2xl ${
      isPrimary
        ? 'bg-gradient-to-r from-[#8A652D] to-[#B8893D] border-[2px] border-white text-white shadow-[0_4px_12px_rgba(163,120,54,0.3)]'
        : 'bg-white border-[2px] border-[#E7E5E4] text-[#1C1917] shadow-[var(--shadow-ambient)]'
    } text-xl z-20 transition-transform hover:scale-105">
      ${emoji}
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -24],
});

const partnerIcon = createCinematicIcon('🧑‍🍳', false);
const clientIcon = createCinematicIcon('🛵', true);

// -----------------------------------------------------------------------------
// AUTOMATIC BOUNDING ENGINE
// -----------------------------------------------------------------------------
const MapBoundsAdjuster: React.FC<{ partnerLoc: Coordinate; clientLoc: Coordinate }> = ({ partnerLoc, clientLoc }) => {
  const map = useMap();
  useEffect(() => {
    if (partnerLoc.lat && clientLoc.lat) {
      const bounds = L.latLngBounds([partnerLoc.lat, partnerLoc.lng], [clientLoc.lat, clientLoc.lng]);
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 16, animate: true, duration: 1.5 });
    }
  }, [partnerLoc, clientLoc, map]);
  return null;
};

// -----------------------------------------------------------------------------
// CORE MAP COMPONENT
// -----------------------------------------------------------------------------
export const LiveOrderMap: React.FC<LiveOrderMapProps> = ({ partnerLoc, clientLoc }) => {
  const centerLat = (partnerLoc.lat + clientLoc.lat) / 2 || 36.8188;
  const centerLng = (partnerLoc.lng + clientLoc.lng) / 2 || 10.1658;

  return (
    <div className="relative w-full h-full isolate">
      <style>{`
        .leaflet-control-attribution { display: none !important; }
        .custom-leaflet-marker { background: transparent !important; border: none !important; }
        .leaflet-container { background: #FAF9F6 !important; font-family: inherit; }
      `}</style>

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        <Marker position={[partnerLoc.lat, partnerLoc.lng]} icon={partnerIcon}>
          <Popup className="font-sans font-black text-[#1C1917]">Établissement</Popup>
        </Marker>
        <Marker position={[clientLoc.lat, clientLoc.lng]} icon={clientIcon}>
          <Popup className="font-sans font-black text-[#8A652D]">Destination</Popup>
        </Marker>

        <Polyline
          positions={[[partnerLoc.lat, partnerLoc.lng], [clientLoc.lat, clientLoc.lng]]}
          pathOptions={{
            color: '#8A652D',
            weight: 4,
            dashArray: '8, 12',
            opacity: 0.8,
            lineCap: 'round',
            lineJoin: 'round'
          }}
        />
        <MapBoundsAdjuster partnerLoc={partnerLoc} clientLoc={clientLoc} />
      </MapContainer>
    </div>
  );
};

export default LiveOrderMap;
