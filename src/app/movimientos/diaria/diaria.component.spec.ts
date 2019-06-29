import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiariaComponent } from './diaria.component';

describe('DiariaComponent', () => {
  let component: DiariaComponent;
  let fixture: ComponentFixture<DiariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
