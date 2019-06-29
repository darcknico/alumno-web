import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPagoDetalleComponent } from './plan-pago-detalle.component';

describe('PlanPagoDetalleComponent', () => {
  let component: PlanPagoDetalleComponent;
  let fixture: ComponentFixture<PlanPagoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanPagoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPagoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
