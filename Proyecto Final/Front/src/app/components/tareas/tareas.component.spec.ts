import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasComponent } from './tareas.component';

describe('TareasComponent', () => {
  let component: TareasComponent;
  let fixture: ComponentFixture<TareasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TareasComponent]
    });
    fixture = TestBed.createComponent(TareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
