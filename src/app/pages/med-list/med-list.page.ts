import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MedService, Med } from '../../services/med.service';

@Component({
  selector: 'app-med-list',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './med-list.page.html',
  styleUrls: ['./med-list.page.scss'],
})
export class MedListPage {
  meds: Med[] = [];

  constructor(
    private medService: MedService,
    private router: Router
  ) {}

  // Este hook se dispara cada vez que entras/retornas a esta vista
  async ionViewWillEnter(): Promise<void> {
    this.meds = await this.medService.getAll();
  }

  openDetail(id: string) {
    this.router.navigate(['/med-detail', id]);
  }
}
