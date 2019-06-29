import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionPlanNuevoComponent } from './inscripcion-plan-nuevo.component';

describe('InscripcionPlanNuevoComponent', () => {
  let component: InscripcionPlanNuevoComponent;
  let fixture: ComponentFixture<InscripcionPlanNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionPlanNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionPlanNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
