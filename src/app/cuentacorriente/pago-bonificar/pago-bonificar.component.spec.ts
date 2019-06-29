import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoBonificarComponent } from './pago-bonificar.component';

describe('PagoBonificarComponent', () => {
  let component: PagoBonificarComponent;
  let fixture: ComponentFixture<PagoBonificarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoBonificarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoBonificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
