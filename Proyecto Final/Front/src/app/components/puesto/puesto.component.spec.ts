import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestosComponent } from './puesto.component';

describe('PuestoComponent', () => {
  let component: PuestosComponent;
  let fixture: ComponentFixture<PuestosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PuestosComponent]
    });
    fixture = TestBed.createComponent(PuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
