import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonButtons,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonList,
  IonItem
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, personCircleOutline, basketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    NgIf,
    NgFor,
    IonHeader,
    IonToolbar,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonButtons,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonList,
    IonItem
  ],
})
export class HomePage {
  showAccordion = false;

  constructor() {
    addIcons({ menuOutline, personCircleOutline, basketOutline });
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
}