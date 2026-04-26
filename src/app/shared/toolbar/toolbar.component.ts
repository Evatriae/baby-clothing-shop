import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonList,
  IonItem,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menu, basket, person } from 'ionicons/icons';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonList,
    IonItem,
    IonBadge
  ]
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Input() showAccordion = false;
  @Input() currentPage = '';
  @Output() toggleAccordion = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();

  cartItemCount = 0;
  private cartSubscription?: Subscription;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {
    addIcons({ menu, basket, person });
  }

  ngOnInit() {
    // Subscribe to cart changes to update the badge count
    this.cartSubscription = this.cartService.cartSummary$.subscribe(summary => {
      this.cartItemCount = summary.total_items;
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  onToggleAccordion() {
    this.toggleAccordion.emit();
  }

  onProfileClick() {
    this.profileClick.emit();
  }

  onCartClick() {
    this.router.navigate(['/cart']);
  }
}
