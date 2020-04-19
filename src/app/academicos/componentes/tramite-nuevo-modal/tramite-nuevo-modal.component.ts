import { Component, OnInit } from '@angular/core';
import { TramiteService } from '../../../_services/tramite.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientoService } from '../../../_services/movimiento.service';
import { Subject } from 'rxjs';
import { FormaPago, Movimiento } from '../../../_models/movimiento';
import { TipoTramite } from '../../../_models/tramite';
import * as moment from 'moment';
import { Inscripcion } from '../../../_models/inscripcion';

@Component({
  selector: 'app-tramite-nuevo-modal',
  templateUrl: './tramite-nuevo-modal.component.html',
  styleUrls: ['./tramite-nuevo-modal.component.scss']
})
export class TramiteNuevoModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  formas:FormaPago[]=[];
  tipos:TipoTramite[]=[];
  inscripcion:Inscripcion;
  formulario: FormGroup;
  editado:boolean=true;

  constructor(
    private tramiteService:TramiteService,
    private movimientoService:MovimientoService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private fb: FormBuilder,
  ) {
    this.formulario = this.fb.group({
      monto: [ 0, [Validators.required,Validators.min(1)]],
      fecha: [ moment().toDate(), Validators.required],
      descripcion: 'Pago tramite',
      id_forma_pago:[1,Validators.required],
      id_tipo_tramite:[null,Validators.required],
      cheque_numero: '',
      cheque_banco: '',
      cheque_origen: '',
      cheque_vencimiento: '',
      numero_oficial:'',
    });
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  onShow(inscripcion:Inscripcion){
    this.inscripcion = inscripcion;
    
    this.tramiteService.sede(inscripcion.id_sede);
    this.movimientoService.sede(inscripcion.id_sede);
    this.movimientoService.formas().subscribe(response=>this.formas=response);
    this.tramiteService.tipos().subscribe(response=>this.tipos=response);
  }

  get f(){
    return this.formulario.controls;
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

    let pago = <any>{};
    pago.id_inscripcion = this.inscripcion.id;
    pago.id_tipo_tramite = this.f.id_tipo_tramite.value;
    pago.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD HH:mm:ss');
    pago.monto = this.f.monto.value;
    pago.descripcion = this.f.descripcion.value;
    pago.numero_oficial = this.f.numero_oficial.value;

    this.movimientoService.ingreso(movimiento).subscribe(response=>{
      this.toastr.success('Generando Movimiento', '');
      pago.id_movimiento = response.id;
      this.tramiteService.register(pago).subscribe((_pago:any)=>{
        this.toastr.success('Pago generado','');
        this.onClose.next(true);
        this.bsModalRef.hide();
      });
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  onTipo(event){
    let tipo = this.tipos.find(item=>item.id == Number(event.target.value))
    this.f.descripcion.setValue('Pago: '+tipo.nombre);
    this.f.monto.setValue(tipo.monto);
  }


}
