import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonList, 
  IonButton, 
  IonIcon, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle,
  IonSelect,
  IonSelectOption,
  IonNote,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  trash, 
  add, 
  remove, 
  cart, 
  checkmarkCircle, 
  alertCircle
} from 'ionicons/icons';
import { Subscription } from 'rxjs';

import { CartService } from '../services/cart.service';
import { Cart, CartItem, CartSummary, UpdateCartItemRequest } from '../models/cart.model';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonList, 
    IonButton, 
    IonIcon, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle,
    IonSelect,
    IonSelectOption,
    IonNote,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    CommonModule, 
    FormsModule,
    ToolbarComponent
  ]
})
export class CartPage implements OnInit, OnDestroy {
  cart: Cart | null = null;
  cartSummary: CartSummary = {
    total_items: 0,
    total_amount: 0,
    subtotal: 0
  };
  
  loading = true;
  updating: { [key: string]: boolean } = {};
  showAccordion = false;

  private cartSubscription?: Subscription;
  private summarySubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      trash,
      add,
      remove,
      cart,
      checkmarkCircle,
      alertCircle
    });
  }

  ngOnInit() {
    this.loadCart();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.summarySubscription) {
      this.summarySubscription.unsubscribe();
    }
  }

  private loadCart() {
    this.loading = true;

    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.loading = false;
    });

    // Subscribe to cart summary changes
    this.summarySubscription = this.cartService.cartSummary$.subscribe(summary => {
      this.cartSummary = summary;
    });
  }

  async handleRefresh(event: any) {
    // Force reload cart data
    this.loadCart();
    event.target.complete();
  }

  async updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity < 1) {
      await this.removeItem(item);
      return;
    }

    this.updating[item.id] = true;

    const request: UpdateCartItemRequest = {
      cart_item_id: item.id,
      quantity: newQuantity,
      selected_size: item.selected_size,
      selected_color: item.selected_color
    };

    const success = await this.cartService.updateCartItem(request);
    
    this.updating[item.id] = false;

    if (!success) {
      this.showToast('Failed to update quantity', 'danger');
    }
  }

  async updateSize(item: CartItem, newSize: string) {
    this.updating[item.id] = true;

    const request: UpdateCartItemRequest = {
      cart_item_id: item.id,
      quantity: item.quantity,
      selected_size: newSize,
      selected_color: item.selected_color
    };

    const success = await this.cartService.updateCartItem(request);
    
    this.updating[item.id] = false;

    if (success) {
      this.showToast('Size updated', 'success');
    } else {
      this.showToast('Failed to update size', 'danger');
    }
  }

  async updateColor(item: CartItem, newColor: string) {
    this.updating[item.id] = true;

    const request: UpdateCartItemRequest = {
      cart_item_id: item.id,
      quantity: item.quantity,
      selected_size: item.selected_size,
      selected_color: newColor
    };

    const success = await this.cartService.updateCartItem(request);
    
    this.updating[item.id] = false;

    if (success) {
      this.showToast('Color updated', 'success');
    } else {
      this.showToast('Failed to update color', 'danger');
    }
  }

  async removeItem(item: CartItem) {
    const alert = await this.alertController.create({
      header: 'Remove Item',
      message: `Are you sure you want to remove "${item.product.name}" from your cart?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: async () => {
            this.updating[item.id] = true;
            const success = await this.cartService.removeFromCart(item.id);
            this.updating[item.id] = false;

            if (success) {
              this.showToast('Item removed from cart', 'success');
            } else {
              this.showToast('Failed to remove item', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async clearCart() {
    if (!this.cart || this.cart.items.length === 0) return;

    const alert = await this.alertController.create({
      header: 'Clear Cart',
      message: 'Are you sure you want to remove all items from your cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Clear All',
          role: 'destructive',
          handler: async () => {
            this.loading = true;
            const success = await this.cartService.clearCart();
            this.loading = false;

            if (success) {
              this.showToast('Cart cleared', 'success');
            } else {
              this.showToast('Failed to clear cart', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  continueShopping() {
    this.router.navigate(['/shop']);
  }

  async proceedToCheckout() {
    if (!this.cart || this.cart.items.length === 0) {
      this.showToast('Your cart is empty', 'warning');
      return;
    }

    // TODO: Navigate to checkout page when implemented
    this.showToast('Checkout feature coming soon!', 'primary');
  }

  getLineTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }

  // Quantity control methods
  increaseQuantity(item: CartItem) {
    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  // Check if cart is empty
  get isCartEmpty(): boolean {
    return !this.cart || this.cart.items.length === 0;
  }

  // Get shipping message
  get shippingMessage(): string {
    if (this.cartSummary.subtotal >= 50) {
      return 'You qualify for free shipping!';
    } else {
      const remaining = 50 - this.cartSummary.subtotal;
      return `Spend ${this.formatPrice(remaining)} more for free shipping`;
    }
  }

  // Toolbar methods
  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  onToggleAccordion() {
    this.toggleAccordion();
  }

  onProfileClick() {
    this.router.navigate(['/profile']);
  }
}