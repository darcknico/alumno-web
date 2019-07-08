import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaNuevaModalComponent } from './plantilla-nueva-modal.component';

describe('PlantillaNuevaModalComponent', () => {
  let component: PlantillaNuevaModalComponent;
  let fixture: ComponentFixture<PlantillaNuevaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantillaNuevaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaNuevaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
