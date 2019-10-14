import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionVerModalComponent } from './obligacion-ver-modal.component';

describe('ObligacionVerModalComponent', () => {
  let component: ObligacionVerModalComponent;
  let fixture: ComponentFixture<ObligacionVerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObligacionVerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligacionVerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
