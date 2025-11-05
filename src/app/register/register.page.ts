import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonButton,
  IonCard,
  IonCardContent,
  IonInput,
  IonInputPasswordToggle,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, checkmarkCircleOutline, mailOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    CommonModule, 
    FormsModule,
    RouterModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonInput,
    IonInputPasswordToggle,
    IonIcon,
    ToolbarComponent
  ]
})
export class RegisterPage implements OnInit {
  showAccordion = false;
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showSuccessModal = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private supabaseAuthService: SupabaseAuthService
  ) {
    addIcons({ closeOutline, checkmarkCircleOutline, mailOutline });
  }

  ngOnInit() {
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  onToggleAccordion() {
    this.toggleAccordion();
  }

  onProfileClick() {
    this.router.navigate(['/login']);
  }

  async onRegister() {
    // Reset error message
    this.errorMessage = '';

    // Basic validation
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    // Start loading
    this.isLoading = true;

    try {
      // Register user with Supabase
      const { data, error } = await this.supabaseAuthService.signUp(
        this.email,
        this.password,
        this.firstName,
        this.lastName
      );

      if (error) {
        this.errorMessage = error;
        this.isLoading = false;
        return;
      }

      // Registration successful
      this.isLoading = false;
      this.showSuccessModal = true;
      
      // Clear form
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';

    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = 'Registration failed. Please try again.';
      console.error('Registration error:', error);
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  goToLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
}
