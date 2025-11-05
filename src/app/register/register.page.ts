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
import { menuOutline, personCircleOutline, basketOutline, mailOutline, closeOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

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
  showSuccessModal = false;

  constructor(private router: Router) {
    addIcons({ menuOutline, personCircleOutline, basketOutline, mailOutline, closeOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  onRegister() {
    // Basic validation
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      console.log('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    // Add registration logic here
    console.log('Register attempt:', { 
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email, 
      password: this.password 
    });
    
    // Simulate API call delay, then show success modal
    setTimeout(() => {
      this.showSuccessModal = true;
    }, 100);
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  goToLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
}
