import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../../_services/usuario.service';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Usuario } from '../../../_models/usuario';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario:FormGroup;
  item:Usuario;

  constructor(
    private service:UsuarioService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) { 
    this.formulario = this.fb.group({
      password: [ '', [Validators.required,Validators.minLength(6)]],
      notificacion: [ false, Validators.required],
      email: [ '', [Validators.required,Validators.email]],
    });
    this.f.email.disable();
    this.f.notificacion.valueChanges.subscribe(value=>{
      if(value){
        this.f.email.enable();
      } else {
        this.f.email.disable();
      }
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  get f(){
    return this.formulario.controls;
  }

  onShow(usuario:Usuario){
    this.item = usuario;
    this.f.email.setValue(this.item.email);
  }

  confirmar(){
    var item = <Usuario>{};
    item.id = this.item.id;
    item.password = this.f.password.value;
    item.notificacion = this.f.notificacion.value;
    item.email = this.f.email.value;

    this.service.password(item).subscribe(response=>{
      this.toastr.success('Contraseña cambiada', item.notificacion?'Correo enviado':'');
      this.onClose.next(true);
      this.bsModalRef.hide();
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
