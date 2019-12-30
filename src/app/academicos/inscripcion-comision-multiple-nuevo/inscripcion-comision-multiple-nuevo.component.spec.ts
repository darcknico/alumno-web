import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionComisionMultipleNuevoComponent } from './inscripcion-comision-multiple-nuevo.component';

describe('InscripcionComisionMultipleNuevoComponent', () => {
  let component: InscripcionComisionMultipleNuevoComponent;
  let fixture: ComponentFixture<InscripcionComisionMultipleNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionComisionMultipleNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionComisionMultipleNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
