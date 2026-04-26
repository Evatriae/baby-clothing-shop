import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonInput,
  IonLabel,
  IonSpinner,
  IonItem,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    CommonModule, 
    FormsModule,
    RouterModule,
    IonButton,
    IonIcon,
    IonItem,
    IonInput,
    IonLabel,
    IonSpinner,
    ToolbarComponent
  ]
})
export class ProfilePage implements OnInit {
  showAccordion = false;
  user: any = null;
  profile: any = null;
  isLoading = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';

  // Editable profile fields
  firstName = '';
  lastName = '';
  email = '';
  username = '';

  constructor(
    private router: Router,
    private supabaseAuthService: SupabaseAuthService
  ) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    this.isLoading = true;
    
    // Check if user is logged in
    this.supabaseAuthService.currentUser.subscribe(user => {
      this.user = user;
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.loadProfile();
    });
  }

  async loadProfile() {
    if (!this.user) return;

    try {
      const { data, error } = await this.supabaseAuthService.getProfile(this.user.id);
      
      if (error) {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile data';
      } else if (data) {
        this.profile = data;
        this.firstName = data.first_name || '';
        this.lastName = data.last_name || '';
        this.email = data.email || this.user.email || '';
        this.username = data.username || '';
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      this.errorMessage = 'Failed to load profile data';
    }
    
    this.isLoading = false;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    this.successMessage = '';
  }

  async saveProfile() {
    if (!this.user) return;

    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      const profileData = {
        first_name: this.firstName,
        last_name: this.lastName,
        username: this.username,
        email: this.email
      };

      const { data, error } = await this.supabaseAuthService.updateProfile(this.user.id, profileData);
      
      if (error) {
        this.errorMessage = 'Failed to update profile';
        console.error('Error updating profile:', error);
      } else {
        this.successMessage = 'Profile updated successfully!';
        this.isEditing = false;
        this.loadProfile(); // Reload to get updated data
      }
    } catch (error) {
      this.errorMessage = 'Failed to update profile';
      console.error('Error updating profile:', error);
    }
    
    this.isLoading = false;
  }

  cancelEdit() {
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';
    // Reset fields to original values
    if (this.profile) {
      this.firstName = this.profile.first_name || '';
      this.lastName = this.profile.last_name || '';
      this.email = this.profile.email || this.user?.email || '';
      this.username = this.profile.username || '';
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabaseAuthService.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        this.errorMessage = 'Failed to sign out';
      } else {
        this.router.navigate(['/landing']);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      this.errorMessage = 'Failed to sign out';
    }
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  onToggleAccordion() {
    this.toggleAccordion();
  }

  onProfileClick() {
    // Already on profile page, no action needed
  }
}
