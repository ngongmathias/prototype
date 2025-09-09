import { supabase } from './supabase';
import { UserLogService } from './userLogService';

export interface ClerkUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export class ClerkSupabaseBridge {
  /**
   * Check if a Clerk user has admin privileges
   * Now automatically grants admin access to all authenticated users
   */
  static async checkAdminStatus(clerkUserId: string, userEmail: string): Promise<{
    isAdmin: boolean;
    role?: string;
    permissions?: string[];
    adminUser?: any;
  }> {
    try {
      console.log('Checking admin status for Clerk user:', clerkUserId);
      
      // First, try to get existing admin user
      let adminUser = await this.getAdminUser(clerkUserId);
      
      if (!adminUser) {
        // User doesn't exist in admin_users table, create them automatically
        console.log('User not found in admin_users table, creating admin user automatically...');
        
        const clerkUser: ClerkUser = {
          id: clerkUserId,
          email: userEmail,
          firstName: userEmail.split('@')[0], // Use email prefix as first name
          lastName: ''
        };
        
        const created = await this.upsertAdminUser(clerkUser, 'super_admin', ['read', 'write', 'delete', 'admin']);
        
        if (created) {
          // Get the newly created admin user
          adminUser = await this.getAdminUser(clerkUserId);
          console.log('Successfully created admin user:', adminUser);
        } else {
          console.error('Failed to create admin user');
          return { isAdmin: false };
        }
      }

      if (!adminUser) {
        console.log('Still no admin user data after creation attempt');
        return { isAdmin: false };
      }

      console.log('Admin user found/created:', adminUser);

      // Log the admin check
      await UserLogService.logAdminAction(
        clerkUserId,
        userEmail,
        'admin_status_check',
        'admin_verification',
        undefined,
        { role: adminUser.role, permissions: adminUser.permissions }
      );

      return {
        isAdmin: true,
        role: adminUser.role,
        permissions: adminUser.permissions,
        adminUser
      };
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      // Even if there's an error, grant admin access for development
      console.log('Granting admin access despite error for development purposes');
      return { 
        isAdmin: true, 
        role: 'super_admin', 
        permissions: ['read', 'write', 'delete', 'admin'] 
      };
    }
  }

  /**
   * Create or update an admin user record
   */
  static async upsertAdminUser(clerkUser: ClerkUser, role: string = 'admin', permissions: string[] = ['read', 'write']): Promise<boolean> {
    try {
      console.log('Upserting admin user:', clerkUser);
      
      const { data, error } = await supabase
        .from('admin_users')
        .upsert({
          user_id: clerkUser.id,
          email: clerkUser.email,
          first_name: clerkUser.firstName,
          last_name: clerkUser.lastName,
          role: role,
          permissions: permissions,
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to upsert admin user:', error);
        return false;
      }

      // Log the admin user creation/update
      await UserLogService.logAdminAction(
        clerkUser.id,
        clerkUser.email,
        'admin_user_upsert',
        'admin_users',
        data.id,
        { role, permissions, action: 'upsert' }
      );

      console.log('Successfully upserted admin user:', data);
      return true;
    } catch (error) {
      console.error('Error upserting admin user:', error);
      return false;
    }
  }

  /**
   * Get admin user information
   */
  static async getAdminUser(clerkUserId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', clerkUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        console.error('Error fetching admin user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAdminUser:', error);
      return null;
    }
  }

  /**
   * Update admin user last login
   */
  static async updateLastLogin(clerkUserId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', clerkUserId);

      if (error) {
        console.error('Failed to update last login:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      return false;
    }
  }

  /**
   * Get all admin users (for super admins)
   */
  static async getAllAdminUsers(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch admin users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }
  }
}
