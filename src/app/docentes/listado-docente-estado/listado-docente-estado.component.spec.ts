import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDocenteEstadoComponent } from './listado-docente-estado.component';

describe('ListadoDocenteEstadoComponent', () => {
  let component: ListadoDocenteEstadoComponent;
  let fixture: ComponentFixture<ListadoDocenteEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoDocenteEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDocenteEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
