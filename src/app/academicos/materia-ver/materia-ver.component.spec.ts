import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaVerComponent } from './materia-ver.component';

describe('MateriaVerComponent', () => {
  let component: MateriaVerComponent;
  let fixture: ComponentFixture<MateriaVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MateriaVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
