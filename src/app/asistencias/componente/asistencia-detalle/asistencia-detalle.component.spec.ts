import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaDetalleComponent } from './asistencia-detalle.component';

describe('AsistenciaDetalleComponent', () => {
  let component: AsistenciaDetalleComponent;
  let fixture: ComponentFixture<AsistenciaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
