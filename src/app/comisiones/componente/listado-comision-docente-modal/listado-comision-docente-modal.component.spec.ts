import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoComisionDocenteModalComponent } from './listado-comision-docente-modal.component';

describe('ListadoComisionDocenteModalComponent', () => {
  let component: ListadoComisionDocenteModalComponent;
  let fixture: ComponentFixture<ListadoComisionDocenteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoComisionDocenteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoComisionDocenteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
