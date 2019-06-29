import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaMateriaEditarComponent } from './mesa-materia-editar.component';

describe('MesaMateriaEditarComponent', () => {
  let component: MesaMateriaEditarComponent;
  let fixture: ComponentFixture<MesaMateriaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesaMateriaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaMateriaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
