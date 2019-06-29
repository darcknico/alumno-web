import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoComisionComponent } from './listado-comision.component';

describe('ListadoComisionComponent', () => {
  let component: ListadoComisionComponent;
  let fixture: ComponentFixture<ListadoComisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoComisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
