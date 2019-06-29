import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SedeService } from '../../_services/sede.service';
import { ExtraService } from '../../_services/extra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Sede } from '../../_models/sede';
import { TipoDocumento } from '../../_models/tipo_documento';
import { TipoUsuario, Usuario } from '../../_models/usuario';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  sedes:Sede[]=[];
  tipo_documentos:TipoDocumento[];
  tipo_usuarios:TipoUsuario[];
  formulario: FormGroup;
  passwordFormulario: FormGroup;
  usuario : Usuario;
  constructor(
    private authenticationService:AuthenticationService,
    private sedeService:SedeService,
    private extraService:ExtraService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { 
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: '',
      fecha_nacimiento: '',
      telefono: '',
      celular: '',
      direccion: '',
      direccion_numero: '',
      direccion_piso: '',
      direccion_dpto: '',
      documento: '',
      id_tipo_documento: '',
    });
    this.passwordFormulario = this.fb.group({
      password: ['', [Validators.required,Validators.minLength(4)]],
      c_password: ['', [Validators.required,Validators.minLength(4)]],
      n_password: ['', [Validators.required,Validators.minLength(4)]],
    },{validators: this.checkPasswords});
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.c_password.value;
    let confirmPass = group.controls.n_password.value;
    return pass === confirmPass ? null : { notSame: true }     
  }

  ngOnInit() {
    this.authenticationService.detalle().subscribe(response=>{
      this.usuario = response;
      this.f.nombre.setValue(response.nombre);
      this.f.apellido.setValue(response.apellido);
      this.f.fecha_nacimiento.setValue(response.fecha_nacimiento);
      this.f.telefono.setValue(response.telefono);
      this.f.celular.setValue(response.celular);
      this.f.direccion.setValue(response.direccion);
      this.f.direccion_numero.setValue(response.direccion_numero);
      this.f.direccion_piso.setValue(response.direccion_piso);
      this.f.direccion_dpto.setValue(response.direccion_dpto);
      this.f.documento.setValue(response.documento);
      this.f.id_tipo_documento.setValue(response.id_tipo_documento);
    });
    this.sedeService.getAll().subscribe(response=>{
      this.sedes = response;
    });
    this.extraService.tipo_documento().subscribe(response=>{
      this.tipo_documentos = response;
    });
  }

  get f(){
    return this.formulario.controls;
  }

  get pf(){
    return this.passwordFormulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Usuario>{}
    item.nombre = this.f.nombre.value;
    item.apellido = this.f.apellido.value;
    item.fecha_nacimiento = this.f.fecha_nacimiento.value;
    item.telefono = this.f.telefono.value;
    item.celular = this.f.celular.value;
    item.direccion = this.f.direccion.value;
    item.direccion_numero = this.f.direccion_numero.value;
    item.direccion_piso = this.f.direccion_piso.value;
    item.direccion_dpto = this.f.direccion_dpto.value;
    item.documento = this.f.documento.value;
    item.id_tipo_documento = this.f.id_tipo_documento.value;
    this.authenticationService.update(item).subscribe(response=>{
      this.authenticationService.actualizar();
      this.toastr.success('Datos actualizados');
    });
  }

  cambiar_contrasenia(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Usuario>{}
    item.password = this.pf.password.value;
    item.c_password = this.pf.c_password.value;
    item.n_password = this.pf.n_password.value;
    this.authenticationService.cambiar_contraseña(item).subscribe(response=>{
      this.toastr.success('Contraseña cambiada');
    });
  }
}
