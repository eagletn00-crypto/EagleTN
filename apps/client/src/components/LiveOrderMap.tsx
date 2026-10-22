import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// أيقونات Leaflet مخصصة واحترافية (🛵 و 🧑‍🍳) مع تصميم دقيق غير مسطح
const partnerIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      width: 44px;
      height: 44px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 12px 25px -5px rgba(245, 158, 11, 0.4);
      border: 3px solid #ffffff;
    ">
      🧑‍🍳
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const clientIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      width: 44px;
      height: 44px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 12px 25px -5px rgba(5, 150, 105, 0.4);
      border: 3px solid #ffffff;
    ">
      🛵
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

interface LiveOrderMapProps {
  partnerLoc: { lat: number; lng: number };
  clientLoc: { lat: number; lng: number };
  status?: string;
}

// مكون ضبط حدود الخريطة أوتوماتيكياً
const MapBoundsAdjuster: React.FC<{ partnerLoc: { lat: number; lng: number }; clientLoc: { lat: number; lng: number } }> = ({ partnerLoc, clientLoc }) => {
  const map = useMap();

  useEffect(() => {
    if (partnerLoc.lat && clientLoc.lat) {
      const bounds = L.latLngBounds(
        [partnerLoc.lat, partnerLoc.lng],
        [clientLoc.lat, clientLoc.lng]
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  }, [partnerLoc, clientLoc, map]);

  return null;
};

export const LiveOrderMap: React.FC<LiveOrderMapProps> = ({ partnerLoc, clientLoc }) => {
  const centerLat = (partnerLoc.lat + clientLoc.lat) / 2 || 36.8188;
  const centerLng = (partnerLoc.lng + clientLoc.lng) / 2 || 10.1658;

  return (
    <div className="relative w-full h-full">
      {/* تنسيقات نظيفة لإلغاء أي علامات مائية أو حدود افتراضية مزعجة */}
      <style>{`
        .leaflet-control-attribution {
          display: none !important;
        }
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        {/* استخدام بلاطات OpenStreetMap الرسمية المستقرة والمجانية تماماً لتجنب مشاكل CARTO API Key */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <Marker position={[partnerLoc.lat, partnerLoc.lng]} icon={partnerIcon}>
          <Popup>Partenaire Cuisine - Tunis (🧑‍🍳)</Popup>
        </Marker>

        <Marker position={[clientLoc.lat, clientLoc.lng]} icon={clientIcon}>
          <Popup>Destination Livraison (🛵)</Popup>
        </Marker>

        <Polyline
          positions={[
            [partnerLoc.lat, partnerLoc.lng],
            [clientLoc.lat, clientLoc.lng],
          ]}
          pathOptions={{
            color: '#059669',
            weight: 5,
            dashArray: '8, 8',
            opacity: 0.85,
            lineCap: 'round',
          }}
        />

        <MapBoundsAdjuster partnerLoc={partnerLoc} clientLoc={clientLoc} />
      </MapContainer>
    </div>
  );
};

export default LiveOrderMap;
