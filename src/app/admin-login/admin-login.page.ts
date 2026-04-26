import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonButton, IonInput, IonIcon]
})
export class AdminLoginPage {
  email = '';
  password = '';
  showPassword = false;
  errorMsg = '';
  isLoading = false;

  constructor(private adminService: AdminService, private router: Router) {
    addIcons({ lockClosedOutline, mailOutline, eyeOutline, eyeOffOutline });
    // Redirect if already logged in
    if (this.adminService.isAdminLoggedIn) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  togglePassword() { this.showPassword = !this.showPassword; }

  async onLogin() {
    this.errorMsg = '';
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter email and password.';
      return;
    }
    this.isLoading = true;
    const result = await this.adminService.login(this.email, this.password);
    this.isLoading = false;
    if (result.ok) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.errorMsg = result.error || 'Login failed.';
    }
  }
}
