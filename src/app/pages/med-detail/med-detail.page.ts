import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { MedService, Med } from '../../services/med.service';

@Component({
  selector: 'app-med-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './med-detail.page.html',
  styleUrls: ['./med-detail.page.scss'],
})
export class MedDetailPage implements OnInit {
  med: Med = { id: '', name: '', time: '' };
  constructor(
    private route: ActivatedRoute,
    private ms: MedService,
    private router: Router
  ) {}
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id === 'new') {
      this.med.id = Date.now().toString();
    } else {
      const existing = await this.ms.get(id);
      if (existing) this.med = existing;
    }
  }
  async save() {
    await this.ms.save(this.med);
    // programa notificación a la hora indicada
    await LocalNotifications.requestPermissions();
    const [h, m] = this.med.time.split(':').map(n=>+n);
    const now = new Date();
    let at = new Date(
      now.getFullYear(), now.getMonth(),
      now.getDate(), h, m, 0
    );
    if (at <= now) at.setDate(at.getDate()+1);
    await LocalNotifications.schedule({
      notifications: [{
        id: +this.med.id,
        title: 'Tu medicamento',
        body: `Toma ${this.med.name}`,
        schedule: { at }
      }]
    });
    // vuelve a la lista
    this.router.navigate(['/med-list']);
  }
}

