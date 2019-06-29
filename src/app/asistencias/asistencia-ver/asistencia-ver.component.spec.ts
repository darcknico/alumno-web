import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaVerComponent } from './asistencia-ver.component';

describe('AsistenciaVerComponent', () => {
  let component: AsistenciaVerComponent;
  let fixture: ComponentFixture<AsistenciaVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciaVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
