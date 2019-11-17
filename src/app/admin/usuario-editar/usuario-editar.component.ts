import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../_services/usuario.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { TipoDocumento } from '../../_models/tipo_documento';
import { TipoUsuario, Usuario, UsuarioSede } from '../../_models/usuario';
import { ValidateEmailUnique } from '../../validators/async-email-unique.validator';
import { ExtraService } from '../../_services/extra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Sede } from '../../_models/sede';
import { SedeService } from '../../_services/sede.service';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.scss']
})
export class UsuarioEditarComponent implements OnInit {

  titulo:string;
  id:number = 0;
  sedes:Sede[]=[];
  sedes_asociadas:UsuarioSede[]=[];
  tipo_documentos:TipoDocumento[];
  tipo_usuarios:TipoUsuario[];
  formulario: FormGroup;

  constructor(
    private usuarioService:UsuarioService,
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
      id_tipo_documento: 96,
      id_tipo_usuario: ['',Validators.required],
      email: ['',Validators.required,ValidateEmailUnique.createValidator(this.usuarioService)],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let ids_usuario = params['id_usuario'];
      if(ids_usuario==null){
        this.id = 0;
      } else {
        this.id = +ids_usuario;
      }
      this.usuarioService.tipos().subscribe(data=>{
        this.tipo_usuarios = data;
      });
      this.extraService.tipo_documento().subscribe(data=>{
        this.tipo_documentos = data;
      });
      if(this.id==0){
        this.titulo="Usuario Nuevo";
      } else {
        this.titulo="Usuario Editar";
        this.usuarioService.getById(this.id).subscribe(response=>{
          this.formulario = this.fb.group({
            nombre: [response.nombre, Validators.required],
            apellido: response.apellido,
            fecha_nacimiento: response.fecha_nacimiento,
            telefono: response.telefono,
            celular: response.celular,
            direccion: response.direccion,
            direccion_numero: response.direccion_numero,
            direccion_piso: response.direccion_piso,
            direccion_dpto: response.direccion_dpto,
            documento: response.documento,
            id_tipo_documento: response.id_tipo_documento,
            id_tipo_usuario: [response.id_tipo_usuario,Validators.required],
            email: [response.email,Validators.required],
          });
          this.sedes_asociadas = response.sedes;
        });
      }
      this.sedeService.getAll().subscribe(response=>{
        this.sedes = response;
      });
    });
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Usuario>{}
    item.id = this.id;
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
    item.id_tipo_usuario = this.f.id_tipo_usuario.value;
    item.email = this.f.email.value;
    item.sedes = this.sedes_asociadas;
    if(this.id>0){
      this.usuarioService.update(item).subscribe(response=>{
        this.toastr.success('Usuario Editado', '');
        this.router.navigate(['/admin/usuarios']);
      });
    } else {
      this.usuarioService.register(item).subscribe(response=>{
        this.toastr.success('Usuario Agregado', '');
        this.router.navigate(['/admin/usuarios']);
      });
    }
  }

  correo_valido():string{
    let clase="";
    if(this.formulario.get('email').value.length>1){
      if(this.formulario.get('email').hasError('coincidencia')){
        clase = 'is-invalid';
      } else {
        clase = 'is-valid';
      }
    }
    return clase;
  }

  volver(){
    this.router.navigate(['/admin/usuarios']);
  }

  /**
   * SEDES
   */

  asociacion(event,item:Sede){
    if(this.id==0){
      if(event.target.checked){
        var ints:UsuarioSede = <UsuarioSede>{};
        ints.id_sede = item.id;
        this.sedes_asociadas.push(ints);
      } else {
        this.sedes_asociadas = this.sedes_asociadas.filter(function( obj ) {
          return obj.id_sede !== item.id;
        });
      }
    } else {
      var pertenece:UsuarioSede = <UsuarioSede>{};
      pertenece.id_usuario = this.id;
      pertenece.id_sede = item.id;
      if(event.target.checked){
        this.usuarioService.sede_asociar(pertenece).subscribe(response=>{
          this.toastr.success('Sede '+item.nombre+' Asociada', '');
        });
      } else {
        this.usuarioService.sede_desasociar(pertenece).subscribe(response=>{
          this.toastr.success('Sede '+item.nombre+' Desasociada', '');
        });
      }
    }
  }

  sede_asociada(item:Sede):boolean{
    return this.sedes_asociadas.filter(function( obj ) {
      return obj.id_sede == item.id;
    }).length>0;
  }
  
}
