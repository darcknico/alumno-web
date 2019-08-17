import { Component, OnInit } from '@angular/core';
import { Movimiento, FormaPago, TipoMovimiento, TipoComprobante } from '../../_models/movimiento';
import { Subject } from 'rxjs';
import { Obligacion } from '../../_models/obligacion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { MovimientoService } from '../../_services/movimiento.service';
import { TipoMovimientoService } from '../../_services/tipo_movimiento.service';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-movimiento-editar-modal',
  templateUrl: './movimiento-editar-modal.component.html',
  styleUrls: ['./movimiento-editar-modal.component.scss']
})
export class MovimientoEditarModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formas:FormaPago[]=[];
  tipos:TipoMovimiento[]=[];
  comprobantes:TipoComprobante[]=[];
  movimiento:Movimiento;
  formulario: FormGroup;

  constructor(
    private planPagoService:PlanPagoService,
    private movimientoService:MovimientoService,
    private tipoMovimientoService:TipoMovimientoService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
    ) {
    this.formulario = this.fb.group({
      monto: '',
      fecha: '',
      descripcion: '',
      id_forma_pago:[null,Validators.required],
      id_tipo_comprobante:null,
      id_tipo_movimiento:[null,Validators.required],
      cheque_numero: '',
      cheque_banco: '',
      cheque_origen: '',
      cheque_vencimiento: '',
      numero:'',
    });
    this.f.monto.disable();
    this.f.fecha.disable();
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  onShow(movimiento:Movimiento){
    this.movimiento = movimiento;
    this.f.monto.setValue(movimiento.monto);
    this.f.fecha.setValue(moment(movimiento.fecha).toDate());
    this.f.descripcion.setValue(movimiento.descripcion);
    this.f.id_forma_pago.setValue(movimiento.id_forma_pago);
    this.f.id_tipo_comprobante.setValue(movimiento.id_tipo_comprobante);
    this.f.id_tipo_movimiento.setValue(movimiento.id_tipo_movimiento);
    this.f.cheque_numero.setValue(movimiento.cheque_numero);
    this.f.cheque_banco.setValue(movimiento.cheque_banco);
    this.f.cheque_origen.setValue(movimiento.cheque_origen);
    let cheque_vencimiento = moment(movimiento.cheque_vencimiento);
    if(cheque_vencimiento.isValid()){
      this.f.cheque_vencimiento.setValue(cheque_vencimiento.toDate());
    }
    this.f.numero.setValue(movimiento.numero);
    this.movimientoService.sede(movimiento.id_sede);
    this.tipoMovimientoService.sede(movimiento.id_sede);
    this.movimientoService.formas().subscribe(response=>this.formas=response);
    this.movimientoService.comprobantes().subscribe(response=>{
      this.comprobantes=response
    });
    if(movimiento.id_tipo_egreso_ingreso == 1){
      this.tipoMovimientoService.ingresos().subscribe(response=>{
        this.tipos = response;
      });
    } else {
      this.tipoMovimientoService.egresos().subscribe(response=>{
        this.tipos = response;
      });
    }
  }

  get f(){
    return this.formulario.controls;
  }

  confirmar(){
    if(!this.formulario.valid){
      return ;
    }
    this.movimiento.id_forma_pago = this.f.id_forma_pago.value;
    this.movimiento.id_tipo_comprobante = this.f.id_tipo_comprobante.value;
    this.movimiento.id_tipo_movimiento = 1;
    this.movimiento.descripcion = this.f.descripcion.value;
    this.movimiento.cheque_numero = this.f.cheque_numero.value;
    this.movimiento.cheque_banco = this.f.cheque_banco.value;
    this.movimiento.cheque_origen = this.f.cheque_origen.value;
    this.movimiento.cheque_vencimiento = this.f.cheque_vencimiento.value;
    this.movimiento.numero = this.f.numero.value;

    this.movimientoService.update(this.movimiento).subscribe(response=>{
      this.toastr.success('Movimiento Editado', '');
      this.onClose.next(true);
      this.bsModalRef.hide();
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }


}
