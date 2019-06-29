import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoExamenComponent } from './listado-examen.component';

describe('ListadoExamenComponent', () => {
  let component: ListadoExamenComponent;
  let fixture: ComponentFixture<ListadoExamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoExamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
