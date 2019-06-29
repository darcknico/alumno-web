import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraVerComponent } from './carrera-ver.component';

describe('CarreraVerComponent', () => {
  let component: CarreraVerComponent;
  let fixture: ComponentFixture<CarreraVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarreraVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarreraVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
