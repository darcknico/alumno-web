import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TramiteNuevoModalComponent } from './tramite-nuevo-modal.component';

describe('TramiteNuevoModalComponent', () => {
  let component: TramiteNuevoModalComponent;
  let fixture: ComponentFixture<TramiteNuevoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TramiteNuevoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TramiteNuevoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
