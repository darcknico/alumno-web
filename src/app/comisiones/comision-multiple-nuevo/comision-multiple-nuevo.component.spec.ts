import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionMultipleNuevoComponent } from './comision-multiple-nuevo.component';

describe('ComisionMultipleNuevoComponent', () => {
  let component: ComisionMultipleNuevoComponent;
  let fixture: ComponentFixture<ComisionMultipleNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionMultipleNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionMultipleNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
