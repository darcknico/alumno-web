import { Component, OnInit } from '@angular/core';
import { Inscripcion } from '../../../_models/inscripcion';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from "moment";
import { InscripcionService } from '../../../_services/inscripcion.service';

@Component({
  selector: 'app-inscripcion-egresado-modal',
  templateUrl: './inscripcion-egresado-modal.component.html',
  styleUrls: ['./inscripcion-egresado-modal.component.scss']
})
export class InscripcionEgresadoModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  item:Inscripcion;
  formulario:FormGroup;

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
      fecha_egreso:[hoy.toDate(),Validators.required],
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
  }
  get f(){
    return this.formulario.controls;
  }

  onShow(item:Inscripcion){
    this.item = item;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    this.item.id_tipo_inscripcion_estado = 2;
    this.item.fecha_egreso = moment(this.f.fecha_egreso.value).format('YYYY-MM-DD');
    this.inscripcionService.estado(this.item).subscribe(response=>{
      this.onClose.next(true);
      this.bsModalRef.hide();
    })
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }


}
