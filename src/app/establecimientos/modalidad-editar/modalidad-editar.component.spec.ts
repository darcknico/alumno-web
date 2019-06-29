import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalidadEditarComponent } from './modalidad-editar.component';

describe('ModalidadEditarComponent', () => {
  let component: ModalidadEditarComponent;
  let fixture: ComponentFixture<ModalidadEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalidadEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalidadEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
