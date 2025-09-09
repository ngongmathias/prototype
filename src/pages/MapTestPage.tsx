import { useState } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { CityMapLeaflet } from '@/components/CityMapLeaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TestBusiness {
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

export const MapTestPage = () => {
  const [selectedCity, setSelectedCity] = useState('cairo');
  const [showMap, setShowMap] = useState(false);

  // Test cities with coordinates
  const testCities = {
    cairo: {
      name: 'Cairo',
      latitude: 30.0444,
      longitude: 31.2357,
      description: 'Capital of Egypt'
    },
    nairobi: {
      name: 'Nairobi',
      latitude: -1.2921,
      longitude: 36.8219,
      description: 'Capital of Kenya'
    },
    kigali: {
      name: 'Kigali',
      latitude: -1.9441,
      longitude: 30.0619,
      description: 'Capital of Rwanda'
    },
    lagos: {
      name: 'Lagos',
      latitude: 6.5244,
      longitude: 3.3792,
      description: 'Largest city in Nigeria'
    }
  };

  // Sample businesses for testing
  const sampleBusinesses: TestBusiness[] = [
    {
      id: 'test-1',
      name: 'Sample Restaurant',
      description: 'A delicious local restaurant serving traditional cuisine',
      phone: '+20 123 456 789',
      website: 'https://example.com',
      address: '123 Main Street',
      latitude: testCities[selectedCity as keyof typeof testCities].latitude + 0.001,
      longitude: testCities[selectedCity as keyof typeof testCities].longitude + 0.001,
      category: { name: 'Restaurant', slug: 'restaurant' },
      reviews: [{ id: '1', rating: 4.5, content: 'Great food!', created_at: '2024-01-01' }]
    },
    {
      id: 'test-2',
      name: 'Sample Hotel',
      description: 'A comfortable hotel in the heart of the city',
      phone: '+20 987 654 321',
      website: 'https://hotel-example.com',
      address: '456 Tourism Avenue',
      latitude: testCities[selectedCity as keyof typeof testCities].latitude - 0.001,
      longitude: testCities[selectedCity as keyof typeof testCities].longitude - 0.001,
      category: { name: 'Hotel', slug: 'hotel' },
      reviews: [{ id: '2', rating: 4.8, content: 'Excellent service!', created_at: '2024-01-02' }]
    },
    {
      id: 'test-3',
      name: 'Sample Bank',
      description: 'A trusted banking institution',
      phone: '+20 555 123 456',
      website: 'https://bank-example.com',
      address: '789 Business District',
      latitude: testCities[selectedCity as keyof typeof testCities].latitude + 0.002,
      longitude: testCities[selectedCity as keyof typeof testCities].longitude - 0.002,
      category: { name: 'Bank', slug: 'bank' },
      reviews: [{ id: '3', rating: 4.2, content: 'Good service', created_at: '2024-01-03' }]
    }
  ];

  const currentCity = testCities[selectedCity as keyof typeof testCities];

  return (
    <div className="min-h-screen bg-yp-gray-light">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yp-dark font-comfortaa mb-4">
            OpenStreetMap Test Page
          </h1>
          <p className="text-gray-600">
            Test the OpenStreetMap integration with different cities and sample businesses.
          </p>
        </div>

        {/* API Key Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🗺️ Map Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Map Provider:</span> OpenStreetMap
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> 
                <Badge variant="default" className="ml-2">
                  ✅ Free & Reliable
                </Badge>
              </p>
              <p className="text-sm text-gray-600">
                ✅ Using OpenStreetMap - no API key required, fully functional
              </p>
            </div>
          </CardContent>
        </Card>

        {/* City Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🌍 Select Test City</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(testCities).map(([key, city]) => (
                <Button
                  key={key}
                  variant={selectedCity === key ? 'default' : 'outline'}
                  onClick={() => setSelectedCity(key)}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <span className="text-lg">🏙️</span>
                  <span className="font-medium">{city.name}</span>
                  <span className="text-xs text-gray-500">{city.description}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🗺️ Map Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={() => setShowMap(true)}
                disabled={showMap}
                className="bg-green-600 hover:bg-green-700"
              >
                🗺️ Show Map
              </Button>
              <Button 
                onClick={() => setShowMap(false)}
                disabled={!showMap}
                variant="outline"
              >
                ❌ Hide Map
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map Display */}
        {showMap && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                🗺️ Map: {currentCity.name}
              </CardTitle>
              <p className="text-sm text-gray-600">
                Coordinates: {currentCity.latitude}, {currentCity.longitude}
              </p>
            </CardHeader>
            <CardContent>
              <CityMapLeaflet
                cityName={currentCity.name}
                latitude={currentCity.latitude}
                longitude={currentCity.longitude}
                businesses={sampleBusinesses}
                height="600px"
              />
            </CardContent>
          </Card>
        )}

        {/* Sample Businesses */}
        <Card>
          <CardHeader>
            <CardTitle>🏢 Sample Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleBusinesses.map((business) => (
                <div key={business.id} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900">{business.name}</h3>
                  <p className="text-sm text-gray-600">{business.category?.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {business.latitude?.toFixed(4)}, {business.longitude?.toFixed(4)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🔧 Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-gray-900">If map doesn't load:</h4>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>• Check browser console for error messages</li>
                  <li>• Verify your internet connection</li>
                  <li>• Ensure coordinates are valid</li>
                  <li>• Try refreshing the page</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">OpenStreetMap Benefits:</h4>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>• ✅ No API key required</li>
                  <li>• ✅ Completely free to use</li>
                  <li>• ✅ Reliable and fast</li>
                  <li>• ✅ Community-driven data</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};
