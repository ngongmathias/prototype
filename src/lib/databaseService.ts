import { supabase } from './supabase';

export class DatabaseService {
  /**
   * Generic method to fetch data from any table
   */
  static async fetchData<T>(
    table: string, 
    select: string = '*', 
    filters: Record<string, any> = {},
    orderBy?: { column: string; ascending?: boolean },
    limit?: number
  ): Promise<{ data: T[] | null; error: any }> {
    try {
      let query = supabase.from(table).select(select);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { 
          ascending: orderBy.ascending !== false 
        });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching data from ${table}:`, error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error(`Unexpected error fetching data from ${table}:`, error);
      return { data: null, error };
    }
  }

  /**
   * Generic method to insert data into any table
   */
  static async insertData<T>(
    table: string, 
    data: any
  ): Promise<{ data: T | null; error: any }> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error(`Error inserting data into ${table}:`, error);
        return { data: null, error };
      }

      return { data: result, error: null };
    } catch (error) {
      console.error(`Unexpected error inserting data into ${table}:`, error);
      return { data: null, error };
    }
  }

  /**
   * Generic method to update data in any table
   */
  static async updateData<T>(
    table: string, 
    filters: Record<string, any>, 
    updates: Record<string, any>
  ): Promise<{ data: T[] | null; error: any }> {
    try {
      let query = supabase.from(table).update(updates);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query.select();

      if (error) {
        console.error(`Error updating data in ${table}:`, error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error(`Unexpected error updating data in ${table}:`, error);
      return { data: null, error };
    }
  }

  /**
   * Generic method to delete data from any table
   */
  static async deleteData(
    table: string, 
    filters: Record<string, any>
  ): Promise<{ error: any }> {
    try {
      let query = supabase.from(table).delete();

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { error } = await query;

      if (error) {
        console.error(`Error deleting data from ${table}:`, error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error(`Unexpected error deleting data from ${table}:`, error);
      return { error };
    }
  }

  /**
   * Check if a table exists and has data
   */
  static async tableExists(table: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      return !error && data !== null;
    } catch (error) {
      console.error(`Error checking if table ${table} exists:`, error);
      return false;
    }
  }

  /**
   * Get table row count
   */
  static async getRowCount(table: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error(`Error getting row count for ${table}:`, error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error(`Unexpected error getting row count for ${table}:`, error);
      return 0;
    }
  }

  /**
   * Execute a raw SQL query (use with caution)
   */
  static async executeRawSQL(sql: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.error('Error executing raw SQL:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error executing raw SQL:', error);
      return { data: null, error };
    }
  }
}
