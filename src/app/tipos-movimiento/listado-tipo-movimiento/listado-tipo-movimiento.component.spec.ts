import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoTipoMovimientoComponent } from './listado-tipo-movimiento.component';

describe('ListadoTipoMovimientoComponent', () => {
  let component: ListadoTipoMovimientoComponent;
  let fixture: ComponentFixture<ListadoTipoMovimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoTipoMovimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoTipoMovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
