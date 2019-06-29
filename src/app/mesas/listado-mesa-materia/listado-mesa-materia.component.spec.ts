import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMesaMateriaComponent } from './listado-mesa-materia.component';

describe('ListadoMesaMateriaComponent', () => {
  let component: ListadoMesaMateriaComponent;
  let fixture: ComponentFixture<ListadoMesaMateriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoMesaMateriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoMesaMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
