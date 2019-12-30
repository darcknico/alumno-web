import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionAbandonadoModalComponent } from './inscripcion-abandonado-modal.component';

describe('InscripcionAbandonadoModalComponent', () => {
  let component: InscripcionAbandonadoModalComponent;
  let fixture: ComponentFixture<InscripcionAbandonadoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionAbandonadoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionAbandonadoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
