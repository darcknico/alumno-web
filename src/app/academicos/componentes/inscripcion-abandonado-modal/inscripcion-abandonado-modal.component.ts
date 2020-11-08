import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Inscripcion, InscripcionEstado } from '../../../_models/inscripcion';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TipoInscripcionAbandonoService } from '../../../_services/tipo_inscripcion_abandono.service.';
import { TipoInscripcionAbandono } from '../../../_models/tipo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InscripcionAbandonoService } from '../../../_services/inscripcion_abandono.service';
import * as moment from "moment";

@Component({
  selector: 'app-inscripcion-abandonado-modal',
  templateUrl: './inscripcion-abandonado-modal.component.html',
  styleUrls: ['./inscripcion-abandonado-modal.component.scss']
})
export class InscripcionAbandonadoModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  inscripcion:Inscripcion;
  tipos:TipoInscripcionAbandono[];
  asociados:TipoInscripcionAbandono[] = [];
  formulario:FormGroup;

  constructor(
    private service: InscripcionAbandonoService,
    private tipoInscripcionAbandonoService:TipoInscripcionAbandonoService,
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
      observaciones:[''],
    });
      
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.tipoInscripcionAbandonoService.getAll().subscribe(response=>{
      this.tipos = response;
    });
  }
  get f(){
    return this.formulario.controls;
  }

  onShow(item:Inscripcion){
    this.inscripcion = item;
  }

  continuar(){
    let tipo_abandonos = [];
    this.asociados.forEach(item=>{
      tipo_abandonos.push(item.id);
    });
    let item = <InscripcionEstado>{};
    item.id = this.inscripcion.id
    item.id_inscripcion = this.inscripcion.id
    item.id_tipo_inscripcion_estado = 2;
    item.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD');
    item.observaciones = this.f.observaciones.value;
    item.tipo_abandonos = tipo_abandonos;

    this.service.register(item).subscribe(response=>{
      this.onClose.next(true);
      this.bsModalRef.hide();
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  tipo_asociada(item:TipoInscripcionAbandono):boolean{
    return this.asociados.filter(function( obj ) {
      return obj.id == item.id;
    }).length>0;
  }

  async tipo_asociacion(event,item:TipoInscripcionAbandono){
    if(event.target.checked){
      this.asociados.push(item);
    } else {
      this.asociados = this.asociados.filter(tipo => {
        return tipo.id != item.id;
      });
    }
  }
}
