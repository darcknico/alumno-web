import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionEgresadoModalComponent } from './inscripcion-egresado-modal.component';

describe('InscripcionEgresadoModalComponent', () => {
  let component: InscripcionEgresadoModalComponent;
  let fixture: ComponentFixture<InscripcionEgresadoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionEgresadoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionEgresadoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
