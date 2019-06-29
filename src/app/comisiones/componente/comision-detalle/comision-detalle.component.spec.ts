import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionDetalleComponent } from './comision-detalle.component';

describe('ComisionDetalleComponent', () => {
  let component: ComisionDetalleComponent;
  let fixture: ComponentFixture<ComisionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
