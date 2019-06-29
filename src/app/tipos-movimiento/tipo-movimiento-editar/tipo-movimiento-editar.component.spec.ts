import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoMovimientoEditarComponent } from './tipo-movimiento-editar.component';

describe('TipoMovimientoEditarComponent', () => {
  let component: TipoMovimientoEditarComponent;
  let fixture: ComponentFixture<TipoMovimientoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoMovimientoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoMovimientoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
