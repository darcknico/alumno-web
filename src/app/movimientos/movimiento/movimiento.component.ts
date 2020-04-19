import { Component, OnInit } from '@angular/core';
import { MovimientoService } from '../../_services/movimiento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormaPago, TipoMovimiento, Movimiento, TipoComprobante } from '../../_models/movimiento';
import { AuthenticationService } from '../../_services/authentication.service';
import { TipoMovimientoService } from '../../_services/tipo_movimiento.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SedeService } from '../../_services/sede.service';
import { SedeProvider } from '../../_providers/sede.provider';

@Component({
  selector: 'app-movimiento',
  templateUrl: './movimiento.component.html',
  styleUrls: ['./movimiento.component.scss']
})
export class MovimientoComponent implements OnInit {

  titulo:string;
  id_tipo_egreso_ingreso:number;
  formas:FormaPago[]=[];
  tipos:TipoMovimiento[]=[];
  comprobantes:TipoComprobante[]=[];
  formulario: FormGroup;

  constructor(
    private movimientoService:MovimientoService,
    private sedeService:SedeProvider,
    private tipoMovimientoService:TipoMovimientoService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    
    this.formulario = this.fb.group({
      monto: [0, [Validators.required,Validators.min(0)]],
      fecha: [moment().toDate(), Validators.required],
      id_forma_pago: [null, Validators.required],
      id_tipo_movimiento: [null, Validators.required],
      descripcion: '',
      cheque_numero: '',
      cheque_banco: '',
      cheque_origen: '',
      cheque_vencimiento: '',
      numero: '',
      id_tipo_comprobante: null,
    });
  }

  ngOnInit() {
    let id_sede = this.sedeService.getIdSede();
    this.movimientoService.sede(id_sede);
    this.tipoMovimientoService.sede(id_sede);

    this.movimientoService.formas().subscribe(response=>{
      this.formas = response;
    });
    this.movimientoService.comprobantes().subscribe(response=>{
      this.comprobantes=response
    });
    this.route.params.subscribe(params=>{
      let id = params['id_tipo_egreso_ingreso'];
      if(id==null){
        this.router.navigate(['/movimientos/listado']);
      } else {
        this.id_tipo_egreso_ingreso = id;
      }
      this.iniciar();
    });
  }

  iniciar(){
    if(this.id_tipo_egreso_ingreso == 1){
      this.titulo = "Generar Ingreso";
      this.tipoMovimientoService.ingresos().subscribe(response=>{
        this.tipos = response;
      });
    } else {
      this.titulo = "Generar Egreso";
      this.tipoMovimientoService.egresos().subscribe(response=>{
        this.tipos = response;
      });
    }
  }

  get f(){
    return this.formulario.controls;
  }

  continuar(){
    if(!this.formulario.valid){
      return;
    }
    var item = <Movimiento>{}
    item.monto = this.f.monto.value;
    item.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD HH:mm:ss');
    item.id_forma_pago = this.f.id_forma_pago.value;
    item.id_tipo_movimiento = this.f.id_tipo_movimiento.value;
    item.descripcion = this.f.descripcion.value;
    item.cheque_numero = this.f.cheque_numero.value;
    item.cheque_banco = this.f.cheque_banco.value;
    item.cheque_origen = this.f.cheque_origen.value;
    item.cheque_vencimiento = this.f.cheque_vencimiento.value;
    item.numero = this.f.numero.value;
    item.id_tipo_comprobante = this.f.id_tipo_comprobante.value;
    if(this.id_tipo_egreso_ingreso==1){
      this.movimientoService.ingreso(item).subscribe(response=>{
        this.toastr.success('Nuevo Ingreso Agregado', '');
        this.volver();
      });
    } else {
      this.movimientoService.egreso(item).subscribe(response=>{
        this.toastr.success('Nuevo Egreso Agregado', '');
        this.volver();
      });
    }
  }

  volver(){
    this.router.navigate(['/movimientos/listado']);
  }
}
