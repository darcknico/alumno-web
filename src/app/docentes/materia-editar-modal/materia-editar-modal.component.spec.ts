import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaEditarModalComponent } from './materia-editar-modal.component';

describe('MateriaEditarModalComponent', () => {
  let component: MateriaEditarModalComponent;
  let fixture: ComponentFixture<MateriaEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MateriaEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MateriaEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
