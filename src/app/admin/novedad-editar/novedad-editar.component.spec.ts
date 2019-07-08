import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadEditarComponent } from './novedad-editar.component';

describe('NovedadEditarComponent', () => {
  let component: NovedadEditarComponent;
  let fixture: ComponentFixture<NovedadEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovedadEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
