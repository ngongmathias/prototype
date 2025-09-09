import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Globe, 
  MapPin,
  Filter,
  Flag
} from "lucide-react";
import { db } from "@/lib/supabase";

interface Country {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  cities_count?: number;
}

export const CountriesManagement = () => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    is_active: true
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data, error } = await db.countries()
        .select(`
          *,
          cities!inner(count)
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching countries:', error);
      } else {
        // Transform data to include cities count
        const countriesWithCounts = data?.map(country => ({
          ...country,
          cities_count: country.cities?.[0]?.count || 0
        })) || [];
        setCountries(countriesWithCounts);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCountry = async () => {
    try {
      const { error } = await db.countries().insert([formData]);
      
      if (error) {
        console.error('Error adding country:', error);
      } else {
        setShowAddForm(false);
        setFormData({ name: "", code: "", is_active: true });
        fetchCountries();
      }
    } catch (error) {
      console.error('Error adding country:', error);
    }
  };

  const handleEditCountry = async () => {
    if (!editingCountry) return;

    try {
      const { error } = await db.countries()
        .update(formData)
        .eq('id', editingCountry.id);
      
      if (error) {
        console.error('Error updating country:', error);
      } else {
        setEditingCountry(null);
        setFormData({ name: "", code: "", is_active: true });
        fetchCountries();
      }
    } catch (error) {
      console.error('Error updating country:', error);
    }
  };

  const handleDeleteCountry = async (countryId: string) => {
    if (window.confirm('Are you sure you want to delete this country? This will also affect all cities associated with it.')) {
      try {
        const { error } = await db.countries()
          .update({ is_active: false })
          .eq('id', countryId);
        
        if (error) {
          console.error('Error deleting country:', error);
        } else {
          fetchCountries();
        }
      } catch (error) {
        console.error('Error deleting country:', error);
      }
    }
  };

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ name: "", code: "", is_active: true });
    setShowAddForm(false);
    setEditingCountry(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-comfortaa font-bold text-gray-900">
              Countries Management
            </h1>
            <p className="text-gray-600 font-roboto">
              Manage countries and regions for your application
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-yp-blue"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Country
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center justify-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {(showAddForm || editingCountry) && (
          <Card>
            <CardHeader>
              <CardTitle className="font-roboto">
                {editingCountry ? 'Edit Country' : 'Add New Country'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Country Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter country name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Country Code
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., US, UK, KE"
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-yp-blue focus:ring-yp-blue"
                  />
                  <span className="text-sm font-roboto">Active</span>
                </label>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button 
                  onClick={editingCountry ? handleEditCountry : handleAddCountry}
                  className="bg-yp-blue"
                >
                  {editingCountry ? 'Update Country' : 'Add Country'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Countries Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-roboto">
              Countries ({filteredCountries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Country</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Code</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Cities</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCountries.map((country) => (
                    <tr key={country.id} className="border-b border-gray-100 hover:bg-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Flag className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-medium font-roboto">{country.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-mono">
                          {country.code}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="font-roboto">{country.cities_count || 0}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={country.is_active ? "default" : "secondary"}>
                          {country.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-roboto">
                        {new Date(country.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCountry(country);
                              setFormData({
                                name: country.name,
                                code: country.code,
                                is_active: country.is_active
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCountry(country.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCountries.length === 0 && (
              <div className="text-center py-12">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 font-roboto mb-2">
                  No countries found
                </h3>
                <p className="text-gray-600 font-roboto">
                  {searchTerm 
                    ? 'Try adjusting your search criteria' 
                    : 'Get started by adding your first country'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 font-roboto">Total Countries</p>
                  <p className="text-2xl font-bold text-gray-900 font-comfortaa">
                    {countries.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 font-roboto">Total Cities</p>
                  <p className="text-2xl font-bold text-gray-900 font-comfortaa">
                    {countries.reduce((sum, country) => sum + (country.cities_count || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Flag className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 font-roboto">Active Countries</p>
                  <p className="text-2xl font-bold text-gray-900 font-comfortaa">
                    {countries.filter(c => c.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};