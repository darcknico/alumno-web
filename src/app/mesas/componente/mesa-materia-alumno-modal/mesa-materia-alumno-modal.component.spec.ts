import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaMateriaAlumnoModalComponent } from './mesa-materia-alumno-modal.component';

describe('MesaMateriaAlumnoModalComponent', () => {
  let component: MesaMateriaAlumnoModalComponent;
  let fixture: ComponentFixture<MesaMateriaAlumnoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesaMateriaAlumnoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaMateriaAlumnoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
