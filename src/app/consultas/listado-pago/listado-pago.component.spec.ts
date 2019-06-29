import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPagoComponent } from './listado-pago.component';

describe('ListadoPagoComponent', () => {
  let component: ListadoPagoComponent;
  let fixture: ComponentFixture<ListadoPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
