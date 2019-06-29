import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaCorrelativaModalComponent } from './materia-correlativa-modal.component';

describe('MateriaCorrelativaModalComponent', () => {
  let component: MateriaCorrelativaModalComponent;
  let fixture: ComponentFixture<MateriaCorrelativaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MateriaCorrelativaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriaCorrelativaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
