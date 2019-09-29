import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionHorarioEditarModalComponent } from './comision-horario-editar-modal.component';

describe('ComisionHorarioEditarModalComponent', () => {
  let component: ComisionHorarioEditarModalComponent;
  let fixture: ComponentFixture<ComisionHorarioEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionHorarioEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionHorarioEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
