import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonButtons
} from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { notifications, medical, logOut, clipboard, documentOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonButtons,
    RouterModule
  ],
})
export class HomePage {
  constructor(private router: Router) {
    addIcons({ notifications, medical, logOut, clipboard, documentOutline });
  }

  logout() {
    // Navegar de vuelta al login
    this.router.navigate(['/login']);
  }
}
