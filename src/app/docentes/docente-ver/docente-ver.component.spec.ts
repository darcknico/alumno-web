import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteVerComponent } from './docente-ver.component';

describe('DocenteVerComponent', () => {
  let component: DocenteVerComponent;
  let fixture: ComponentFixture<DocenteVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocenteVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenteVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
