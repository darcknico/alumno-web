import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecaEditarComponent } from './beca-editar.component';

describe('BecaEditarComponent', () => {
  let component: BecaEditarComponent;
  let fixture: ComponentFixture<BecaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
