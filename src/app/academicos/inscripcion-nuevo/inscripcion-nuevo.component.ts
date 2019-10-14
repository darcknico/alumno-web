import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../_services/alumno.service';
import { ExtraService } from '../../_services/extra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Alumno } from '../../_models/alumno';
import { CarreraService } from '../../_services/carrera.service';
import { DepartamentoService } from '../../_services/departamento.service';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { PlanService } from '../../_services/plan.service';
import { PlanEstudio } from '../../_models/plan_estudio';
import { Inscripcion } from '../../_models/inscripcion';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { BsModalService } from 'ngx-bootstrap';
import { PlanPago } from '../../_models/plan_pago';
import { BecaService } from '../../_services/beca.service';
import { Beca } from '../../_models/beca';
import { Obligacion } from '../../_models/obligacion';
import { PlanPagoService } from '../../_services/plan_pago.service';
import * as moment from 'moment';

@Component({
  selector: 'app-inscripcion-nuevo',
  templateUrl: './inscripcion-nuevo.component.html',
  styleUrls: ['./inscripcion-nuevo.component.scss']
})
export class InscripcionNuevoComponent implements OnInit {

  dataSource:Obligacion[]=[];
  dtOptions: DataTables.Settings = {};
  formulario: FormGroup;

  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];
  planes_estudio:PlanEstudio[]=[];
  plan_estudio:PlanEstudio;
  becas:Beca[]=[];
  alumno:Alumno;
  carrera:Carrera;
  id_departamento:number=0;
  id_modalidad:number;
  id_plan_estudio:number;

  constructor(
    private alumnoService:AlumnoService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private planService:PlanService,
    private planPagoService:PlanPagoService,
    private becaService:BecaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    let anio = moment().get('year');
    let fecha = moment().set({
      'year':anio,
      'month':1,
      'date':1
    });
    this.formulario = this.fb.group({
      anio: [anio, [Validators.required, Validators.min(1950)]],
      matricula_monto: [0, [Validators.required,Validators.min(0)]],
      cuota_monto: [0, [Validators.required,Validators.min(0)]],
      interes_monto: [0, [Validators.required,Validators.min(0)]],
      id_beca:[1,Validators.required],
      beca_porcentaje:[0,Validators.min(0)],
      cuota_cantidad: [10, [Validators.required,Validators.min(0)]],
      dias_vencimiento: [9, [Validators.required,Validators.min(0)]],
      fecha: [fecha.toDate(), [Validators.required]],
    });
  }

  ngOnInit() {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      paging:false,
      searching:false,
      lengthChange:false,
      info:false,
      ordering:false,
    };

    this.becaService.getAll().subscribe(response=>{
      this.becas = response;
    });
    this.route.queryParams.subscribe(query=>{
      let id_alumno = query['id_alumno'];
      if(id_alumno){
        this.alumnoService.getById(+id_alumno).subscribe(response=>{
          this.alumno = response;
        });
      }
    });

    this.departamentoService.getAll().subscribe(response=>{
      this.departamentos = response;
    });
  }

  seleccionar_departamento(event){
    this.id_departamento = event.target.value;
    this.carrera = null;
    if(this.id_departamento>0){
      this.carreraService._getAll(this.id_departamento).subscribe(response=>{
        this.carreras = response;
      });
    }
  }

  seleccionar_carrera(event){
    let id_carrera = event.target.value;
    this.plan_estudio = null;
    this.id_plan_estudio = null;
    if(id_carrera>0){
      this.carreraService.getById(id_carrera).subscribe(response=>{
        this.carrera = response;
        if(this.carrera.modalidades.length>0){
          this.id_modalidad = this.carrera.modalidades[0].modalidad.id;
        }
        if(this.carrera.id_plan_estudio){
          this.id_plan_estudio = this.carrera.id_plan_estudio;
        }
      });
      this.planService.carrera(id_carrera);
      this.planService.getAll().subscribe(response=>{
        this.planes_estudio = response;
      });
    }
    
  }

  seleccionar_beca(){
    let id = this.f.id_beca.value;
    if(id>1){
      let beca = this.becas.find(data=>data.id == id);
      if(beca){
        this.f.beca_porcentaje.setValue(beca.porcentaje);
      }
    } else {
      this.f.beca_porcentaje.setValue(0);
    }
  }

  confirmar_carrera(){
    this.planService.getById(this.id_plan_estudio).subscribe(response=>{
      this.plan_estudio = response;
    });
    this.planPagoService.precios_ultimo().subscribe(response=>{
      this.f.matricula_monto.setValue(response.matricula_monto);
      this.f.cuota_monto.setValue(response.cuota_monto);
      this.f.interes_monto.setValue(response.interes_monto);
    });
  }

  cambiar_carrera(){
    this.id_departamento = 0;
    this.carrera = null;
    this.plan_estudio = null;
    this.planes_estudio = [];
    this.dataSource = [];
  }

  get f(){
    return this.formulario.controls;
  }

  vista_previa(){
    let plan_pago = <PlanPago>{};
    plan_pago.anio = this.f.anio.value;
    plan_pago.matricula_monto = this.f.matricula_monto.value;
    plan_pago.cuota_monto = this.f.cuota_monto.value;
    plan_pago.beca_porcentaje = this.f.beca_porcentaje.value;
    plan_pago.cuota_cantidad = this.f.cuota_cantidad.value;
    plan_pago.dias_vencimiento = this.f.dias_vencimiento.value;
    let fecha = moment(this.f.fecha.value);
    if(fecha.isValid()){
      plan_pago.fecha = fecha.format('YYYY-MM-DD');
    }
    this.planPagoService.previa(plan_pago).subscribe(response=>{
      this.dataSource = response.obligaciones;
    });
  }

  inscribir(){
    let inscripcion = <Inscripcion>{};
    inscripcion.id_alumno = this.alumno.id;
    inscripcion.id_carrera = this.carrera.id;
    inscripcion.id_plan_estudio = this.plan_estudio.id;
    inscripcion.id_modalidad = this.id_modalidad;
    inscripcion.anio = this.f.anio.value;
    let id = this.f.id_beca.value;
    if(id>1){
      let beca = this.becas.find(data=>data.id == id);
      if(beca){
        inscripcion.id_beca = this.f.id_beca.value;
        inscripcion.beca_nombre = beca.nombre;
        inscripcion.beca_porcentaje = this.f.beca_porcentaje.value;
      }
    } else {
      inscripcion.id_beca = 1;
      inscripcion.beca_nombre = "Ninguna";
      inscripcion.beca_porcentaje = 0;
    }

    let plan_pago = <PlanPago>{};
    plan_pago.matricula_monto = this.f.matricula_monto.value;
    plan_pago.cuota_monto = this.f.cuota_monto.value;
    plan_pago.interes_monto = this.f.interes_monto.value;
    plan_pago.cuota_cantidad = this.f.cuota_cantidad.value;
    plan_pago.dias_vencimiento = this.f.dias_vencimiento.value;
    let fecha = moment(this.f.fecha.value);
    if(fecha.isValid()){
      plan_pago.fecha = fecha.format('YYYY-MM-DD');
    }
    
    const modal = this.modalService.show(DialogConfirmComponent);
    (<DialogConfirmComponent>modal.content).onShow(
      "Finalizar Inscripcion",
      "Esta por inscribir al alumno: "+this.alumno.apellido+" "+this.alumno.nombre+" en la carrera: "+this.carrera.nombre+".¿Desea Continuar?");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.alumnoService.inscribir(inscripcion,plan_pago).subscribe(response=>{
          this.toastr.success('Inscripcion Aceptada', '');
          this.router.navigate(['/academicos/inscripciones/'+response.id+'/ver']);
        });
      }
    });
  }
}
