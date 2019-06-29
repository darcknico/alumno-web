import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionAsistenciaModalComponent } from './inscripcion-asistencia-modal.component';

describe('InscripcionAsistenciaModalComponent', () => {
  let component: InscripcionAsistenciaModalComponent;
  let fixture: ComponentFixture<InscripcionAsistenciaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionAsistenciaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionAsistenciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
