import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAlumnoDisponibleComponent } from './listado-alumno-disponible.component';

describe('ListadoAlumnoDisponibleComponent', () => {
  let component: ListadoAlumnoDisponibleComponent;
  let fixture: ComponentFixture<ListadoAlumnoDisponibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoAlumnoDisponibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoAlumnoDisponibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
