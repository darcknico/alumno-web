import { Component, OnInit } from '@angular/core';
import { Obligacion } from '../../_models/obligacion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pago } from '../../_models/pago';

import * as moment from 'moment';
import 'moment/min/locales';

@Component({
  selector: 'app-pago-bonificar',
  templateUrl: './pago-bonificar.component.html',
  styleUrls: ['./pago-bonificar.component.scss']
})
export class PagoBonificarComponent implements OnInit {

  id:number;
  id_sede:number;
  dataSource:Obligacion[];
  formulario: FormGroup;
  dtOptions: DataTables.Settings = {};
  editado:boolean=true;

  constructor(
    private planPagoService:PlanPagoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.formulario = this.fb.group({
      monto: [ 0, [Validators.required,Validators.min(1)]],
      fecha: [ moment().toDate(), Validators.required],
      id_tipo_pago: [ 2, Validators.required],
      descripcion: 'Pago bonificado '+moment().format('DD')+' de '+moment().locale('es').format('MMMM')+' del año '+moment().format('YYYY'),
    });

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

  ngOnInit(){
    this.id_sede = +localStorage.getItem('id_sede');
    this.planPagoService.sede(this.id_sede);

    this.route.params.subscribe(params=>{
      this.id = +params['id_plan_pago'];
    });
  }

  get f(){
    return this.formulario.controls;
  }

  preparar(){
    let item = <Pago>{};
    item.id_plan_pago = this.id;
    item.fecha = this.f.fecha.value;
    item.monto = this.f.monto.value;
    item.id_tipo_pago = this.f.id_tipo_pago.value;
    this.planPagoService.bonificarPreparar(item).subscribe((response:any)=>{
      this.editado = false;
      this.dataSource = response.detalles.filter(item=>item.monto>0);
    });
  }

  confirmar(){

    let pago = <Pago>{};
    pago.id_plan_pago = this.id;
    pago.fecha = moment(this.f.fecha.value).format('YYYY-MM-DD HH:mm:ss');
    pago.monto = this.f.monto.value;
    pago.descripcion = this.f.descripcion.value;
    pago.id_tipo_pago = this.f.id_tipo_pago.value;
    this.planPagoService.bonificar(pago).subscribe((response:any)=>{
      this.toastr.success('Pago generado','');
      this.volver();
    });
    
  }


  volver(){
    this.router.navigate(['/cuentacorriente/'+this.id+'/ver']);
  }

  onEditar(){
    this.editado = true;
  }

  disablePagar():boolean{
    return (this.dataSource?this.dataSource.length == 0:true) || this.editado;
  }
}
