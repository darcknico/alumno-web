import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaNuevoComponent } from './asistencia-nuevo.component';

describe('AsistenciaNuevoComponent', () => {
  let component: AsistenciaNuevoComponent;
  let fixture: ComponentFixture<AsistenciaNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciaNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
