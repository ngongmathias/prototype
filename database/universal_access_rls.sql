-- UNIVERSAL ACCESS RLS POLICIES FOR BARA APP
-- This file creates RLS policies that allow EVERYONE (including unauthenticated users)
-- to have full CRUD operations on ALL tables
-- PERFECT FOR DEVELOPMENT AND TESTING

-- =============================================
-- STEP 1: ENABLE RLS ON ALL TABLES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 2: DROP ALL EXISTING POLICIES
-- =============================================

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view cities" ON public.cities;
DROP POLICY IF EXISTS "Only admins can modify cities" ON public.cities;
DROP POLICY IF EXISTS "Admin can modify cities" ON public.cities;
DROP POLICY IF EXISTS "Development bypass cities" ON public.cities;
DROP POLICY IF EXISTS "Authenticated users can modify cities" ON public.cities;
DROP POLICY IF EXISTS "Admins can modify cities" ON public.cities;

DROP POLICY IF EXISTS "Anyone can view countries" ON public.countries;
DROP POLICY IF EXISTS "Only admins can modify countries" ON public.countries;
DROP POLICY IF EXISTS "Admin can modify countries" ON public.countries;
DROP POLICY IF EXISTS "Development bypass countries" ON public.countries;
DROP POLICY IF EXISTS "Authenticated users can modify countries" ON public.countries;
DROP POLICY IF EXISTS "Admins can modify countries" ON public.countries;

DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Only admins can modify categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can modify categories" ON public.categories;
DROP POLICY IF EXISTS "Development bypass categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can modify categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can modify categories" ON public.categories;

DROP POLICY IF EXISTS "Anyone can view all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Business owners can view own businesses" ON public.businesses;
DROP POLICY IF EXISTS "Business owners can insert own businesses" ON public.businesses;
DROP POLICY IF EXISTS "Business owners can update own businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can modify all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admin can modify all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Development bypass businesses" ON public.businesses;
DROP POLICY IF EXISTS "Authenticated users can modify businesses" ON public.businesses;

DROP POLICY IF EXISTS "Anyone can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can view own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own pending reviews" ON public.reviews;
DROP POLICY IF EXISTS "Business owners can view business reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can modify all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin can modify all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Development bypass reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can modify reviews" ON public.reviews;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can modify all users" ON public.users;
DROP POLICY IF EXISTS "Development bypass users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can modify users" ON public.users;
DROP POLICY IF EXISTS "Admins can modify all users" ON public.users;

DROP POLICY IF EXISTS "Admin users can view own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can update own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can insert own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can view all admin profiles" ON public.admin_users;
DROP POLICY IF EXISTS "Development bypass admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can delete own profile" ON public.admin_users;

DROP POLICY IF EXISTS "Admin users can view all user logs" ON public.user_logs;
DROP POLICY IF EXISTS "Admin users can insert user logs" ON public.user_logs;
DROP POLICY IF EXISTS "Development bypass user_logs" ON public.user_logs;
DROP POLICY IF EXISTS "Authenticated users can view all user logs" ON public.user_logs;
DROP POLICY IF EXISTS "Authenticated users can insert user logs" ON public.user_logs;
DROP POLICY IF EXISTS "Users can view own logs" ON public.user_logs;
DROP POLICY IF EXISTS "Users can insert own logs" ON public.user_logs;
DROP POLICY IF EXISTS "Admins can view all user logs" ON public.user_logs;
DROP POLICY IF EXISTS "Admins can modify all user logs" ON public.user_logs;

-- Drop policies for other tables
DROP POLICY IF EXISTS "Anyone can view all events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can modify events" ON public.events;
DROP POLICY IF EXISTS "Admins can modify events" ON public.events;

DROP POLICY IF EXISTS "Anyone can view all products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can modify products" ON public.products;
DROP POLICY IF EXISTS "Admins can modify products" ON public.products;

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can modify payments" ON public.payments;
DROP POLICY IF EXISTS "Business owners can view business payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can modify all payments" ON public.payments;

DROP POLICY IF EXISTS "Anyone can view premium features" ON public.premium_features;
DROP POLICY IF EXISTS "Authenticated users can modify premium features" ON public.premium_features;
DROP POLICY IF EXISTS "Admins can modify premium features" ON public.premium_features;

DROP POLICY IF EXISTS "Anyone can view all questions" ON public.questions;
DROP POLICY IF EXISTS "Authenticated users can modify questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can modify questions" ON public.questions;

DROP POLICY IF EXISTS "Anyone can view all ad campaigns" ON public.ad_campaigns;
DROP POLICY IF EXISTS "Authenticated users can modify ad campaigns" ON public.ad_campaigns;
DROP POLICY IF EXISTS "Admins can modify ad campaigns" ON public.ad_campaigns;

-- =============================================
-- STEP 3: CREATE UNIVERSAL ACCESS POLICIES
-- =============================================

-- =============================================
-- CITIES TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to cities" ON public.cities
    FOR ALL USING (true);

-- =============================================
-- COUNTRIES TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to countries" ON public.countries
    FOR ALL USING (true);

-- =============================================
-- CATEGORIES TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to categories" ON public.categories
    FOR ALL USING (true);

-- =============================================
-- BUSINESSES TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to businesses" ON public.businesses
    FOR ALL USING (true);

-- =============================================
-- REVIEWS TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to reviews" ON public.reviews
    FOR ALL USING (true);

-- =============================================
-- USERS TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to users" ON public.users
    FOR ALL USING (true);

-- =============================================
-- ADMIN_USERS TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to admin_users" ON public.admin_users
    FOR ALL USING (true);

-- =============================================
-- USER_LOGS TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to user_logs" ON public.user_logs
    FOR ALL USING (true);

-- =============================================
-- EVENTS TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to events" ON public.events
    FOR ALL USING (true);

-- =============================================
-- PRODUCTS TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to products" ON public.products
    FOR ALL USING (true);

-- =============================================
-- PAYMENTS TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to payments" ON public.payments
    FOR ALL USING (true);

-- =============================================
-- PREMIUM_FEATURES TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to premium_features" ON public.premium_features
    FOR ALL USING (true);

-- =============================================
-- QUESTIONS TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to questions" ON public.questions
    FOR ALL USING (true);

-- =============================================
-- AD_CAMPAIGNS TABLE - UNIVERSAL ACCESS
-- =============================================

CREATE POLICY "Universal access to ad_campaigns" ON public.ad_campaigns
    FOR ALL USING (true);

-- =============================================
-- STEP 4: VERIFICATION QUERIES
-- =============================================

-- Check if RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check if policies are created successfully
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- =============================================
-- STEP 5: SUMMARY OF PERMISSIONS
-- =============================================

/*
PERMISSION SUMMARY:

EVERYONE (including unauthenticated users):
- Can do everything (INSERT, UPDATE, DELETE, SELECT) on ALL tables
- No restrictions whatsoever
- Perfect for development and testing

This setup allows:
✅ Anyone to create, read, update, delete any data
✅ No authentication required
✅ No admin checks
✅ Full CRUD operations on all tables
✅ Perfect for development and testing

WARNING: This is NOT secure for production!
Use this only for development and testing purposes.
For production, use the production_rls_policies.sql file instead.
*/
