import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionEstadoModalComponent } from './inscripcion-estado-modal.component';

describe('InscripcionEstadoModalComponent', () => {
  let component: InscripcionEstadoModalComponent;
  let fixture: ComponentFixture<InscripcionEstadoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionEstadoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionEstadoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
