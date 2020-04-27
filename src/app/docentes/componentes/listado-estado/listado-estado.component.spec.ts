import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoEstadoComponent } from './listado-estado.component';

describe('ListadoEstadoComponent', () => {
  let component: ListadoEstadoComponent;
  let fixture: ComponentFixture<ListadoEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
