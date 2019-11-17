import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionExamenCalendarComponent } from './comision-examen-calendar.component';

describe('ComisionExamenCalendarComponent', () => {
  let component: ComisionExamenCalendarComponent;
  let fixture: ComponentFixture<ComisionExamenCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionExamenCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionExamenCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
