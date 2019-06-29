import { Component, OnInit } from '@angular/core';
import { SedeService } from '../../_services/sede.service';
import { ExtraService } from '../../_services/extra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Sede } from '../../_models/sede';

@Component({
  selector: 'app-sede-editar',
  templateUrl: './sede-editar.component.html',
  styleUrls: ['./sede-editar.component.scss']
})
export class SedeEditarComponent implements OnInit {

  titulo:string;
  id:number = 0;
  formulario: FormGroup;

  constructor(
    private sedeService:SedeService,
    private extraService:ExtraService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: '',
      localidad: '',
      codigo_postal: '',
      direccion:'',
      telefono:'',
      celular:'',
      email: ['',Validators.email],
      punto_venta:'',
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      let ids_usuario = params['id_sede'];
      if(ids_usuario==null){
        this.id = 0;
      } else {
        this.id = +ids_usuario;
      }
      if(this.id==0){
        this.titulo="Sede Nuevo";
      } else {
        this.titulo="Sede Editar";
        this.sedeService.getById(this.id).subscribe(response=>{
          this.f.nombre.setValue(response.nombre);
          this.f.ubicacion.setValue(response.ubicacion);
          this.f.localidad.setValue(response.localidad);
          this.f.codigo_postal.setValue(response.codigo_postal);
          this.f.direccion.setValue(response.direccion);
          this.f.telefono.setValue(response.telefono);
          this.f.celular.setValue(response.celular);
          this.f.email.setValue(response.email);
          this.f.punto_venta.setValue(response.punto_venta);
        });
      }
    });
  }

  
  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Sede>{}
    item.id = this.id;
    item.nombre = this.f.nombre.value;
    item.ubicacion = this.f.ubicacion.value;
    item.localidad = this.f.localidad.value;
    item.codigo_postal = this.f.codigo_postal.value;
    item.direccion = this.f.direccion.value;
    item.telefono = this.f.telefono.value;
    item.celular = this.f.celular.value;
    item.email = this.f.email.value;
    item.punto_venta = this.f.punto_venta.value;
    if(this.id>0){
      this.sedeService.update(item).subscribe(response=>{
        this.toastr.success('Sede Editada', '');
        this.volver();
      });
    } else {
      this.sedeService.register(item).subscribe(response=>{
        this.toastr.success('Sede Agregada', '');
        this.volver();
      });
    }
  }

  volver(){
    this.router.navigate(['/establecimientos/sedes']);
  }
}
