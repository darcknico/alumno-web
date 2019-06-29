import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenAlumnoEditarModalComponent } from './examen-alumno-editar-modal.component';

describe('ExamenAlumnoEditarModalComponent', () => {
  let component: ExamenAlumnoEditarModalComponent;
  let fixture: ComponentFixture<ExamenAlumnoEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamenAlumnoEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenAlumnoEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
