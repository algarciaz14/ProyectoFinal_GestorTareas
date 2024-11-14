import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosComponent } from './proyecto.component';

describe('ProyectoComponent', () => {
  let component: ProyectosComponent;
  let fixture: ComponentFixture<ProyectosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProyectosComponent]
    });
    fixture = TestBed.createComponent(ProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
