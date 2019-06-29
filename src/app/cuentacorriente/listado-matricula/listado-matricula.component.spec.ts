import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMatriculaComponent } from './listado-matricula.component';

describe('ListadoMatriculaComponent', () => {
  let component: ListadoMatriculaComponent;
  let fixture: ComponentFixture<ListadoMatriculaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoMatriculaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
