import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building2, 
  MapPin,
  Globe,
  Crown,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  X
} from "lucide-react";
import { db } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  category_id: string;
  category_name?: string;
  city_id: string;
  city_name?: string;
  country_name?: string;
  status: 'active' | 'pending' | 'suspended';
  is_premium: boolean;
  is_verified: boolean;
  has_coupons: boolean;
  accepts_orders_online: boolean;
  is_kid_friendly: boolean;
  rating: number | null;
  review_count: number | null;
  created_at: string;
  owner_id: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface City {
  id: string;
  name: string;
  country_name?: string;
}

export const BusinessesManagement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    category_id: "",
    city_id: "",
    status: "pending" as 'active' | 'pending' | 'suspended',
    is_premium: false,
    is_verified: false,
    has_coupons: false,
    accepts_orders_online: false,
    is_kid_friendly: false,
  });

  useEffect(() => {
    fetchBusinesses();
    fetchCategories();
    fetchCities();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await db
        .businesses()
        .select(`
          *,
          categories!inner(name, slug),
          cities!inner(name, countries!inner(name))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const businessesWithDetails = data?.map(business => ({
        ...business,
        category_name: business.categories?.name,
        city_name: business.cities?.name,
        country_name: business.cities?.countries?.name
      })) || [];
      
      setBusinesses(businessesWithDetails);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.failedToFetchBusinesses'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await db
        .categories()
        .select('*')
        .order('name');

      if (error) throw error;
        setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCities = async () => {
    try {
      const { data, error } = await db
        .cities()
        .select(`
          *,
          countries!inner(name)
        `)
        .order('name');

      if (error) throw error;
      
      const citiesWithCountries = data?.map(city => ({
        ...city,
        country_name: city.countries?.name
      })) || [];
      
      setCities(citiesWithCountries);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const openEditDialog = (business: Business) => {
    setEditingBusiness(business);
    setFormData({
      name: business.name,
      description: business.description || "",
      address: business.address || "",
      phone: business.phone || "",
      email: business.email || "",
      website: business.website || "",
      category_id: business.category_id,
      city_id: business.city_id,
      status: business.status,
      is_premium: business.is_premium,
      is_verified: business.is_verified,
      has_coupons: business.has_coupons,
      accepts_orders_online: business.accepts_orders_online,
      is_kid_friendly: business.is_kid_friendly,
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
        setEditingBusiness(null);
        setFormData({
          name: "",
          description: "",
      address: "",
          phone: "",
          email: "",
          website: "",
      category_id: "",
          city_id: "",
      status: "pending",
      is_premium: false,
      is_verified: false,
      has_coupons: false,
      accepts_orders_online: false,
      is_kid_friendly: false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.category_id || !formData.city_id) {
        toast({
          title: t('admin.validationError'),
          description: t('admin.pleaseFillRequiredFields'),
          variant: "destructive"
        });
        return;
      }

      const businessData = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: formData.description || null,
        address: formData.address || null,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        category_id: formData.category_id,
        city_id: formData.city_id,
        status: formData.status,
        is_premium: formData.is_premium,
        is_verified: formData.is_verified,
        has_coupons: formData.has_coupons,
        accepts_orders_online: formData.accepts_orders_online,
        is_kid_friendly: formData.is_kid_friendly,
      };

      if (editingBusiness) {
        // Update existing business
        const { error } = await db
          .businesses()
          .update(businessData)
          .eq('id', editingBusiness.id);

        if (error) throw error;

        toast({
          title: t('admin.success'),
          description: t('admin.businessUpdatedSuccessfully'),
        });
      } else {
        // Create new business
        const { error } = await db
          .businesses()
          .insert(businessData);

        if (error) throw error;

        toast({
          title: t('admin.success'),
          description: t('admin.businessCreatedSuccessfully'),
        });
      }

      setIsDialogOpen(false);
        fetchBusinesses();
    } catch (error) {
      console.error('Error saving business:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.failedToSaveBusiness'),
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (businessId: string) => {
    if (!confirm(t('admin.confirmDeleteBusiness'))) return;

    try {
      const { error } = await db
        .businesses()
        .delete()
          .eq('id', businessId);
        
      if (error) throw error;

      toast({
        title: t('admin.success'),
        description: t('admin.businessDeletedSuccessfully'),
      });

          fetchBusinesses();
      } catch (error) {
        console.error('Error deleting business:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.failedToDeleteBusiness'),
        variant: "destructive"
      });
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || business.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || business.category_id === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue mx-auto mb-4"></div>
            <p className="text-gray-600 font-roboto">{t('admin.loadingBusinesses')}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-comfortaa font-bold text-yp-dark">
              {t('admin.businessManagement')}
            </h1>
            <p className="text-gray-600 font-roboto mt-1">
              {t('admin.manageAllBusinesses')}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="bg-yp-blue hover:bg-yp-blue/90">
            <Plus className="w-4 h-4 mr-2" />
                {t('admin.addBusiness')}
          </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-comfortaa">
                  {editingBusiness ? t('admin.editBusiness') : t('admin.addNewBusiness')}
                </DialogTitle>
                <DialogDescription>
                  {editingBusiness ? t('admin.updateBusinessInfo') : t('admin.createNewBusinessListing')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="space-y-4">
                <div>
                    <Label htmlFor="name" className="font-roboto">{t('admin.businessName')} *</Label>
                  <Input
                      id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="font-roboto"
                  />
                </div>
                  
                <div>
                    <Label htmlFor="description" className="font-roboto">{t('admin.description')}</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="font-roboto"
                      rows={3}
                    />
                </div>
                  
                <div>
                    <Label htmlFor="address" className="font-roboto">{t('admin.address')}</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="font-roboto"
                    />
                </div>
                  
                <div>
                    <Label htmlFor="phone" className="font-roboto">{t('admin.phone')}</Label>
                  <Input
                      id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="font-roboto"
                  />
                </div>
                  
                <div>
                    <Label htmlFor="email" className="font-roboto">{t('admin.email')}</Label>
                  <Input
                      id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="font-roboto"
                  />
                </div>
                  
                <div>
                    <Label htmlFor="website" className="font-roboto">{t('admin.website')}</Label>
                  <Input
                      id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="font-roboto"
                  />
                </div>
                </div>
                
                {/* Categories and Status */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category" className="font-roboto">{t('admin.category')} *</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                      <SelectTrigger className="font-roboto">
                        <SelectValue placeholder={t('admin.selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="font-roboto">
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="city" className="font-roboto">{t('admin.city')} *</Label>
                    <Select value={formData.city_id} onValueChange={(value) => setFormData({ ...formData, city_id: value })}>
                      <SelectTrigger className="font-roboto">
                        <SelectValue placeholder={t('admin.selectCity')} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id} className="font-roboto">
                            {city.name}, {city.country_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="status" className="font-roboto">{t('admin.status')}</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="font-roboto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending" className="font-roboto">{t('admin.pending')}</SelectItem>
                        <SelectItem value="active" className="font-roboto">{t('admin.active')}</SelectItem>
                        <SelectItem value="suspended" className="font-roboto">{t('admin.suspended')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Business Features */}
                  <div className="space-y-3">
                    <Label className="font-roboto">{t('admin.businessFeatures')}</Label>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_premium" className="font-roboto text-sm">{t('admin.premiumBusiness')}</Label>
                      <Switch
                        id="is_premium"
                        checked={formData.is_premium}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                  />
                </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_verified" className="font-roboto text-sm">{t('admin.verifiedBusiness')}</Label>
                      <Switch
                        id="is_verified"
                        checked={formData.is_verified}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_verified: checked })}
                  />
                </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="has_coupons" className="font-roboto text-sm">{t('admin.hasCoupons')}</Label>
                      <Switch
                        id="has_coupons"
                        checked={formData.has_coupons}
                        onCheckedChange={(checked) => setFormData({ ...formData, has_coupons: checked })}
                      />
              </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="accepts_orders_online" className="font-roboto text-sm">{t('admin.acceptsOrdersOnline')}</Label>
                      <Switch
                        id="accepts_orders_online"
                        checked={formData.accepts_orders_online}
                        onCheckedChange={(checked) => setFormData({ ...formData, accepts_orders_online: checked })}
                      />
              </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_kid_friendly" className="font-roboto text-sm">{t('admin.kidFriendly')}</Label>
                      <Switch
                        id="is_kid_friendly"
                        checked={formData.is_kid_friendly}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_kid_friendly: checked })}
                      />
                    </div>
                        </div>
                    </div>
                  </div>
                  
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  {t('admin.cancel')}
                </Button>
                <Button onClick={handleSubmit} className="bg-yp-blue hover:bg-yp-blue/90">
                  <Save className="w-4 h-4 mr-2" />
                  {editingBusiness ? t('admin.update') : t('admin.create')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={t('admin.searchBusinesses')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-roboto"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="font-roboto">
                  <SelectValue placeholder={t('admin.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-roboto">{t('admin.allStatuses')}</SelectItem>
                  <SelectItem value="active" className="font-roboto">{t('admin.active')}</SelectItem>
                  <SelectItem value="pending" className="font-roboto">{t('admin.pending')}</SelectItem>
                  <SelectItem value="suspended" className="font-roboto">{t('admin.suspended')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="font-roboto">
                  <SelectValue placeholder={t('admin.filterByCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-roboto">{t('admin.allCategories')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="font-roboto">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="self-center justify-center">
                {filteredBusinesses.length} {t('admin.businesses')}
                      </Badge>
                    </div>
          </CardContent>
        </Card>

        {/* Businesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-yp-blue" />
                    <div className="flex-1">
                      <CardTitle className="text-lg font-comfortaa line-clamp-2">{business.name}</CardTitle>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-roboto text-gray-600">
                          {business.city_name}, {business.country_name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                      <Button
                      variant="ghost"
                        size="sm"
                      className="p-1 h-8 w-8"
                      onClick={() => openEditDialog(business)}
                    >
                      <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                      variant="ghost"
                        size="sm"
                      className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-[#4e3c28]/10"
                      onClick={() => handleDelete(business.id)}
                      >
                      <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
              </CardHeader>
              <CardContent className="pt-0">
                            {business.description && (
                  <p className="text-sm font-roboto text-gray-600 mb-3 line-clamp-2">
                                {business.description}
                  </p>
                )}
                
                {/* Business Features Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  
                  {business.has_coupons && (
                    <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
                      {t('businessFeatures.coupons')}
                    </Badge>
                  )}
                  {business.accepts_orders_online && (
                    <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                      {t('businessFeatures.orderOnline')}
                    </Badge>
                  )}
                  {business.is_kid_friendly && (
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                      {t('businessFeatures.kidFriendly')}
                    </Badge>
                            )}
                          </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="font-roboto">{business.rating?.toFixed(1) || "N/A"}</span>
                        </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span className="font-roboto">{business.review_count || 0} {t('admin.reviews')}</span>
                        </div>
                            </div>
                
                <div className="flex items-center justify-between">
                  <Badge 
                            variant="outline"
                    className="font-roboto"
                  >
                    <span className="capitalize">{business.status}</span>
                  </Badge>
                  <span className="text-xs font-roboto text-gray-500">
                    {new Date(business.created_at).toLocaleDateString()}
                  </span>
            </div>
          </CardContent>
        </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredBusinesses.length === 0 && searchTerm && (
          <Card className="text-center py-12">
            <CardContent>
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-comfortaa font-semibold text-gray-900 mb-2">
                {t('admin.noBusinessesFound')}
                </h3>
                <p className="text-gray-600 font-roboto">
                {t('admin.tryAdjustingSearchTerms')}
                </p>
            </CardContent>
          </Card>
            )}
      </div>
    </AdminLayout>
  );
};