import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoReciboComponent } from './pago-recibo.component';

describe('PagoReciboComponent', () => {
  let component: PagoReciboComponent;
  let fixture: ComponentFixture<PagoReciboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoReciboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoReciboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
