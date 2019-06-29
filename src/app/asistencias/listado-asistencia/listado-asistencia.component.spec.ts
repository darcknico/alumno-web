import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAsistenciaComponent } from './listado-asistencia.component';

describe('ListadoAsistenciaComponent', () => {
  let component: ListadoAsistenciaComponent;
  let fixture: ComponentFixture<ListadoAsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoAsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
