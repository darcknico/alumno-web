import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaEditarComponent } from './mesa-editar.component';

describe('MesaEditarComponent', () => {
  let component: MesaEditarComponent;
  let fixture: ComponentFixture<MesaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
