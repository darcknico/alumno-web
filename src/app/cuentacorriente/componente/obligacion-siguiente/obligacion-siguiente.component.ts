import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlanPagoService } from '../../../_services/plan_pago.service';
import { Obligacion } from '../../../_models/obligacion';

@Component({
  selector: 'app-obligacion-siguiente-component',
  templateUrl: './obligacion-siguiente.component.html',
  styleUrls: ['./obligacion-siguiente.component.scss']
})
export class ObligacionSiguienteComponent implements OnInit {

  @Input('id_plan_pago') id_plan_pago:number;
  @Input('id_tipo_obligacion') id_tipo_obligacion:number = 1;

  @Output() siguiente = new EventEmitter();

  obligacion:Obligacion;
  dtOptions: DataTables.Settings = {};
  
  constructor(
    private planPagoService:PlanPagoService,
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
  }

  ngOnInit() {
    this.planPagoService.siguiente(this.id_plan_pago,this.id_tipo_obligacion).subscribe(response=>{
      if(response.estado){
        this.obligacion = response;
        this.obligacion.acumulado = this.obligacion.monto - this.obligacion.saldo;
      } else {
        this.obligacion = <Obligacion>{};
        this.obligacion.estado = false;
      }
      this.siguiente.emit(this.obligacion);
    });
  }

}
