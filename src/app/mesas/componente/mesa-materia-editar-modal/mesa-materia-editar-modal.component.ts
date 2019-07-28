import { Component, OnInit } from '@angular/core';
import { MesaExamenMateria, MesaExamen } from '../../../_models/mesa.examen';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Carrera } from '../../../_models/carrera';
import { PlanEstudio } from '../../../_models/plan_estudio';
import { Materia } from '../../../_models/materia';
import { CarreraService } from '../../../_services/carrera.service';
import { PlanService } from '../../../_services/plan.service';
import { MateriaService } from '../../../_services/materia.service';
import { MesaExamenMateriaService } from '../../../_services/mesa_examen_materia.service';
import * as moment from 'moment';
import { MesaExamenService } from '../../../_services/mesa_examen.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mesa-materia-editar-modal',
  templateUrl: './mesa-materia-editar-modal.component.html',
  styleUrls: ['./mesa-materia-editar-modal.component.scss']
})
export class MesaMateriaEditarModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formulario: FormGroup;
  id:number=0;
  id_mesa_examen:number=0;
  fecha_inicio:Date;
  mesa_examen:MesaExamen;

  carreras:Carrera[] = [];
  planes_estudio:PlanEstudio[] = [];
  materias:Materia[] = [];

  consultando = false;
  materia:Materia = null;
  carrera:Carrera = null;
  constructor(
    public service:MesaExamenMateriaService,
    private mesaExamenService:MesaExamenService,
    private carreraService:CarreraService,
    private planService:PlanService,
    private materiaService:MateriaService,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    ) {
      this.formulario = this.fb.group({
        fecha: ['', Validators.required],
        fecha_cierre: '',
        hora: ['', Validators.required],
        ubicacion: '',
        libro: '',
        folio: '',
        observaciones: '',

        id_carrera:'',
        id_plan_estudio:'',
        id_materia: ['', Validators.required],
      });
    }

  onShow(id_mesa_examen:number,item:MesaExamenMateria = null){
    this.id_mesa_examen = id_mesa_examen;
    if(item){
      this.id = item.id;
      let fecha = moment(item.fecha).toDate();
      if(item.fecha_cierre){
        let fecha_cierre = moment(item.fecha_cierre).toDate();
        this.f.fecha_cierre.setValue(fecha_cierre);
      }
      this.f.fecha.setValue(fecha);
      this.f.hora.setValue(fecha);
      this.f.ubicacion.setValue(item.ubicacion);
      this.f.libro.setValue(item.libro);
      this.f.folio.setValue(item.folio);
      this.f.observaciones.setValue(item.observaciones);
      this.carrera = item.carrera;
      this.materia = item.materia;
      this.f.id_materia.disable();
    } else {
      this.mesaExamenService.getById(id_mesa_examen).subscribe(response=>{
        this.mesa_examen = response;
        this.fecha_inicio = moment(this.mesa_examen.fecha_inicio).toDate();
      });
      this.f.id_materia.enable();
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
    var item = <MesaExamenMateria>{};
    item.id = this.id;
    item.id_mesa_examen = this.id_mesa_examen;
    let fecha = moment(this.f.fecha.value);
    let fecha_cierre = moment(this.f.fecha_cierre.value);
    let hora = moment(this.f.hora.value);
    fecha.set('hour',hora.hour());
    fecha.set('minute',hora.minute());
    item.fecha = fecha.format('YYYY-MM-DD HH:mm:00');
    item.fecha_cierre = fecha_cierre.format('YYYY-MM-DD');
    item.ubicacion = this.f.ubicacion.value;
    item.libro = this.f.libro.value;
    item.folio = this.f.folio.value;
    item.observaciones = this.f.observaciones.value;
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
        this.onClose.next(false);
        this.router.navigate(['/mesas/materias/'+response.id+'/editar']).then(()=>{
          this.bsModalRef.hide();
        });
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
