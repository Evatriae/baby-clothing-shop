import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Category {
  id: string;
  name: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  sizes: string[];
  colors: string[];
  featured: boolean;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url, 
      environment.supabase.anonKey
    );
  }

  // Storage helper methods
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a local asset path, return as is for backwards compatibility
    if (imagePath.startsWith('assets/')) {
      return imagePath;
    }
    
    // Generate Supabase Storage URL
    const { data } = this.supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  }

  async uploadImage(file: File, filename: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.storage
        .from('product-images')
        .upload(filename, file);

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      return data.path;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  async deleteImage(imagePath: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from('product-images')
        .remove([imagePath]);

      if (error) {
        console.error('Error deleting image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    // Transform image paths to full URLs
    const categories = (data || []).map(category => ({
      ...category,
      image: category.image ? this.getImageUrl(category.image) : undefined
    }));
    
    return categories;
  }

  async getCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select(`
        *,
        products (*)
      `)
      .order('name');
    
    if (error) {
      console.error('Error fetching categories with products:', error);
      throw error;
    }
    
    // Transform image paths to full URLs for categories and products
    const categoriesWithProducts = (data || []).map(category => ({
      ...category,
      image: category.image ? this.getImageUrl(category.image) : undefined,
      products: category.products.map((product: any) => ({
        ...product,
        image: product.image ? this.getImageUrl(product.image) : undefined
      }))
    }));
    
    return categoriesWithProducts;
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
    
    if (data) {
      return {
        ...data,
        image: data.image ? this.getImageUrl(data.image) : undefined
      };
    }
    
    return data;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    // Transform image paths to full URLs
    const products = (data || []).map(product => ({
      ...product,
      image: product.image ? this.getImageUrl(product.image) : undefined
    }));
    
    return products;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('in_stock', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
    
    // Transform image paths to full URLs
    const products = (data || []).map(product => ({
      ...product,
      image: product.image ? this.getImageUrl(product.image) : undefined
    }));
    
    return products;
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('in_stock', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
    
    // Transform image paths to full URLs
    const products = (data || []).map(product => ({
      ...product,
      image: product.image ? this.getImageUrl(product.image) : undefined
    }));
    
    return products;
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
    
    if (data) {
      return {
        ...data,
        image: data.image ? this.getImageUrl(data.image) : undefined
      };
    }
    
    return data;
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('in_stock', true)
      .order('name');
    
    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }
    
    return data || [];
  }

  // Utility method to format price
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}