import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  locationOutline,
  cardOutline,
  cashOutline,
  checkmarkCircle,
  arrowBackOutline,
  bagCheckOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';

import { CartService } from '../services/cart.service';
import { Cart, CartSummary } from '../models/cart.model';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    ToolbarComponent
  ]
})
export class CheckoutPage implements OnInit, OnDestroy {
  showAccordion = false;

  // Form data
  firstName = '';
  lastName = '';
  email = '';
  phone = '';

  address = '';
  city = '';
  province = '';
  postalCode = '';
  country = 'Philippines';

  // Payment data
  paymentMethod = 'card';
  cardNumber = '';
  cardHolder = '';
  expiryDate = '';
  cvv = '';

  // UI state
  isSubmitting = false;
  orderPlaced = false;

  // Cart data
  cart: Cart | null = null;
  cartSummary: CartSummary = { total_items: 0, total_amount: 0, subtotal: 0 };

  private cartSub?: Subscription;
  private summarySub?: Subscription;

  countries = ['Philippines', 'United States', 'United Kingdom', 'Australia', 'Canada', 'Singapore', 'Japan'];

  philippineProvinces = [
    'Metro Manila', 'Cebu', 'Davao', 'Laguna', 'Cavite', 'Rizal', 'Bulacan',
    'Pampanga', 'Batangas', 'Iloilo', 'Zamboanga', 'Cagayan de Oro', 'Other'
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ personOutline, locationOutline, cardOutline, cashOutline, checkmarkCircle, arrowBackOutline, bagCheckOutline });
  }

  ngOnInit() {
    this.cartSub = this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      if (!cart || cart.items.length === 0) {
        // If someone navigates here with no cart, go back
        if (!this.orderPlaced) {
          this.router.navigate(['/cart']);
        }
      }
    });

    this.summarySub = this.cartService.cartSummary$.subscribe(summary => {
      this.cartSummary = summary;
    });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
    this.summarySub?.unsubscribe();
  }

  onToggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  onProfileClick() {
    this.router.navigate(['/profile']);
  }

  goBackToCart() {
    this.router.navigate(['/cart']);
  }

  formatPrice(price: number): string {
    return this.cartService.formatPrice(price);
  }

  get formIsValid(): boolean {
    const basicInfoValid = !!(
      this.firstName.trim() &&
      this.lastName.trim() &&
      this.email.trim() &&
      this.address.trim() &&
      this.city.trim() &&
      this.postalCode.trim()
    );

    if (this.paymentMethod === 'card') {
      return basicInfoValid && !!(
        this.cardNumber.trim() &&
        this.cardHolder.trim() &&
        this.expiryDate.trim() &&
        this.cvv.trim()
      );
    }

    return basicInfoValid;
  }

  async placeOrder() {
    if (!this.formIsValid) {
      await this.showToast('Please fill in all required fields.', 'warning');
      return;
    }

    this.isSubmitting = true;

    // Simulate order processing delay
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Clear the cart
    await this.cartService.clearCart();

    this.isSubmitting = false;
    this.orderPlaced = true;
  }

  continueShopping() {
    this.router.navigate(['/shop']);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });
    toast.present();
  }
}
