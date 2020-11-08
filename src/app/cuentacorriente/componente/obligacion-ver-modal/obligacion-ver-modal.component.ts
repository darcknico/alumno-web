import { Component, OnInit } from '@angular/core';
import { ObligacionService } from '../../../_services/obligacion.service';
import { ObligacionPago, Obligacion, PaymentMercadoPago } from '../../../_models/obligacion';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SedeProvider } from '../../../_providers/sede.provider';

@Component({
  selector: 'app-obligacion-ver-modal',
  templateUrl: './obligacion-ver-modal.component.html',
  styleUrls: ['./obligacion-ver-modal.component.scss']
})
export class ObligacionVerModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  dtOptions: DataTables.Settings = {};
  dataSource:ObligacionPago[];
  item:Obligacion;

  isFormularioMercadoPago:boolean = false;
  formulario:FormGroup;
  consultando:boolean = false;

  mercadoPagoHabilitado:boolean = false;

  constructor(
    private service:ObligacionService,
    private sede:SedeProvider,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private fb:FormBuilder,
    public bsModalRef: BsModalRef,
    private router: Router,
    ) { 
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
    this.formulario = this.fb.group({
      monto:[0,[Validators.required, Validators.min(0.01)]],
      email:["", [Validators.required, Validators.email]],
      observaciones:["",Validators.maxLength(100)],
    })
  }

  get f(){
    return this.formulario.controls;
  }

  ngOnInit() {
    this.mercadoPagoHabilitado = this.sede.getSede().sede.mercadopago;
    this.onClose = new Subject();
  }

  abrirFormularioMercadoPago(){
    if(!this.mercadoPagoHabilitado){
      this.toastr.warning('La sede no se encuentra habilitada para generar link de mercadopago');
      return;
    }
    this.isFormularioMercadoPago = true;
    this.f.monto.setValue(this.item.saldo);
    if(this.item.inscripcion && this.item.inscripcion.alumno && this.item.inscripcion.alumno.email){
      this.f.email.setValue(this.item.inscripcion.alumno.email);
    }
  }

  generarPreferenciaMercadoPago(){
    if(!this.formulario.valid){
      return;
    }
    let preferencia = <PaymentMercadoPago>{};
    preferencia.id_obligacion = this.item.id;
    preferencia.monto = this.f.monto.value;
    preferencia.email = this.f.email.value;
    preferencia.observaciones = this.f.observaciones.value;

    this.service.mercadopago(preferencia).subscribe((response)=>{
      this.isFormularioMercadoPago = false;
      this.onClose.next(true);
      this.actualizar();
      
    });
  }

  eliminarPreferenciaMercadoPago(){
    this.consultando = true;
    this.service.mercadopagoEliminar(this.item.mercadopago).subscribe((response)=>{
      this.consultando = false;
      this.onClose.next(true);
    });
  }

  onShow(item:Obligacion){
    this.item = item;
    this.actualizar();
  }

  actualizar(){
    this.service.getById(this.item.id).subscribe(response=>{
      this.item = response;
      this.dataSource = response.pagos;
    });
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  estado(item:ObligacionPago):string{
    let color="";
    if(!item.estado){
      color = "#F7BECA";
    }
    return color;
  }

  copied(e){
    this.toastr.info("Link copiado");
  }
}
