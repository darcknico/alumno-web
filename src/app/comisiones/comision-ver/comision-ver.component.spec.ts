import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionVerComponent } from './comision-ver.component';

describe('ComisionVerComponent', () => {
  let component: ComisionVerComponent;
  let fixture: ComponentFixture<ComisionVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
