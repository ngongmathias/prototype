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
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Globe, 
  MapPin,
  Users,
  Building2
} from "lucide-react";
import { getAdminDb } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Country {
  id: string;
  name: string;
  code: string;
  flag_emoji?: string;
  is_active: boolean;
  created_at: string;
  city_count?: number;
  business_count?: number;
}

export const AdminCountries = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    flag_emoji: "",
    is_active: true
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {  
    try {
      const db = getAdminDb();
      
      // Fetch countries with counts using separate queries
      const { data: countriesData, error: countriesError } = await db
        .countries()
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (countriesError) {
        console.error('Countries fetch error:', countriesError);
        throw countriesError;
      }
      
      // Get counts for each country
      const countriesWithCounts = await Promise.all(
        (countriesData || []).map(async (country) => {
          try {
            // Get city count
            const { count: cityCount } = await db
              .cities()
              .select('*', { count: 'exact', head: true })
              .eq('country_id', country.id)
              .eq('is_active', true);

            // Get business count
            const { count: businessCount } = await db
              .businesses()
              .select('*', { count: 'exact', head: true })
              .eq('country_id', country.id);

            return {
              ...country,
              city_count: cityCount || 0,
              business_count: businessCount || 0
            };
          } catch (error) {
            console.error(`Error getting counts for country ${country.id}:`, error);
            return {
              ...country,
              city_count: 0,
              business_count: 0
            };
          }
        })
      );
      
      setCountries(countriesWithCounts);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch countries. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCountry = async () => {
    // Validate form data
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Country name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.code.trim()) {
      toast({
        title: "Error",
        description: "Country code is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.code.length !== 2) {
      toast({
        title: "Error",
        description: "Country code must be exactly 2 characters",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const db = getAdminDb();
      
      // Check if country already exists
      const { data: existingCountry } = await db
        .countries()
        .select('id')
        .or(`name.eq.${formData.name.trim()},code.eq.${formData.code.toUpperCase()}`)
        .eq('is_active', true)
        .single();

      if (existingCountry) {
        toast({
          title: "Error",
          description: "A country with this name or code already exists",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await db
        .countries()
        .insert([{
          name: formData.name.trim(),
          code: formData.code.toUpperCase(),
          flag_emoji: formData.flag_emoji || null,
          is_active: formData.is_active
        }])
        .select();

      if (error) {
        console.error('Add country error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from insert operation');
      }

      toast({
        title: "Success",
        description: "Country added successfully",
      });

      setIsAddDialogOpen(false);
      setFormData({ name: "", code: "", flag_emoji: "", is_active: true });
      fetchCountries();
    } catch (error) {
      console.error('Error adding country:', error);
      let errorMessage = "Failed to add country.";
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = error.message as string;
      } else if (error && typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCountry = async () => {
    if (!selectedCountry) return;

    // Validate form data
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Country name is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.code.trim()) {
      toast({
        title: "Error",
        description: "Country code is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.code.length !== 2) {
      toast({
        title: "Error",
        description: "Country code must be exactly 2 characters",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const db = getAdminDb();
      
      // Check if country already exists (excluding current country)
      const { data: existingCountry } = await db
        .countries()
        .select('id')
        .or(`name.eq.${formData.name.trim()},code.eq.${formData.code.toUpperCase()}`)
        .eq('is_active', true)
        .neq('id', selectedCountry.id)
        .single();

      if (existingCountry) {
        toast({
          title: "Error",
          description: "A country with this name or code already exists",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await db
        .countries()
        .update({
          name: formData.name.trim(),
          code: formData.code.toUpperCase(),
          flag_emoji: formData.flag_emoji || null,
          is_active: formData.is_active
        })
        .eq('id', selectedCountry.id)
        .select();

      if (error) {
        console.error('Update country error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from update operation');
      }

      toast({
        title: "Success",
        description: "Country updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedCountry(null);
      setFormData({ name: "", code: "", flag_emoji: "", is_active: true });
      fetchCountries();
    } catch (error) {
      console.error('Error updating country:', error);
      let errorMessage = "Failed to update country.";
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = error.message as string;
      } else if (error && typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCountry = async (countryId: string) => {
    const countryToDelete = countries.find(country => country.id === countryId);
    if (!countryToDelete) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${countryToDelete.name}"? This will also affect all associated cities and businesses. This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      const db = getAdminDb();
      const { data, error } = await db
        .countries()
        .update({ is_active: false })
        .eq('id', countryId)
        .select();

      if (error) {
        console.error('Delete country error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from delete operation');
      }

      toast({
        title: "Success",
        description: `Country "${countryToDelete.name}" deleted successfully`,
      });

      fetchCountries();
    } catch (error) {
      console.error('Error deleting country:', error);
      let errorMessage = "Failed to delete country.";
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = error.message as string;
      } else if (error && typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (country: Country) => {
    setSelectedCountry(country);
    setFormData({
      name: country.name,
      code: country.code,
      flag_emoji: country.flag_emoji || "",
      is_active: country.is_active
    });
    setIsEditDialogOpen(true);
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Countries Management" subtitle="Manage countries and regions">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Countries Management" subtitle="Manage countries and regions">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-comfortaa font-bold text-yp-dark">Countries</h2>
          <p className="text-gray-600 font-roboto">Manage countries and their regions</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yp-blue hover:bg-[#4e3c28]">
              <Plus className="w-4 h-4 mr-2" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-comfortaa">Add New Country</DialogTitle>
              <DialogDescription className="font-roboto">
                Create a new country entry for your platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="country-name" className="font-roboto">Country Name</Label>
                <Input
                  id="country-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter country name"
                  className="font-roboto"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country-code" className="font-roboto">Country Code</Label>
                <Input
                  id="country-code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g., RW, KE, UG"
                  className="font-roboto"
                  maxLength={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="flag-emoji" className="font-roboto">Flag Emoji (Optional)</Label>
                <Input
                  id="flag-emoji"
                  value={formData.flag_emoji}
                  onChange={(e) => setFormData(prev => ({ ...prev, flag_emoji: e.target.value }))}
                  placeholder="🇷🇼 🇰🇪 🇺🇬"
                  className="font-roboto"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="font-roboto" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddCountry} className="font-roboto" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Country"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-roboto"
              />
            </div>
            <Badge variant="secondary" className="self-center">
              {filteredCountries.length} countries
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map((country) => (
          <Card key={country.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{country.flag_emoji || "🌍"}</div>
                  <div>
                    <CardTitle className="text-lg font-comfortaa">{country.name}</CardTitle>
                    <div className="flex items-center space-x-1 mt-1">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-roboto text-gray-600">{country.code}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(country)}
                    className="p-1 h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCountry(country.id)}
                    className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="font-roboto">{country.city_count || 0} cities</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span className="font-roboto">{country.business_count || 0} businesses</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 font-roboto">
                <span>Added: {new Date(country.created_at).toLocaleDateString()}</span>
                <Badge variant={country.is_active ? "default" : "secondary"}>
                  {country.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCountries.length === 0 && searchTerm && (
        <Card className="text-center py-12">
          <CardContent>
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-comfortaa font-semibold text-gray-900 mb-2">
              No countries found
            </h3>
            <p className="text-gray-600 font-roboto">
              Try adjusting your search terms or add a new country.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-comfortaa">Edit Country</DialogTitle>
            <DialogDescription className="font-roboto">
              Update country information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-country-name" className="font-roboto">Country Name</Label>
              <Input
                id="edit-country-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter country name"
                className="font-roboto"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-country-code" className="font-roboto">Country Code</Label>
              <Input
                id="edit-country-code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="e.g., RW, KE, UG"
                className="font-roboto"
                maxLength={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-flag-emoji" className="font-roboto">Flag Emoji (Optional)</Label>
              <Input
                id="edit-flag-emoji"
                value={formData.flag_emoji}
                onChange={(e) => setFormData(prev => ({ ...prev, flag_emoji: e.target.value }))}
                placeholder="🇷🇼 🇰🇪 🇺🇬"
                className="font-roboto"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="font-roboto" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditCountry} className="font-roboto" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Country"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};