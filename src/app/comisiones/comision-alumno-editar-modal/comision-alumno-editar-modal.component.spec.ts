import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionAlumnoEditarModalComponent } from './comision-alumno-editar-modal.component';

describe('ComisionAlumnoEditarModalComponent', () => {
  let component: ComisionAlumnoEditarModalComponent;
  let fixture: ComponentFixture<ComisionAlumnoEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionAlumnoEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionAlumnoEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
