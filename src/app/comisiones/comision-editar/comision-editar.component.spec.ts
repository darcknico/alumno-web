import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionEditarComponent } from './comision-editar.component';

describe('ComisionEditarComponent', () => {
  let component: ComisionEditarComponent;
  let fixture: ComponentFixture<ComisionEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
