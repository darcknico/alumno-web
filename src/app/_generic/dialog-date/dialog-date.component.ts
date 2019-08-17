import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-dialog-date',
  templateUrl: './dialog-date.component.html',
  styleUrls: ['./dialog-date.component.scss']
})
export class DialogDateComponent implements OnInit {

  public onClose: Subject<any>;
  formulario: FormGroup;
  titulo:string="";
  descripcion:string="";

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    ) {
      this.formulario = this.fb.group({
        fecha: [ '', Validators.required],
      });
    }

  ngOnInit() {
    this.onClose = new Subject();
  }

  get f(){
    return this.formulario.controls;
  }

  onShow(titulo:string,descripcion:string,value:Date=null){
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.f.fecha.setValue(value);
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.onClose.next(this.f.fecha.value);
    this.bsModalRef.hide();
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
