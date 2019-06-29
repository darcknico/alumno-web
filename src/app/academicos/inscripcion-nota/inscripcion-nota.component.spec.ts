import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionNotaComponent } from './inscripcion-nota.component';

describe('InscripcionNotaComponent', () => {
  let component: InscripcionNotaComponent;
  let fixture: ComponentFixture<InscripcionNotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscripcionNotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscripcionNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
