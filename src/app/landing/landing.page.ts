import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonContent,
  IonButton
} from '@ionic/angular/standalone';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    CommonModule, 
    FormsModule,
    RouterModule
  ]
})
export class LandingPage implements OnInit {
  heroImageUrl: string = '';

  constructor(private storageService: StorageService) {
  }

  ngOnInit() {
    this.loadHeroImage();
  }

  private loadHeroImage() {
    // Try to load from Supabase storage, fallback to local assets
    this.heroImageUrl = this.storageService.getImageWithFallback(
      'landing/hero-image.webp',
      'assets/landing.webp'
    );
  }
}
