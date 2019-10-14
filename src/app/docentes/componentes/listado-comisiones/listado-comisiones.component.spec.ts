import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoComisionesComponent } from './listado-comisiones.component';

describe('ListadoComisionesComponent', () => {
  let component: ListadoComisionesComponent;
  let fixture: ComponentFixture<ListadoComisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoComisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoComisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
