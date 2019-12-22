import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoNoPlanPagoComponent } from './listado-no-plan-pago.component';

describe('ListadoNoPlanPagoComponent', () => {
  let component: ListadoNoPlanPagoComponent;
  let fixture: ComponentFixture<ListadoNoPlanPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoNoPlanPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoNoPlanPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
