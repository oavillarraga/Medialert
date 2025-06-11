import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedDetailPage } from './med-detail.page';

describe('MedDetailPage', () => {
  let component: MedDetailPage;
  let fixture: ComponentFixture<MedDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
