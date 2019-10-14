import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaDetalleComponent } from './materia-detalle.component';

describe('MateriaDetalleComponent', () => {
  let component: MateriaDetalleComponent;
  let fixture: ComponentFixture<MateriaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MateriaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
