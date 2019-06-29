import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaNuevoComponent } from './mesa-nuevo.component';

describe('MesaNuevoComponent', () => {
  let component: MesaNuevoComponent;
  let fixture: ComponentFixture<MesaNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesaNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
