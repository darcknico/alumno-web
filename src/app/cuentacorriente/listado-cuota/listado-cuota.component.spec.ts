import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCuotaComponent } from './listado-cuota.component';

describe('ListadoCuotaComponent', () => {
  let component: ListadoCuotaComponent;
  let fixture: ComponentFixture<ListadoCuotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoCuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoCuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
