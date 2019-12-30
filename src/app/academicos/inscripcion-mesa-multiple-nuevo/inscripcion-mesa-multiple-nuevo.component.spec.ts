import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionMesaMultipleNuevoComponent } from './inscripcion-mesa-multiple-nuevo.component';

describe('InscripcionMesaMultipleNuevoComponent', () => {
  let component: InscripcionMesaMultipleNuevoComponent;
  let fixture: ComponentFixture<InscripcionMesaMultipleNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionMesaMultipleNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionMesaMultipleNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
