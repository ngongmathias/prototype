import { useEffect, useState } from 'react';

interface MapDebugInfoProps {
  mapRef: React.RefObject<HTMLDivElement>;
  cityName: string;
  latitude: number;
  longitude: number;
}

export const MapDebugInfo = ({ mapRef, cityName, latitude, longitude }: MapDebugInfoProps) => {
  const [debugInfo, setDebugInfo] = useState({
    mapRefAvailable: false,
    googleMapsAvailable: false,
    coordinatesValid: false,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        mapRefAvailable: !!mapRef.current,
        googleMapsAvailable: !!(window as any).google?.maps,
        coordinatesValid: !!(latitude && longitude),
        timestamp: new Date().toISOString()
      });
    };

    // Update immediately
    updateDebugInfo();

    // Update every second for debugging
    const interval = setInterval(updateDebugInfo, 1000);

    return () => clearInterval(interval);
  }, [mapRef, latitude, longitude]);

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="font-bold mb-2">🗺️ Map Debug Info</div>
      <div className="space-y-1">
        <div>📍 Map Ref: {debugInfo.mapRefAvailable ? '✅' : '❌'}</div>
        <div>🌐 Google Maps: {debugInfo.googleMapsAvailable ? '✅' : '❌'}</div>
        <div>🎯 Coordinates: {debugInfo.coordinatesValid ? '✅' : '❌'}</div>
        <div>🏙️ City: {cityName}</div>
        <div>📊 Lat: {latitude}</div>
        <div>📊 Lng: {longitude}</div>
        <div>⏰ {debugInfo.timestamp}</div>
      </div>
    </div>
  );
};
