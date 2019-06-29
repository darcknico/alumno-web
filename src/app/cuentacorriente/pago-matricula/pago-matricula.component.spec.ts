import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoMatriculaComponent } from './pago-matricula.component';

describe('PagoMatriculaComponent', () => {
  let component: PagoMatriculaComponent;
  let fixture: ComponentFixture<PagoMatriculaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoMatriculaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
