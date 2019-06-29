import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoComisionModalComponent } from './listado-comision-modal.component';

describe('ListadoComisionModalComponent', () => {
  let component: ListadoComisionModalComponent;
  let fixture: ComponentFixture<ListadoComisionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoComisionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoComisionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
