import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, Crown, Building, X, Globe, MapPin, Shield, ChevronRight, Pocket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSelector } from "./LanguageSelector";
import { AdminNavLink } from "./AdminNavLink";
import { db } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { fetchWikipediaCountryInfo } from "@/lib/wikipedia";

interface Country {
  id: string;
  name: string;
  code: string;
  flag_url: string | null;
  wikipedia_url: string | null;
  description: string | null;
  population: number | null;
  capital: string | null;
  currency: string | null;
  language: string | null;
  coat_of_arms_url?: string | null;
  area?: string | null;
  gdp?: string | null;
  timezone?: string | null;
  wikipedia_description?: string | null;
}

export const Header = () => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [countriesExpanded, setCountriesExpanded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        console.log('Fetching countries from database...');
        
        const { data, error } = await db.countries()
          .select(`
            id,
            name,
            code,
            flag_url,
            wikipedia_url,
            description,
            population,
            capital,
            currency,
            language
          `)
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching countries:', error);
          toast({
            title: 'Error',
            description: 'Failed to load countries. Please try again.',
            variant: "destructive"
          });
        } else {
          console.log(`Fetched ${data?.length || 0} countries from database:`, data);
          
          if (data && data.length > 0) {
            setCountries(data);
          } else {
            console.warn('No countries found in database');
            setCountries([]);
          }
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast({
          title: 'Error',
          description: 'Failed to load countries. Please try again.',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const formatCountryDisplay = (country: Country) => {
    return `${country.name} (${country.code})`;
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(formatCountryDisplay(country));
    closeMobileMenu();
    // Navigate to country detail page
    const countrySlug = country.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/countries/${countrySlug}`);
  };

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      closeMobileMenu();
    } else {
      setMobileMenuOpen(true);
      setMobileMenuClosing(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
    }, 300);
  };

  const toggleCountriesExpanded = () => {
    setCountriesExpanded(!countriesExpanded);
  };

  return (
    <header className="bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between h-30">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <div className="flex items-center py-4">
                <img src="/bara-3.png" className="w-30 h-16" alt="Logo picture" />
                <img src="/bara-1-removebg-preview.png" className="w-30 h-16" alt="Logo picture" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/advertise">
              <Button variant="ghost" className="font-roboto">
                <Building className="w-4 h-4 mr-1" />
                {t('navigation.advertise')}
              </Button>
            </Link>
            
            <Link to="/writeareview">
              <Button variant="ghost" className="font-roboto">
                <Crown className="w-4 h-4 mr-1" />
                {t('navigation.writeReview')}
              </Button>
            </Link>

            {/* Admin Link */}
            <AdminNavLink />

            {/* Search by Country Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="font-roboto">
                  {t('navigation.searchByCountry')}
                  <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 border border-border shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                sideOffset={8}
              >
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yp-blue mx-auto"></div>
                    <p className="text-xs mt-1">{t('common.loading')}</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {countries.map((country) => (
                      <DropdownMenuItem
                        key={country.id}
                        onClick={() => handleCountrySelect(country)}
                        className="dropdown-menu-item-override font-roboto button cursor-pointer"
                      >
                        <span>{formatCountryDisplay(country)}</span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>


            {/* Other Apps Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-roboto">
                  <Pocket className="w-4 h-4 mr-2" />
                  Other Apps
                  <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 border border-border shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                sideOffset={8}
              >
                <div className="p-2">
                  <a 
                    href="https://afri-nexus-listings-xw16.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <div className="w-10 h-10 bg-yp-blue rounded-lg flex items-center justify-center mr-3 group-hover:bg-yp-blue/90 transition-colors duration-200">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-roboto font-semibold text-yp-dark text-sm group-hover:text-yp-blue transition-colors duration-200">
                        Rwandaful Services
                      </h4>
                      {/* <p className="font-roboto text-xs text-yp-gray-dark">
                        Discover amazing services in Rwanda
                      </p> */}
                    </div>
                    <Globe className="w-4 h-4 text-yp-gray-dark group-hover:text-yp-blue transition-colors duration-200" />
                  </a>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {(mobileMenuOpen || mobileMenuClosing) && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
              mobileMenuClosing ? 'bg-opacity-0' : 'bg-opacity-50'
            }`}
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu */}
          <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 transition-transform duration-300 ease-out ${
            mobileMenuClosing ? 'translate-x-full' : 'translate-x-0' }`}>
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-comfortaa font-semibold text-yp-dark">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMobileMenu}
                  className="p-1 hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Advertise */}
                <div className="space-y-3">
                  <h3 className="text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide">
                    Business Services
                  </h3>
                  <Button variant="ghost" className="w-full justify-start font-roboto h-12">
                    <Building className="w-5 h-5 mr-3" />
                    {t('navigation.advertise')}
                  </Button>
                </div>

                {/* Write Review */}
                <div className="space-y-3">
                  <h3 className="text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide">
                    User Actions
                  </h3>
                  <Link to="/writeareview" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start font-roboto h-12">
                      <Crown className="w-5 h-5 mr-3" />
                      {t('navigation.writeReview')}
                    </Button>
                  </Link>
                </div>

                {/* Admin Access */}
                <div className="space-y-3">
                  <h3 className="text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide">
                    Administration
                  </h3>
                  <Link to="/admin" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full justify-start font-roboto h-12">
                      <Shield className="w-5 h-5 mr-3" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>

                {/* Countries Section */}
                <div className="space-y-3">
                  <button
                    onClick={toggleCountriesExpanded}
                    className="w-full flex items-center justify-between text-left text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide hover:text-yp-blue transition-colors duration-200"
                  >
                    <span>{t('navigation.searchByCountry')}</span>
                    <ChevronRight 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        countriesExpanded ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    countriesExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yp-blue mx-auto"></div>
                        <p className="text-xs text-gray-500 mt-1">{t('common.loading')}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 pl-4 max-h-[600px] overflow-y-auto">
                        {countries.map((country) => (
                          <Button
                            key={country.id}
                            variant="ghost"
                            className={`w-full justify-start font-roboto h-10 text-sm transition-all duration-200 ${
                              selectedCountry === formatCountryDisplay(country) 
                                ? "bg-yp-blue text-white shadow-md" 
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                            onClick={() => handleCountrySelect(country)}
                          >
                            <div className="flex items-center space-x-3">
                              <MapPin className="w-4 h-4" />
                              <span>{formatCountryDisplay(country)}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Apps */}
                <div className="space-y-3">
                  <h3 className="text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide">
                    Other Apps
                  </h3>
                  <a 
                    href="https://afri-nexus-listings-xw16.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={closeMobileMenu}
                    className="block"
                  >
                    <Button variant="ghost" className="w-full justify-start font-roboto h-12">
                      <Pocket className="w-5 h-5 mr-3" />
                      Rwandaful Services
                    </Button>
                  </a>
                </div>

                {/* Language Selector */}
                <div className="space-y-3">
                  <h3 className="text-sm font-comfortaa font-semibold text-gray-900 uppercase tracking-wide">
                    Language
                  </h3>
                  <div className="pl-4">
                    <LanguageSelector />
                  </div>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 font-roboto text-center">
                  Bara App - Connect with Local Businesses
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};