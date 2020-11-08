import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoInscripcionEstadoModalComponent } from './listado-inscripcion-estado-modal.component';

describe('ListadoInscripcionEstadoModalComponent', () => {
  let component: ListadoInscripcionEstadoModalComponent;
  let fixture: ComponentFixture<ListadoInscripcionEstadoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoInscripcionEstadoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoInscripcionEstadoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
