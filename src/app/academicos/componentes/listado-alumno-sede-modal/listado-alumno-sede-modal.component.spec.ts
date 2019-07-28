import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAlumnoSedeModalComponent } from './listado-alumno-sede-modal.component';

describe('ListadoAlumnoSedeModalComponent', () => {
  let component: ListadoAlumnoSedeModalComponent;
  let fixture: ComponentFixture<ListadoAlumnoSedeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoAlumnoSedeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoAlumnoSedeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
