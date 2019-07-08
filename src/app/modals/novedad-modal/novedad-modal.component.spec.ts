import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadModalComponent } from './novedad-modal.component';

describe('NovedadModalComponent', () => {
  let component: NovedadModalComponent;
  let fixture: ComponentFixture<NovedadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovedadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
