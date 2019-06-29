import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionVerComponent } from './notificacion-ver.component';

describe('NotificacionVerComponent', () => {
  let component: NotificacionVerComponent;
  let fixture: ComponentFixture<NotificacionVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificacionVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
