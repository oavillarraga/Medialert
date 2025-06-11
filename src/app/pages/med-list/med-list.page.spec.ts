import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedListPage } from './med-list.page';

describe('MedListPage', () => {
  let component: MedListPage;
  let fixture: ComponentFixture<MedListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
