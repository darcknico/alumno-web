import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoMateriaNotaModalComponent } from './alumno-materia-nota-modal.component';

describe('AlumnoMateriaNotaModalComponent', () => {
  let component: AlumnoMateriaNotaModalComponent;
  let fixture: ComponentFixture<AlumnoMateriaNotaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnoMateriaNotaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoMateriaNotaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
