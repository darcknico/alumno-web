import { Component, OnInit } from '@angular/core';
import { InscripcionService } from '../../_services/inscripcion.service';
import { Inscripcion, TipoInscripcionEstado } from '../../_models/inscripcion';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
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

@Component({
  selector: 'app-inscripcion-ver',
  templateUrl: './inscripcion-ver.component.html',
  styleUrls: ['./inscripcion-ver.component.scss']
})
export class InscripcionVerComponent implements OnInit {

  id_sede:number;
  inscripcion:Inscripcion;
  plan_pago:PlanPago;

  dtOptions: DataTables.Settings = {};
  dataSource:PlanPago[];
  obligaciones:Obligacion[];
  tipos_estado:TipoInscripcionEstado[];
  obligacionDtOptions: DataTables.Settings = {};
  formulario:FormGroup;

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
  }

  ngOnInit() {
    this.id_sede = +localStorage.getItem('id_sede');
    this.inscripcionService.sede(this.id_sede);
    this.inscripcionService.tipos_estado().subscribe(response=>{
      this.tipos_estado = response;
    });
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
    this.route.params.subscribe(query=>{
      let id_inscripcion = query['id_inscripcion'];
      if(id_inscripcion){
        this.inscripcionService.getById(+id_inscripcion).subscribe(response=>{
          this.inscripcion = response;
          this.obligaciones = [];
          this.f.id_tipo_inscripcion_estado.setValue(response.id_tipo_inscripcion_estado);
          this.actualizar();
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
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/planes/'+item.id+'/editar']);
  }

  plan_pago_eliminar(item:PlanPago){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Plan de Pago","Eliminara todos los pagos y movimientos asociados al plan \""+item.anio+"\"");
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
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/planes/nuevo']);
  }

  ficha_reporte(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.inscripcionService.reporte_ficha(this.inscripcion.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "ficha_inscripcion_"+this.inscripcion.alumno.documento+".pdf";
      saveAs(blob,filename)
    });
  }

  ficha_imprimir(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.inscripcionService.reporte_ficha(this.inscripcion.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Archivo listo');
      var blob = new Blob([data], {type: 'application/pdf'});
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    });
  }

  constancia_reporte(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.inscripcionService.reporte_constancia_regular(this.inscripcion.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "constancia_alumno_regular_"+this.inscripcion.alumno.documento+".pdf";
      saveAs(blob,filename)
    });
  }

  constancia_imprimir(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.inscripcionService.reporte_constancia_regular(this.inscripcion.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Archivo listo');
      var blob = new Blob([data], {type: 'application/pdf'});
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    });
  }

  analitico_reporte(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.inscripcionService.reporte_analitico(this.inscripcion.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      var mediaType = 'application/pdf';
      var blob = new Blob([data], {type: mediaType});
      var filename = "constancia_alumno_regular_"+this.inscripcion.alumno.documento+".pdf";
      saveAs(blob,filename)
    });
  }

  analitico_imprimir(){
    let aviso = this.toastr.warning('Preparando descarga', '',{
      timeOut:15000,
    });
    this.inscripcionService.reporte_analitico(this.inscripcion.id).subscribe(data =>{
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Archivo listo');
      var blob = new Blob([data], {type: 'application/pdf'});
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
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
        if(data.saldo_total>0 && !this.plan_pago){
          this.plan_pago = data;
          this.planPagoService.cuenta_corriente(this.plan_pago.id).pipe(
            map(data=>{
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
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/editar']);
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
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/comisiones']);
  }

  mesas_examenes(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/mesas']);
  }

  notas(){
    this.router.navigate(['/academicos/inscripciones/'+this.inscripcion.id+'/notas']);
  }
}
