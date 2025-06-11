import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonItem,
  IonButton,
  IonIcon,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { key, person, lockClosed, personCircle } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    RouterModule,
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
    RouterModule,
    IonInput,
    IonItem,
    FormsModule,
  ],
})
export class LoginPage {
  username = '';
  password = '';

  constructor(private router: Router, private alertController: AlertController) {
    addIcons({ key, person, lockClosed, personCircle });
  }

  async login() {
    // Datos quemados
    const validUser = 'admin';
    const validPass = '1234';

    if (this.username === validUser && this.password === validPass) {
      this.router.navigate(['/home']);
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario o contraseña incorrectos',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }
}
