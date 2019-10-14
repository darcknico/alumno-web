import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMesaExamenComponent } from './listado-mesa-examen.component';

describe('ListadoMesaExamenComponent', () => {
  let component: ListadoMesaExamenComponent;
  let fixture: ComponentFixture<ListadoMesaExamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoMesaExamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoMesaExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
