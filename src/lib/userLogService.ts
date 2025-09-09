import { supabase } from './supabase';

export interface UserLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  permissions: string[];
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  country?: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

export interface ClerkUser {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
    verification: {
      status: string;
    };
  }>;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  created_at: number;
  last_sign_in_at?: number;
  public_metadata?: any;
  private_metadata?: any;
}

export interface PaginatedUsers {
  users: (DatabaseUser | AdminUser)[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedUserLogs {
  users: UserLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class UserLogService {
  /**
   * Log a user action to the database
   */
  static async logAction(logData: UserLog): Promise<boolean> {
    try {
      console.log('Attempting to log user action:', logData);
      
      const { data, error } = await supabase
        .from('user_logs')
        .insert({
          user_id: logData.user_id,
          user_email: logData.user_email,
          action: logData.action,
          resource_type: logData.resource_type,
          resource_id: logData.resource_id,
          details: logData.details,
          ip_address: logData.ip_address,
          user_agent: logData.user_agent || navigator.userAgent,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to log user action:', error);
        
        // Handle specific error codes
        if (error.code === '42501') {
          console.error('RLS Policy Violation: The user_logs table has restrictive RLS policies');
          console.error('This usually means the RLS policies need to be updated to allow authenticated users');
        } else if (error.code === '401') {
          console.error('Unauthorized: The user is not properly authenticated');
        } else if (error.code === '406') {
          console.error('Not Acceptable: There might be a content negotiation issue');
        }
        
        return false;
      }

      console.log('Successfully logged user action:', data);
      return true;
    } catch (error) {
      console.error('Error logging user action:', error);
      return false;
    }
  }

  /**
   * Log user authentication events
   */
  static async logAuthEvent(userId: string, userEmail: string, action: 'sign_in' | 'sign_up' | 'sign_out'): Promise<boolean> {
    return await this.logAction({
      user_id: userId,
      user_email: userEmail,
      action: action,
      resource_type: 'authentication',
      details: {
        timestamp: new Date().toISOString(),
        event: action,
        platform: 'web',
        source: 'clerk'
      }
    });
  }

  /**
   * Log admin actions
   */
  static async logAdminAction(userId: string, userEmail: string, action: string, resourceType: string, resourceId?: string, details?: any): Promise<boolean> {
    return await this.logAction({
      user_id: userId,
      user_email: userEmail,
      action: action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
        admin_action: true,
        source: 'clerk'
      }
    });
  }

  /**
   * Get user logs for a specific user
   */
  static async getUserLogs(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch user logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user logs:', error);
      return [];
    }
  }

  /**
   * Get all admin logs (for admin users)
   */
  static async getAdminLogs(limit: number = 100): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch admin logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      return [];
    }
  }

  /**
   * Get recent activity logs
   */
  static async getRecentLogs(limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch recent logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent logs:', error);
      return [];
    }
  }

  /**
   * Get all admin users with pagination
   */
  static async getAdminUsers(page: number = 1, pageSize: number = 15, searchTerm?: string): Promise<PaginatedUsers> {
    try {
      let query = supabase
        .from('admin_users')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) {
        console.error('Failed to fetch admin users:', error);
        return { users: [], total: 0, page, pageSize, totalPages: 0 };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        users: data || [],
        total,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return { users: [], total: 0, page, pageSize, totalPages: 0 };
    }
  }

  /**
   * Get all database users with pagination
   */
  static async getDatabaseUsers(page: number = 1, pageSize: number = 15, searchTerm?: string): Promise<PaginatedUsers> {
    try {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) {
        console.error('Failed to fetch database users:', error);
        return { users: [], total: 0, page, pageSize, totalPages: 0 };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        users: data || [],
        total,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching database users:', error);
      return { users: [], total: 0, page, pageSize, totalPages: 0 };
    }
  }

  /**
   * Get all users from Clerk (requires backend API)
   * This would typically be called from a backend endpoint
   */
  static async getClerkUsers(page: number = 1, pageSize: number = 15, searchTerm?: string): Promise<PaginatedUsers> {
    try {
      // For now, we'll return empty data since we need a backend API
      // In a real implementation, this would call your backend endpoint
      console.warn('getClerkUsers requires a backend API endpoint to be implemented');
      
      return {
        users: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0
      };
    } catch (error) {
      console.error('Error fetching Clerk users:', error);
      return { users: [], total: 0, page, pageSize, totalPages: 0 };
    }
  }

  /**
   * Get combined users from both database and admin tables
   */
  static async getCombinedUsers(page: number = 1, pageSize: number = 15, searchTerm?: string): Promise<PaginatedUsers> {
    try {
      // Get users from both sources
      const [dbUsers, adminUsers] = await Promise.all([
        this.getDatabaseUsers(page, pageSize, searchTerm),
        this.getAdminUsers(page, pageSize, searchTerm)
      ]);

      // Combine and deduplicate users
      const allUsers = [...dbUsers.users, ...adminUsers.users];
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u.email === user.email)
      );

      // Sort by creation date
      const sortedUsers = uniqueUsers.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Apply pagination to combined results
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

      const total = uniqueUsers.length;
      const totalPages = Math.ceil(total / pageSize);

      return {
        users: paginatedUsers,
        total,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching combined users:', error);
      return { users: [], total: 0, page, pageSize, totalPages: 0 };
    }
  }

  /**
   * Export users to CSV format
   */
  static exportUsersToCSV(users: (DatabaseUser | AdminUser)[]): string {
    const headers = ['ID', 'Email', 'Name', 'Role', 'Phone', 'Country', 'City', 'Created Date', 'Last Updated'];
    
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        `"${user.email}"`,
        `"${user.full_name || user.first_name + ' ' + (user.last_name || '') || 'N/A'}"`,
        user.role || 'N/A',
        `"${user.phone || 'N/A'}"`,
        `"${user.country || 'N/A'}"`,
        `"${user.city || 'N/A'}"`,
        new Date(user.created_at).toLocaleDateString(),
        new Date(user.updated_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Get user logs with pagination
   */
  static async getUserLogsPaginated(page: number = 1, pageSize: number = 15, searchTerm?: string): Promise<PaginatedUserLogs> {
    try {
      let query = supabase
        .from('user_logs')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`user_email.ilike.%${searchTerm}%,action.ilike.%${searchTerm}%,resource_type.ilike.%${searchTerm}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) {
        console.error('Failed to fetch user logs:', error);
        return { users: [], total: 0, page, pageSize, totalPages: 0 };
      }

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        users: data || [],
        total,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching user logs:', error);
      return { users: [], total: 0, page, pageSize, totalPages: 0 };
    }
  }
}
