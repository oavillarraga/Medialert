import { Component } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonicModule,
    RouterModule
  ],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    // Que la WebView no se meta bajo la barra de estado
    await StatusBar.setOverlaysWebView({ overlay: false });
    // Usa el enum Style.Dark, no un string literal
    await StatusBar.setStyle({ style: Style.Dark });
  }
}
