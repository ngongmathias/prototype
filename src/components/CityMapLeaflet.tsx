import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Business {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  category?: {
    name: string;
    slug: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    content: string;
    created_at: string;
  }>;
}

interface CityMapLeafletProps {
  cityName: string;
  latitude: number;
  longitude: number;
  businesses: Business[];
  height?: string;
}

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const CityMapLeaflet = ({ 
  cityName, 
  latitude, 
  longitude, 
  businesses, 
  height = "500px" 
}: CityMapLeafletProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [containerReady, setContainerReady] = useState(false);

  // Check if container is ready
  useEffect(() => {
    if (mapRef.current) {
      setContainerReady(true);
    }
  }, []);

  useEffect(() => {
    // Don't proceed if container is not ready
    if (!containerReady) {
      console.log('⏳ Container not ready yet, waiting...');
      return;
    }

    // Don't proceed if map ref is not available
    if (!mapRef.current) {
      console.error('❌ Map container not available');
      setError('Map container not available - please refresh the page');
      setIsLoading(false);
      return;
    }

    // Check if we have valid coordinates
    if (!latitude || !longitude) {
      console.error('❌ Invalid coordinates provided');
      setError('Invalid coordinates provided for map');
      setIsLoading(false);
      return;
    }

    console.log('🗺️ Initializing Leaflet map...');
    console.log('📍 City:', cityName);
    console.log('🎯 Coordinates:', { lat: latitude, lng: longitude });
    console.log('🏢 Businesses:', businesses.length);
    console.log('🗺️ Map container available:', !!mapRef.current);

    try {
      // Initialize the map
      const map = L.map(mapRef.current).setView([latitude, longitude], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
      console.log('✅ Leaflet map initialized successfully');

      // Add city center marker
      addCityMarker(map);
      
      // Add business markers
      addBusinessMarkers(map);
      
      // Fit map to show all markers
      fitMapToMarkers(map);
      
      setMapLoaded(true);
      setIsLoading(false);
      console.log('🎉 Map setup completed successfully');
      
    } catch (error) {
      console.error('❌ Error initializing Leaflet map:', error);
      setError(`Error initializing map: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [cityName, latitude, longitude, businesses, containerReady]);

  const addCityMarker = (map: L.Map) => {
    try {
      // Create custom city marker icon
      const cityIcon = L.divIcon({
        className: 'custom-city-marker',
        html: `
          <div style="
            width: 40px; 
            height: 40px; 
            background: linear-gradient(135deg, #3B82F6, #1E40AF);
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: bold;
            color: white;
            font-size: 16px;
          ">
            ${cityName.charAt(0).toUpperCase()}
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const cityMarker = L.marker([latitude, longitude], { icon: cityIcon }).addTo(map);

      // Create popup for city marker
      const cityPopup = L.popup({
        maxWidth: 300,
        className: 'city-popup'
      }).setContent(`
        <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="margin: 0 0 8px 0; color: #1F2937; font-size: 18px; font-weight: bold;">
            ${cityName}
          </h3>
          <p style="margin: 0; color: #6B7280; font-size: 14px;">
            🏙️ City Center
          </p>
          <p style="margin: 4px 0 0 0; color: #9CA3AF; font-size: 12px;">
            📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
          </p>
          <p style="margin: 8px 0 0 0; color: #059669; font-size: 12px; font-weight: 500;">
            🏢 ${businesses.length} businesses nearby
          </p>
        </div>
      `);

      cityMarker.bindPopup(cityPopup);
      markersRef.current.push(cityMarker);
      console.log('✅ City marker added successfully');
    } catch (error) {
      console.error('❌ Error adding city marker:', error);
    }
  };

  const addBusinessMarkers = (map: L.Map) => {
    try {
      console.log(`🏢 Adding ${businesses.length} business markers...`);
      
      businesses.forEach((business, index) => {
        if (business.latitude && business.longitude) {
          console.log(`📍 Adding business marker ${index + 1}: ${business.name}`);
          
          // Create custom business marker icon
          const businessIcon = L.divIcon({
            className: 'custom-business-marker',
            html: `
              <div style="
                width: 36px; 
                height: 36px; 
                background: linear-gradient(135deg, #10B981, #059669);
                border: 2px solid #FFFFFF;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 3px 8px rgba(0,0,0,0.12);
                font-size: 18px;
                cursor: pointer;
              ">
                🏢
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const businessMarker = L.marker([business.latitude, business.longitude], { 
            icon: businessIcon 
          }).addTo(map);

          // Create popup for business
          const getAverageRating = (business: Business) => {
            if (!business.reviews || business.reviews.length === 0) return 0;
            const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
            return totalRating / business.reviews.length;
          };

          const averageRating = getAverageRating(business);
          const ratingStars = '⭐'.repeat(Math.round(averageRating));

          const businessPopup = L.popup({
            maxWidth: 350,
            className: 'business-popup'
          }).setContent(`
            <div style="padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #1F2937; font-size: 16px; font-weight: bold;">
                ${business.name}
              </h3>
              ${business.category ? `
                <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 12px; background: #F3F4F6; padding: 4px 8px; border-radius: 6px; display: inline-block;">
                  ${business.category.name}
                </p>
              ` : ''}
              ${business.description ? `
                <p style="margin: 8px 0; color: #4B5563; font-size: 14px; line-height: 1.4;">
                  ${business.description}
                </p>
              ` : ''}
              ${business.address ? `
                <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
                  📍 ${business.address}
                </p>
              ` : ''}
              ${business.phone ? `
                <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
                  📞 ${business.phone}
                </p>
              ` : ''}
              ${averageRating > 0 ? `
                <p style="margin: 8px 0 0 0; color: #F59E0B; font-size: 12px; font-weight: 500;">
                  ${ratingStars} ${averageRating.toFixed(1)} (${business.reviews?.length || 0} reviews)
                </p>
              ` : ''}
            </div>
          `);

          businessMarker.bindPopup(businessPopup);
          markersRef.current.push(businessMarker);
        }
      });
      
      console.log(`✅ Added ${businesses.filter(b => b.latitude && b.longitude).length} business markers`);
    } catch (error) {
      console.error('❌ Error adding business markers:', error);
    }
  };

  const fitMapToMarkers = (map: L.Map) => {
    try {
      if (markersRef.current.length > 0) {
        console.log('🔍 Fitting map to show all markers...');
        const group = new L.FeatureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.1));
        console.log('✅ Map bounds fitted successfully');
      }
    } catch (error) {
      console.error('❌ Error fitting map to markers:', error);
    }
  };

  // Show error state
  if (error) {
    return (
      <div 
        style={{ height }} 
        className="bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200"
      >
        <div className="text-center p-6">
          <div className="text-red-500 text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Error</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Check your internet connection</p>
            <p>• Verify coordinates are valid</p>
            <p>• Try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div 
        style={{ height }} 
        className="bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Loading map...</p>
          <p className="text-gray-500 text-sm mt-1">Using OpenStreetMap</p>
          {!containerReady && (
            <p className="text-gray-400 text-xs mt-2">Waiting for container...</p>
          )}
        </div>
      </div>
    );
  }

  // Show map
  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, minHeight: '400px' }} 
        className="w-full rounded-lg border border-gray-200 shadow-sm"
      />
      
      {/* Business count badge */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-95 px-4 py-2 rounded-full shadow-lg border border-gray-200 z-[1000]">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🏢</span>
          <span className="text-sm font-medium text-gray-700">
            {businesses.filter(b => b.latitude && b.longitude).length} businesses
          </span>
        </div>
      </div>

      {/* City name badge */}
      <div className="absolute top-4 left-4 bg-blue-600 bg-opacity-95 px-4 py-2 rounded-full shadow-lg z-[1000]">
        <span className="text-sm font-medium text-white">
          📍 {cityName}
        </span>
      </div>

      {/* Map loaded indicator */}
      {mapLoaded && (
        <div className="absolute bottom-4 left-4 bg-green-600 bg-opacity-95 px-3 py-1 rounded-full shadow-lg z-[1000]">
          <span className="text-xs font-medium text-white">
            ✅ OpenStreetMap Loaded
          </span>
        </div>
      )}

      {/* Map provider badge */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 px-3 py-1 rounded-full shadow-lg z-[1000]">
        <span className="text-xs font-medium text-white">
          🗺️ OpenStreetMap
        </span>
      </div>
    </div>
  );
};
