import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoEditarComponent } from './alumno-editar.component';

describe('AlumnoEditarComponent', () => {
  let component: AlumnoEditarComponent;
  let fixture: ComponentFixture<AlumnoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
