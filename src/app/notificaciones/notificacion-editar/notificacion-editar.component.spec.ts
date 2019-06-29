import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionEditarComponent } from './notificacion-editar.component';

describe('NotificacionEditarComponent', () => {
  let component: NotificacionEditarComponent;
  let fixture: ComponentFixture<NotificacionEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
