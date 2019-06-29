import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoDiariaComponent } from './listado-diaria.component';

describe('ListadoDiariaComponent', () => {
  let component: ListadoDiariaComponent;
  let fixture: ComponentFixture<ListadoDiariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoDiariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoDiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
