import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthLogging } from "@/hooks/useAuthLogging";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ListingsPage } from "./pages/ListingsPage";
import { WriteReviewPage } from "./pages/WriteReviewPage";
import { ClaimListingPage } from "./pages/ClaimListingPage";
import  AdvertisePage from "./pages/AdvertisePage";
import  ContactUsPage from "./pages/ContactUsPage";
import AboutUsPage from "./pages/AboutUsPage";
import { BusinessDetailPage } from "./pages/BusinessDetailPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { CityDetailPage } from "./pages/CityDetailPage";
import { CountryDetailPage } from "./pages/CountryDetailPage";
import { AskQuestionPage } from "./pages/AskQuestionPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCities } from "./pages/admin/AdminCities";
import { AdminCountries } from "./pages/admin/AdminCountries";
import { AdminBusinesses } from "./pages/admin/AdminBusinesses";
import { AdminReviews } from "./pages/admin/AdminReviews";
import { AdminSponsoredAds } from "./pages/admin/AdminSponsoredAds";
import { AdminReports } from "./pages/admin/AdminReports";
import { AdminCategories } from "./pages/admin/AdminCategories";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminSettings } from "./pages/admin/AdminSettings";
import ContactMessagesPage from "./pages/admin/ContactMessagesPage";
import { AdminAuthGuard } from "./components/admin/AdminAuthGuard";
import { MapTestPage } from "./pages/MapTestPage";
// import { SimpleMapTest } from "./pages/SimpleMapTest";
import { UltraSimpleMap } from "./components/UltraSimpleMap";

const queryClient = new QueryClient();

const AppRoutes = () => {
  // Use the auth logging hook to track all authentication events
  useAuthLogging();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/writeareview" element={<WriteReviewPage />} />
      <Route path="/write-review/:businessId" element={<WriteReviewPage />} />
      <Route path="/claim-listing" element={<ClaimListingPage />} />
      <Route path="/advertise" element={<AdvertisePage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/ask-question" element={<AskQuestionPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/category/:categorySlug" element={<ListingsPage />} />
      <Route path="/:city/search" element={<ListingsPage />} />
      <Route path="/:city/:category" element={<ListingsPage />} />
      <Route path="/:city/:category/:businessId" element={<BusinessDetailPage />} />
      <Route path="/cities/:citySlug" element={<CityDetailPage />} />
      <Route path="/countries/:countrySlug" element={<CountryDetailPage />} />
      
      {/* Authentication Routes */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      
      {/* <Route path="/googlemaps" element={<GoogleMapsTest />} /> */}
      <Route path="/map-test" element={<MapTestPage />} />
      {/* <Route path="/simple-map-test" element={<SimpleMapTest />} /> */}
    {/* <Route path="/callback-map-test" element={
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Callback Map Test</h1>
        <CityMapLeafletCallback
          cityName="Cairo"
          latitude={30.0444}
          longitude={31.2357}
          businesses={[
            {
              id: 'test-1',
              name: 'Test Restaurant',
              description: 'A test restaurant',
              phone: '+1234567890',
              website: 'https://example.com',
              address: '123 Test St',
              latitude: 30.0444 + 0.001,
              longitude: 31.2357 + 0.001,
              category: { name: 'Restaurant', slug: 'restaurant' },
              reviews: []
            }
          ]}
          height="500px"
        />
      </div>
    } /> */}
    <Route path="/ultra-simple-map" element={
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Ultra Simple Map Test</h1>
        <UltraSimpleMap 
          cityName="Cairo"
          latitude={30.0444}
          longitude={31.2357}
        />
      </div>
    } />
      
      {/* Admin Routes - Protected by AdminAuthGuard */}
      <Route path="/admin" element={
        <AdminAuthGuard>
          <AdminDashboard />
        </AdminAuthGuard>
      } />
      <Route path="/admin/cities" element={
        <AdminAuthGuard>
          <AdminCities />
        </AdminAuthGuard>
      } />
      <Route path="/admin/countries" element={
        <AdminAuthGuard>
          <AdminCountries />
        </AdminAuthGuard>
      } />
      <Route path="/admin/businesses" element={
        <AdminAuthGuard>
          <AdminBusinesses />
        </AdminAuthGuard>
      } />
      <Route path="/admin/sponsored-ads" element={
        <AdminAuthGuard>
          <AdminSponsoredAds />
        </AdminAuthGuard>
      } />
      <Route path="/admin/categories" element={
        <AdminAuthGuard>
          <AdminCategories />
        </AdminAuthGuard>
      } />
      <Route path="/admin/reports" element={
        <AdminAuthGuard>
          <AdminReports />
        </AdminAuthGuard>
      } />
      <Route path="/admin/reviews" element={
        <AdminAuthGuard>
          <AdminReviews />
        </AdminAuthGuard>
      } />
      <Route path="/admin/users" element={
        <AdminAuthGuard>
          <AdminUsers />
        </AdminAuthGuard>
      } />
      <Route path="/admin/settings" element={
        <AdminAuthGuard>
          <AdminSettings />
        </AdminAuthGuard>
      } />
      <Route path="/admin/contact-messages" element={
        <AdminAuthGuard>
          <ContactMessagesPage />
        </AdminAuthGuard>
      } />
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
