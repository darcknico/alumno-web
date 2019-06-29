import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionMesaNuevoComponent } from './inscripcion-mesa-nuevo.component';

describe('InscripcionMesaNuevoComponent', () => {
  let component: InscripcionMesaNuevoComponent;
  let fixture: ComponentFixture<InscripcionMesaNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionMesaNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionMesaNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
