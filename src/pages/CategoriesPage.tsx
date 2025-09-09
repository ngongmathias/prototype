import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/supabase";
import { Users, UtensilsCrossed, Stethoscope, Wrench, HardHat, Zap, Car, Home, Scale, Bed, Plane, Building, Wine, Scissors, BookOpen, Coffee, Film, Heart, Users as UsersIcon, User, Church, Leaf, Palette, Landmark, Hospital, Book, ShoppingBag, Building2, Trees, Pill, Mail, Gamepad2, GraduationCap, Truck, CreditCard, Smartphone, ArrowLeft,Search} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Icon mapping for categories
const iconMap: { [key: string]: any } = {
  'airports': Plane,
  'banks': Building,
  'bars': Wine,
  'barbers': Scissors,
  'bookstores': BookOpen,
  'cafes': Coffee,
  'cinemas-theatres': Film,
  'clinics': Stethoscope,
  'clubs-professional': UsersIcon,
  'clubs-leisure': UsersIcon,
  'dentists': Stethoscope,
  'doctors': User,
  'faith': Church,
  'farms': Leaf,
  'galleries-art': Palette,
  'government': Landmark,
  'hospitals': Hospital,
  'hotels': Bed,
  'lawyers': Scale,
  'libraries': Book,
  'markets': ShoppingBag,
  'museums': Building2,
  'parks': Trees,
  'pharmacies': Pill,
  'post-offices': Mail,
  'recreation': Gamepad2,
  'real-estate': Home,
  'restaurants': UtensilsCrossed,
  'salons': Scissors,
  'schools': GraduationCap,
  'services': Wrench,
  'shopping': ShoppingBag,
  'tours': Car,
  'transportation': Truck,
  'universities': GraduationCap,
  'utilities': Zap,
  'auto-repair': Wrench,
  'coffee-shops': Coffee,
  'gyms-fitness': Users,
  'beauty-salons': Scissors,
  'pet-services': Heart
};

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export const CategoriesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await db.categories()
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          setCategories(data || []);
          setFilteredCategories(data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t(`categories.${category.slug}`).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories, t]);

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yp-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue mx-auto"></div>
            <p className="mt-2 text-yp-gray-dark">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yp-gray-light">
        <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={handleBackClick}
              className="p-2 hover:bg-white rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-comfortaa font-bold text-yp-dark">
              {t('categories.title')}
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yp-gray-dark w-5 h-5" />
            <Input
              type="text"
              placeholder={t('categories.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 font-roboto border-yp-gray-medium focus:border-yp-blue focus:ring-yp-blue"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = iconMap[category.slug] || Home;
            // Use the category name directly if translation is not available
            const translatedName = t(`categories.${category.slug}`, { defaultValue: category.name });
            
            return (
              <div 
                key={category.id} 
                className="bg-white rounded-lg shadow-sm border border-yp-gray-medium hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => handleCategoryClick(category.slug)}
              >
                {/* Category Icon */}
                <div className="p-6 pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yp-blue to-yp-green rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Category Content */}
                <div className="px-6 pb-6">
                  <h3 className="font-roboto font-semibold text-lg text-yp-dark mb-2 text-center group-hover:text-[#4e3c28] transition-colors duration-200">
                    {translatedName}
                  </h3>
                  
                  {category.description && (
                    <p className="font-roboto text-sm text-yp-gray-dark text-center leading-relaxed">
                      {category.description}
                    </p>
                  )}
                  
                  {/* Category Stats (placeholder) */}
                  <div className="mt-4 pt-4 border-t border-yp-gray-light">
                    <div className="flex justify-center items-center space-x-4 text-xs text-yp-gray-dark">
                      <span>📍 150+ locations</span>
                      <span>⭐ 4.5 rating</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-yp-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-yp-gray-dark" />
            </div>
            <h3 className="text-lg font-roboto font-semibold text-yp-dark mb-2">
              {t('categories.noResults.title')}
            </h3>
            <p className="text-yp-gray-dark">
              {t('categories.noResults.description')}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};