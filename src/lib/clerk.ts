import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

// Clerk configuration
export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
  appearance: {
    baseTheme: dark,
    variables: {
      colorPrimary: '#3B82F6', // Blue color matching your theme
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorInputBackground: '#f9fafb',
      colorInputText: '#1f2937',
    },
    elements: {
      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
      card: 'shadow-lg border border-gray-200',
      headerTitle: 'text-xl font-semibold text-gray-900',
      headerSubtitle: 'text-sm text-gray-600',
    }
  }
};

// Clerk components for easy import
export { ClerkProvider, ClerkLoaded, ClerkLoading };
export { useUser, useAuth, useClerk } from '@clerk/clerk-react';
