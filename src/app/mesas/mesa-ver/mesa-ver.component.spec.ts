import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaVerComponent } from './mesa-ver.component';

describe('MesaVerComponent', () => {
  let component: MesaVerComponent;
  let fixture: ComponentFixture<MesaVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesaVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
