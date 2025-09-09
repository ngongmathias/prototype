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
  MapPin, 
  Globe,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { db } from "@/lib/supabase";

interface City {
  id: string;
  name: string;
  country_id: string;
  country_name?: string;
  is_active: boolean;
  created_at: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
}

export const CitiesManagement = () => {
  const { t } = useTranslation();
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    country_id: "",
    is_active: true
  });

  useEffect(() => {
    fetchCities();
    fetchCountries();
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await db.cities()
        .select(`
          *,
          countries!inner(name)
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching cities:', error);
      } else {
        setCities(data || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const { data, error } = await db.countries()
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching countries:', error);
      } else {
        setCountries(data || []);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleAddCity = async () => {
    try {
      const { error } = await db.cities().insert([formData]);
      
      if (error) {
        console.error('Error adding city:', error);
      } else {
        setShowAddForm(false);
        setFormData({ name: "", country_id: "", is_active: true });
        fetchCities();
      }
    } catch (error) {
      console.error('Error adding city:', error);
    }
  };

  const handleEditCity = async () => {
    if (!editingCity) return;

    try {
      const { error } = await db.cities()
        .update(formData)
        .eq('id', editingCity.id);
      
      if (error) {
        console.error('Error updating city:', error);
      } else {
        setEditingCity(null);
        setFormData({ name: "", country_id: "", is_active: true });
        fetchCities();
      }
    } catch (error) {
      console.error('Error updating city:', error);
    }
  };

  const handleDeleteCity = async (cityId: string) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      try {
        const { error } = await db.cities()
          .update({ is_active: false })
          .eq('id', cityId);
        
        if (error) {
          console.error('Error deleting city:', error);
        } else {
          fetchCities();
        }
      } catch (error) {
        console.error('Error deleting city:', error);
      }
    }
  };

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || city.country_id === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const resetForm = () => {
    setFormData({ name: "", country_id: "", is_active: true });
    setShowAddForm(false);
    setEditingCity(null);
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
              Cities Management
            </h1>
            <p className="text-gray-600 font-roboto">
              Manage cities and locations across all countries
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-yp-blue"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New City
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yp-blue focus:border-transparent"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              <Button variant="outline" className="flex items-center justify-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {(showAddForm || editingCity) && (
          <Card>
            <CardHeader>
              <CardTitle className="font-roboto">
                {editingCity ? 'Edit City' : 'Add New City'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    City Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter city name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
                    Country
                  </label>
                  <select
                    value={formData.country_id}
                    onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yp-blue focus:border-transparent"
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
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
                  onClick={editingCity ? handleEditCity : handleAddCity}
                  className="bg-yp-blue"
                >
                  {editingCity ? 'Update City' : 'Add City'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cities Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-roboto">
              Cities ({filteredCities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">City</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Country</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Created</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 font-roboto">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCities.map((city) => (
                    <tr key={city.id} className="border-b border-gray-100 hover:bg-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium font-roboto">{city.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="font-roboto">{city.countries?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={city.is_active ? "default" : "secondary"}>
                          {city.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-roboto">
                        {new Date(city.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCity(city);
                              setFormData({
                                name: city.name,
                                country_id: city.country_id,
                                is_active: city.is_active
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCity(city.id)}
                            className="text-red-600"
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

            {filteredCities.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 font-roboto mb-2">
                  No cities found
                </h3>
                <p className="text-gray-600 font-roboto">
                  {searchTerm || selectedCountry 
                    ? 'Try adjusting your search criteria' 
                    : 'Get started by adding your first city'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};