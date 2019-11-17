import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AlumnoService } from '../../../_services/alumno.service';
import { TipoAlumnoDocumentacion, AlumnoArchivo } from '../../../_models/alumno';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-alumno-archivo-editar-modal',
  templateUrl: './alumno-archivo-editar-modal.component.html',
  styleUrls: ['./alumno-archivo-editar-modal.component.scss']
})
export class AlumnoArchivoEditarModalComponent implements OnInit {
  public onClose: Subject<boolean>;
  formulario: FormGroup;
  tipo_documentacion:TipoAlumnoDocumentacion[]=[];
  @ViewChild('fileInput') fileInput: ElementRef;
  item:AlumnoArchivo;

  constructor(
    public service:AlumnoService,
    private sanitizer : DomSanitizer,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private changeDetection: ChangeDetectorRef,
    private modalService: BsModalService,
  ) {
    this.formulario = this.fb.group({
      id_tipo_alumno_documentacion: [ '', Validators.required],
      observaciones: '',
    });
    this.f.id_tipo_alumno_documentacion.disable();
    this.modalService.onHide.subscribe((reason: string) => {
      if(this.onClose){
        this.onClose.next(false);
      }
    })
  }

  ngOnInit() {
    this.service.tipos_documentacion().subscribe(response=>{
        this.tipo_documentacion = response;
      })
  }
  get f(){
    return this.formulario.controls;
  }

  onShow(item:AlumnoArchivo = <AlumnoArchivo>{id:0}){
    this.onClose = new Subject();
    this.item = item;
    this.f.id_tipo_alumno_documentacion.setValue(item.id_tipo_alumno_documentacion);
    if(this.item.id>0){
      this.f.observaciones.setValue(item.observaciones);
    } else {
      
    }
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.item.id_tipo_alumno_documentacion = this.f.id_tipo_alumno_documentacion.value;
    this.item.observaciones = this.f.observaciones.value;
    this.item.tipo_documentacion = this.tipo_documentacion.find(tipo=>{
      return tipo.id == this.item.id_tipo_alumno_documentacion;
    });
    this.onClose.next(true);
    this.onClose = null;
    this.bsModalRef.hide();
  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.fileInput.nativeElement.value = "";
      let urlCreator = window.URL;
      this.item.url = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(file));
      this.item.nombre = file.name;
      this.item.archivo = file;
    }
  }

  cancelar(){
    this.onClose.next(false);
    this.onClose = null;
    this.bsModalRef.hide();
  }

}
