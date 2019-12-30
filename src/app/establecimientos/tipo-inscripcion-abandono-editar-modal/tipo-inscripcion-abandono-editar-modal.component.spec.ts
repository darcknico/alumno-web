import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoInscripcionAbandonoEditarModalComponent } from './tipo-inscripcion-abandono-editar-modal.component';

describe('TipoInscripcionAbandonoEditarModalComponent', () => {
  let component: TipoInscripcionAbandonoEditarModalComponent;
  let fixture: ComponentFixture<TipoInscripcionAbandonoEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoInscripcionAbandonoEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoInscripcionAbandonoEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
