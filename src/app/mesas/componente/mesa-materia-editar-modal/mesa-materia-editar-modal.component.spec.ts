import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaMateriaEditarModalComponent } from './mesa-materia-editar-modal.component';

describe('MesaMateriaEditarModalComponent', () => {
  let component: MesaMateriaEditarModalComponent;
  let fixture: ComponentFixture<MesaMateriaEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesaMateriaEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaMateriaEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
