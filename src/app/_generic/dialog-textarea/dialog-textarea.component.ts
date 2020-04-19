import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dialog-textarea',
  templateUrl: './dialog-textarea.component.html',
  styleUrls: ['./dialog-textarea.component.scss']
})
export class DialogTextareaComponent implements OnInit {
  public onClose: Subject<any>;
  formulario: FormGroup;
  titulo:string="";
  descripcion:string="";
  texto:string="";

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

  onShow(titulo:string,descripcion:string,texto:string=""){
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.texto = texto;
    this.formulario.controls.input.setValue(texto);
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.onClose.next(this.formulario.controls.input.value);
    this.bsModalRef.hide();
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
