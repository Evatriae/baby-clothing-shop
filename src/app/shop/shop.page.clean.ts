import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';
import { ProductService } from '../services/product.service';
import { CategoryWithProducts } from '../services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ToolbarComponent]
})
export class ShopPage implements OnInit {
  categories: CategoryWithProducts[] = [];
  loading = true;
  error = false;

  constructor(private productService: ProductService) {}

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
}