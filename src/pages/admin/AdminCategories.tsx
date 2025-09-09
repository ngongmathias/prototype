import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  FolderOpen,
  Eye,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  parent_id: string | null;
  parent_name?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

interface CategoryFormData {
  name: string;
  slug: string;
  icon: string;
  description: string;
  parent_id: string;
  sort_order: number;
  is_active: boolean;
}

export const AdminCategories = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCategories, setTotalCategories] = useState(0);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    icon: '',
    description: '',
    parent_id: 'none',
    sort_order: 0,
    is_active: true
  });

  // Fetch categories from database
  const fetchCategories = async (searchMode = false) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      // If searching, use server-side search; otherwise use pagination
      if (searchMode && searchTerm.trim()) {
        // Server-side search using Supabase text search
        const searchQuery = searchTerm.trim();
        
        // Use ilike for case-insensitive search across multiple fields
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .or(`name.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,icon.ilike.%${searchQuery}%`)
          .order('sort_order', { ascending: true })
          .order('name', { ascending: true });

        if (error) {
          console.error('Error searching categories:', error);
          toast({
            title: 'Error',
            description: 'Failed to search categories',
            variant: 'destructive'
          });
          return;
        }

        // Get total count for search results
        setTotalCategories(data?.length || 0);

        // Get parent names for categories that have parents
        const categoriesWithParents = data?.filter(cat => cat.parent_id) || [];
        const parentIds = [...new Set(categoriesWithParents.map(cat => cat.parent_id))];
        
        let parentCategories: { [key: string]: string } = {};
        if (parentIds.length > 0) {
          const { data: parentData, error: parentError } = await supabase
            .from('categories')
            .select('id, name')
            .in('id', parentIds);
          
          if (!parentError && parentData) {
            parentCategories = parentData.reduce((acc, parent) => {
              acc[parent.id] = parent.name;
              return acc;
            }, {} as { [key: string]: string });
          }
        }

        // Transform data to include parent name
        const categoriesWithParent = data?.map(category => ({
          ...category,
          parent_name: category.parent_id ? parentCategories[category.parent_id] || null : null
        })) || [];

        setCategories(categoriesWithParent);
      } else if (searchMode) {
        // For search mode without search term, fetch all categories
        const { data, error } = await query;

        if (error) {
          console.error('Error fetching categories:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch categories',
            variant: 'destructive'
          });
          return;
        }

        // Get total count for search results
        setTotalCategories(data?.length || 0);

        // Get parent names for categories that have parents
        const categoriesWithParents = data?.filter(cat => cat.parent_id) || [];
        const parentIds = [...new Set(categoriesWithParents.map(cat => cat.parent_id))];
        
        let parentCategories: { [key: string]: string } = {};
        if (parentIds.length > 0) {
          const { data: parentData, error: parentError } = await supabase
            .from('categories')
            .select('id, name')
            .in('id', parentIds);
          
          if (!parentError && parentData) {
            parentCategories = parentData.reduce((acc, parent) => {
              acc[parent.id] = parent.name;
              return acc;
            }, {} as { [key: string]: string });
          }
        }

        // Transform data to include parent name
        const categoriesWithParent = data?.map(category => ({
          ...category,
          parent_name: category.parent_id ? parentCategories[category.parent_id] || null : null
        })) || [];

        setCategories(categoriesWithParent);
      } else {
        // For normal pagination mode
        // Get total count for pagination
        const { count } = await supabase
          .from('categories')
          .select('id', { count: 'exact', head: true });

        setTotalCategories(count || 0);

        // Fetch categories with pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const { data, error } = await query.range(startIndex, startIndex + itemsPerPage - 1);

        if (error) {
          console.error('Error fetching categories:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch categories',
            variant: 'destructive'
          });
          return;
        }

        // Get parent names for categories that have parents
        const categoriesWithParents = data?.filter(cat => cat.parent_id) || [];
        const parentIds = [...new Set(categoriesWithParents.map(cat => cat.parent_id))];
        
        let parentCategories: { [key: string]: string } = {};
        if (parentIds.length > 0) {
          const { data: parentData, error: parentError } = await supabase
            .from('categories')
            .select('id, name')
            .in('id', parentIds);
          
          if (!parentError && parentData) {
            parentCategories = parentData.reduce((acc, parent) => {
              acc[parent.id] = parent.name;
              return acc;
            }, {} as { [key: string]: string });
          }
        }

        // Transform data to include parent name
        const categoriesWithParent = data?.map(category => ({
          ...category,
          parent_name: category.parent_id ? parentCategories[category.parent_id] || null : null
        })) || [];

        setCategories(categoriesWithParent);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on search term (client-side fallback for parent names)
  const filteredCategories = categories.filter(category => {
    if (!searchTerm.trim()) return true;
    
    // Since we're using server-side search, we only need to filter by parent_name
    // as the server-side search doesn't include parent names
    const searchLower = searchTerm.toLowerCase();
    return (
      category.name.toLowerCase().includes(searchLower) ||
      category.slug.toLowerCase().includes(searchLower) ||
      (category.description && category.description.toLowerCase().includes(searchLower)) ||
      (category.parent_name && category.parent_name.toLowerCase().includes(searchLower)) ||
      (category.icon && category.icon.toLowerCase().includes(searchLower))
    );
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle form data changes
  const handleFormChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug when name changes
    if (field === 'name') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          icon: formData.icon.trim() || null,
          description: formData.description.trim() || null,
          parent_id: formData.parent_id === 'none' ? null : formData.parent_id,
          sort_order: formData.sort_order,
          is_active: formData.is_active
        }]);

      if (error) {
        console.error('Error adding category:', error);
        toast({
          title: 'Error',
          description: 'Failed to add category',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Category added successfully',
        variant: 'default'
      });

      setIsAddDialogOpen(false);
      setFormData({
        name: '',
        slug: '',
        icon: '',
        description: '',
        parent_id: 'none',
        sort_order: 0,
        is_active: true
      });
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit category
  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatePayload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        // Preserve existing DB icon when the hidden input is empty
        icon: formData.icon.trim() === '' ? (selectedCategory.icon || null) : formData.icon.trim(),
        description: formData.description.trim() || null,
        parent_id: formData.parent_id === 'none' ? null : formData.parent_id,
        sort_order: formData.sort_order,
        is_active: formData.is_active
      };

      const { error } = await supabase
        .from('categories')
        .update(updatePayload)
        .eq('id', selectedCategory.id);

      if (error) {
        console.error('Error updating category:', error);
        toast({
          title: 'Error',
          description: 'Failed to update category',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Category updated successfully',
        variant: 'default'
      });

      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', selectedCategory.id);

      if (error) {
        console.error('Error deleting category:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete category',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Category deleted successfully',
        variant: 'default'
      });

      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '',
      description: category.description || '',
      parent_id: category.parent_id ? category.parent_id : 'none',
      sort_order: category.sort_order,
      is_active: category.is_active
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Download categories as CSV
  const downloadCategoriesData = () => {
    const csvData = [
      ['Name', 'Slug', 'Icon', 'Description', 'Parent Category', 'Sort Order', 'Active', 'Created At'],
      ...filteredCategories.map(category => [
        category.name,
        category.slug,
        category.icon || '',
        category.description || '',
        category.parent_name || '',
        category.sort_order,
        category.is_active ? 'Yes' : 'No',
        new Date(category.created_at).toLocaleDateString()
      ])
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `categories-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setIsSearching(value.trim().length > 0);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear search and return to pagination mode
  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(1);
    fetchCategories(false); // Fetch with pagination
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCategories / itemsPerPage);

  useEffect(() => {
    if (isSearching) {
      // When searching, fetch all categories
      fetchCategories(true);
    } else {
      // When not searching, use pagination
      fetchCategories(false);
    }
  }, [currentPage, isSearching]);

  // Handle search term changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        fetchCategories(true);
      } else if (isSearching) {
        setIsSearching(false);
        fetchCategories(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading) {
    return (
      <AdminLayout title="Categories Management" subtitle="Manage business categories">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories Management" subtitle="Manage business categories">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-comfortaa font-bold text-yp-dark">Categories</h2>
          <p className="text-gray-600 font-roboto">Manage business categories and subcategories</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => fetchCategories(isSearching)}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yp-blue hover:bg-[#4e3c28]">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-comfortaa">Add New Category</DialogTitle>
                <DialogDescription className="font-roboto">
                  Create a new business category
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="font-roboto">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter category name"
                    className="font-roboto"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug" className="font-roboto">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleFormChange('slug', e.target.value)}
                    placeholder="category-slug"
                    className="font-roboto"
                  />
                </div>
                <div className="grid gap-2 hidden">
                  <Label htmlFor="icon" className="font-roboto">Icon (CSS Class)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => handleFormChange('icon', e.target.value)}
                    placeholder="fas fa-store"
                    className="font-roboto"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="font-roboto">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Category description"
                    className="font-roboto"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parent" className="font-roboto">Parent Category</Label>
                  <Select value={formData.parent_id} onValueChange={(value) => handleFormChange('parent_id', value)}>
                    <SelectTrigger className="font-roboto">
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="font-roboto">No Parent (Top Level)</SelectItem>
                      {categories.filter(cat => cat.is_active).map((category) => (
                        <SelectItem key={category.id} value={category.id} className="font-roboto">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sort_order" className="font-roboto">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => handleFormChange('sort_order', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="font-roboto"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="font-roboto" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory} className="font-roboto" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={downloadCategoriesData}
            variant="outline"
            className="bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search categories by name, slug, description, parent, or icon..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {isSearching && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="font-roboto">
                  Search Mode
                </Badge>
                <span className="text-sm text-gray-600 font-roboto">
                  {filteredCategories.length} result{filteredCategories.length !== 1 ? 's' : ''} found
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                {searchTerm ? 'No categories found matching your search.' : 'No categories available.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yp-blue to-yp-green rounded-lg flex items-center justify-center">
                          <FolderOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-yp-dark">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {category.slug}
                          </p>
                        </div>
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {category.parent_name && (
                          <Badge variant="outline">
                            Parent: {category.parent_name}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Description</p>
                          <p className="text-sm text-gray-900">
                            {category.description || 'No description available'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Details</p>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900">
                              Icon: {category.icon || 'No icon'}
                            </p>
                            <p className="text-sm text-gray-900">
                              Sort Order: {category.sort_order}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-4 ml-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(category)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Created: {new Date(category.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination - Only show when not in search mode */}
            {!isSearching && totalPages > 1 && (
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCategories)} of {totalCategories.toLocaleString()} categories
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
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-comfortaa">Edit Category</DialogTitle>
            <DialogDescription className="font-roboto">
              Update category information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="font-roboto">Category Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Enter category name"
                className="font-roboto"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-slug" className="font-roboto">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => handleFormChange('slug', e.target.value)}
                placeholder="category-slug"
                className="font-roboto"
              />
            </div>
            <div className="grid gap-2 hidden">
              <Label htmlFor="edit-icon" className="font-roboto">Icon (CSS Class)</Label>
              <Input
                id="edit-icon"
                value={formData.icon}
                onChange={(e) => handleFormChange('icon', e.target.value)}
                placeholder="fas fa-store"
                className="font-roboto"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description" className="font-roboto">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Category description"
                className="font-roboto"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-parent" className="font-roboto">Parent Category</Label>
              <Select value={formData.parent_id} onValueChange={(value) => handleFormChange('parent_id', value)}>
                <SelectTrigger className="font-roboto">
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="font-roboto">No Parent (Top Level)</SelectItem>
                  {categories.filter(cat => cat.is_active).map((category) => (
                    <SelectItem key={category.id} value={category.id} className="font-roboto">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-sort_order" className="font-roboto">Sort Order</Label>
              <Input
                id="edit-sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => handleFormChange('sort_order', parseInt(e.target.value) || 0)}
                placeholder="0"
                className="font-roboto"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="font-roboto" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} className="font-roboto" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-comfortaa">Delete Category</DialogTitle>
            <DialogDescription className="font-roboto">
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="font-roboto" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleDeleteCategory} className="bg-red-600 hover:bg-red-700 font-roboto" disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
