import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoNovedadSistemaModalComponent } from './listado-novedad-sistema-modal.component';

describe('ListadoNovedadSistemaModalComponent', () => {
  let component: ListadoNovedadSistemaModalComponent;
  let fixture: ComponentFixture<ListadoNovedadSistemaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoNovedadSistemaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoNovedadSistemaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
