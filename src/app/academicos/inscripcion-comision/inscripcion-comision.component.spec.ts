import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionComisionComponent } from './inscripcion-comision.component';

describe('InscripcionComisionComponent', () => {
  let component: InscripcionComisionComponent;
  let fixture: ComponentFixture<InscripcionComisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionComisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
