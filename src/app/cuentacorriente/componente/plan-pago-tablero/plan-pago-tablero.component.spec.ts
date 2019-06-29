import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPagoTableroComponent } from './plan-pago-tablero.component';

describe('PlanPagoTableroComponent', () => {
  let component: PlanPagoTableroComponent;
  let fixture: ComponentFixture<PlanPagoTableroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanPagoTableroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPagoTableroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
