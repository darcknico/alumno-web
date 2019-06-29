import { Component, OnInit } from '@angular/core';
import { InscripcionService } from '../../_services/inscripcion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { Inscripcion } from '../../_models/inscripcion';
import { Obligacion } from '../../_models/obligacion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlumnoService } from '../../_services/alumno.service';
import { PlanPago } from '../../_models/plan_pago';
import { Beca } from '../../_models/beca';
import { BecaService } from '../../_services/beca.service';
import * as moment from 'moment';

@Component({
  selector: 'app-inscripcion-plan-nuevo',
  templateUrl: './inscripcion-plan-nuevo.component.html',
  styleUrls: ['./inscripcion-plan-nuevo.component.scss']
})
export class InscripcionPlanNuevoComponent implements OnInit {
  inscripcion:Inscripcion;
  becas:Beca[]=[];

  dtOptions: DataTables.Settings = {};
  dataSource:Obligacion[]=[];
  formulario: FormGroup;
  
  constructor(
    private inscripcionService:InscripcionService,
    private planPagoService:PlanPagoService,
    private alumnoService:AlumnoService,
    private becaService:BecaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { 

    this.formulario = this.fb.group({
      anio: [moment().get('year'), [Validators.required, Validators.minLength(4)]],
      matricula_monto: [0, Validators.required],
      cuota_monto: [0, Validators.required],
      interes_monto: [0, Validators.required],
      id_beca:[1,Validators.required],
      beca_porcentaje:'',
    });
  }

  ngOnInit() {
    let ids = +localStorage.getItem('id_sede');
    this.inscripcionService.sede(ids);
    this.planPagoService.sede(ids);
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      searching:false,
      paging:false,
      lengthChange:false,
      info:false,
      ordering:false,
    };
    this.becaService.getAll().subscribe(response=>{
      this.becas = response;
    });
    this.route.params.subscribe(query=>{
      let ids = query['id_inscripcion'];
      if(ids){
        this.inscripcionService.getById(ids).subscribe(response=>{
          this.inscripcion = response;
          this.f.id_beca.setValue(this.inscripcion.id_beca);
          this.f.beca_porcentaje.setValue(this.inscripcion.beca_porcentaje);
        });
      }
    });
    this.planPagoService.precios_ultimo().subscribe(response=>{
      this.f.matricula_monto.setValue(response.matricula_monto);
      this.f.cuota_monto.setValue(response.cuota_monto);
      this.f.interes_monto.setValue(response.interes_monto);
    });
  }

  get f(){
    return this.formulario.controls;
  }

  vista_previa(){
    let inscripcion = <Inscripcion>{};
    inscripcion.id_alumno = this.inscripcion.id_alumno;
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

    this.alumnoService.inscribir_previa(inscripcion,plan_pago).subscribe(response=>{
      this.dataSource = response;
    });
  }

  continuar(){
    let plan_pago = <PlanPago>{};
    plan_pago.id_inscripcion = this.inscripcion.id;
    plan_pago.matricula_monto = this.f.matricula_monto.value;
    plan_pago.cuota_monto = this.f.cuota_monto.value;
    plan_pago.interes_monto = this.f.interes_monto.value;
    plan_pago.anio = this.f.anio.value;
    let id = this.f.id_beca.value;
    if(id>1){
      let beca = this.becas.find(data=>data.id == id);
      if(beca){
        plan_pago.id_beca = this.f.id_beca.value;
        plan_pago.beca_nombre = beca.nombre;
        plan_pago.beca_porcentaje = this.f.beca_porcentaje.value;
      }
    } else {
      plan_pago.id_beca = 1;
      plan_pago.beca_nombre = "Ninguna";
      plan_pago.beca_porcentaje = 0;
    }
    
    this.planPagoService.store(plan_pago).subscribe(response=>{
      this.toastr.success('Inscripcion Aceptada', '');
      this.volver();
    });
  }

  volver(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/ver']);
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

}
