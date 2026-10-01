import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// أيقونة السائق الميدانية (EAGLE TN Scooter Icon)
const courierIcon = new L.DivIcon({
  html: `<div class="w-10 h-10 bg-emerald-600 text-white rounded-full border-2 border-white shadow-lg flex items-center justify-center text-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse">🛵</div>`,
  className: 'custom-courier-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// أيقونة المطعم / الشريك
const partnerIcon = new L.DivIcon({
  html: `<div class="w-8 h-8 bg-slate-900 text-white rounded-xl border-2 border-white shadow-md flex items-center justify-center text-sm transform -translate-x-1/2 -translate-y-1/2">🍳</div>`,
  className: 'custom-partner-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// أيقونة موقع التسليم (العميل)
const clientIcon = new L.DivIcon({
  html: `<div class="w-8 h-8 bg-emerald-500 text-white rounded-full border-2 border-white shadow-md flex items-center justify-center text-sm transform -translate-x-1/2 -translate-y-1/2">📍</div>`,
  className: 'custom-client-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface Location {
  lat: number;
  lng: number;
}

interface LiveOrderMapProps {
  courierLoc?: Location;
  partnerLoc: Location;
  clientLoc: Location;
  status: string;
}

// مكون فرعي لإعادة ضبط مركز الخريطة عند تحرك السائق
const MapViewController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
};

export const LiveOrderMap: React.FC<LiveOrderMapProps> = ({
  courierLoc,
  partnerLoc,
  clientLoc,
  status,
}) => {
  // تحديد المركز الافتراضي للخريطة (موقع السائق أو المطعم)
  const currentCenter: [number, number] = courierLoc
    ? [courierLoc.lat, courierLoc.lng]
    : [partnerLoc.lat, partnerLoc.lng];

  // رسم مسار التسليم بناءً على حالة الطلب
  const routePositions: [number, number][] = [];
  if (courierLoc) {
    routePositions.push([courierLoc.lat, courierLoc.lng]);
    if (status === 'preparing' || status === 'accepted' || status === 'picking_up') {
      routePositions.push([partnerLoc.lat, partnerLoc.lng]);
    }
    routePositions.push([clientLoc.lat, clientLoc.lng]);
  } else {
    routePositions.push([partnerLoc.lat, partnerLoc.lng], [clientLoc.lat, clientLoc.lng]);
  }

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={currentCenter}
        zoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapViewController center={currentCenter} />

        {/* موقع المطعم */}
        <Marker position={[partnerLoc.lat, partnerLoc.lng]} icon={partnerIcon}>
          <Popup>المطعم / الشريك</Popup>
        </Marker>

        {/* موقع العميل */}
        <Marker position={[clientLoc.lat, clientLoc.lng]} icon={clientIcon}>
          <Popup>نقطة التسليم</Popup>
        </Marker>

        {/* موقع السائق اللحظي */}
        {courierLoc && (
          <Marker position={[courierLoc.lat, courierLoc.lng]} icon={courierIcon}>
            <Popup>السائق في الطريق</Popup>
          </Marker>
        )}

        {/* المسار الميداني بين النقاط */}
        <Polyline
          positions={routePositions}
          pathOptions={{
            color: '#10b981',
            weight: 4,
            dashArray: '8, 8',
            opacity: 0.8,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default LiveOrderMap;
