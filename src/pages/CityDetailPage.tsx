import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UltraSimpleMap } from "@/components/UltraSimpleMap";
import { CityInfo } from "@/components/CityInfo";
import { 
  MapPin, 
  Phone, 
  Crown, 
  Building, 
  ArrowLeft,
  Grid3X3,
  List
} from "lucide-react";
import { db } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface City {
  id: string;
  name: string;
  country_id: string;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  countries: {
    name: string;
    code: string;
  } | null;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  is_premium: boolean;
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

export const CityDetailPage: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const navigate = useNavigate();
  
  const [city, setCity] = useState<City | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (!citySlug) {
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    fetchCityData().catch(console.error);

    return () => clearTimeout(timeout);
  }, [citySlug]);

  const fetchCityData = async () => {
    try {
      const cityName = citySlug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
      
      const { data, error } = await db.cities()
        .select(`
          id,
          name,
          country_id,
          latitude,
          longitude,
          population,
          countries (
            name,
            code
          )
        `)
        .ilike('name', cityName)
        .single();

      if (error) {
        console.error('Error fetching city:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const transformedCity: City = {
          id: data.id,
          name: data.name,
          country_id: data.country_id,
          latitude: data.latitude,
          longitude: data.longitude,
          population: data.population,
          countries: data.countries && Array.isArray(data.countries) && data.countries.length > 0 ? {
            name: data.countries[0].name,
            code: data.countries[0].code
          } : null
        };
        
        setCity(transformedCity);
        await fetchBusinesses(transformedCity);
      }
    } catch (error) {
      console.error('Error fetching city:', error);
      setLoading(false);
    }
  };

  const fetchBusinesses = async (cityData: City) => {
    try {
      const { data, error } = await db.businesses()
        .select(`
          id,
          name,
          slug,
          description,
          phone,
          website,
          address,
          latitude,
          longitude,
          logo_url,
          is_premium,
          category:categories(name, slug),
          reviews(id, rating, content, created_at)
        `)
        .eq('status', 'active')
        .eq('city_id', cityData.id);

      if (error) {
        console.error('Error fetching businesses:', error);
        setBusinesses(generateSampleBusinesses(cityData));
        return;
      }

      const transformedBusinesses: Business[] = data?.map((business: any) => ({
        id: business.id,
        name: business.name,
        slug: business.slug,
        description: business.description,
        phone: business.phone,
        website: business.website,
        address: business.address,
        latitude: business.latitude,
        longitude: business.longitude,
        logo_url: business.logo_url,
        is_premium: business.is_premium,
                 category: business.category ? {
           name: business.category.name,
           slug: business.category.slug
         } : undefined,
        reviews: business.reviews || []
      })) || [];

      setBusinesses(transformedBusinesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses(generateSampleBusinesses(cityData));
    } finally {
      setLoading(false);
    }
  };

  const generateSampleBusinesses = (cityData: City): Business[] => {
    return [
      {
        id: 'sample-1',
        name: 'Sample Restaurant',
        slug: 'sample-restaurant',
        description: 'A delicious local restaurant serving traditional cuisine',
        phone: '+20 123 456 789',
        website: 'https://example.com',
        address: '123 Main Street',
        latitude: cityData.latitude ? cityData.latitude + 0.001 : 30.0444 + 0.001,
        longitude: cityData.longitude ? cityData.longitude + 0.001 : 31.2357 + 0.001,
        logo_url: null,
        is_premium: false,
        category: { name: 'Restaurant', slug: 'restaurant' },
        reviews: [{ id: '1', rating: 4.5, content: 'Great food!', created_at: '2024-01-01' }]
      },
      {
        id: 'sample-2',
        name: 'Sample Hotel',
        slug: 'sample-hotel',
        description: 'A comfortable hotel in the heart of the city',
        phone: '+20 987 654 321',
        website: 'https://hotel-example.com',
        address: '456 Tourism Avenue',
        latitude: cityData.latitude ? cityData.latitude - 0.001 : 30.0444 - 0.001,
        longitude: cityData.longitude ? cityData.longitude - 0.001 : 31.2357 - 0.001,
        logo_url: null,
        is_premium: true,
        category: { name: 'Hotel', slug: 'hotel' },
        reviews: [{ id: '2', rating: 4.8, content: 'Excellent service!', created_at: '2024-01-02' }]
      }
    ];
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (business.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = !selectedCategory || business.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAverageRating = (business: Business): number => {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / business.reviews.length;
  };

  const formatCityName = (slug: string): string => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yp-gray-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-yp-gray-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-yp-dark mb-4">City Not Found</h1>
            <Button onClick={() => navigate('/')} className="bg-yp-blue">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yp-gray-light">
      <Header />
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-yp-dark font-comfortaa">
                {formatCityName(citySlug)}
              </h1>
              <p className="text-yp-gray-dark">
                {city.countries?.name ?? 'Unknown'} • {city.population?.toLocaleString() ?? 'Unknown'} residents
              </p>
            </div>
          </div>
          
          <CityInfo
            citySlug={citySlug}
            cityName={formatCityName(citySlug)}
            countryCode={city.countries?.code ?? 'N/A'}
            population={city.population ?? undefined}
            businessCount={businesses.length}
          />
        </div>
      </div>

      {city.latitude && city.longitude && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-yp-dark font-comfortaa mb-6">City Map & Location</h2>
            
            <UltraSimpleMap 
              cityName={formatCityName(citySlug)}
              latitude={city.latitude}
              longitude={city.longitude}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yp-blue focus:border-transparent"
              >
                <option value="">All Categories</option>
                {Array.from(new Set(businesses.map(b => b.category?.name).filter((name): name is string => !!name))).map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'No businesses have been added to this city yet'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {business.logo_url ? (
                          <img 
                            src={business.logo_url} 
                            alt={`${business.name} logo`}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <Building className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg font-semibold text-yp-dark truncate">
                          {business.name}
                        </CardTitle>
                        {business.category && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {business.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {business.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {business.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {business.address && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{business.address}</span>
                      </div>
                    )}
                    
                    {business.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{business.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  {business.reviews && business.reviews.length > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                      <Crown className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {getAverageRating(business).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({business.reviews.length} reviews)
                      </span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Link 
                      to={`/${citySlug}/${business.category?.slug ?? 'business'}/${business.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full text-sm">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/write-review/${business.id}`}>
                      <Button size="sm" className="bg-yp-blue text-white text-sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};