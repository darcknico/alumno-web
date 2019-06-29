import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionPagarModalComponent } from './obligacion-pagar-modal.component';

describe('ObligacionPagarModalComponent', () => {
  let component: ObligacionPagarModalComponent;
  let fixture: ComponentFixture<ObligacionPagarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObligacionPagarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligacionPagarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
