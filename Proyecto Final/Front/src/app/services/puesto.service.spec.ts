import { TestBed } from '@angular/core/testing';

import { PuestoService } from './puesto.service';

describe('PuestoService', () => {
  let service: PuestoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuestoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
