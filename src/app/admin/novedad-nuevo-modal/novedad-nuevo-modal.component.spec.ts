import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadNuevoModalComponent } from './novedad-nuevo-modal.component';

describe('NovedadNuevoModalComponent', () => {
  let component: NovedadNuevoModalComponent;
  let fixture: ComponentFixture<NovedadNuevoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovedadNuevoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadNuevoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
