import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionExamenHelpComponent } from './comision-examen-help.component';

describe('ComisionExamenHelpComponent', () => {
  let component: ComisionExamenHelpComponent;
  let fixture: ComponentFixture<ComisionExamenHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionExamenHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionExamenHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
