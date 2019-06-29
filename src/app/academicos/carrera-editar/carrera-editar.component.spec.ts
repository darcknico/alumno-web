import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraEditarComponent } from './carrera-editar.component';

describe('CarreraEditarComponent', () => {
  let component: CarreraEditarComponent;
  let fixture: ComponentFixture<CarreraEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarreraEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarreraEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
