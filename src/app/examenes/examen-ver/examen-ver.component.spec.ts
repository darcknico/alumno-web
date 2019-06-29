import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenVerComponent } from './examen-ver.component';

describe('ExamenVerComponent', () => {
  let component: ExamenVerComponent;
  let fixture: ComponentFixture<ExamenVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamenVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
