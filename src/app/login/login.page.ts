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
import { mailOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    RouterModule,
    CommonModule, 
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonInput,
    IonInputPasswordToggle,
    IonIcon,
    ToolbarComponent
  ]
})
export class LoginPage implements OnInit {
  showAccordion = false;
  cartItemCount = 0;
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  showSuccessModal = false;

  constructor(
    private router: Router,
    private supabaseAuthService: SupabaseAuthService
  ) {
    addIcons({ mailOutline });
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
    // Already on login page, no action needed
  }

  async onLogin() {
    // Reset error message
    this.errorMessage = '';

    // Basic validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // Start loading
    this.isLoading = true;

    try {
      // Sign in user with Supabase
      const { data, error } = await this.supabaseAuthService.signIn(
        this.email,
        this.password
      );

      if (error) {
        this.errorMessage = error;
        this.isLoading = false;
        return;
      }

      // Login successful
      this.isLoading = false;
      console.log('Login successful:', data);
      
      // Show success modal
      this.showSuccessModal = true;
      
      // Clear form
      this.email = '';
      this.password = '';

      // Navigate to home after short delay
      setTimeout(() => {
        this.showSuccessModal = false;
        this.router.navigate(['/home']);
      }, 1500);

    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = 'Login failed. Please try again.';
      console.error('Login error:', error);
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/home']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
