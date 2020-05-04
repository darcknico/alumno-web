import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAlumnoDispositivoAjaxComponent } from './listado-alumno-dispositivo-ajax.component';

describe('ListadoAlumnoDispositivoAjaxComponent', () => {
  let component: ListadoAlumnoDispositivoAjaxComponent;
  let fixture: ComponentFixture<ListadoAlumnoDispositivoAjaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoAlumnoDispositivoAjaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoAlumnoDispositivoAjaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
