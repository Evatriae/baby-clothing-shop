import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductService, Product } from './product.service';
import { 
  Cart, 
  CartItem, 
  CartSummary, 
  AddToCartRequest, 
  UpdateCartItemRequest,
  LocalCart,
  LocalCartItem 
} from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private supabase: SupabaseClient;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  private cartSummarySubject = new BehaviorSubject<CartSummary>({
    total_items: 0,
    total_amount: 0,
    subtotal: 0
  });

  public cart$ = this.cartSubject.asObservable();
  public cartSummary$ = this.cartSummarySubject.asObservable();

  private currentUser: User | null = null;
  private readonly CART_STORAGE_KEY = 'baby_shop_cart';

  constructor(private productService: ProductService) {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
    this.initializeCart();
    this.setupAuthListener();
  }

  private async initializeCart() {
    // Check if user is authenticated
    const { data: { user } } = await this.supabase.auth.getUser();
    this.currentUser = user;

    if (user) {
      await this.loadUserCart();
    } else {
      this.loadSessionCart();
    }
  }

  private setupAuthListener() {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      const previousUser = this.currentUser;
      this.currentUser = session?.user || null;

      if (event === 'SIGNED_IN' && session?.user && !previousUser) {
        // User just logged in, merge session cart with user cart
        await this.mergeSessionCartWithUserCart();
      } else if (event === 'SIGNED_OUT' && previousUser) {
        // User logged out, switch to session cart
        this.loadSessionCart();
      }
    });
  }

  // Cart Loading Methods
  private async loadUserCart() {
    if (!this.currentUser) return;

    try {
      const { data, error } = await this.supabase
        .from('cart_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', this.currentUser.id);

      if (error) throw error;

      const cartItems: CartItem[] = await Promise.all((data || []).map(async (item: any) => {
        const product = await this.productService.getProductById(item.product_id);
        return {
          id: item.id,
          product_id: item.product_id,
          product: product!,
          quantity: item.quantity,
          selected_size: item.selected_size,
          selected_color: item.selected_color,
          added_at: item.created_at
        };
      }));

      const cart: Cart = {
        id: this.currentUser.id,
        user_id: this.currentUser.id,
        items: cartItems,
        total_items: this.calculateTotalItems(cartItems),
        total_amount: this.calculateTotalAmount(cartItems),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.cartSubject.next(cart);
      this.updateCartSummary(cart);
    } catch (error) {
      console.error('Error loading user cart:', error);
    }
  }

  private loadSessionCart() {
    try {
      const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
      if (savedCart) {
        const localCart: LocalCart = JSON.parse(savedCart);
        this.buildCartFromLocalItems(localCart.items);
      } else {
        this.cartSubject.next(null);
        this.updateCartSummary(null);
      }
    } catch (error) {
      console.error('Error loading session cart:', error);
      this.cartSubject.next(null);
      this.updateCartSummary(null);
    }
  }

  private async buildCartFromLocalItems(localItems: LocalCartItem[]) {
    const cartItems: CartItem[] = await Promise.all(
      localItems.map(async (item, index) => {
        const product = await this.productService.getProductById(item.product_id);
        return {
          id: `local_${index}`,
          product_id: item.product_id,
          product: product!,
          quantity: item.quantity,
          selected_size: item.selected_size,
          selected_color: item.selected_color,
          added_at: item.added_at
        };
      })
    );

    const cart: Cart = {
      id: 'session',
      items: cartItems,
      total_items: this.calculateTotalItems(cartItems),
      total_amount: this.calculateTotalAmount(cartItems),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.cartSubject.next(cart);
    this.updateCartSummary(cart);
  }

  // Cart Operations
  async addToCart(request: AddToCartRequest): Promise<boolean> {
    try {
      if (this.currentUser) {
        return await this.addToUserCart(request);
      } else {
        return this.addToSessionCart(request);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  private async addToUserCart(request: AddToCartRequest): Promise<boolean> {
    if (!this.currentUser) return false;

    // Check if item already exists
    const { data: existingItem } = await this.supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .eq('product_id', request.product_id)
      .eq('selected_size', request.selected_size || '')
      .eq('selected_color', request.selected_color || '')
      .maybeSingle();

    if (existingItem) {
      // Update quantity
      const { error } = await this.supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + request.quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id);

      if (error) throw error;
    } else {
      // Insert new item
      const { error } = await this.supabase
        .from('cart_items')
        .insert({
          user_id: this.currentUser.id,
          product_id: request.product_id,
          quantity: request.quantity,
          selected_size: request.selected_size,
          selected_color: request.selected_color
        });

      if (error) throw error;
    }

    await this.loadUserCart();
    return true;
  }

  private addToSessionCart(request: AddToCartRequest): boolean {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    const localCart: LocalCart = savedCart ? JSON.parse(savedCart) : { items: [], updated_at: new Date().toISOString() };

    // Check if item already exists
    const existingItemIndex = localCart.items.findIndex(item =>
      item.product_id === request.product_id &&
      item.selected_size === request.selected_size &&
      item.selected_color === request.selected_color
    );

    if (existingItemIndex >= 0) {
      localCart.items[existingItemIndex].quantity += request.quantity;
    } else {
      localCart.items.push({
        product_id: request.product_id,
        quantity: request.quantity,
        selected_size: request.selected_size,
        selected_color: request.selected_color,
        added_at: new Date().toISOString()
      });
    }

    localCart.updated_at = new Date().toISOString();
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(localCart));
    
    this.buildCartFromLocalItems(localCart.items);
    return true;
  }

  async updateCartItem(request: UpdateCartItemRequest): Promise<boolean> {
    try {
      if (this.currentUser) {
        return await this.updateUserCartItem(request);
      } else {
        return this.updateSessionCartItem(request);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    }
  }

  private async updateUserCartItem(request: UpdateCartItemRequest): Promise<boolean> {
    const { error } = await this.supabase
      .from('cart_items')
      .update({
        quantity: request.quantity,
        selected_size: request.selected_size,
        selected_color: request.selected_color,
        updated_at: new Date().toISOString()
      })
      .eq('id', request.cart_item_id);

    if (error) throw error;

    await this.loadUserCart();
    return true;
  }

  private updateSessionCartItem(request: UpdateCartItemRequest): boolean {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (!savedCart) return false;

    const localCart: LocalCart = JSON.parse(savedCart);
    const itemIndex = parseInt(request.cart_item_id.replace('local_', ''));

    if (itemIndex >= 0 && itemIndex < localCart.items.length) {
      localCart.items[itemIndex].quantity = request.quantity;
      if (request.selected_size !== undefined) localCart.items[itemIndex].selected_size = request.selected_size;
      if (request.selected_color !== undefined) localCart.items[itemIndex].selected_color = request.selected_color;
      
      localCart.updated_at = new Date().toISOString();
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(localCart));
      
      this.buildCartFromLocalItems(localCart.items);
      return true;
    }

    return false;
  }

  async removeFromCart(cartItemId: string): Promise<boolean> {
    try {
      if (this.currentUser) {
        return await this.removeFromUserCart(cartItemId);
      } else {
        return this.removeFromSessionCart(cartItemId);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  }

  private async removeFromUserCart(cartItemId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) throw error;

    await this.loadUserCart();
    return true;
  }

  private removeFromSessionCart(cartItemId: string): boolean {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (!savedCart) return false;

    const localCart: LocalCart = JSON.parse(savedCart);
    const itemIndex = parseInt(cartItemId.replace('local_', ''));

    if (itemIndex >= 0 && itemIndex < localCart.items.length) {
      localCart.items.splice(itemIndex, 1);
      localCart.updated_at = new Date().toISOString();
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(localCart));
      
      this.buildCartFromLocalItems(localCart.items);
      return true;
    }

    return false;
  }

  async clearCart(): Promise<boolean> {
    try {
      if (this.currentUser) {
        const { error } = await this.supabase
          .from('cart_items')
          .delete()
          .eq('user_id', this.currentUser.id);

        if (error) throw error;
        await this.loadUserCart();
      } else {
        localStorage.removeItem(this.CART_STORAGE_KEY);
        this.cartSubject.next(null);
        this.updateCartSummary(null);
      }
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  // Cart Synchronization
  private async mergeSessionCartWithUserCart() {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (!savedCart || !this.currentUser) return;

    try {
      const localCart: LocalCart = JSON.parse(savedCart);
      
      for (const localItem of localCart.items) {
        await this.addToUserCart({
          product_id: localItem.product_id,
          quantity: localItem.quantity,
          selected_size: localItem.selected_size,
          selected_color: localItem.selected_color
        });
      }

      // Clear session cart after merging
      localStorage.removeItem(this.CART_STORAGE_KEY);
      
      await this.loadUserCart();
    } catch (error) {
      console.error('Error merging carts:', error);
    }
  }

  // Utility Methods
  private calculateTotalItems(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  private calculateTotalAmount(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  private updateCartSummary(cart: Cart | null) {
    if (!cart) {
      this.cartSummarySubject.next({
        total_items: 0,
        total_amount: 0,
        subtotal: 0
      });
      return;
    }

    const subtotal = cart.total_amount;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50

    this.cartSummarySubject.next({
      total_items: cart.total_items,
      total_amount: subtotal + tax + shipping,
      subtotal: subtotal,
      tax: tax,
      shipping: shipping
    });
  }

  // Public getters
  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }

  getCurrentCartSummary(): CartSummary {
    return this.cartSummarySubject.value;
  }

  getCartItemCount(): number {
    const cart = this.getCurrentCart();
    return cart ? cart.total_items : 0;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}