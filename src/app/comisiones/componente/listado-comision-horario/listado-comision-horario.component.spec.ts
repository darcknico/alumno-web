import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoComisionHorarioComponent } from './listado-comision-horario.component';

describe('ListadoComisionHorarioComponent', () => {
  let component: ListadoComisionHorarioComponent;
  let fixture: ComponentFixture<ListadoComisionHorarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoComisionHorarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoComisionHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
