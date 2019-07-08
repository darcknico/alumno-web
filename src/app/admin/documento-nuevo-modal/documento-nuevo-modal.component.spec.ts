import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoNuevoModalComponent } from './documento-nuevo-modal.component';

describe('DocumentoNuevoModalComponent', () => {
  let component: DocumentoNuevoModalComponent;
  let fixture: ComponentFixture<DocumentoNuevoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoNuevoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoNuevoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
