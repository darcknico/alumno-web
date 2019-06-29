import { Component, OnInit } from '@angular/core';
import { SedeService } from '../../_services/sede.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Sede } from '../../_models/sede';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { UsuarioService } from '../../_services/usuario.service';

@Component({
  selector: 'app-usuario-sede-modal',
  templateUrl: './usuario-sede-modal.component.html',
  styleUrls: ['./usuario-sede-modal.component.scss']
})
export class UsuarioSedeModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  sedes:Sede[];
  formulario: FormGroup;
  id_sede:number;

  constructor(
    private authenticationService:AuthenticationService,
    private usuarioService:UsuarioService,
    public sedeService:SedeService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    ) {
      this.id_sede = this.sedeService.getIdSede();
      this.formulario = this.fb.group({
        id_sede: [ this.id_sede , [Validators.required]],
      });
    }

  ngOnInit() {
    this.onClose = new Subject();
    this.sedeService.getAll().subscribe(response=>{
      this.sedes = response;
    });
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.sedeService.seleccionar(this.formulario.controls.id_sede.value);
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
