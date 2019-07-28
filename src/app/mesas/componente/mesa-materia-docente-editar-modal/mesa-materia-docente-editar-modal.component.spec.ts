import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaMateriaDocenteEditarModalComponent } from './mesa-materia-docente-editar-modal.component';

describe('MesaMateriaDocenteEditarModalComponent', () => {
  let component: MesaMateriaDocenteEditarModalComponent;
  let fixture: ComponentFixture<MesaMateriaDocenteEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesaMateriaDocenteEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaMateriaDocenteEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
