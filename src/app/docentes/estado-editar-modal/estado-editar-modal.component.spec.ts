import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoEditarModalComponent } from './estado-editar-modal.component';

describe('EstadoEditarModalComponent', () => {
  let component: EstadoEditarModalComponent;
  let fixture: ComponentFixture<EstadoEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
