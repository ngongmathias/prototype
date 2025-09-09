import { useEffect, useRef, useState } from 'react';

interface UltraSimpleMapProps {
  cityName?: string;
  latitude?: number;
  longitude?: number;
  countryName?: string;
  countryData?: {
    name: string;
    capital?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
}

export const UltraSimpleMap = ({ 
  cityName = "Cairo", 
  latitude = 30.0444, 
  longitude = 31.2357,
  countryName,
  countryData
}: UltraSimpleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [status, setStatus] = useState('Starting...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        setStatus('Loading Leaflet...');
        
        // Add CSS
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Wait for CSS to load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStatus('Importing Leaflet...');
        const L = await import('leaflet');
        
        setStatus('Checking container...');
        if (!mapRef.current) {
          throw new Error('Map container not found');
        }
        
        // Clean up existing map if it exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
        
        // Determine coordinates and location name
        let mapLatitude = latitude;
        let mapLongitude = longitude;
        let locationName = cityName;
        let zoomLevel = 13;
        
        // If country data is provided, use country coordinates
        if (countryData) {
          if (countryData.latitude && countryData.longitude) {
            mapLatitude = countryData.latitude;
            mapLongitude = countryData.longitude;
            zoomLevel = 6; // Zoom out for country view
          }
          locationName = countryData.name;
          if (countryData.capital) {
            locationName = `${countryData.capital}, ${countryData.name}`;
          }
        } else if (countryName) {
          locationName = countryName;
        }
        
        setStatus('Creating map...');
        const map = L.map(mapRef.current, {
          center: [mapLatitude, mapLongitude],
          zoom: zoomLevel
        });
        
        mapInstanceRef.current = map;
        
        setStatus('Adding tiles...');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        setStatus('Adding marker...');
        L.marker([mapLatitude, mapLongitude])
          .addTo(map)
          .bindPopup(locationName);
        
        setStatus('Map loaded successfully!');
        console.log(`✅ Ultra simple map loaded for ${locationName}`);
        
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    loadMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [cityName, latitude, longitude, countryName, countryData]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800 font-bold">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-2 bg-yp-blue border border-blue-100 rounded">
        {/* <p className="text-white-800">Status: {status}</p> */}
        <p className="text-white-600 text-lg">
          This Map shows the location of {countryData ? countryData.name : countryName || cityName}
        </p>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 border border-gray-300 rounded"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};
