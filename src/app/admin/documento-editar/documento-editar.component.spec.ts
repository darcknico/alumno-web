import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoEditarComponent } from './documento-editar.component';

describe('DocumentoEditarComponent', () => {
  let component: DocumentoEditarComponent;
  let fixture: ComponentFixture<DocumentoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
