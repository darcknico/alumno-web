import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoInscripcionAbandonoComponent } from './tipo-inscripcion-abandono.component';

describe('TipoInscripcionAbandonoComponent', () => {
  let component: TipoInscripcionAbandonoComponent;
  let fixture: ComponentFixture<TipoInscripcionAbandonoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoInscripcionAbandonoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoInscripcionAbandonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
