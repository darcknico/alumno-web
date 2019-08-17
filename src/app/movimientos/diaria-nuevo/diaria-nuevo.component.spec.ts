import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiariaNuevoComponent } from './diaria-nuevo.component';

describe('DiariaNuevoComponent', () => {
  let component: DiariaNuevoComponent;
  let fixture: ComponentFixture<DiariaNuevoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiariaNuevoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiariaNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
