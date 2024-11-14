import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentosComponent } from './departamento.component';

describe('DepartamentoComponent', () => {
  let component: DepartamentosComponent;
  let fixture: ComponentFixture<DepartamentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartamentosComponent]
    });
    fixture = TestBed.createComponent(DepartamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
