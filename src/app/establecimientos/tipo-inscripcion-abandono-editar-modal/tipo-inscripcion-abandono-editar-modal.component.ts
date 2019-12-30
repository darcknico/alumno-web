import { Component, OnInit } from '@angular/core';
import { TipoInscripcionAbandonoService } from '../../_services/tipo_inscripcion_abandono.service.';
import { TipoInscripcionAbandono } from '../../_models/tipo';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-tipo-inscripcion-abandono-editar-modal',
  templateUrl: './tipo-inscripcion-abandono-editar-modal.component.html',
  styleUrls: ['./tipo-inscripcion-abandono-editar-modal.component.scss']
})
export class TipoInscripcionAbandonoEditarModalComponent implements OnInit {

  item: TipoInscripcionAbandono;
  formulario:FormGroup;

  public onClose: Subject<boolean>;

  constructor(
    private service:TipoInscripcionAbandonoService,
    public bsModalRef: BsModalRef,
    private fb:FormBuilder,
    private toastr: ToastrService,
    ) { 
    this.formulario = this.fb.group({
      nombre:['',[Validators.required]],
      descripcion:'',
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  get f(){
    return this.formulario.controls;
  }

  onShow(item:TipoInscripcionAbandono=null){
    if(item){
      this.item = item
      this.f.nombre.setValue(item.nombre);
      this.f.descripcion.setValue(item.descripcion);
    } else {
      this.item = <TipoInscripcionAbandono>{};
      this.item.id = 0;
    }
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.item.nombre = this.f.nombre.value;
    this.item.descripcion = this.f.descripcion.value;
    
    if(this.item.id>0){
      this.service.update(this.item).subscribe(response=>{
        this.toastr.success('Tipo editado', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    } else {
      this.service.register(this.item).subscribe(response=>{
        this.toastr.success('Tipo creado', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    }
    
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
