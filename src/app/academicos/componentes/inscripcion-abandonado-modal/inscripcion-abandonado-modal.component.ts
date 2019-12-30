import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Inscripcion } from '../../../_models/inscripcion';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TipoInscripcionAbandonoService } from '../../../_services/tipo_inscripcion_abandono.service.';
import { TipoInscripcionAbandono } from '../../../_models/tipo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InscripcionAbandonoService } from '../../../_services/inscripcion_abandono.service';

@Component({
  selector: 'app-inscripcion-abandonado-modal',
  templateUrl: './inscripcion-abandonado-modal.component.html',
  styleUrls: ['./inscripcion-abandonado-modal.component.scss']
})
export class InscripcionAbandonadoModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  item:Inscripcion;
  tipos:TipoInscripcionAbandono[];
  asociados:TipoInscripcionAbandono[] = [];

  constructor(
    private service: InscripcionAbandonoService,
    private tipoInscripcionAbandonoService:TipoInscripcionAbandonoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private sanitizer : DomSanitizer,
    public bsModalRef: BsModalRef,
    private router: Router,
    ) { 
      
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.tipoInscripcionAbandonoService.getAll().subscribe(response=>{
      this.tipos = response;
    });
  }

  onShow(item:Inscripcion){
    this.item = item;
  }

  continuar(){
    let tipo_abandonos = [];
    this.asociados.forEach(item=>{
      tipo_abandonos.push(item.id);
    })
    this.item.tipo_abandonos = tipo_abandonos;
    this.service.register(this.item).subscribe(response=>{
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
