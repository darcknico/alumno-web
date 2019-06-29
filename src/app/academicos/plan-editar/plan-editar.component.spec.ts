import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanEditarComponent } from './plan-editar.component';

describe('PlanEditarComponent', () => {
  let component: PlanEditarComponent;
  let fixture: ComponentFixture<PlanEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
