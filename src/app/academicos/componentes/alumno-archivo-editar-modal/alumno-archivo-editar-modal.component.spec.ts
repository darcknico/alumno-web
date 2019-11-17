import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoArchivoEditarModalComponent } from './alumno-archivo-editar-modal.component';

describe('AlumnoArchivoEditarModalComponent', () => {
  let component: AlumnoArchivoEditarModalComponent;
  let fixture: ComponentFixture<AlumnoArchivoEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnoArchivoEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoArchivoEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
