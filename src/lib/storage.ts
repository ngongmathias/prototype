import { supabase } from './supabase';

export interface UploadResult {
  path: string;
  url: string;
  error?: string;
}

// Updated interface to match Supabase's FileObject type
export interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>; // Changed to match Supabase's flexible metadata type
}

export class StorageService {
  private bucketName = 'business-images';

  /**
   * Upload an image file to Supabase storage
   */
  async uploadImage(
    file: File,
    businessId: string,
    folder: string = 'general'
  ): Promise<UploadResult> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${businessId}/${folder}/${Date.now()}.${fileExt}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { path: '', url: '', error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      return {
        path: fileName,
        url: urlData.publicUrl
      };
    } catch (error) {
      console.error('Storage upload error:', error);
      return { path: '', url: '', error: 'Upload failed' };
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(
    files: File[],
    businessId: string,
    folder: string = 'general'
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => 
      this.uploadImage(file, businessId, folder)
    );
    
    return Promise.all(uploadPromises);
  }

  /**
   * Delete an image from storage
   */
  async deleteImage(path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Storage delete error:', error);
      return { success: false, error: 'Delete failed' };
    }
  }

  /**
   * Get all images for a business
   */
  async getBusinessImages(businessId: string): Promise<StorageFile[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(businessId, {
          limit: 100,
          offset: 0
        });

      if (error) {
        console.error('List error:', error);
        return [];
      }

      // Transform Supabase FileObject to our StorageFile interface
      return (data || []).map(file => ({
        name: file.name,
        id: file.id,
        updated_at: file.updated_at,
        created_at: file.created_at,
        last_accessed_at: file.last_accessed_at,
        metadata: file.metadata || {}
      }));
    } catch (error) {
      console.error('Storage list error:', error);
      return [];
    }
  }

  /**
   * Get public URL for an image
   */
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  /**
   * Create storage bucket if it doesn't exist
   */
  async createBucket(): Promise<void> {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);

      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(this.bucketName, {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });

        if (error) {
          console.error('Bucket creation error:', error);
        }
      }
    } catch (error) {
      console.error('Storage bucket creation error:', error);
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Initialize storage bucket
storageService.createBucket(); 