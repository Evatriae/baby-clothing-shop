import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonBadge,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, add, remove, cart } from 'ionicons/icons';

import { Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AddToCartRequest } from '../../models/cart.model';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonBadge,
    IonSpinner
  ],
  host: {
    '[class.modal-open]': 'isOpen'
  }
})
export class ProductModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() dismiss = new EventEmitter<void>();

  selectedSize = '';
  selectedColor = '';
  quantity = 1;
  addingToCart = false;

  // Inline styles to force proper positioning
  overlayStyles = {
    'position': 'fixed',
    'top': '0',
    'left': '0', 
    'right': '0',
    'bottom': '0',
    'width': '100vw',
    'height': '100vh',
    'z-index': '999999999',
    'background-color': 'rgba(0, 0, 0, 0.7)',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'flex-start',
    'padding': '80px 20px 20px 20px',
    'box-sizing': 'border-box'
  };

  constructor(
    private cartService: CartService,
    private toastController: ToastController
  ) {
    addIcons({ 
      'close-outline': closeOutline, 
      'add': add, 
      'remove': remove, 
      'cart': cart 
    });
  }

  ngOnInit() {
    // Initial setup if needed
  }

  ngOnDestroy() {
    // Ensure body scroll is restored when component is destroyed
    this.enableBodyScroll();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      if (this.isOpen) {
        this.disableBodyScroll();
      } else {
        this.enableBodyScroll();
      }
    }
  }

  private disableBodyScroll() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.classList.add('modal-open');
    }
  }

  private enableBodyScroll() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.classList.remove('modal-open');
    }
  }

  onDismiss() {
    this.enableBodyScroll();
    this.resetSelection();
    this.dismiss.emit();
  }

  private resetSelection() {
    this.selectedSize = '';
    this.selectedColor = '';
    this.quantity = 1;
    this.addingToCart = false;
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  async addToCart() {
    if (!this.product) return;

    // Validate selections if product has options
    if (this.product.sizes && this.product.sizes.length > 0 && !this.selectedSize) {
      this.showToast('Please select a size', 'warning');
      return;
    }

    if (this.product.colors && this.product.colors.length > 0 && !this.selectedColor) {
      this.showToast('Please select a color', 'warning');
      return;
    }

    this.addingToCart = true;

    const request: AddToCartRequest = {
      product_id: this.product.id,
      quantity: this.quantity,
      selected_size: this.selectedSize || undefined,
      selected_color: this.selectedColor || undefined
    };

    const success = await this.cartService.addToCart(request);

    this.addingToCart = false;

    if (success) {
      this.showToast(`${this.product.name} added to cart!`, 'success');
      this.onDismiss();
    } else {
      this.showToast('Failed to add item to cart', 'danger');
    }
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

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  get canAddToCart(): boolean {
    if (!this.product) return false;
    
    // Check if size is required but not selected
    if (this.product.sizes && this.product.sizes.length > 0 && !this.selectedSize) {
      return false;
    }
    
    // Check if color is required but not selected
    if (this.product.colors && this.product.colors.length > 0 && !this.selectedColor) {
      return false;
    }

    return this.quantity > 0 && !this.addingToCart;
  }

  get hasOptions(): boolean {
    if (!this.product) return false;
    return (this.product.sizes && this.product.sizes.length > 0) || 
           (this.product.colors && this.product.colors.length > 0);
  }
}