import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private supabase: SupabaseClient;
  private readonly BUCKET_NAME = 'images';

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
  }

  /**
   * Get the public URL for an image from Supabase storage
   * @param path The path to the image in the bucket
   * @returns The public URL or null if error
   */
  getImageUrl(path: string): string | null {
    try {
      const { data } = this.supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(path);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  }

  /**
   * Upload an image to Supabase storage
   * @param file The file to upload
   * @param path The path where to store the file
   * @returns Promise with upload result
   */
  async uploadImage(file: File, path: string) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Delete an image from Supabase storage
   * @param path The path to the image to delete
   * @returns Promise with delete result
   */
  async deleteImage(path: string) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .remove([path]);

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * List all images in a folder
   * @param folderPath The folder path to list images from
   * @returns Promise with list of images
   */
  async listImages(folderPath: string = '') {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .list(folderPath, {
          limit: 100,
          offset: 0
        });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  /**
   * Get predefined image URLs for the app
   */
  getAppImages() {
    return {
      landing: this.getImageUrl('landing/hero-image.webp'),
      logo: this.getImageUrl('branding/logo.png'),
      placeholder: this.getImageUrl('placeholders/product-placeholder.png'),
      // Add more predefined images as needed
    };
  }

  /**
   * Get image URL with fallback to local assets
   * @param storagePath Path in Supabase storage
   * @param fallbackPath Fallback path in local assets
   * @returns Image URL (Supabase or fallback)
   */
  getImageWithFallback(storagePath: string, fallbackPath: string): string {
    const storageUrl = this.getImageUrl(storagePath);
    return storageUrl || fallbackPath;
  }
}