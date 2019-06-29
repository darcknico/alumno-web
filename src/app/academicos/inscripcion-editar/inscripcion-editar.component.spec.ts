import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionEditarComponent } from './inscripcion-editar.component';

describe('InscripcionEditarComponent', () => {
  let component: InscripcionEditarComponent;
  let fixture: ComponentFixture<InscripcionEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
