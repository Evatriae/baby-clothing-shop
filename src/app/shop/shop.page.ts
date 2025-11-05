import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';
import { ProductModalComponent } from '../shared/product-modal/product-modal.component';
import { ProductService, Product } from '../services/product.service';
import { CategoryWithProducts } from '../services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ToolbarComponent, ProductModalComponent]
})
export class ShopPage implements OnInit {
  categories: CategoryWithProducts[] = [];
  loading = true;
  error = false;
  showProductModal = false;
  selectedProduct: Product | null = null;
  showAccordion = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    try {
      this.loading = true;
      this.error = false;
      this.categories = await this.productService.getCategoriesWithProducts();
    } catch (error) {
      console.error('Error loading categories:', error);
      this.error = true;
    } finally {
      this.loading = false;
    }
  }

  async onRefresh(event: any) {
    await this.loadCategories();
    event.target.complete();
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
    // Open the product modal instead of adding directly
    // This allows users to select size, color, quantity
    this.openProductModal(product);
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