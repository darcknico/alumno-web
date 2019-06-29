import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaMateriaAlumnoVerComponent } from './mesa-materia-alumno-ver.component';

describe('MesaMateriaAlumnoVerComponent', () => {
  let component: MesaMateriaAlumnoVerComponent;
  let fixture: ComponentFixture<MesaMateriaAlumnoVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesaMateriaAlumnoVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaMateriaAlumnoVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
