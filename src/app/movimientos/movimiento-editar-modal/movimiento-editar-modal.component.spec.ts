import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoEditarModalComponent } from './movimiento-editar-modal.component';

describe('MovimientoEditarModalComponent', () => {
  let component: MovimientoEditarModalComponent;
  let fixture: ComponentFixture<MovimientoEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovimientoEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovimientoEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
