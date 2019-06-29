import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPlanPagoComponent } from './listado-plan-pago.component';

describe('ListadoPlanPagoComponent', () => {
  let component: ListadoPlanPagoComponent;
  let fixture: ComponentFixture<ListadoPlanPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoPlanPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPlanPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
