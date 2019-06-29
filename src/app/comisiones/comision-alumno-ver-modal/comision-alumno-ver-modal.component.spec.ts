import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionAlumnoVerModalComponent } from './comision-alumno-ver-modal.component';

describe('ComisionAlumnoVerModalComponent', () => {
  let component: ComisionAlumnoVerModalComponent;
  let fixture: ComponentFixture<ComisionAlumnoVerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionAlumnoVerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionAlumnoVerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
