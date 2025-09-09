import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Crown, Clock, Building, ChevronRight, Camera, Users, ArrowLeft, Award, CheckCircle, Map } from "lucide-react";
import { useBusinessById } from "@/hooks/useBusinesses";
import { Business } from "@/lib/businessService";
import { Skeleton } from "@/components/ui/skeleton";

export const BusinessDetailPage = () => {
  const { city, category, categorySlug, businessId } = useParams();
  const navigate = useNavigate();
  
  // Determine which category slug to use
  const actualCategorySlug = categorySlug || category;
  
  // Fetch business data
  const { 
    data: business, 
    isLoading, 
    error 
  } = useBusinessById(businessId || "");
  
  const formatTitle = (str: string) => {
    return str?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || '';
  };

  const cityName = formatTitle(city || '');
  const categoryName = formatTitle(actualCategorySlug || '');
  
  // Handle back navigation
  const handleBackClick = () => {
    if (city) {
      navigate(`/${city}/${actualCategorySlug}`);
    } else {
      navigate(`/category/${actualCategorySlug}`);
    }
  };

  // Calculate average rating
  const getAverageRating = (business: Business) => {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / business.reviews.length;
  };

  // Get review count
  const getReviewCount = (business: Business) => {
    return business.reviews?.length || 0;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-96 mb-6" />
            <Skeleton className="h-6 w-64" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div>
              <Skeleton className="h-48 w-full mb-6" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-8 w-full" />
            </div>
        </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !business) {
  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-red-600" />
          </div>
            <h2 className="text-2xl font-comfortaa font-bold text-yp-dark mb-4">
              Business Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error?.message || 'The business you are looking for could not be found.'}
            </p>
            <Button onClick={handleBackClick} className="bg-yp-blue">
              Go Back
                </Button>
              </div>
            </div>
        <Footer />
      </div>
    );
  }

  const avgRating = getAverageRating(business);
  const reviewCount = getReviewCount(business);

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackClick}
            className="p-1 h-auto text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to {categoryName}
              </Button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-yp-dark font-medium">{business.name}</span>
          </div>

            {/* Business Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-comfortaa font-bold text-yp-dark mb-2">
                {business.name}
              </h1>
              <p className="text-lg text-gray-600 mb-3">
                {business.category?.name || 'Business'}
              </p>
              
              {/* Rating and Reviews */}
              {reviewCount > 0 && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Crown
                      key={i}
                      className={`w-5 h-5 ${
                          i < Math.floor(avgRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  </div>
                  <span className="ml-2 text-lg text-gray-600">
                    {avgRating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {business.is_premium && (
                  <Badge variant="default" className="bg-yp-blue text-white">
                    <Award className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {business.is_verified && (
                  <Badge variant="secondary">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              </div>
              </div>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Images */}
            {business.images && business.images.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-4">
                  {business.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${business.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {business.description && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yp-dark mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">
                    {business.description}
                  </p>
                </div>
            )}

            {/* Services */}
            {business.services && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yp-dark mb-3">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(business.services) 
                    ? business.services.map((service, index) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))
                    : Object.entries(business.services).map(([key, value]) => (
                        <Badge key={key} variant="outline">
                          {key}: {String(value)}
                        </Badge>
                      ))
                  }
                  </div>
                </div>
            )}

            {/* Reviews Preview */}
            {business.reviews && business.reviews.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yp-dark mb-3">Recent Reviews</h3>
                <div className="space-y-4">
                  {business.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Crown
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                    ))}
                  </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                </div>
                      {review.title && (
                        <h4 className="font-medium text-yp-dark mb-1">{review.title}</h4>
                      )}
                      {review.content && (
                        <p className="text-gray-700 text-sm">{review.content}</p>
                    )}
                  </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to={`/write-review/${business.id}`}>
                    <Button variant="outline" className="w-full">
                      Write a Review
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yp-dark mb-4">Contact Information</h3>
              
              <div className="space-y-3">
                {business.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-3" />
                    <a href={`tel:${business.phone}`} className="text-yp-blue hover:underline">
                      {business.phone}
                    </a>
                  </div>
                )}
                
                {business.email && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-500 mr-3" />
                    <a href={`mailto:${business.email}`} className="text-yp-blue hover:underline">
                      {business.email}
                    </a>
                </div>
                )}
                
                {business.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-500 mr-3" />
                    <a 
                      href={`https://${business.website}`} 
                      className="text-yp-blue hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {business.website}
                    </a>
              </div>
                )}
                
                {business.address && (
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mr-3 mt-0.5" />
                    <span className="text-gray-700">{business.address}</span>
                </div>
                )}
              </div>
            </div>

            {/* Business Hours */}
            {business.hours_of_operation && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-yp-dark mb-4">Business Hours</h3>
                <div className="space-y-2">
                  {typeof business.hours_of_operation === 'string' ? (
                    <p className="text-gray-700">{business.hours_of_operation}</p>
                  ) : (
                    Object.entries(business.hours_of_operation).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium text-gray-700">{day}</span>
                        <span className="text-gray-600">{hours as string}</span>
                      </div>
                    ))
                  )}
                </div>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Link to={`/write-review/${business.id}`}>
                <Button className="w-full bg-yp-blue">
                  Write Review
                </Button>
              </Link>
              
              {business.website && (
                <a 
                  href={`https://${business.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    Visit Website
                  </Button>
                </a>
              )}
              
              <Button variant="outline" className="w-full">
                <Map className="w-4 h-4 mr-2" />
                Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      
      <Footer />
    </div>
  );
};