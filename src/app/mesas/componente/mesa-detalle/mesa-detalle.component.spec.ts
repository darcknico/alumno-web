import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaDetalleComponent } from './mesa-detalle.component';

describe('MesaDetalleComponent', () => {
  let component: MesaDetalleComponent;
  let fixture: ComponentFixture<MesaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
