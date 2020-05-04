import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoUsuarioDispositivoAjaxComponent } from './listado-usuario-dispositivo-ajax.component';

describe('ListadoUsuarioDispositivoAjaxComponent', () => {
  let component: ListadoUsuarioDispositivoAjaxComponent;
  let fixture: ComponentFixture<ListadoUsuarioDispositivoAjaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoUsuarioDispositivoAjaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoUsuarioDispositivoAjaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
