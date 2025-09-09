# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for the admin panel in your Bara application.

## 🔐 **Prerequisites**

1. **Clerk Account**: Sign up at [clerk.com](https://clerk.com)
2. **Supabase Project**: Your existing Supabase project
3. **Node.js**: Version 16 or higher

## 📦 **Installation**

### 1. Install Clerk Dependencies

```bash
npm install @clerk/clerk-react
```

### 2. Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# Existing Supabase variables
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 🚀 **Clerk Dashboard Setup**

### 1. Create a New Application

1. Go to [clerk.com](https://clerk.com) and sign in
2. Click "Add application"
3. Choose "Single Page Application"
4. Select "React" as your framework
5. Name your application (e.g., "Bara Admin Panel")

### 2. Configure Authentication

1. **Sign-in Methods**: Enable Email/Password authentication
2. **User Management**: Enable user registration and management
3. **Appearance**: Customize the sign-in page to match your brand

### 3. Get Your Keys

1. Go to "API Keys" in your Clerk dashboard
2. Copy the "Publishable Key" (starts with `pk_test_` or `pk_live_`)
3. Add it to your `.env.local` file

## 🗄️ **Database Setup**

### 1. Run the User Logging Schema

Execute the SQL script to create the necessary tables:

```bash
# Connect to your Supabase database and run:
psql -h your_supabase_host -U your_username -d your_database -f database/user-logging-schema.sql
```

Or use the Supabase SQL editor to run the contents of `database/user-logging-schema.sql`.

### 2. Verify Tables Created

The script will create:
- `user_logs` - Tracks all user activities
- `admin_users` - Manages admin access permissions

## 🔧 **Configuration**

### 1. Clerk Configuration

The Clerk configuration is already set up in `src/lib/clerk.ts` with:
- Dark theme by default
- Blue color scheme matching your app
- Custom styling for forms and cards

### 2. Admin Authentication

The `AdminAuthGuard` component will:
- Check if users are signed in with Clerk
- Verify admin permissions in your database
- Log all admin actions
- Redirect unauthorized users

## 👥 **Admin User Management**

### 1. First Admin User

After running the database schema, you'll have a default admin user:
- Email: `admin@example.com`
- Role: `super_admin`
- Permissions: `['read', 'write', 'delete', 'admin']`

### 2. Adding New Admins

1. Sign up with Clerk using the email you want to make admin
2. Add the user to the `admin_users` table in Supabase
3. Set appropriate role and permissions

### 3. Admin Roles

- **admin**: Basic admin access
- **super_admin**: Full access including user management

## 🚀 **Testing the Setup**

### 1. Start Your Application

```bash
npm run dev
```

### 2. Test Admin Access

1. Navigate to `/admin` in your browser
2. You should see the Clerk sign-in page
3. Sign in with an admin account
4. You should be redirected to the admin dashboard

### 3. Check User Logs

1. Go to `/admin/users` in the admin panel
2. View the "Activity Logs" tab
3. You should see your login activity logged

## 🔍 **Troubleshooting**

### Common Issues

1. **"Clerk not configured" error**
   - Check your `.env.local` file has the correct Clerk key
   - Restart your development server

2. **Admin access denied**
   - Verify the user exists in the `admin_users` table
   - Check the user's role and permissions

3. **Database connection errors**
   - Ensure your Supabase credentials are correct
   - Verify the `user_logs` and `admin_users` tables exist

### Debug Mode

Enable debug logging by adding to your `.env.local`:

```env
VITE_CLERK_DEBUG=true
```

## 📱 **Features**

### What's Included

✅ **Clerk Authentication**: Secure sign-in/sign-up
✅ **Admin Role Management**: Role-based access control
✅ **User Activity Logging**: Track all admin actions
✅ **Responsive Design**: Works on mobile and desktop
✅ **Internationalization**: Multi-language support
✅ **Real-time Updates**: Live data from Supabase

### Admin Panel Sections

- **Dashboard**: Overview and analytics
- **Businesses**: Manage business listings
- **Cities**: Manage city information
- **Countries**: Manage country data
- **Reviews**: Moderate user reviews
- **Sponsored Ads**: Manage advertising campaigns
- **Users**: Admin user management
- **Activity Logs**: View user activity history
- **Settings**: System configuration

## 🔒 **Security Features**

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based auth
- **Permission-based Access**: Granular permission system
- **Activity Logging**: Audit trail for all actions
- **Session Management**: Secure session handling

## 📞 **Support**

If you encounter issues:

1. Check the Clerk documentation: [docs.clerk.com](https://docs.clerk.com)
2. Review the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
3. Check the browser console for error messages
4. Verify all environment variables are set correctly

---

**🎉 Congratulations!** Your admin panel now has secure authentication with Clerk and comprehensive user activity logging with Supabase.
