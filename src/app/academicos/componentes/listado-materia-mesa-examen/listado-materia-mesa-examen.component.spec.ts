import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMateriaMesaExamenComponent } from './listado-materia-mesa-examen.component';

describe('ListadoMateriaMesaExamenComponent', () => {
  let component: ListadoMateriaMesaExamenComponent;
  let fixture: ComponentFixture<ListadoMateriaMesaExamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoMateriaMesaExamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoMateriaMesaExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
