import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioSedeModalComponent } from './usuario-sede-modal.component';

describe('UsuarioSedeModalComponent', () => {
  let component: UsuarioSedeModalComponent;
  let fixture: ComponentFixture<UsuarioSedeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioSedeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioSedeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
