import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionMateriaComponent } from './comision-materia.component';

describe('ComisionMateriaComponent', () => {
  let component: ComisionMateriaComponent;
  let fixture: ComponentFixture<ComisionMateriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionMateriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
