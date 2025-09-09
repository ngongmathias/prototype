-- BARA APP RLS POLICIES
-- Row Level Security Policies for Supabase

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- COUNTRIES TABLE POLICIES
-- =============================================

-- Allow everyone to read countries (public data)
CREATE POLICY "Anyone can view countries" ON public.countries
    FOR SELECT USING (true);

-- Only admins can modify countries
CREATE POLICY "Only admins can modify countries" ON public.countries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =============================================
-- CITIES TABLE POLICIES
-- =============================================

-- Allow everyone to read cities (public data)
CREATE POLICY "Anyone can view cities" ON public.cities
    FOR SELECT USING (true);

-- Only admins can modify cities
CREATE POLICY "Only admins can modify cities" ON public.cities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =============================================
-- CATEGORIES TABLE POLICIES
-- =============================================

-- Allow everyone to read categories (public data)
CREATE POLICY "Anyone can view categories" ON public.categories
    FOR SELECT USING (true);

-- Only admins can modify categories
CREATE POLICY "Only admins can modify categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =============================================
-- BUSINESSES TABLE POLICIES
-- =============================================

-- Allow everyone to read ALL businesses (public data)
CREATE POLICY "Anyone can view all businesses" ON public.businesses
    FOR SELECT USING (true);

-- Business owners can view their own businesses (including pending/suspended)
CREATE POLICY "Business owners can view own businesses" ON public.businesses
    FOR SELECT USING (owner_id = auth.uid());

-- Business owners can insert their own businesses
CREATE POLICY "Business owners can insert own businesses" ON public.businesses
    FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Business owners can update their own businesses
CREATE POLICY "Business owners can update own businesses" ON public.businesses
    FOR UPDATE USING (owner_id = auth.uid());

-- Admins can view all businesses
CREATE POLICY "Admins can view all businesses" ON public.businesses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admins can modify all businesses
CREATE POLICY "Admins can modify all businesses" ON public.businesses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =============================================
-- REVIEWS TABLE POLICIES
-- =============================================

-- Allow everyone to read ALL reviews (public data)
CREATE POLICY "Anyone can view all reviews" ON public.reviews
    FOR SELECT USING (true);

-- Users can view their own reviews (including pending/rejected)
CREATE POLICY "Users can view own reviews" ON public.reviews
    FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews" ON public.reviews
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own reviews (if pending)
CREATE POLICY "Users can update own pending reviews" ON public.reviews
    FOR UPDATE USING (user_id = auth.uid() AND status = 'pending');

-- Business owners can view reviews for their businesses
CREATE POLICY "Business owners can view business reviews" ON public.reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = reviews.business_id 
            AND businesses.owner_id = auth.uid()
        )
    );

-- Admins can view all reviews
CREATE POLICY "Admins can view all reviews" ON public.reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admins can modify all reviews
CREATE POLICY "Admins can modify all reviews" ON public.reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =============================================
-- PREMIUM FEATURES TABLE POLICIES
-- =============================================

-- Allow everyone to read premium features (public data)
CREATE POLICY "Anyone can view premium features" ON public.premium_features
    FOR SELECT USING (true);

-- Business owners can view their own premium features
CREATE POLICY "Business owners can view own premium features" ON public.premium_features
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = premium_features.business_id 
            AND businesses.owner_id = auth.uid()
        )
    );

-- Business owners can insert premium features for their businesses
CREATE POLICY "Business owners can insert own premium features" ON public.premium_features
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = premium_features.business_id 
            AND businesses.owner_id = auth.uid()
        )
    );

-- Admins can view all premium features
CREATE POLICY "Admins can view all premium features" ON public.premium_features
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admins can modify all premium features
CREATE POLICY "Admins can modify all premium features" ON public.premium_features
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =============================================
-- PAYMENTS TABLE POLICIES
-- =============================================

-- Users can view their own payments
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (user_id = auth.uid());

-- Users can insert their own payments
CREATE POLICY "Users can insert own payments" ON public.payments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Business owners can view payments for their businesses
CREATE POLICY "Business owners can view business payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = payments.business_id 
            AND businesses.owner_id = auth.uid()
        )
    );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admins can modify all payments
CREATE POLICY "Admins can modify all payments" ON public.payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =============================================
-- EVENTS TABLE POLICIES
-- =============================================

-- Allow everyone to read ALL events (public data)
CREATE POLICY "Anyone can view all events" ON public.events
    FOR SELECT USING (true);

-- Event organizers can view their own events
CREATE POLICY "Organizers can view own events" ON public.events
    FOR SELECT USING (organizer_id = auth.uid());

-- Users can insert their own events
CREATE POLICY "Users can insert own events" ON public.events
    FOR INSERT WITH CHECK (organizer_id = auth.uid());

-- Event organizers can update their own events
CREATE POLICY "Organizers can update own events" ON public.events
    FOR UPDATE USING (organizer_id = auth.uid());

-- Admins can view all events
CREATE POLICY "Admins can view all events" ON public.events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admins can modify all events
CREATE POLICY "Admins can modify all events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =============================================
-- PRODUCTS TABLE POLICIES
-- =============================================

-- Allow everyone to read ALL products (public data)
CREATE POLICY "Anyone can view all products" ON public.products
    FOR SELECT USING (true);

-- Sellers can view their own products
CREATE POLICY "Sellers can view own products" ON public.products
    FOR SELECT USING (seller_id = auth.uid());

-- Users can insert their own products
CREATE POLICY "Users can insert own products" ON public.products
    FOR INSERT WITH CHECK (seller_id = auth.uid());

-- Sellers can update their own products
CREATE POLICY "Sellers can update own products" ON public.products
    FOR UPDATE USING (seller_id = auth.uid());

-- Business owners can view products for their businesses
CREATE POLICY "Business owners can view business products" ON public.products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = products.business_id 
            AND businesses.owner_id = auth.uid()
        )
    );

-- Admins can view all products
CREATE POLICY "Admins can view all products" ON public.products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Admins can modify all products
CREATE POLICY "Admins can modify all products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =============================================
-- FUNCTIONS FOR AUTOMATIC USER PROFILE CREATION
-- =============================================

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- FUNCTIONS FOR BUSINESS ANALYTICS
-- =============================================

-- Function to increment business view count
CREATE OR REPLACE FUNCTION public.increment_business_view(business_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.businesses 
    SET view_count = view_count + 1 
    WHERE id = business_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment business click count
CREATE OR REPLACE FUNCTION public.increment_business_click(business_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.businesses 
    SET click_count = click_count + 1 
    WHERE id = business_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 