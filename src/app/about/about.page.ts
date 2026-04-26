import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonButton, 
  IonCard,
  IonCardContent,
  IonInput
} from '@ionic/angular/standalone';
import { ToolbarComponent } from '../shared/toolbar/toolbar.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
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
    ToolbarComponent
  ]
})
export class AboutPage implements OnInit {
  showAccordion = false;
  newsletterEmail = '';

  constructor(private router: Router) {}

  ngOnInit() {
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  onToggleAccordion() {
    this.toggleAccordion();
  }

  onProfileClick() {
    this.router.navigate(['/profile']);
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
