import { Component, OnInit } from '@angular/core';
import { CarreraService } from '../../_services/carrera.service';
import { Carrera, CarreraModalidad } from '../../_models/carrera';
import { DepartamentoService } from '../../_services/departamento.service';
import { Modalidad } from '../../_models/modalidad';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalidadService } from '../../_services/modalidad.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Departamento } from '../../_models/departamento';

@Component({
  selector: 'app-carrera-editar',
  templateUrl: './carrera-editar.component.html',
  styleUrls: ['./carrera-editar.component.scss']
})
export class CarreraEditarComponent implements OnInit {

  titulo:string;
  id_sede:number = 0;
  id:number = 0;
  formulario: FormGroup;

  departamentos:Departamento[] = [];
  modalidades:Modalidad[] = [];
  modalidades_asociadas:CarreraModalidad[] = [];

  constructor(
    private carreraService:CarreraService,
    private departamentoService:DepartamentoService,
    private modalidadService:ModalidadService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.formulario = this.fb.group({
      id_departamento: ['', Validators.required],
      nombre: ['', Validators.required],
      nombre_corto: ['', Validators.required],
      titulo: ['', Validators.required],
      descripcion: '',
    });
  }

  ngOnInit() {
    let ids_sede = +localStorage.getItem('id_sede');
    if(ids_sede == null){
      this.router.navigate(['/establecimientos/departamentos']);
    } else {
      this.id_sede = +ids_sede;
    }
    this.route.params.subscribe(params=>{
      let ids = params['id_carrera'];
      if(ids==null){
        this.id = 0;
      } else {
        this.id = +ids;
      }
      if(this.id==0){
        this.titulo="Carrera Nueva";
      } else {
        this.titulo="Carrera Editar";
        this.carreraService.getById(this.id).subscribe(response=>{
          this.f.nombre.setValue(response.nombre);
          this.f.nombre_corto.setValue(response.nombre_corto);
          this.f.titulo.setValue(response.titulo);
          this.f.descripcion.setValue(response.descripcion);
          this.f.id_departamento.setValue(response.id_departamento);
          this.modalidades_asociadas = response.modalidades;
        });
      }

      this.departamentoService.getAll().subscribe(response=>{
        this.departamentos = response;
      });
      this.modalidadService.getAll().subscribe(response=>{
        this.modalidades = response;
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
    var item = <Carrera>{}
    item.id = this.id;
    item.id_departamento = this.f.id_departamento.value;
    item.nombre = this.f.nombre.value;
    item.nombre_corto = this.f.nombre_corto.value;
    item.titulo = this.f.titulo.value;
    item.descripcion = this.f.descripcion.value;
    item.modalidades = this.modalidades_asociadas;
    if(item.modalidades.length == 0){
      this.toastr.error('Debe seleccionar por lo menos una modalidad.');
      return;
    }
    if(this.id>0){
      this.carreraService.update(item).subscribe(response=>{
        this.toastr.success('Carrera Editada', '');
        this.router.navigate(['/academicos/carreras']);
      });
    } else {
      this.carreraService.register(item).subscribe(response=>{
        this.toastr.success('Carrera Agregada', '');
        this.router.navigate(['/academicos/carreras']);
      });
    }
  }

  volver(){
    this.router.navigate(['/academicos/carreras']);
  }

  /**
   * MODALIDADES
   */

  modalidad(event,item:Modalidad){
    if(this.id==0){
      if(event.target.checked){
        var ints:CarreraModalidad = <CarreraModalidad>{};
        ints.id_modalidad = item.id;
        this.modalidades_asociadas.push(ints);
      } else {
        this.modalidades_asociadas = this.modalidades_asociadas.filter(function( obj ) {
          return obj.id_modalidad !== item.id;
        });
      }
    } else {
      var modalidad:CarreraModalidad = <CarreraModalidad>{};
      modalidad.id_carrera = this.id;
      modalidad.id_modalidad = item.id;
      if(event.target.checked){
        this.carreraService.modalidad_asociar(modalidad).subscribe(response=>{
          this.modalidades_asociadas.push(response);
          this.toastr.success('Modalidad '+item.nombre+' Asociada', '');
        });
      } else {
        if(this.modalidades_asociadas.length == 1){
          event.target.checked = true;
          this.toastr.warning('Debe tener por lo menos una modalidad seleccionada.');
          return;
        }
        this.carreraService.modalidad_desasociar(modalidad).subscribe(response=>{
          this.modalidades_asociadas = this.modalidades_asociadas.filter(function( obj ) {
            return Number(obj.id_modalidad) !== item.id;
          });
          this.toastr.success('Modalidad '+item.nombre+' Desasociada', '');
        });
      }
    }
  }

  modalidad_asociada(item:Modalidad):boolean{
    return this.modalidades_asociadas.filter(function( obj ) {
      return obj.id_modalidad == item.id;
    }).length>0;
  }
}
