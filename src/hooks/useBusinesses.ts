import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { BusinessService, BusinessSearchParams, BusinessFilters } from '@/lib/businessService';

export const useBusinesses = (params: BusinessSearchParams = {}) => {
  return useQuery({
    queryKey: ['businesses', params],
    queryFn: () => BusinessService.getBusinesses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Updated to support country filtering
export const useBusinessesByCategory = (categorySlug: string, citySlug?: string, countryName?: string) => {
  return useQuery({
    queryKey: ['businesses', 'category', categorySlug, citySlug, countryName],
    queryFn: () => BusinessService.getBusinessesByCategory(categorySlug, citySlug, countryName),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: !!categorySlug,
  });
};

export const useBusinessesInfinite = (params: BusinessSearchParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['businesses', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => 
      BusinessService.getBusinesses({ ...params, page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

export const useBusinessSearch = (searchTerm: string, filters: BusinessFilters = {}) => {
  return useQuery({
    queryKey: ['businesses', 'search', searchTerm, filters],
    queryFn: () => BusinessService.searchBusinesses(searchTerm, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: searchTerm.length > 2, // Only search when term is longer than 2 characters
  });
};

export const useBusinessById = (id: string) => {
  return useQuery({
    queryKey: ['business', id],
    queryFn: () => BusinessService.getBusinessById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes for individual business
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useBusinessCountByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['businesses', 'count', categorySlug],
    queryFn: () => BusinessService.getBusinessCountByCategory(categorySlug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    enabled: !!categorySlug,
  });
};

export const useCitiesByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['cities', 'category', categorySlug],
    queryFn: () => BusinessService.getCitiesByCategory(categorySlug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    enabled: !!categorySlug,
  });
};

export const useCountriesByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['countries', 'category', categorySlug],
    queryFn: () => BusinessService.getCountriesByCategory(categorySlug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    enabled: !!categorySlug,
  });
};

export const useCategoryStats = (categorySlug: string) => {
  return useQuery({
    queryKey: ['category', 'stats', categorySlug],
    queryFn: () => BusinessService.getCategoryStats(categorySlug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    enabled: !!categorySlug,
  });
};

// Hook for real-time business updates (if needed)
export const useBusinessesRealtime = (params: BusinessSearchParams = {}) => {
  const query = useBusinesses(params);
  
  // You can add real-time subscription logic here if needed
  // For now, we'll just return the regular query result
  
  return query;
};
