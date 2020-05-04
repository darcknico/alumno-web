import { Component, OnInit } from '@angular/core';
import { Inscripcion } from '../../_models/inscripcion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InscripcionService } from '../../_services/inscripcion.service';
import { PlanService } from '../../_services/plan.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PlanEstudio } from '../../_models/plan_estudio';
import { ModalidadService } from '../../_services/modalidad.service';
import { Modalidad } from '../../_models/modalidad';
import { BecaService } from '../../_services/beca.service';
import { Beca } from '../../_models/beca';
import * as moment from "moment";

@Component({
  selector: 'app-inscripcion-editar',
  templateUrl: './inscripcion-editar.component.html',
  styleUrls: ['./inscripcion-editar.component.scss']
})
export class InscripcionEditarComponent implements OnInit {

  id_sede:number;
  inscripcion:Inscripcion;

  formulario:FormGroup;
  dtOptions: DataTables.Settings = {};
  planes_estudio:PlanEstudio[];
  modalidades:Modalidad[];
  becas:Beca[];
  maxYear;
  constructor(
    private inscripcionService:InscripcionService,
    private planEstudioService:PlanService,
    private modalidadService:ModalidadService,
    private becaService:BecaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.maxYear = moment().year() + 20;
    this.formulario = this.fb.group({
      anio:[0,[Validators.required,Validators.min(1976),Validators.max(this.maxYear)]],
      id_plan_estudio:[0,[Validators.required]],
      id_modalidad:[0,[Validators.required]],
      id_beca:[0,[Validators.required]],
      fecha_egreso:'',
      observaciones:['',[Validators.maxLength(191)]],
    });
  }

  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.inscripcionService.sede(this.id_sede);
    
    this.modalidadService.getAll().subscribe(response=>{
      this.modalidades = response;
    });
    this.becaService.getAll().subscribe(response=>{
      this.becas = response;
    });

    this.route.params.subscribe(query=>{
      let id_inscripcion = query['id_inscripcion'];
      if(id_inscripcion){
        this.inscripcionService.getById(+id_inscripcion).subscribe(response=>{
          this.inscripcion = response;
          this.f.anio.setValue(this.inscripcion.anio);
          this.f.id_modalidad.setValue(this.inscripcion.id_modalidad);
          this.f.id_plan_estudio.setValue(this.inscripcion.id_plan_estudio);
          this.f.id_beca.setValue(this.inscripcion.id_beca);
          this.f.observaciones.setValue(this.inscripcion.observaciones);
          if(this.inscripcion.fecha_egreso){
            let fecha = moment(this.inscripcion.fecha_egreso);
            this.f.fecha_egreso.setValue(fecha.toDate());
          }
          this.planEstudioService.carrera(this.inscripcion.id_carrera);
          this.planEstudioService.getAll().subscribe(response=>{
            this.planes_estudio = response;
          });
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
    this.inscripcion.anio = this.f.anio.value;
    this.inscripcion.id_modalidad = this.f.id_modalidad.value;
    this.inscripcion.id_plan_estudio = this.f.id_plan_estudio.value;
    this.inscripcion.id_beca = this.f.id_beca.value;
    this.inscripcion.observaciones = this.f.observaciones.value;
    let fecha = this.f.fecha_egreso.value;
    if(fecha){
      this.inscripcion.fecha_egreso = moment(fecha).format('YYYY-MM-DD');
    } else {
      this.inscripcion.fecha_egreso = null;
    }
    this.inscripcionService.update(this.inscripcion).subscribe(response=>{
      this.toastr.success('Inscripcion modificada con exito.');
      this.ver();
    });
  }

  volver(){
    this.router.navigate(['/academicos/inscripciones']);
  }
  
  ver(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/ver']);
  }
}
