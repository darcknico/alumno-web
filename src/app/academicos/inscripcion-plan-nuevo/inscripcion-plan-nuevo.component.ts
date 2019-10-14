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
import { Location } from '@angular/common';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

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
  plan_pago:PlanPago;
  error;
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
    private location: Location
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
      id_beca:null,
      beca_porcentaje:[0,Validators.min(0)],
      cuota_cantidad: [10, [Validators.required,Validators.min(0)]],
      dias_vencimiento: [9, [Validators.required,Validators.min(0)]],
      fecha: [fecha.toDate(), [Validators.required]],
    });
  }

  ngOnInit() {
    let ids = +localStorage.getItem('id_sede');
    this.inscripcionService.sede(ids);
    
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
    this.route.params.subscribe(query=>{
      let id_plan_pago = query['id_plan_pago'];
      if(id_plan_pago){
        this.planPagoService.getById(+id_plan_pago).subscribe(response=>{
          this.plan_pago = response;
          this.f.anio.setValue(response.anio);
          this.f.matricula_monto.setValue(response.matricula_monto);
          this.f.cuota_monto.setValue(response.cuota_monto);
          this.f.interes_monto.setValue(response.interes_monto);
          this.f.id_beca.setValue(response.id_beca);
          this.f.cuota_cantidad.setValue(response.cuota_cantidad);
          this.f.dias_vencimiento.setValue(response.dias_vencimiento);
          let fecha = moment(response.fecha);
          if(fecha.isValid()){
            this.f.fecha.setValue(fecha.toDate());
          } else {
            fecha = moment().set({
              'year':response.anio,
              'month':1,
              'date':1
            });
            this.f.fecha.setValue(fecha.toDate());
          }
        });
      } else {
        this.planPagoService.precios_ultimo().subscribe(response=>{
          this.f.matricula_monto.setValue(response.matricula_monto);
          this.f.cuota_monto.setValue(response.cuota_monto);
          this.f.interes_monto.setValue(response.interes_monto);
        });
      }
    });
    
  }

  get f(){
    return this.formulario.controls;
  }

  vista_previa(){
    let plan_pago = <PlanPago>{};
    plan_pago.beca_porcentaje = this.f.beca_porcentaje.value;
    plan_pago.anio = this.f.anio.value;
    plan_pago.matricula_monto = this.f.matricula_monto.value;
    plan_pago.cuota_monto = this.f.cuota_monto.value;
    plan_pago.interes_monto = this.f.interes_monto.value;
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

  continuar(){
    let plan_pago = <PlanPago>{};
    plan_pago.id_inscripcion = this.inscripcion.id;
    plan_pago.matricula_monto = this.f.matricula_monto.value;
    plan_pago.cuota_monto = this.f.cuota_monto.value;
    plan_pago.interes_monto = this.f.interes_monto.value;
    plan_pago.anio = this.f.anio.value;
    plan_pago.cuota_cantidad = this.f.cuota_cantidad.value;
    plan_pago.dias_vencimiento = this.f.dias_vencimiento.value;
    plan_pago.beca_porcentaje = this.f.beca_porcentaje.value;
    let fecha = moment(this.f.fecha.value);
    if(fecha.isValid()){
      plan_pago.fecha = fecha.format('YYYY-MM-DD');
    }

    if(this.plan_pago){
      plan_pago.id = this.plan_pago.id;

      const modal = this.modalService.show(DialogConfirmComponent);
      (<DialogConfirmComponent>modal.content).onShow(
        "Editar Plan de pagos",
        "Los pagos realizados no seran eliminados.¿Desea Continuar?");
      (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
        if (result === true) {
          this.planPagoService.update(plan_pago).subscribe(response=>{
            this.toastr.success('Plan editado', '');
            this.volver();
          },error=>{
            this.errores(error);
          });
        }
      });
      
    } else {
      this.planPagoService.store(plan_pago).subscribe(response=>{
        this.toastr.success('Plan generado', '');
        this.volver();
      },error=>{
        this.errores(error);
      });
    }
    
  }

  private errores(error){
    let tipo = error.error.error;
    if(typeof tipo === 'string' || tipo instanceof String){
      this.error = tipo;
    }
    if(error.error.anio){
      this.f.anio.setErrors({
        ocupado:true,
      });
      this.f.anio.markAsDirty();
    }
  }

  volver(){
    this.location.back();
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
