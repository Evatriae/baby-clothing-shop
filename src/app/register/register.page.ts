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
  IonInput,
  IonInputPasswordToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, personCircleOutline, basketOutline, mailOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonInput,
    IonInputPasswordToggle
  ]
})
export class RegisterPage implements OnInit {
  showAccordion = false;
  cartItemCount = 0;
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor() {
    addIcons({ menuOutline, personCircleOutline, basketOutline, mailOutline });
  }

  ngOnInit() {
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  onRegister() {
    // Add registration logic here
    console.log('Register attempt:', { 
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email, 
      password: this.password 
    });
  }
}
