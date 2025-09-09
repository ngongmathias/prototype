# Supabase Setup Guide for Bara App

## 🚀 Quick Start

### 1. **Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready (usually 2-3 minutes)

### 2. **Set Environment Variables**
Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**To find these values:**
- Go to your Supabase project dashboard
- Click on "Settings" → "API"
- Copy the "Project URL" and "anon public" key

### 3. **Run Database Schema**
1. Go to your Supabase project dashboard
2. Click on "SQL Editor"
3. Run the following files in order:

```sql
-- First, run the schema
\i database/schema.sql

-- Then, run the seed data
\i database/enhanced-sample-data.sql

-- Finally, ensure all categories are present
\i database/ensure-all-categories.sql
```

### 4. **Verify Setup**
After running the SQL files, you should see:
- **10+ countries** in the `countries` table
- **30+ cities** in the `cities` table  
- **20+ categories** in the `categories` table
- **40+ businesses** in the `businesses` table

## 🔧 Database Schema Overview

### **Core Tables:**
- `countries` - Country information and metadata
- `cities` - City data with coordinates
- `categories` - Business categories (Restaurants, Hotels, etc.)
- `businesses` - Business listings and details
- `reviews` - User reviews and ratings
- `users` - User profiles and authentication

### **Key Features:**
- **Row Level Security (RLS)** enabled on all tables
- **Full-text search** capabilities
- **Geolocation support** for mapping
- **Real-time subscriptions** ready
- **TypeScript types** included

## 🧪 Testing the Setup

### **1. Test Category Loading**
- Start your development server: `npm run dev`
- Navigate to the homepage
- You should see all business categories displayed
- Click on any category to see businesses

### **2. Test Business Listings**
- Click on a category (e.g., "Restaurants")
- You should see real businesses loaded from Supabase
- Each business should show:
  - Name, description, contact info
  - Rating and reviews (if any)
  - Premium/Verified badges
  - Contact information

### **3. Test Business Details**
- Click "More Info" on any business
- You should see a detailed business page
- All business information should be populated from the database

## 🐛 Troubleshooting

### **Categories Not Loading:**
```sql
-- Check if categories exist
SELECT * FROM public.categories WHERE is_active = true;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'categories';
```

### **Businesses Not Loading:**
```sql
-- Check if businesses exist
SELECT * FROM public.businesses WHERE status = 'active';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'businesses';
```

### **Common Issues:**

1. **"Missing Supabase environment variables"**
   - Make sure `.env.local` exists and has correct values
   - Restart your development server after adding environment variables

2. **"Error fetching categories"**
   - Check your Supabase project is active
   - Verify your API keys are correct
   - Check browser console for detailed error messages

3. **"No businesses found"**
   - Ensure you've run the seed data SQL files
   - Check that businesses have `status = 'active'`
   - Verify RLS policies allow public read access

## 📱 Features Implemented

### **✅ Real-time Business Fetching:**
- All businesses loaded from Supabase database
- Category-based filtering
- Search functionality
- Premium/Verified business highlighting

### **✅ Responsive UI:**
- Loading states with skeletons
- Error handling with retry options
- Mobile-friendly design
- Smooth animations and transitions

### **✅ Business Management:**
- Business details with full information
- Contact information display
- Business hours and services
- Review system integration

### **✅ Navigation:**
- Category-based routing
- Business detail pages
- Breadcrumb navigation
- Back button functionality

## 🚀 Next Steps

### **Immediate Actions:**
1. ✅ Set up Supabase project
2. ✅ Configure environment variables
3. ✅ Run database schema and seed data
4. ✅ Test category and business loading

### **Future Enhancements:**
- [ ] Add real-time business updates
- [ ] Implement business search with filters
- [ ] Add business image uploads
- [ ] Implement review system
- [ ] Add business owner dashboard
- [ ] Implement premium features

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Supabase project is active
3. Ensure all SQL files have been run successfully
4. Check that environment variables are correctly set

The app should now be fully functional with real business data from your Supabase database!
