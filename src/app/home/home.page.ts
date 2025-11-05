import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonCardTitle
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { Subscription } from 'rxjs';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    NgFor,
    RouterModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardTitle,
    ToolbarComponent
  ],
})
export class HomePage implements OnInit, OnDestroy {
  showAccordion = false;
  isLoggedIn = false;
  private authSubscription?: Subscription;

  constructor(
    private router: Router,
    private supabaseAuthService: SupabaseAuthService
  ) {}

  ngOnInit() {
    // Subscribe to auth state changes
    this.authSubscription = this.supabaseAuthService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  featuredCategories = [
    { name: 'Pink with Flowers', img: 'assets/M-1.png' },
    { name: 'White and Pink', img: 'assets/162198a6-d981-4ff8-8008-74545cc053cf.png' },
    { name: 'Harlow Sets', img: 'assets/usoEdK.png' },
    { name: 'New Trends', img: 'assets/Smith-and-Wesson-MP-1.png' },
  ];

  bestSellers = [
    { name: 'Chloe Set', img: 'assets/108861-DEFAULT-l.png' },
    { name: 'Romper with Stripes', img: 'assets/98879-DEFAULT-l.png' },
    { name: 'Pink Dress', img: 'assets/stainless-raptor-9mm_2.png' },
    { name: 'Short Sleeve', img: 'assets/66127e1e1ddc0_large.png' },
    { name: 'Flower Sets', img: 'assets/receiver_pump-jpg-1.png' },
    { name: 'Romper with Hearts', img: 'assets/K-1.png' }
  ];

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
}