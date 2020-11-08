import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InscripcionService } from '../../_services/inscripcion.service';
import { Inscripcion, TipoInscripcionEstado } from '../../_models/inscripcion';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PlanPago } from '../../_models/plan_pago';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { Obligacion } from '../../_models/obligacion';
import { map} from 'rxjs/operators';
import * as moment from "moment";
import { ObligacionPagarModalComponent } from '../../modals/obligacion-pagar-modal/obligacion-pagar-modal.component';
import { PagoModalComponent } from '../../modals/pago-modal/pago-modal.component';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { TramiteNuevoModalComponent } from '../componentes/tramite-nuevo-modal/tramite-nuevo-modal.component';
import { ListadoPagoInscripcionModalComponent } from '../componentes/listado-pago-inscripcion-modal/listado-pago-inscripcion-modal.component';
import { Chart } from 'chart.js';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';
import { InscripcionEgresadoModalComponent } from '../componentes/inscripcion-egresado-modal/inscripcion-egresado-modal.component';
import { InscripcionAbandonadoModalComponent } from '../componentes/inscripcion-abandonado-modal/inscripcion-abandonado-modal.component';
import dtLanguage from '../../_constants/dtLanguage';
import { ListadoInscripcionEstadoModalComponent } from '../componentes/listado-inscripcion-estado-modal/listado-inscripcion-estado-modal.component';
import { InscripcionEstadoModalComponent } from '../componentes/inscripcion-estado-modal/inscripcion-estado-modal.component';

@Component({
  selector: 'app-inscripcion-ver',
  templateUrl: './inscripcion-ver.component.html',
  styleUrls: ['./inscripcion-ver.component.scss']
})
export class InscripcionVerComponent implements OnInit {
  @ViewChild("rendimientosLineCanvas",{static:true}) rendimientosLineCanvas: any;

  id_sede:number;
  inscripcion:Inscripcion = null;
  plan_pago:PlanPago;

  dtOptions: DataTables.Settings = {};
  dataSource:PlanPago[];
  obligaciones:Obligacion[];
  tipos_estado:TipoInscripcionEstado[];
  obligacionDtOptions: DataTables.Settings = {};
  formulario:FormGroup;
  anios:number[]=[];
  anio:string;
  consultando:boolean = false;
  constructor(
    private inscripcionService:InscripcionService,
    private planPagoService:PlanPagoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    this.formulario = this.fb.group({
      id_tipo_inscripcion_estado:[0,Validators.required],
    });
    this.route.params.subscribe(query=>{
      let id_inscripcion = query['id_inscripcion'];
      let {extras} = this.router.getCurrentNavigation();
      if(extras.state){
        this.inscripcion = extras.state.inscripcion;
        if(this.inscripcion.id != id_inscripcion){
          this.inscripcion = null
        }
      }
      if(id_inscripcion){
        if(this.inscripcion == null){
          this.inscripcionService.getById(+id_inscripcion).subscribe(response=>{
            this.inscripcion = response;
            this.iniciar();
          });
        } else {
          this.iniciar();
        }
      }
    });
  }

