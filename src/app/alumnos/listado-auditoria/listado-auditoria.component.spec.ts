import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAuditoriaComponent } from './listado-auditoria.component';

describe('ListadoAuditoriaComponent', () => {
  let component: ListadoAuditoriaComponent;
  let fixture: ComponentFixture<ListadoAuditoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoAuditoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
