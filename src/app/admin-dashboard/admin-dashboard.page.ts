import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonButton, IonIcon, IonSpinner, IonBadge,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  gridOutline, shirtOutline, cartOutline, trendingUpOutline,
  addCircleOutline, createOutline, trashOutline, logOutOutline,
  checkmarkCircleOutline, closeCircleOutline, searchOutline,
  barChartOutline, peopleOutline, receiptOutline, starOutline
} from 'ionicons/icons';
import { AdminService, DashboardStats, SaleItem } from '../services/admin.service';
import { Product, Category } from '../services/product.service';

type Tab = 'overview' | 'products' | 'sales';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonButton, IonIcon, IonSpinner, IonBadge,
  ]
})
export class AdminDashboardPage implements OnInit {
  activeTab: Tab = 'overview';
  loading = true;
  stats: DashboardStats | null = null;

  // Products tab
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  productLoading = false;

  // Product form
  showProductForm = false;
  isEditMode = false;
  editingProductId: string | null = null;
  productForm: Partial<Product> & { sizesStr: string; colorsStr: string } = this.blankForm();

  // Sales tab
  sales: SaleItem[] = [];
  salesLoading = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({
      gridOutline, shirtOutline, cartOutline, trendingUpOutline,
      addCircleOutline, createOutline, trashOutline, logOutOutline,
      checkmarkCircleOutline, closeCircleOutline, searchOutline,
      barChartOutline, peopleOutline, receiptOutline, starOutline
    });
  }

  async ngOnInit() {
    await this.loadDashboard();
  }

  async loadDashboard() {
    this.loading = true;
    try {
      this.stats = await this.adminService.getDashboardStats();
    } catch (e) {
      await this.toast('Failed to load dashboard data', 'danger');
    } finally {
      this.loading = false;
    }
  }

  // ─── Tab switching ────────────────────────────────────────
  async switchTab(tab: Tab) {
    this.activeTab = tab;
    if (tab === 'products' && this.products.length === 0) await this.loadProducts();
    if (tab === 'sales' && this.sales.length === 0) await this.loadSales();
  }

  // ─── Products ─────────────────────────────────────────────
  async loadProducts() {
    this.productLoading = true;
    try {
      [this.products, this.categories] = await Promise.all([
        this.adminService.getAllProducts(),
        this.adminService.getAllCategories()
      ]);
      this.applySearch();
    } catch (e) {
      await this.toast('Failed to load products', 'danger');
    } finally {
      this.productLoading = false;
    }
  }

  applySearch() {
    const q = this.searchQuery.toLowerCase();
    this.filteredProducts = q
      ? this.products.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
      : [...this.products];
  }

  getCategoryName(id: string) {
    return this.categories.find(c => c.id === id)?.name ?? '—';
  }

  openCreateForm() {
    this.isEditMode = false;
    this.editingProductId = null;
    this.productForm = this.blankForm();
    this.showProductForm = true;
  }

  openEditForm(product: Product) {
    this.isEditMode = true;
    this.editingProductId = product.id;
    this.productForm = {
      ...product,
      sizesStr: (product.sizes || []).join(', '),
      colorsStr: (product.colors || []).join(', ')
    };
    this.showProductForm = true;
  }

  closeForm() { this.showProductForm = false; }

  async saveProduct() {
    if (!this.productForm.name || !this.productForm.price || !this.productForm.category_id) {
      await this.toast('Name, price and category are required', 'warning');
      return;
    }
    const payload: Partial<Product> = {
      name: this.productForm.name,
      price: Number(this.productForm.price),
      category_id: this.productForm.category_id,
      description: this.productForm.description,
      image: this.productForm.image,
      sizes: this.productForm.sizesStr ? this.productForm.sizesStr.split(',').map(s => s.trim()).filter(Boolean) : [],
      colors: this.productForm.colorsStr ? this.productForm.colorsStr.split(',').map(s => s.trim()).filter(Boolean) : [],
      featured: this.productForm.featured ?? false,
      in_stock: this.productForm.in_stock ?? true,
    };
    try {
      if (this.isEditMode && this.editingProductId) {
        await this.adminService.updateProduct(this.editingProductId, payload);
        await this.toast('Product updated successfully', 'success');
      } else {
        await this.adminService.createProduct(payload);
        await this.toast('Product created successfully', 'success');
      }
      this.closeForm();
      await this.loadProducts();
    } catch (e: any) {
      await this.toast(e.message || 'Failed to save product', 'danger');
    }
  }

  async confirmDelete(product: Product) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Product',
      message: `Are you sure you want to delete "${product.name}"? This cannot be undone.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              await this.adminService.deleteProduct(product.id);
              await this.toast('Product deleted', 'success');
              await this.loadProducts();
            } catch (e: any) {
              await this.toast(e.message || 'Failed to delete product', 'danger');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // ─── Sales ────────────────────────────────────────────────
  async loadSales() {
    this.salesLoading = true;
    try {
      this.sales = await this.adminService.getSalesData();
    } catch (e) {
      await this.toast('Failed to load sales data', 'danger');
    } finally {
      this.salesLoading = false;
    }
  }

  formatPrice(n: number) { return `₱${n.toFixed(2)}`; }
  formatDate(d: string) { return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }); }

  // ─── Logout ───────────────────────────────────────────────
  async onLogout() {
    this.adminService.logout();
    this.router.navigate(['/admin/login']);
  }

  // ─── Helpers ──────────────────────────────────────────────
  private blankForm(): Partial<Product> & { sizesStr: string; colorsStr: string } {
    return {
      name: '', price: 0, category_id: '', description: '', image: '',
      featured: false, in_stock: true, sizes: [], colors: [],
      sizesStr: '', colorsStr: ''
    };
  }

  private async toast(message: string, color: string) {
    const t = await this.toastCtrl.create({ message, duration: 2500, color, position: 'top' });
    t.present();
  }
}
