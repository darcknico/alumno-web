import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoReporteComponent } from './listado-reporte.component';

describe('ListadoReporteComponent', () => {
  let component: ListadoReporteComponent;
  let fixture: ComponentFixture<ListadoReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
