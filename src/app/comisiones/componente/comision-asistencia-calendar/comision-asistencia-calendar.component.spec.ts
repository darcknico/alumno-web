import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionAsistenciaCalendarComponent } from './comision-asistencia-calendar.component';

describe('ComisionAsistenciaCalendarComponent', () => {
  let component: ComisionAsistenciaCalendarComponent;
  let fixture: ComponentFixture<ComisionAsistenciaCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionAsistenciaCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionAsistenciaCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
