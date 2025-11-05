import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
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
import { menu, basket, person } from 'ionicons/icons';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    IonHeader,
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
  ]
})
export class ToolbarComponent {
  @Input() showAccordion = false;
  @Input() cartItemCount = 0;
  @Input() currentPage = '';
  @Output() toggleAccordion = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();

  constructor() {
    addIcons({ menu, basket, person });
  }

  onToggleAccordion() {
    this.toggleAccordion.emit();
  }

  onProfileClick() {
    this.profileClick.emit();
  }
}
