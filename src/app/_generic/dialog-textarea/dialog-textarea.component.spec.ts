import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTextareaComponent } from './dialog-textarea.component';

describe('DialogTextareaComponent', () => {
  let component: DialogTextareaComponent;
  let fixture: ComponentFixture<DialogTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
