import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMateriaComisionComponent } from './listado-materia-comision.component';

describe('ListadoMateriaComisionComponent', () => {
  let component: ListadoMateriaComisionComponent;
  let fixture: ComponentFixture<ListadoMateriaComisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoMateriaComisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoMateriaComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
