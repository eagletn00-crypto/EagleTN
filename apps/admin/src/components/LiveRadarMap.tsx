import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAdminStore } from '../stores/useAdminStore';

export default function LiveRadarMap() {
  const { activeOrders } = useAdminStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // بناء الخريطة وتوجيهها إلى تونس المركز
    const map = L.map(mapRef.current, {
      center: [36.8065, 10.1815],
      zoom: 12,
      zoomControl: false,
    });

    // استخدام خوادم OpenStreetMap القياسية (بدون حاجة لمفتاح API)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    if (activeOrders > 0) {
      if (!markerRef.current) {
        markerRef.current = L.circleMarker([36.8065, 10.1815], {
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.8, // زيادة وضوح النقطة
          radius: 12,
        }).addTo(mapInstance.current);
      }
      
      markerRef.current.bindPopup(`
        <div style="text-align: center; font-family: sans-serif;">
          <span style="font-size: 10px; font-weight: 900; color: #047857; text-transform: uppercase;">Hub Actif</span>
          <p style="font-size: 12px; font-weight: bold; color: #52525b; margin: 4px 0 0 0;">${activeOrders} Commandes</p>
        </div>
      `);
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [activeOrders]);

  return (
    <div className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] border border-white/30 relative z-0">
      <div ref={mapRef} className="w-full h-full absolute inset-0 z-0 opacity-80" />
      
      <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white">
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          SIG En Direct
        </span>
      </div>
    </div>
  );
}
