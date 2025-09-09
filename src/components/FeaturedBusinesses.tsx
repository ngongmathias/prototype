import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Phone, 
  Globe, 
  MapPin, 
  Crown,
  ExternalLink,
  Navigation,
  Info
} from 'lucide-react';
import { Business, BusinessService } from '@/lib/businessService';
import { supabase } from '@/lib/supabase';

interface FeaturedBusinessesProps {
  citySlug?: string;
  categorySlug?: string;
  maxDisplay?: number;
}

export const FeaturedBusinesses: React.FC<FeaturedBusinessesProps> = ({
  citySlug,
  categorySlug,
  maxDisplay = 5
}) => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBusinesses();
  }, [citySlug, categorySlug]);

  const fetchFeaturedBusinesses = async () => {
    try {
      setLoading(true);
      
      // Fetch real sponsored businesses from Supabase
      // ONLY businesses with is_sponsored_ad = true will be shown
      console.log('Fetching sponsored businesses from Supabase...');
      
      // Test database connection first
      const { data: testData, error: testError } = await supabase
        .from('businesses')
        .select('id, name, is_sponsored_ad')
        .limit(1);
      
      if (testError) {
        console.error('Database connection test failed:', testError);
        throw testError;
      }
      
      console.log('Database connection successful, test data:', testData);
      
      // First, let's try a simple query without complex joins
      const { data: businesses, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_sponsored_ad', true)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching featured businesses:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      if (!businesses || businesses.length === 0) {
        console.log('No sponsored businesses found in database');
        setFeaturedBusinesses([]);
        return;
      }

      console.log(`Found ${businesses.length} sponsored businesses in database:`, businesses.map(b => ({ id: b.id, name: b.name, is_sponsored_ad: b.is_sponsored_ad })));

      // Verify that all returned businesses are actually sponsored
      const allSponsored = businesses.every(b => b.is_sponsored_ad === true);
      if (!allSponsored) {
        console.warn('Warning: Some businesses returned are not marked as sponsored!');
      }

      // Transform the data to match our Business interface
      const transformedBusinesses: Business[] = businesses.map((business: any) => ({
        id: business.id,
        name: business.name,
        slug: business.slug,
        description: business.description,
        category_id: business.category_id,
        city_id: business.city_id,
        country_id: business.country_id,
        phone: business.phone,
        email: business.email,
        website: business.website,
        order_online_url: business.order_online_url,
        website_visible: business.website_visible !== undefined ? business.website_visible : true,
        address: business.address,
        status: business.status,
        latitude: business.latitude,
        longitude: business.longitude,
        hours_of_operation: business.hours_of_operation,
        services: business.services,
        images: business.images,
        logo_url: business.logo_url,
        view_count: business.view_count || 0,
        click_count: business.click_count || 0,
        created_at: business.created_at,
        updated_at: business.updated_at,
        is_premium: business.is_premium || false,
        is_verified: business.is_verified || false,
        has_coupons: business.has_coupons || false,
        accepts_orders_online: business.accepts_orders_online || false,
        is_kid_friendly: business.is_kid_friendly || false,
        is_sponsored_ad: business.is_sponsored_ad || false,
        category: { 
          id: business.category_id || 'unknown',
          name: 'Business', // We'll get this from a separate query if needed
          slug: 'business',
          icon: '🏢'
        },
        country: {
          id: business.country_id || 'unknown',
          name: 'Unknown',
          code: 'UN',
          flag_url: null
        },
        city: {
          id: business.city_id || 'unknown',
          name: 'Unknown',
          country_id: business.country_id || 'unknown'
        },
        reviews: [] // We'll get this from a separate query if needed
      }));

      // Filter by category if specified - show ONLY businesses from that category
      let filtered = transformedBusinesses;
      if (categorySlug) {
        filtered = transformedBusinesses.filter(b => b.category?.slug === categorySlug);
        console.log(`Filtering for category '${categorySlug}': found ${filtered.length} businesses`);
        
        // If no businesses found for this category, show all sponsored businesses instead
        if (filtered.length === 0) {
          console.log(`No businesses found for category '${categorySlug}', showing all sponsored businesses`);
          filtered = transformedBusinesses;
        }
      }

      // Also filter by city if specified
      if (citySlug) {
        // Note: This assumes city_id matches citySlug - you may need to adjust this logic
        // based on your actual database structure
        const cityFiltered = filtered.filter(b => {
          // For now, we'll show all businesses since city_id might not match citySlug
          // In production, you'd want to join with cities table or use proper city filtering
          return true;
        });
        filtered = cityFiltered;
        console.log(`Filtering for city '${citySlug}': found ${filtered.length} businesses`);
      }

      // Limit the number of displayed businesses
      const limited = filtered.slice(0, maxDisplay);
      console.log('FeaturedBusinesses: categorySlug:', categorySlug, 'filtered count:', filtered.length, 'limited count:', limited.length);
      
      // Only show real businesses from database - no fallbacks
      setFeaturedBusinesses(limited);
    } catch (error) {
      console.error('Error fetching featured businesses:', error);
      // On error, show empty state - no fallback data
      setFeaturedBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = (business: Business) => {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / business.reviews.length;
  };

  const getCategoryDisplayName = () => {
    if (categorySlug) {
      // Try to get category name from the first business
      const categoryName = featuredBusinesses[0]?.category?.name;
      if (categoryName) {
        return `Featured ${categoryName}s`;
      }
    }
    return 'Featured Businesses';
  };

  // Fallback text for missing translations
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'featuredBusinesses.title': 'Featured Businesses',
      'featuredBusinesses.sponsored': 'Sponsored',
      'featuredBusinesses.ad': 'Ad',
      'featuredBusinesses.reviews': 'reviews',
      'featuredBusinesses.website': 'Website',
      'featuredBusinesses.directions': 'Directions',
      'featuredBusinesses.moreInfo': 'More Info',
      'featuredBusinesses.noFeaturedYet': 'No featured businesses yet',
      'featuredBusinesses.comingSoon': 'Coming soon!'
    };
    return translations[key] || key;
  };

  // Remove debugging console.log
  // console.log('FeaturedBusinesses render:', { 
  //   citySlug, 
  //   categorySlug, 
  //   maxDisplay, 
  //   featuredBusinessesCount: featuredBusinesses.length,
  //   loading 
  // });

  if (loading) {
    return (
      <Card className="w-[60vh] border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-yp-dark">
            {getCategoryDisplayName()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Always show the main business listings - no empty state
  return (
    <Card className="w-[58vh] border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-yp-dark flex items-center justify-between">
          {getCategoryDisplayName()}
          <Badge variant="secondary" className="text-xs">
            {t('featuredBusinesses.sponsored')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {featuredBusinesses.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              No sponsored businesses available
            </p>
            <p className="text-xs text-gray-400">
              Check back later for featured businesses
            </p>
          </div>
        ) : (
          featuredBusinesses.map((business) => (
            <div key={business.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              {/* Business Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-yp-dark text-sm truncate">
                    {business.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {business.phone}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs ml-2">
                  {t('featuredBusinesses.ad')}
                </Badge>
              </div>

              {/* Category */}
              {business.category && (
                <p className="text-xs text-gray-600 mb-2">
                  {business.category.name}
                </p>
              )}

              {/* Address */}
              {business.address && (
                <p className="text-xs text-gray-600 mb-3 flex items-start">
                  <MapPin className="w-3 h-3 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{business.address}</span>
                </p>
              )}

              {/* Rating */}
              {business.reviews && business.reviews.length > 0 && (
                <div className="flex items-center space-x-2 mb-3">
                  <Crown className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium text-gray-900">
                    {getAverageRating(business).toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({business.reviews.length} {t('featuredBusinesses.reviews')})
                  </span>
                </div>
              )}

              {/* Action Links */}
              <div className="flex items-center space-x-2 text-xs">
                {/* {business.website && (
                  <Link to={business.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-yp-blue hover:text-yp-blue-dark">
                      <Globe className="w-3 h-3 mr-1" />
                      {t('featuredBusinesses.website')}
                    </Button>
                  </Link>
                )} */}
                
                {/* <Button variant="ghost" size="sm" className="h-6 px-2 text-yp-blue hover:text-yp-blue-dark">
                  <Navigation className="w-3 h-3 mr-1" />
                  {t('featuredBusinesses.directions')}
                </Button> */}
                
                <Link to={`/${citySlug || 'city'}/${business.category?.slug || 'business'}/${business.id}`}>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-yp-blue hover:text-yp-blue-dark">
                    <Info className="w-3 h-3 mr-1" />
                    {t('featuredBusinesses.moreInfo')}
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
