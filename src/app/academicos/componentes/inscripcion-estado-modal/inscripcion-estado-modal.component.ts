import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Inscripcion, InscripcionEstado, TipoInscripcionEstado } from '../../../_models/inscripcion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InscripcionService } from '../../../_services/inscripcion.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-inscripcion-estado-modal',
  templateUrl: './inscripcion-estado-modal.component.html',
  styleUrls: ['./inscripcion-estado-modal.component.scss']
})
export class InscripcionEstadoModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  inscripcion:Inscripcion;
  formulario:FormGroup;
  tipo_inscripcion_estado:TipoInscripcionEstado;

  constructor(
    private inscripcionService:InscripcionService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private sanitizer : DomSanitizer,
    public bsModalRef: BsModalRef,
    private router: Router,
    private fb: FormBuilder,
  ) { 
    let hoy = moment();
    this.formulario = this.fb.group({
      fecha:[hoy.toDate(),Validators.required],
      observaciones:'',
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
  }
  get f(){
    return this.formulario.controls;
  }

  onShow(inscripcion:Inscripcion,tipo_inscripcion_estado:TipoInscripcionEstado){
    this.inscripcion = inscripcion;
    this.tipo_inscripcion_estado = tipo_inscripcion_estado;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    let item = <InscripcionEstado>{};
    item.id = this.inscripcion.id
    item.id_inscripcion = this.inscripcion.id
    item.id_tipo_inscripcion_estado = this.tipo_inscripcion_estado.id;
    item.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD');
    item.observaciones = this.f.observaciones.value;
    this.inscripcionService.estado(item).subscribe(response=>{
      this.onClose.next(true);
      this.bsModalRef.hide();
    })
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
