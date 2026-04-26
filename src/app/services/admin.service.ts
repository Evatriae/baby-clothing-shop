import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, Category } from './product.service';

export interface SaleItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  averageOrderValue: number;
}

export interface DashboardStats {
  totalProducts: number;
  inStockProducts: number;
  totalCategories: number;
  sales: SalesSummary;
  recentSales: SaleItem[];
  topProducts: { product: Product; quantity: number; revenue: number }[];
}

const ADMIN_EMAIL = 'admin@babyshop.com';
const ADMIN_PASSWORD = 'Admin@12345';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private supabase: SupabaseClient;
  private _isAdminLoggedIn = new BehaviorSubject<boolean>(false);

  get isAdminLoggedIn$() { return this._isAdminLoggedIn.asObservable(); }
  get isAdminLoggedIn() { return this._isAdminLoggedIn.value; }

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
    // Restore session from localStorage
    const saved = localStorage.getItem('admin_session');
    if (saved === 'true') { this._isAdminLoggedIn.next(true); }
  }

  // ─── Auth ────────────────────────────────────────────────
  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    // First check credentials match known admin
    if (email.trim() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return { ok: false, error: 'Invalid admin credentials.' };
    }
    // Sign in to Supabase so the client session is authenticated
    // (required for RLS INSERT/UPDATE/DELETE on products/categories)
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Supabase user may not exist yet — still allow local-only access
      console.warn('Supabase auth sign-in failed (admin user may not exist in Auth):', error.message);
    }
    this._isAdminLoggedIn.next(true);
    localStorage.setItem('admin_session', 'true');
    return { ok: true };
  }

  async logout() {
    this._isAdminLoggedIn.next(false);
    localStorage.removeItem('admin_session');
    await this.supabase.auth.signOut();
  }

  // ─── Products ────────────────────────────────────────────
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async createProduct(product: Partial<Product>): Promise<Product> {
    const payload = {
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const { data, error } = await this.supabase
      .from('products')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }

  // ─── Categories ──────────────────────────────────────────
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  }

  // ─── Sales / Cart Items ──────────────────────────────────
  async getSalesData(): Promise<SaleItem[]> {
    const { data, error } = await this.supabase
      .from('cart_items')
      .select('*, products(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [products, categories, sales] = await Promise.all([
      this.getAllProducts(),
      this.getAllCategories(),
      this.getSalesData()
    ]);

    const totalRevenue = sales.reduce((sum, item) => {
      const price = item.product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);

    // Count per product
    const productMap = new Map<string, { product: Product; quantity: number; revenue: number }>();
    for (const item of sales) {
      if (!item.product) continue;
      const key = item.product_id;
      const existing = productMap.get(key);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.product.price * item.quantity;
      } else {
        productMap.set(key, {
          product: item.product,
          quantity: item.quantity,
          revenue: item.product.price * item.quantity
        });
      }
    }

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalProducts: products.length,
      inStockProducts: products.filter(p => p.in_stock).length,
      totalCategories: categories.length,
      sales: {
        totalRevenue,
        totalOrders: sales.length,
        totalItems: sales.reduce((s, i) => s + i.quantity, 0),
        averageOrderValue: sales.length ? totalRevenue / sales.length : 0
      },
      recentSales: sales.slice(0, 10),
      topProducts
    };
  }
}
