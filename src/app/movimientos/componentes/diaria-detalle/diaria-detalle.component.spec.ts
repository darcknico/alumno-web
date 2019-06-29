import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiariaDetalleComponent } from './diaria-detalle.component';

describe('DiariaDetalleComponent', () => {
  let component: DiariaDetalleComponent;
  let fixture: ComponentFixture<DiariaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiariaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiariaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
