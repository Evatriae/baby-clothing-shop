import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';
import { ProductService, CategoryWithProducts, Product } from '../services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    CommonModule, 
    FormsModule,
    RouterModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon,
    ToolbarComponent
  ]
})
export class ShopPage implements OnInit {
  showAccordion = false;
  cartItemCount = 0;
  showProductModal = false;
  selectedProduct: Product | null = null;
  categories: CategoryWithProducts[] = [];
  loading = true;
  error: string | null = null;

  constructor(private productService: ProductService) {
    addIcons({ closeOutline });
  }

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    try {
      this.loading = true;
      this.error = null;
      this.categories = await this.productService.getCategoriesWithProducts();
    } catch (error) {
      console.error('Error loading categories:', error);
      this.error = 'Failed to load products. Please try again later.';
      // Fallback to static data if needed
      this.loadStaticCategories();
    } finally {
      this.loading = false;
    }
  }

  private loadStaticCategories() {
    // Simplified fallback data in case database is not available
    this.categories = [
      {
        id: '1',
        name: 'Sample Category',
        image: 'assets/Romper with hearts.png',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        products: [
          {
            id: '1',
            category_id: '1',
            name: 'Sample Product',
            price: 24.99,
            image: 'assets/Romper with hearts.png',
            description: 'Sample product for fallback display.',
            sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
            colors: ['Pink', 'White', 'Blue'],
            featured: true,
            in_stock: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }
    ];
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  onToggleAccordion() {
    this.toggleAccordion();
  }

  onProfileClick() {
    // Navigate to profile or login based on auth state
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
    this.cartItemCount++;
    // Add cart logic here
    console.log('Added to cart:', product);
  }

  formatPrice(price: number): string {
    return this.productService.formatPrice(price);
  }

  async refreshCategories() {
    await this.loadCategories();
  }
}