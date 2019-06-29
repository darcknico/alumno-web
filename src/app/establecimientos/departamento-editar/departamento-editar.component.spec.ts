import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentoEditarComponent } from './departamento-editar.component';

describe('DepartamentoEditarComponent', () => {
  let component: DepartamentoEditarComponent;
  let fixture: ComponentFixture<DepartamentoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartamentoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartamentoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
