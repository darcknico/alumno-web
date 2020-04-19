import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Sede } from '../../_models/sede';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dialog-input',
  templateUrl: './dialog-input.component.html',
  styleUrls: ['./dialog-input.component.scss']
})
export class DialogInputComponent implements OnInit {

  public onClose: Subject<any>;
  formulario: FormGroup;
  titulo:string="";
  descripcion:string="";
  type:string="";

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    ) {
      this.formulario = this.fb.group({
        input: [ '', Validators.required],
      });
    }

  ngOnInit() {
    this.onClose = new Subject();
  }

  get f(){
    return this.formulario.controls;
  }

  onShow(titulo:string,descripcion:string,type:string="text",value=null){
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.type = type;
    this.f.input.setValue(value);
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.onClose.next(this.f.input.value);
    this.bsModalRef.hide();
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
