import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMateriaComponent } from './listado-materia.component';

describe('ListadoMateriaComponent', () => {
  let component: ListadoMateriaComponent;
  let fixture: ComponentFixture<ListadoMateriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoMateriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
