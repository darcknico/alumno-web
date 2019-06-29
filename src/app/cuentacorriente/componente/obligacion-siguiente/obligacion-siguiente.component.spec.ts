import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionSiguienteComponent } from './obligacion-siguiente.component';

describe('ObligacionSiguienteComponent', () => {
  let component: ObligacionSiguienteComponent;
  let fixture: ComponentFixture<ObligacionSiguienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObligacionSiguienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligacionSiguienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
