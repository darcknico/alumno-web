import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaEditarComponent } from './plantilla-editar.component';

describe('PlantillaEditarComponent', () => {
  let component: PlantillaEditarComponent;
  let fixture: ComponentFixture<PlantillaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantillaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
