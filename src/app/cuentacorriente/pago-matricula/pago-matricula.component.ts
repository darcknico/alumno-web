import { Component, OnInit } from '@angular/core';
import { FormaPago, Movimiento } from '../../_models/movimiento';
import { Obligacion } from '../../_models/obligacion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { MovimientoService } from '../../_services/movimiento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pago } from '../../_models/pago';

import * as moment from 'moment';
import 'moment/min/locales';

@Component({
  selector: 'app-pago-matricula',
  templateUrl: './pago-matricula.component.html',
  styleUrls: ['./pago-matricula.component.scss']
})
export class PagoMatriculaComponent implements OnInit {

  id:number;
  id_sede:number;
  formas:FormaPago[]=[];
  formulario: FormGroup;
  editado:boolean=true;

  obligacion:Obligacion;

  constructor(
    private planPagoService:PlanPagoService,
    private movimientoService:MovimientoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.formulario = this.fb.group({
      monto: [ 0, [Validators.required,Validators.min(1)]],
      fecha: [ moment().toDate(), Validators.required],
      descripcion: 'Pago '+moment().format('DD')+' de '+moment().locale('es').format('MMMM')+' del año '+moment().format('YYYY'),
      id_forma_pago:[1,Validators.required],
      cheque_numero: '',
      cheque_banco: '',
      cheque_origen: '',
      cheque_vencimiento: '',
    });
  }

  ngOnInit(){
    this.id_sede = +localStorage.getItem('id_sede');
    this.planPagoService.sede(this.id_sede);
    this.movimientoService.sede(this.id_sede);
    this.movimientoService.formas().subscribe(response=>this.formas=response);

    this.route.params.subscribe(params=>{
      this.id = +params['id_plan_pago'];
    });
  }

  get f(){
    return this.formulario.controls;
  }

  confirmar(){
    if(!this.obligacion){
      this.toastr.error('No hay saldo de matricula a pagar');
      return;
    }
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

    let pago = <Pago>{};
    pago.id_plan_pago = this.id;
    pago.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD HH:mm:ss');
    pago.monto = this.f.monto.value;
    pago.descripcion = this.f.descripcion.value;

    if(this.obligacion.saldo<pago.monto){
      this.toastr.error('El monto a pagar es mayor al saldo de la matricula');
      return;
    }
    this.movimientoService.ingreso(movimiento).subscribe(response=>{
      this.toastr.success('Generando Movimiento', '');
      pago.id_movimiento = response.id;
      this.planPagoService.pagarMatricula(pago).subscribe((response:any)=>{
        this.toastr.success('Pago generado','');
        this.router.navigate(['/cuentacorriente/'+this.id+'/pagos/'+response.id+'/recibo']);
      });
    });
  }

  volver(){
    this.router.navigate(['/cuentacorriente/'+this.id+'/ver']);
  }

  onEditar(){
    this.editado = true;
  }

  disablePagar():boolean{
    if(this.obligacion){
      if(this.obligacion.estado){
        return !this.formulario.valid;
      } else {
        return true;
      }
    } else {
      return !this.formulario.valid;
    }
    
  }

  siguiente(obligacion){
    this.obligacion = obligacion;
  }
}
