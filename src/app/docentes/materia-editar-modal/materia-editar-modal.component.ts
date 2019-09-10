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
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SedeService } from '../../_services/sede.service';

@Component({
  selector: 'app-materia-editar-modal',
  templateUrl: './materia-editar-modal.component.html',
  styleUrls: ['./materia-editar-modal.component.scss']
})
export class MateriaEditarModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario: FormGroup;
  id:number=0;
  id_usuario:number=0;
  item:DocenteMateria;

  carreras:Carrera[] = [];
  planes_estudio:PlanEstudio[] = [];
  materias:Materia[] = [];

  consultando = false;
  materia:Materia = null;
  carrera:Carrera = null;
  constructor(
    public service:DocenteMateriaService,
    private carreraService:CarreraService,
    private planService:PlanService,
    private sedeService:SedeService,
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
      });
    }

  onShow(id_usuario:number,item:DocenteMateria=null){
    this.id_usuario = id_usuario;
    this.item = item;
    if(item){

    } else {
      this.carreraService.getAll().subscribe(response => {
        this.carreras = response;
      });
    }
  }
  ngOnInit() {
    this.onClose = new Subject();
  }

  get f(){
    return this.formulario.controls;
  }

  confirmar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <DocenteMateria>{};
    item.id_usuario = this.id_usuario;
    item.id_materia = this.f.id_materia.value;
    item.id_carrera = this.f.id_carrera.value;
    item.id_sede = this.sedeService.getIdSede();
    this.consultando = true;
    if(this.id>0){
      this.service.update(item).subscribe(response=>{
        this.toastr.success('Mesa de examen editada con exito', '');
        this.onClose.next(true);
        this.bsModalRef.hide();
      },err=>{
        this.consultando = false;
      });
    } else {
      item.id_materia = this.f.id_materia.value;
      this.service.register(item).subscribe(response=>{
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

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
