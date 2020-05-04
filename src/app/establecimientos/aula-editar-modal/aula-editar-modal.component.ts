import { Component, OnInit } from '@angular/core';
import { Aula } from '../../_models/aula';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { AulaService } from '../../_services/aula.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-aula-editar-modal',
  templateUrl: './aula-editar-modal.component.html',
  styleUrls: ['./aula-editar-modal.component.scss']
})
export class AulaEditarModalComponent implements OnInit {

  item: Aula;
  formulario:FormGroup;

  public onClose: Subject<boolean>;

  constructor(
    private service:AulaService,
    public bsModalRef: BsModalRef,
    private fb:FormBuilder,
    private toastr: ToastrService,
    ) { 
    this.formulario = this.fb.group({
      numero:[1,[Validators.min(0),Validators.required]],
      nombre:['',Validators.maxLength(191)],
      capacidad:[0,[Validators.min(0),Validators.required]],
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  get f(){
    return this.formulario.controls;
  }

  onShow(item:Aula=null){
    if(item){
      this.item = item
      this.f.numero.setValue(item.numero);
      this.f.nombre.setValue(item.nombre);
      this.f.capacidad.setValue(item.capacidad);
    } else {
      this.item = <Aula>{};
      this.item.id = 0;
    }
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.item.numero = this.f.numero.value;
    this.item.nombre = this.f.nombre.value;
    this.item.capacidad = this.f.capacidad.value;
    if(this.item.id>0){
      this.service.update(this.item).subscribe(response=>{
        this.toastr.success('Aula editada', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    } else {
      this.service.register(this.item).subscribe(response=>{
        this.toastr.success('Aula creada', '');
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
