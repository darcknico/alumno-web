import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoVerModalComponent } from './alumno-ver-modal.component';

describe('AlumnoVerModalComponent', () => {
  let component: AlumnoVerModalComponent;
  let fixture: ComponentFixture<AlumnoVerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlumnoVerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoVerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
