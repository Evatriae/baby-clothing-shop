import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { ProductService, Product, CategoryWithProducts } from '../services/product.service';
import { Subscription } from 'rxjs';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    NgFor,
    CommonModule,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonSpinner,
    IonRefresher,
    IonRefresherContent,
    ToolbarComponent
  ],
})
export class HomePage implements OnInit, OnDestroy {
  showAccordion = false;
  isLoggedIn = false;
  private authSubscription?: Subscription;
  
  // Product-related properties
  featuredProducts: Product[] = [];
  categories: CategoryWithProducts[] = [];
  loading = true;
  error = false;
  showProductModal = false;
  selectedProduct: Product | null = null;

  constructor(
    private router: Router,
    private supabaseAuthService: SupabaseAuthService,
    private productService: ProductService
  ) {}

  async ngOnInit() {
    // Subscribe to auth state changes
    this.authSubscription = this.supabaseAuthService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    
    // Load products data
    await this.loadData();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async loadData() {
    try {
      this.loading = true;
      this.error = false;
      
      // Load featured products and categories
      [this.featuredProducts, this.categories] = await Promise.all([
        this.productService.getFeaturedProducts(),
        this.productService.getCategoriesWithProducts()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  cartItemCount = 0;

  goToProfile() {
    if (this.isLoggedIn) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onToggleAccordion() {
    this.toggleAccordion();
  }

  onProfileClick() {
    this.goToProfile();
  }

  openProductModal(product: Product) {
    this.selectedProduct = product;
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  addToCart(product: Product) {
    console.log('Adding to cart:', product);
    // TODO: Implement cart functionality
  }

  async onRefresh(event: any) {
    await this.loadData();
    event.target.complete();
  }
}