  ngOnInit() {
    moment.locale('es');
    this.id_sede = +localStorage.getItem('id_sede');
    this.inscripcionService.sede(this.id_sede);
    this.inscripcionService.tipos_estado().subscribe(response=>{
      this.tipos_estado = response;
    });
    this.dtOptions = {
      language: dtLanguage,
      paging:false,
      searching:false,
      lengthChange:false,
      info:false,
      ordering:false,
    };
    this.rendimientosLineCanvas = new Chart(this.rendimientosLineCanvas.nativeElement, {
      type: 'line',
      options: {
        responsive: true,
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Promedio'
            },
            ticks: {
              max: 10,
              min: 0
            },
          }],
          xAxes: [
            {
              type: 'time',
              time: {
                tooltipFormat: 'MMMM',
                unit: 'month',
                displayFormats: {
                  'month': 'MMMM'
                }
              }
            }
          ],
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(tooltipItems, data) {
              let value = data.datasets[0].data[tooltipItems.index];
              if(tooltipItems.datasetIndex == 0){
                let cantidad = data.datasets[2].data[tooltipItems.index];
                return 'Examen Prom.:' + Number(value).toFixed(2) + ' Cant.:'+cantidad;
              }
              value = data.datasets[1].data[tooltipItems.index];
              if(tooltipItems.datasetIndex == 1){
                let cantidad = data.datasets[3].data[tooltipItems.index];
                return 'Mesa de Examen Prom.:' + Number(value).toFixed(2) +  ' Cant.:'+cantidad;
              }
            }
          }
        },
        legend: {
          labels: {
            filter: function(item, chart) {
                return !item.text.includes('0');
            }
          }
        }
      }
    });
  }

  iniciar(){
    this.obligaciones = [];
    this.f.id_tipo_inscripcion_estado.setValue(this.inscripcion.id_tipo_inscripcion_estado);
    this.actualizar();
    let egreso = moment(this.inscripcion.fecha_egreso);
    if(!egreso.isValid()){
      egreso = moment();
    }
    let fin = egreso.get('year');
    for (let index = this.inscripcion.anio; index <= fin; index++) {
      this.anios.push(index);
    }
    this.anio = String(fin);
    this.rendimientos();
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    let modal;
    const id_tipo_inscripcion_estado:number = Number(this.f.id_tipo_inscripcion_estado.value);
    let tipo_inscripcion = this.tipos_estado.find(t=>t.id == id_tipo_inscripcion_estado);
    switch(id_tipo_inscripcion_estado){
      case 1: //regular
        modal = this.modalService.show(InscripcionEstadoModalComponent,{class: 'modal-lg modal-danger'});
        (<InscripcionEstadoModalComponent>modal.content).onShow(this.inscripcion,tipo_inscripcion);
        (<InscripcionEstadoModalComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            this.inscripcion.id_tipo_inscripcion_estado = this.f.id_tipo_inscripcion_estado.value;
            this.toastr.success('El estado de la inscripción fue cambiado con exito.');
          } else {
            this.f.id_tipo_inscripcion_estado.setValue(this.inscripcion.id_tipo_inscripcion_estado);
          }
        });
        break;
      case 2: //egresado
        modal = this.modalService.show(InscripcionEgresadoModalComponent,{class: 'modal-info'});
        (<InscripcionEgresadoModalComponent>modal.content).onShow(this.inscripcion);
        (<InscripcionEgresadoModalComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            this.inscripcion.id_tipo_inscripcion_estado = this.f.id_tipo_inscripcion_estado.value;
            this.toastr.success('El estado de la inscripción fue cambiado con exito.');
          } else {
            this.f.id_tipo_inscripcion_estado.setValue(this.inscripcion.id_tipo_inscripcion_estado);
          }
        });
        break;
      case 3: //abandono
        modal = this.modalService.show(InscripcionAbandonadoModalComponent,{class: 'modal-lg modal-danger'});
        (<InscripcionAbandonadoModalComponent>modal.content).onShow(this.inscripcion);
        (<InscripcionAbandonadoModalComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            this.inscripcion.id_tipo_inscripcion_estado = this.f.id_tipo_inscripcion_estado.value;
            this.toastr.success('El estado de la inscripción fue cambiado con exito.');
          } else {
            this.f.id_tipo_inscripcion_estado.setValue(this.inscripcion.id_tipo_inscripcion_estado);
          }
        });
        break;
      default:
        modal = this.modalService.show(InscripcionEstadoModalComponent,{class: 'modal-lg modal-danger'});
        (<InscripcionEstadoModalComponent>modal.content).onShow(this.inscripcion,tipo_inscripcion);
        (<InscripcionEstadoModalComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            this.inscripcion.id_tipo_inscripcion_estado = this.f.id_tipo_inscripcion_estado.value;
            this.toastr.success('El estado de la inscripción fue cambiado con exito.');
          } else {
            this.f.id_tipo_inscripcion_estado.setValue(this.inscripcion.id_tipo_inscripcion_estado);
          }
        });
        break;
    }
  }

  cambiar_estado(){
    this.inscripcion.id_tipo_inscripcion_estado = this.f.id_tipo_inscripcion_estado.value;
    this.inscripcionService.estado(this.inscripcion).subscribe(response=>{
      this.toastr.success('El estado de la inscripción fue cambiado con exito.');
    });
  }

  rearmar(){
    this.planPagoService.rearmar(this.plan_pago.id).subscribe(response=>{
      this.actualizar();
    });
  }

  pagos(){
    const modal = this.modalService.show(PagoModalComponent,{class: 'modal-lg modal-info'});
    (<PagoModalComponent>modal.content).onShow(this.plan_pago,this.id_sede);
    (<PagoModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.actualizar();
      }
    });
  }

  plan_pago_ver(item?:PlanPago){
    if(item){
      this.router.navigate(['/cuentacorriente/'+item.id+'/ver']);
    } else {
      this.router.navigate(['/cuentacorriente/'+this.plan_pago.id+'/ver']);
    }
  }

  plan_pago_editar(item:PlanPago){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/planes/'+item.id+'/editar'],{
      state:{
        inscripcion:this.inscripcion,
      }
    });
  }

  plan_pago_eliminar(item:PlanPago){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    let mensaje = "Eliminara todos los pagos y movimientos asociados al plan \""+item.anio+"\"";
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Plan de Pago","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.planPagoService.delete(item.id).subscribe(response=>{
          this.toastr.success('Plan de pago eliminado', '');
          this.actualizar();
        });
      }
    });
  }
  
  nuevo_pago(){
    const modal = this.modalService.show(ObligacionPagarModalComponent,{class: 'modal-lg modal-danger'});
    (<ObligacionPagarModalComponent>modal.content).onShow(this.plan_pago,this.id_sede);
    (<ObligacionPagarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.actualizar();
      }
    });
  }

  nuevo_plan(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/planes/nuevo'],{
      state:{
        inscripcion:this.inscripcion,
      }
    });
  }

  ficha_reporte(){
    this.consultando = true;
    AuxiliarFunction.descargar(this.toastr,this.inscripcionService.reporte_ficha(this.inscripcion.id)).then(()=>{
      this.consultando = false;
    }).catch( ()=>{
      this.consultando = false;
    });
  }

  ficha_imprimir(){
    this.consultando = true;
    AuxiliarFunction.imprimir(this.toastr,this.inscripcionService.reporte_ficha(this.inscripcion.id)).then(()=>{
      this.consultando = false;
    }).catch( ()=>{
      this.consultando = false;
    });
  }

  constancia_reporte(){
    this.consultando = true;
    AuxiliarFunction.descargar(this.toastr,this.inscripcionService.reporte_constancia_regular(this.inscripcion.id)).then(()=>{
      this.consultando = false;
    }).catch( ()=>{
      this.consultando = false;
    });
  }

  constancia_imprimir(){
    this.consultando = true;
    AuxiliarFunction.imprimir(this.toastr,this.inscripcionService.reporte_constancia_regular(this.inscripcion.id)).then(()=>{
      this.consultando = false;
    }).catch( ()=>{
      this.consultando = false;
    });
  }

  analitico_reporte(){
    this.consultando = true;
    AuxiliarFunction.descargar(this.toastr,this.inscripcionService.reporte_analitico(this.inscripcion.id)).then(()=>{
      this.consultando = false;
    }).catch( ()=>{
      this.consultando = false;
    });
  }

  analitico_imprimir(){
    this.consultando = true;
    AuxiliarFunction.imprimir(this.toastr,this.inscripcionService.reporte_analitico(this.inscripcion.id)).then(()=>{
      this.consultando = false;
    }).catch( ()=>{
      this.consultando = false;
    });
  }

  cursadas_reporte(){
    this.consultando = true;
    AuxiliarFunction.descargar(this.toastr,this.inscripcionService.reporte_cursadas(this.inscripcion.id)).then(()=>{
      this.consultando = false;
    }).catch( ()=>{
      this.consultando = false;
    });
  }

  cursadas_imprimir(){
    this.consultando = true;
    AuxiliarFunction.imprimir(this.toastr,this.inscripcionService.reporte_cursadas(this.inscripcion.id)).then(()=>{
      this.consultando = false;
    }).catch( ()=>{
      this.consultando = false;
    });
  }

  onClickInscripcionEstado(){
    const modal = this.modalService.show(ListadoInscripcionEstadoModalComponent,{class: 'modal-lg modal-danger'});
    (<ListadoInscripcionEstadoModalComponent>modal.content).onShow(this.inscripcion);
    (<ListadoInscripcionEstadoModalComponent>modal.content).onClose.subscribe(result => {
      
    });
  }

  /**
   * TABLA
   */
  id_ultimo:number = 0 ;
  actualizar(){
    this.obligaciones = null;
    this.plan_pago = null;
    this.dataSource = null;
    this.inscripcionService.planes_pago(this.inscripcion.id).subscribe(response=>{
      this.dataSource = response;      
      this.dataSource.forEach(data => {
        if(data.saldo_total>0 && !this.plan_pago && data.estado){
          this.plan_pago = data;
          this.planPagoService.cuenta_corriente(this.plan_pago.id).pipe(
            map((data:any)=>{
              if(data.length>0){
                let acum = 0;
                let fechaUltimo = moment(data[0].fecha_vencimiento);
                let fechaAhora = moment();
                let fechaDias = fechaAhora.diff(fechaUltimo,'days');
                let id_concepto_ultimo = data[0].id_tipo_obligacion;
                this.id_ultimo = data[0].id;
                data.forEach(item=>{
                  if(item.estado){
                    if([1,2,10].indexOf(item.id_tipo_obligacion) >= 0 ){
                      acum += +item.monto;
                    }
                    if([3,4].indexOf(item.id_tipo_obligacion) >= 0 ){
                      acum -= +item.monto;
                    }
                  }
                  item.acumulado = acum;
                  let fechaUltimoAux = moment(item.fecha_vencimiento);
                  if(fechaAhora.isAfter(fechaUltimoAux) || fechaAhora.isSame(fechaUltimoAux)){
                    let fechaDiasAux = fechaAhora.diff(fechaUltimoAux,'days');
                    if(fechaDias>=fechaDiasAux){
                      if( fechaDias == fechaDiasAux){
                        if(id_concepto_ultimo <= item.id_tipo_obligacion){
                          id_concepto_ultimo = item.id_tipo_obligacion;
                          fechaUltimo = fechaUltimoAux;
                          fechaDias = fechaDiasAux;
                          this.id_ultimo = item.id;
                        }
                      } else {
                        fechaUltimo = fechaUltimoAux;
                        fechaDias = fechaDiasAux;
                        this.id_ultimo = item.id;
                      }
                    }
                  }
                  return item;
                });
              }
              return data;
          })).subscribe(response => {
            this.obligaciones = (response);
          });
        }
      });
    });
  }
  ultimo(item:Obligacion):string{
    let color="";
    if(!item.estado){
      color = "#F7BECA";
    }else if(item.id==this.id_ultimo){
      color="#71BA79";
    }
    return color;
  }

  editar(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/editar'],{
        state:{
          inscripcion:this.inscripcion,
        }
    });
  }

  ver_alumno(){
    this.router.navigate(['/academicos/alumnos/'+this.inscripcion.id_alumno+'/ver']);
  }

  nuevo_tramite(){
    const modal = this.modalService.show(TramiteNuevoModalComponent,{class: 'modal-lg modal-danger'});
    (<TramiteNuevoModalComponent>modal.content).onShow(this.inscripcion);
    (<TramiteNuevoModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.pagos_inscripcion();
      }
    });
  }
  
  pagos_inscripcion(){
    const modal = this.modalService.show(ListadoPagoInscripcionModalComponent,{class: 'modal-lg modal-danger'});
    (<ListadoPagoInscripcionModalComponent>modal.content).onShow(this.inscripcion);
    (<ListadoPagoInscripcionModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.actualizar();
      }
    });
  }

  comisiones(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/comisiones'],{
      state:{
        inscripcion:this.inscripcion,
      }
    });
  }
  comisiones_nuevo(){
    this.router.navigate(['/comisiones/carreras/'+this.inscripcion.id_carrera],{
      queryParams:{
        id_inscripcion:this.inscripcion.id,
      }
    });
  }
  comisiones_masivo(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/comisiones/masivo'],{
      state:{
        inscripcion:this.inscripcion,
      }
    });
  }

  mesas_examenes(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/mesas'],{
      state:{
        inscripcion:this.inscripcion,
      }
    });
  }
  mesas_examenes_nuevo(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/mesas/nuevo'],{
      state:{
        inscripcion:this.inscripcion,
      }
    });
  }
  mesas_examenes_masivo(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/mesas/masivo'],{
      state:{
        inscripcion:this.inscripcion,
      }
    });
  }

  notas(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/notas'],{
      state:{
        inscripcion:this.inscripcion,
      }
    });
  }

  rendimientos(){
    this.inscripcionService.rendimientos(this.inscripcion.id,this.anio).subscribe((response:any)=>{
      let label = [];
      let notas_total = [];
      let notas_cantidad = [];
      let mesas_total = [];
      let mesas_cantidad = [];
      response.notas.forEach(item => {
        let fecha = moment([item.anio,item.mes-1,1]);
        label.push(fecha);
        notas_total.push(item.total);
        notas_cantidad.push(item.cantidad);
      });
      response.mesas.forEach(item => {
        mesas_total.push(item.total);
        mesas_cantidad.push(item.cantidad);
      });
      var lineChartData = {
        labels: label,
        datasets: [{
          label: 'Promedio de nota por Examenes',
          borderColor: "rgba(255, 99, 132, 0.2)",
          backgroundColor: "red",
          fill: false,
          data: notas_total,
        },{
          label: 'Promedio de nota por Mesa de Examen',
          borderColor: "rgba(255, 159, 64, 0.2)",
          backgroundColor: "orange",
          fill: false,
          data: mesas_total,
        },{
          label: '0',
          hidden:true,
          data: notas_cantidad,
        },{
          label: '0',
          hidden:true,
          data: mesas_cantidad,
        }]
      };
      this.rendimientosLineCanvas.data = lineChartData;
      this.rendimientosLineCanvas.options.title = {
        display: true,
        text: 'Rendimiento Academico - Periodo: '+this.anio,
      },
      this.rendimientosLineCanvas.update();
    });
  }
}
