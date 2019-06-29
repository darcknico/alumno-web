import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionCarreraComponent } from './comision-carrera.component';

describe('ComisionCarreraComponent', () => {
  let component: ComisionCarreraComponent;
  let fixture: ComponentFixture<ComisionCarreraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionCarreraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
