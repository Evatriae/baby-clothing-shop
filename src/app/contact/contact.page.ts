import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle,
  IonInput,
  IonTextarea,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  mailOutline, 
  callOutline, 
  locationOutline, 
  logoFacebook, 
  logoInstagram, 
  logoTwitter,
  sendOutline
} from 'ionicons/icons';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    IonContent, 
    IonButton, 
    IonIcon, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonCardTitle,
    IonInput,
    IonTextarea,
    ToolbarComponent
  ]
})
export class ContactPage implements OnInit {
  showAccordion = false;
  
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ 
      mailOutline, 
      callOutline, 
      locationOutline, 
      logoFacebook, 
      logoInstagram, 
      logoTwitter,
      sendOutline
    });
  }

  ngOnInit() {}

  onToggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  onProfileClick() {
    this.router.navigate(['/profile']);
  }

  async onSubmit() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      this.showToast('Please fill in all required fields', 'warning');
      return;
    }

    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(async () => {
      this.isSubmitting = false;
      await this.showToast('Your message has been sent successfully!', 'success');
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    }, 1500);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
