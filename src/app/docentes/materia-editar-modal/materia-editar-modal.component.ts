import { Component, OnInit } from '@angular/core';
import { DocenteMateriaService } from '../../_services/docente_materia.service';
import { DocenteMateria } from '../../_models/usuario';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Carrera } from '../../_models/carrera';
import { PlanEstudio } from '../../_models/plan_estudio';
import { Materia } from '../../_models/materia';
import { CarreraService } from '../../_services/carrera.service';
import { PlanService } from '../../_services/plan.service';
import { MateriaService } from '../../_services/materia.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SedeService } from '../../_services/sede.service';
import * as moment from 'moment';
import { TipoService } from '../../_services/tipo.service';
import { TipoDocenteCargo } from '../../_models/tipo';
import { SedeProvider } from '../../_providers/sede.provider';

@Component({
  selector: 'app-materia-editar-modal',
  templateUrl: './materia-editar-modal.component.html',
  styleUrls: ['./materia-editar-modal.component.scss']
})
export class MateriaEditarModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario: FormGroup;
  id_usuario:number=0;
  item:DocenteMateria;

  carreras:Carrera[] = [];
  planes_estudio:PlanEstudio[] = [];
  materias:Materia[] = [];
  cargos:TipoDocenteCargo[]=[];

  consultando = false;
  materia:Materia = null;
  carrera:Carrera = null;
  constructor(
    public service:DocenteMateriaService,
    private tipos:TipoService,
    private carreraService:CarreraService,
    private planService:PlanService,
    private sedeService:SedeProvider,
    private materiaService:MateriaService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    ) {
      this.formulario = this.fb.group({
        id_carrera:'',
        id_plan_estudio:'',
        id_materia: ['', Validators.required],
        fecha_asignacion:[],
        horas_catedra:0,
        id_tipo_docente_cargo:null,
      });
    }

  onShow(id_usuario:number,item:DocenteMateria=null){
    this.id_usuario = id_usuario;
    this.item = item;
    if(item){
      let fecha = moment(item.fecha_asignacion);
      if(fecha.isValid){
        this.f.fecha_asignacion.setValue(fecha.toDate());
      }
      this.f.horas_catedra.setValue(item.horas_catedra);
      this.f.id_tipo_docente_cargo.setValue(item.id_tipo_docente_cargo);
      this.f.id_materia.disable();
    } else {
      this.item = <DocenteMateria>{};
      this.item.id = 0;
      this.carreraService.getAll().subscribe(response => {
        this.carreras = response;
      });
    }
  }
  ngOnInit() {
    this.onClose = new Subject();
    this.tipos.docentes_cargos().subscribe(response=>{
      this.cargos = response;
    });
  }

  get f(){
    return this.formulario.controls;
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    this.item.id_usuario = this.id_usuario;
    this.item.id_materia = this.f.id_materia.value;
    this.item.id_carrera = this.f.id_carrera.value;
    this.item.id_sede = this.sedeService.getIdSede();
    let fecha = moment(this.f.fecha_asignacion.value);
    if(fecha.isValid()){
      this.item.fecha_asignacion = fecha.format('YYYY-MM-DD');
    } else {
      this.item.fecha_asignacion = null;
    }
    this.item.horas_catedra = this.f.horas_catedra.value;
    this.item.id_tipo_docente_cargo = this.f.id_tipo_docente_cargo.value;
    this.consultando = true;
    if(this.item.id>0){
      this.service.update(this.item).subscribe(response=>{
        this.toastr.success('Mesa de examen editada con exito', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      },err=>{
        this.consultando = false;
      });
    } else {
      this.item.id_materia = this.f.id_materia.value;
      this.service.register(this.item).subscribe(response=>{
        this.toastr.success('Mesa de examen registrada con exito', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      },err=>{
        this.consultando = false;
      });
    }
    
  }

  seleccionar_carrera(carrera:Carrera){
    this.f.id_materia.setValue('');
    this.f.id_plan_estudio.setValue(carrera.id_plan_estudio);
    this.materias = [];
    this.planService.carrera(carrera.id);
    this.planService.getAll().subscribe(response=>{
      this.planes_estudio = response;
    });
    if(carrera.id_plan_estudio){
      this.materiaService.planEstudio(carrera.id_plan_estudio).subscribe(response=>{
        this.materias = response;
        if(this.materias.length == 0){
          this.f.id_materia.disable();
        } else {
          this.f.id_materia.enable();
        }
      });
    }
  }

  seleccionar_plan_estudio(plan:PlanEstudio){
    this.f.id_materia.setValue('');
    this.materiaService.planEstudio(plan.id).subscribe(response=>{
      this.materias = response;
      if(this.materias.length == 0){
        this.f.id_materia.disable();
      } else {
        this.f.id_materia.enable();
      }
    });
  }
  seleccionar_materia(materia:Materia){
    this.f.horas_catedra.setValue(materia.horas);
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
