import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { UserLogService } from '@/lib/userLogService';
import { ClerkSupabaseBridge } from '@/lib/clerkSupabaseBridge';

export const useAuthLogging = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (!isLoaded || isLogged) return;

    if (isSignedIn && user) {
      const logAuthEvent = async () => {
        try {
          const userEmail = user.primaryEmailAddress?.emailAddress || '';
          
          // Log the authentication event
          const logSuccess = await UserLogService.logAuthEvent(
            user.id, 
            userEmail, 
            'sign_in'
          );

          if (logSuccess) {
            console.log('Successfully logged authentication event');
            setIsLogged(true);
          } else {
            console.warn('Failed to log authentication event');
          }

          // Check if user should be added to admin_users table
          // This allows first-time users to potentially become admins
          const adminStatus = await ClerkSupabaseBridge.checkAdminStatus(user.id, userEmail);
          
          if (!adminStatus.isAdmin) {
            // For now, let's not auto-create admin users
            // You can uncomment this if you want to auto-create admin users
            /*
            const clerkUser = {
              id: user.id,
              email: userEmail,
              firstName: user.firstName,
              lastName: user.lastName
            };
            
            await ClerkSupabaseBridge.upsertAdminUser(clerkUser, 'admin', ['read', 'write']);
            */
          } else {
            // Update last login for existing admin users
            await ClerkSupabaseBridge.updateLastLogin(user.id);
          }

        } catch (error) {
          console.error('Error in auth logging:', error);
        }
      };

      logAuthEvent();
    }
  }, [isLoaded, isSignedIn, user, isLogged]);

  return { isSignedIn, user, isLoaded };
};
