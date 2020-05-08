import { Component, OnInit } from '@angular/core';
import { TipoMovimientoService } from '../../_services/tipo_movimiento.service';
import { TipoMovimiento } from '../../_models/movimiento';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tipo-movimiento-editar',
  templateUrl: './tipo-movimiento-editar.component.html',
  styleUrls: ['./tipo-movimiento-editar.component.scss']
})
export class TipoMovimientoEditarComponent implements OnInit {

  titulo:string;
  id:number = 0;
  formulario: FormGroup;

  constructor(
    private tipoMovimientoService:TipoMovimientoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { 
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required,Validators.maxLength(191)]],
      descripcion: ['',Validators.maxLength(191)],
      id_tipo_egreso_ingreso: ['', Validators.required],
    });
  }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.tipoMovimientoService.sede(id_sede);
    this.route.params.subscribe(params=>{
      let ids_usuario = params['id_tipo_movimiento'];
      if(ids_usuario==null){
        this.id = 0;
      } else {
        this.id = +ids_usuario;
      }
      this.iniciar();
    });
  }

  iniciar(){
    if(this.id==0){
      this.titulo="Tipo Movimiento Nuevo";
    } else {
      this.titulo="Tipo Movimiento Editar";
      this.tipoMovimientoService.getById(this.id).subscribe(response=>{
        this.f.nombre.setValue(response.nombre);
        this.f.descripcion.setValue(response.descripcion);
        this.f.id_tipo_egreso_ingreso.setValue(response.id_tipo_egreso_ingreso);
        this.f.id_tipo_egreso_ingreso.disable();
      });
    }
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <TipoMovimiento>{}
    item.id = this.id;
    item.nombre = this.f.nombre.value;
    item.descripcion = this.f.descripcion.value;
    item.id_tipo_egreso_ingreso = this.f.id_tipo_egreso_ingreso.value;
    if(this.id>0){
      this.tipoMovimientoService.update(item).subscribe(response=>{
        this.toastr.success('Tipo Movimiento Editado', '');
        this.volver();
      });
    } else {
      this.tipoMovimientoService.register(item).subscribe(response=>{
        this.toastr.success('Tipo Movimiento Agregado', '');
        this.volver();
      });
    }
  }

  volver(){
    this.router.navigate(['/tipos_movimiento/listado']);
  }
}
