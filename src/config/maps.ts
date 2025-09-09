// Map Configuration
export const MAP_CONFIG = {
  // Google Maps API Key - Replace with your actual API key
  // Get your API key from: https://console.cloud.google.com/apis/credentials
  // For development, you can use a demo key temporarily
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg', // Demo key for development
  
  // Map Default Settings
  DEFAULT_ZOOM: 12,
  DEFAULT_CENTER: { lat: 0, lng: 0 },
  
  // Map Styles
  MAP_STYLES: [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'on' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'landscape',
      stylers: [{ color: '#f5f5f5' }]
    },
    {
      featureType: 'water',
      stylers: [{ color: '#e3f2fd' }]
    }
  ]
};

// Mapbox Configuration (Alternative)
export const MAPBOX_CONFIG = {
  ACCESS_TOKEN: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN_HERE',
  STYLE_URL: 'mapbox://styles/mapbox/streets-v11'
};
