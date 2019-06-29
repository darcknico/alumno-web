import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionVerComponent } from './inscripcion-ver.component';

describe('InscripcionVerComponent', () => {
  let component: InscripcionVerComponent;
  let fixture: ComponentFixture<InscripcionVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
