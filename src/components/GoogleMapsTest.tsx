import { useEffect, useRef, useState } from 'react';
import { MAP_CONFIG } from '@/config/maps';

declare global {
  interface Window {
    google: any;
  }
}

export const GoogleMapsTest = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testGoogleMaps = async () => {
      try {
        setStatus('Loading Google Maps script...');
        console.log('Testing Google Maps API Key:', MAP_CONFIG.GOOGLE_MAPS_API_KEY.substring(0, 10) + '...');

        // Add timeout to prevent endless loading
        const timeout = setTimeout(() => {
          setError('Loading timeout - please check your API key and internet connection');
          setStatus('Timeout error');
          setIsLoading(false);
        }, 15000);

        // Check if already loaded
        if (window.google && window.google.maps) {
          setStatus('Google Maps already loaded');
          clearTimeout(timeout);
          createTestMap();
          return;
        }

        // Load script with proper async loading
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_CONFIG.GOOGLE_MAPS_API_KEY}&loading=async`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          setStatus('Google Maps script loaded successfully');
          console.log('Google Maps API available:', !!window.google?.maps);
          clearTimeout(timeout);
          createTestMap();
        };

        script.onerror = () => {
          setError('Failed to load Google Maps script');
          setStatus('Error loading script');
          clearTimeout(timeout);
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        setError('Error in test setup');
        setStatus('Error occurred');
        setIsLoading(false);
      }
    };

    const createTestMap = async () => {
      if (!mapRef.current || !window.google) {
        setError('Map container or Google Maps not available');
        setStatus('Error: Missing dependencies');
        setIsLoading(false);
        return;
      }

      try {
        setStatus('Creating test map...');
        
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 30.0444, lng: 31.2357 }, // Cairo coordinates
          zoom: 10,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          backgroundColor: '#f8fafc'
        });

        // Try to use AdvancedMarkerElement first
        try {
          const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
          
          // Create test marker content
          const markerContent = document.createElement('div');
          markerContent.innerHTML = `
            <div style="
              width: 40px; 
              height: 40px; 
              background: linear-gradient(135deg, #EF4444, #DC2626);
              border: 3px solid #FFFFFF;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              font-size: 20px;
              cursor: pointer;
              transition: transform 0.2s ease;
            " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
              📍
            </div>
          `;

          const marker = new AdvancedMarkerElement({
            position: { lat: 30.0444, lng: 31.2357 },
            map: map,
            title: 'Test Marker - Cairo',
            content: markerContent
          });

          setStatus('Test map created successfully with AdvancedMarkerElement!');
          setIsLoading(false);
          console.log('Google Maps test completed successfully with AdvancedMarkerElement');
        } catch (error) {
          console.log('AdvancedMarkerElement not available, using fallback marker');
          
          // Fallback to regular marker
          new window.google.maps.Marker({
            position: { lat: 30.0444, lng: 31.2357 },
            map: map,
            title: 'Test Marker - Cairo',
            label: '📍'
          });

          setStatus('Test map created successfully with fallback marker!');
          setIsLoading(false);
          console.log('Google Maps test completed successfully with fallback marker');
        }
      } catch (error) {
        setError(`Error creating test map: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setStatus('Error creating map');
        setIsLoading(false);
      }
    };

    testGoogleMaps();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Google Maps API Test</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Test Status:</h3>
        <p className="text-blue-700">{status}</p>
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">API Key Info:</h3>
        <p className="text-gray-700 text-sm">
          Key: {MAP_CONFIG.GOOGLE_MAPS_API_KEY.substring(0, 10)}...
        </p>
        <p className="text-gray-700 text-sm">
          Source: {MAP_CONFIG.GOOGLE_MAPS_API_KEY === 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg' ? 'Demo Key' : 'Environment Variable'}
        </p>
        <p className="text-gray-700 text-sm">
          Development Server: localhost:8080
        </p>
      </div>

      {isLoading && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            <p className="text-yellow-700">Loading map...</p>
          </div>
        </div>
      )}

      <div 
        ref={mapRef} 
        className="w-full h-96 border border-gray-300 rounded-lg"
        style={{ minHeight: '400px' }}
      />

      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">Expected Results:</h3>
        <ul className="text-green-700 text-sm space-y-1">
          <li>✅ Map should load with Cairo, Egypt visible</li>
          <li>✅ A marker should appear at Cairo's location</li>
          <li>✅ Zoom controls should be functional</li>
          <li>✅ Map type controls should work</li>
          <li>✅ Street view should be available (click the yellow man icon)</li>
          <li>✅ AdvancedMarkerElement should be used (if supported)</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-800 mb-2">Latest Features:</h3>
        <ul className="text-purple-700 text-sm space-y-1">
          <li>🚀 Uses AdvancedMarkerElement (modern Google Maps API)</li>
          <li>⚡ Proper async loading with loading=async parameter</li>
          <li>🎨 Enhanced styling and animations</li>
          <li>📱 Responsive design for all devices</li>
          <li>🔄 Automatic fallback to legacy markers if needed</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <h3 className="font-semibold text-orange-800 mb-2">Troubleshooting:</h3>
        <ul className="text-orange-700 text-sm space-y-1">
          <li>🔍 Check browser console for detailed error messages</li>
          <li>🔑 Verify your API key is correct in .env file</li>
          <li>🌐 Ensure you have internet connection</li>
          <li>🔒 Check if API key has proper restrictions</li>
          <li>💰 Verify billing is enabled in Google Cloud Console</li>
        </ul>
      </div>
    </div>
  );
};
