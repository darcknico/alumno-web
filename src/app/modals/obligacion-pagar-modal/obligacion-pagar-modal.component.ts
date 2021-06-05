import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import 'moment/min/locales';
import { Obligacion } from '../../_models/obligacion';
import { PlanPago } from '../../_models/plan_pago';
import { Subject } from 'rxjs';
import { Pago } from '../../_models/pago';
import { Movimiento, FormaPago } from '../../_models/movimiento';
import { MovimientoService } from '../../_services/movimiento.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-obligacion-pagar-modal',
  templateUrl: './obligacion-pagar-modal.component.html',
  styleUrls: ['./obligacion-pagar-modal.component.scss']
})
export class ObligacionPagarModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formas:FormaPago[]=[];
  plan_pago:PlanPago;
  id_sede:number;
  dataSource:Obligacion[];
  formulario: FormGroup;
  dtOptions: DataTables.Settings = {};
  editado:boolean=true;
  descripcionDefault:string = 'Pago '+moment().format('DD')+' de '+moment().locale('es').format('MMMM')+' del año '+moment().format('YYYY');

  isLoading:boolean = false;
  constructor(
    private planPagoService:PlanPagoService,
    private movimientoService:MovimientoService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    ) {
    this.formulario = this.fb.group({
      especial_covid:false,
      especial_ahora_estudiantes:false,
      especial_nov_dic_2020:false,
      monto: [ 0, Validators.required],
      fecha: [ moment().toDate(), Validators.required],
      descripcion: [this.descripcionDefault,Validators.maxLength(255)],
      bonificar_intereses:false,
      bonificar_cuotas:true,
      id_forma_pago:[null,Validators.required],
      cheque_numero: ['',Validators.maxLength(255)],
      cheque_banco: ['',Validators.maxLength(255)],
      cheque_origen: ['',Validators.maxLength(255)],
      cheque_vencimiento: '',
      numero_transaccion: ['',Validators.maxLength(255)],
      numero_oficial:['',Validators.maxLength(255)],
    });

    this.formulario.valueChanges.subscribe(()=>{
      this.onEditar();
    })

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      paging:false,
      searching:false,
      info:false,
      ordering:false,
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }

  ngOnInit() {
    this.onClose = new Subject();

    this.f.especial_ahora_estudiantes.valueChanges.subscribe(val=>{
      if(val){
        this.f.descripcion.setValue('Ahora estudiantes: '+this.descripcionDefault,{emitEvent:false});
        this.f.monto.setValue(3500,{emitEvent:false});
        this.f.especial_covid.setValue(false,{emitEvent:false});
        this.f.especial_nov_dic_2020.setValue(false,{emitEvent:false});
        this.f.id_forma_pago.setValue(9);
        this.f.id_forma_pago.disable();
      } else {
        this.f.id_forma_pago.enable();
        this.f.id_forma_pago.setValue(null,{emitEvent:false});
        this.f.descripcion.setValue(this.descripcionDefault,{emitEvent:false});
      }
    });
    this.f.especial_covid.valueChanges.subscribe(val=>{
      if(val){
        this.f.descripcion.setValue('COVID: '+this.descripcionDefault,{emitEvent:false});
        this.f.especial_ahora_estudiantes.setValue(false,{emitEvent:false});
        this.f.especial_nov_dic_2020.setValue(false,{emitEvent:false});
        this.f.id_forma_pago.enable();
      } else {
        this.f.descripcion.setValue(this.descripcionDefault,{emitEvent:false});
      }
    });
    this.f.especial_nov_dic_2020.valueChanges.subscribe(val=>{
      if(val){
        this.f.monto.setValue(3000,{emitEvent:false});
        this.f.descripcion.setValue('Nov/Dic2020: '+this.descripcionDefault,{emitEvent:false});
        this.f.especial_ahora_estudiantes.setValue(false,{emitEvent:false});
        this.f.especial_covid.setValue(false,{emitEvent:false});
        this.f.id_forma_pago.setValue(null,{emitEvent:false});
        this.f.id_forma_pago.enable();
      } else {
        this.f.descripcion.setValue(this.descripcionDefault,{emitEvent:false});
      }
    });
  }

  onShow(plan_pago:PlanPago,id_sede:number){
    this.plan_pago = plan_pago;
    this.id_sede = id_sede;
    this.movimientoService.sede(id_sede);
    this.movimientoService.formas().subscribe(response=>this.formas=response);
  }

  get f(){
    return this.formulario.controls;
  }

  preparar(){
    let item = <Pago>{};
    item.id_plan_pago = this.plan_pago.id;
    item.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD HH:mm:ss');
    item.monto = this.f.monto.value;
    item.bonificar_intereses = this.f.bonificar_intereses.value;
    item.bonificar_cuotas = this.f.bonificar_cuotas.value;
    item.especial_covid = this.f.especial_covid.value;
    item.especial_ahora_estudiantes = this.f.especial_ahora_estudiantes.value;
    item.especial_nov_dic_2020 = this.f.especial_nov_dic_2020.value;
    this.isLoading = true;
    this.planPagoService.pagarPreparar(item).subscribe((response:any)=>{
      this.isLoading = false;
      this.editado = false;
      this.dataSource = response.detalles.filter(item=>item.monto>0);
    },()=>{
      this.isLoading = false;
    });
  }

  confirmar(){
    var movimiento = <Movimiento>{}
    movimiento.monto = this.f.monto.value;
    movimiento.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD HH:mm:ss');
    movimiento.id_forma_pago = this.f.id_forma_pago.value;
    movimiento.id_tipo_movimiento = 1;
    movimiento.descripcion = this.f.descripcion.value;
    movimiento.cheque_numero = this.f.cheque_numero.value;
    movimiento.cheque_banco = this.f.cheque_banco.value;
    movimiento.cheque_origen = this.f.cheque_origen.value;
    movimiento.cheque_vencimiento = this.f.cheque_vencimiento.value;
    movimiento.numero_transaccion = this.f.numero_transaccion.value;

    let pago = <Pago>{};
    pago.id_plan_pago = this.plan_pago.id;
    pago.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD HH:mm:ss');
    pago.monto = this.f.monto.value;
    pago.descripcion = this.f.descripcion.value;
    pago.bonificar_intereses = !this.f.bonificar_intereses.value;
    pago.bonificar_cuotas = this.f.bonificar_cuotas.value;
    pago.numero_oficial = this.f.numero_oficial.value;
    pago.especial_covid = this.f.especial_covid.value;
    pago.especial_ahora_estudiantes = this.f.especial_ahora_estudiantes.value;
    pago.especial_nov_dic_2020 = this.f.especial_nov_dic_2020.value;

    this.isLoading = true;
    this.movimientoService.ingreso(movimiento).subscribe(response=>{
      this.toastr.success('Generando Movimiento', '');
      pago.id_movimiento = response.id;
      this.planPagoService.pagar(pago).subscribe((_pago:any)=>{
        this.toastr.success('Pago generado','');
        this.onClose.next(false);
        this.bsModalRef.hide();
        this.router.navigate(['/cuentacorriente/'+this.plan_pago.id+'/pagos/'+_pago.id+'/recibo']);
      },()=>{
        this.isLoading = false;
      });
    },()=>{
      this.isLoading = false;
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  onEditar(){
    this.editado = true;
  }

  disablePagar():boolean{
    return (this.dataSource?this.dataSource.length == 0:true) || this.editado || this.isLoading;
  }
}
