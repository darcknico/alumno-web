import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDocenteMateriaComponent } from './listado-docente-materia.component';

describe('ListadoDocenteMateriaComponent', () => {
  let component: ListadoDocenteMateriaComponent;
  let fixture: ComponentFixture<ListadoDocenteMateriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoDocenteMateriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDocenteMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
