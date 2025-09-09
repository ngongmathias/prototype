import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Search, 
  Download,
  ChevronLeft,
  ChevronRight,
  Globe,
  Building2,
  Target,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface Business {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  is_sponsored_ad: boolean;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const AdminSponsoredAds = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingBusiness, setUpdatingBusiness] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Fetch businesses from database
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          id,
          name,
          description,
          website,
          is_sponsored_ad,
          slug,
          status,
          created_at,
          updated_at
        `)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching businesses:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch businesses',
          variant: 'destructive'
        });
        return;
      }

      setBusinesses(data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch businesses',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle sponsored ad status
  const toggleSponsoredAd = async (businessId: string, currentStatus: boolean) => {
    try {
      setUpdatingBusiness(businessId);
      
      const { error } = await supabase
        .from('businesses')
        .update({ 
          is_sponsored_ad: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (error) {
        console.error('Error updating business:', error);
        toast({
          title: 'Error',
          description: 'Failed to update sponsored ad status',
          variant: 'destructive'
        });
        return;
      }

      // Update local state
      setBusinesses(prev => prev.map(business => 
        business.id === businessId 
          ? { ...business, is_sponsored_ad: !currentStatus }
          : business
    ));
    
    toast({
        title: 'Success',
        description: `Sponsored ad ${!currentStatus ? 'enabled' : 'disabled'} for ${businesses.find(b => b.id === businessId)?.name}`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error updating business:', error);
      toast({
        title: 'Error',
        description: 'Failed to update sponsored ad status',
        variant: 'destructive'
      });
    } finally {
      setUpdatingBusiness(null);
    }
  };

  // Filter businesses based on search term
  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (business.description && business.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (business.website && business.website.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBusinesses = filteredBusinesses.slice(startIndex, endIndex);

  // Download functionality
  const downloadBusinessesData = () => {
    const csvData = [
      ['Name', 'Description', 'Website', 'Sponsored Ad', 'Status', 'Created At', 'Updated At'],
      ...filteredBusinesses.map(business => [
        business.name,
        business.description || '',
        business.website || '',
        business.is_sponsored_ad ? 'Yes' : 'No',
        business.status,
        new Date(business.created_at).toLocaleDateString(),
        new Date(business.updated_at).toLocaleDateString()
      ])
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sponsored-ads-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <AdminLayout title="Sponsored Ads Management" subtitle="Manage sponsored advertising status for businesses">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Sponsored Ads Management" subtitle="Manage sponsored advertising status for businesses">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-comfortaa font-bold text-yp-dark">Sponsored Ads</h2>
          <p className="text-gray-600 font-roboto">Manage sponsored advertising status for businesses</p>
        </div>
        
        <Button 
          onClick={downloadBusinessesData}
          variant="outline"
          className="bg-white hover:bg-gray-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Data
        </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
                  <div>
                <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                    <p className="text-2xl font-bold text-yp-dark">
                  {businesses.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-green-600" />
                  <div>
                <p className="text-sm font-medium text-gray-600">Sponsored Ads Active</p>
                    <p className="text-2xl font-bold text-yp-dark">
                  {businesses.filter(b => b.is_sponsored_ad).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                <p className="text-sm font-medium text-gray-600">Sponsored Ads Inactive</p>
                    <p className="text-2xl font-bold text-yp-dark">
                  {businesses.filter(b => !b.is_sponsored_ad).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

      {/* Search Filter */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                  placeholder="Search businesses by name, description, or website..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

      {/* Businesses List */}
          <div className="space-y-4">
        {currentBusinesses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                {searchTerm ? 'No businesses found matching your search.' : 'No businesses available.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {currentBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-yp-dark">
                          {business.name}
                        </h3>
                        <Badge variant={business.is_sponsored_ad ? "default" : "secondary"}>
                          {business.is_sponsored_ad ? "Sponsored" : "Regular"}
                        </Badge>
                        <Badge variant="outline">
                          {business.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Description</p>
                          <p className="text-sm text-gray-900">
                            {business.description || 'No description available'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Website</p>
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            {business.website ? (
                              <a 
                                href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {business.website}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-500">No website</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-4 ml-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600">
                          Sponsored Ad
                        </span>
                        <Switch
                          checked={business.is_sponsored_ad}
                          onCheckedChange={() => toggleSponsoredAd(business.id, business.is_sponsored_ad)}
                          disabled={updatingBusiness === business.id}
                          className={cn(
                            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                            business.is_sponsored_ad 
                              ? "data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300" 
                              : "data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-500"
                          )}
                          style={{
                            '--switch-bg-checked': business.is_sponsored_ad ? '#16a34a' : '#16a34a',
                            '--switch-bg-unchecked': business.is_sponsored_ad ? '#d1d5db' : '#ef4444'
                          } as React.CSSProperties}
                        />
                        {updatingBusiness === business.id && (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Last updated: {new Date(business.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredBusinesses.length)} of {filteredBusinesses.length} businesses
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
          </div>
        </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};
