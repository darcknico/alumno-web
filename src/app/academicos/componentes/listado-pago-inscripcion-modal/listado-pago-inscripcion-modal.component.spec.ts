import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPagoInscripcionModalComponent } from './listado-pago-inscripcion-modal.component';

describe('ListadoPagoInscripcionModalComponent', () => {
  let component: ListadoPagoInscripcionModalComponent;
  let fixture: ComponentFixture<ListadoPagoInscripcionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoPagoInscripcionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPagoInscripcionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
