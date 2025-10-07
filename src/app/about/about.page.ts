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
  IonBadge 
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
    IonBadge
  ]
})
export class AboutPage implements OnInit {
  showAccordion = false;
  cartItemCount = 0;

  constructor() {
    addIcons({ menuOutline, personCircleOutline, basketOutline });
  }

  ngOnInit() {
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }
}
