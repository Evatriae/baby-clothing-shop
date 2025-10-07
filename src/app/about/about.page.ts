import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonButton, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonIcon, 
  IonList, 
  IonItem, 
  IonBadge,
  IonCard,
  IonCardContent,
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, personCircleOutline, basketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    RouterModule, 
    IonButtons, 
    IonButton, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonIcon, 
    IonList,
    IonItem,
    IonBadge,
    IonCard,
    IonCardContent,
    IonInput
  ]
})
export class AboutPage implements OnInit {
  showAccordion = false;
  cartItemCount = 0;
  newsletterEmail = '';

  constructor() {
    addIcons({ menuOutline, personCircleOutline, basketOutline });
  }

  ngOnInit() {
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  subscribeNewsletter() {
    if (this.newsletterEmail) {
      // Add newsletter subscription logic here
      console.log('Newsletter subscription for:', this.newsletterEmail);
      alert('Thank you for subscribing to our newsletter!');
      this.newsletterEmail = '';
    } else {
      alert('Please enter a valid email address.');
    }
  }
}
