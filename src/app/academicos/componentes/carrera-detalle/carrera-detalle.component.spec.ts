import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraDetalleComponent } from './carrera-detalle.component';

describe('CarreraDetalleComponent', () => {
  let component: CarreraDetalleComponent;
  let fixture: ComponentFixture<CarreraDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarreraDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarreraDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
