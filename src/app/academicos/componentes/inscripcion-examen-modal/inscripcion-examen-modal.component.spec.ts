import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionExamenModalComponent } from './inscripcion-examen-modal.component';

describe('InscripcionExamenModalComponent', () => {
  let component: InscripcionExamenModalComponent;
  let fixture: ComponentFixture<InscripcionExamenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionExamenModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionExamenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
