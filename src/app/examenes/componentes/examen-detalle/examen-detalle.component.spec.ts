import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenDetalleComponent } from './examen-detalle.component';

describe('ExamenDetalleComponent', () => {
  let component: ExamenDetalleComponent;
  let fixture: ComponentFixture<ExamenDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamenDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
