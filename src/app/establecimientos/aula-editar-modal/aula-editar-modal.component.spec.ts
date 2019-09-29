import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AulaEditarModalComponent } from './aula-editar-modal.component';

describe('AulaEditarModalComponent', () => {
  let component: AulaEditarModalComponent;
  let fixture: ComponentFixture<AulaEditarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AulaEditarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AulaEditarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
