import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDispositivoComponent } from './listado-dispositivo.component';

describe('ListadoDispositivoComponent', () => {
  let component: ListadoDispositivoComponent;
  let fixture: ComponentFixture<ListadoDispositivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoDispositivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDispositivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
