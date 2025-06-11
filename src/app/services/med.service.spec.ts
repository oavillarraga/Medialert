import { TestBed } from '@angular/core/testing';

import { MedService } from './med.service';

describe('MedService', () => {
  let service: MedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
