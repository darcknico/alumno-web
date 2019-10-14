import { Component, OnInit, Input } from '@angular/core';
import { Obligacion } from '../../../_models/obligacion';
import { PlanPagoService } from '../../../_services/plan_pago.service';
import { PlanPago } from '../../../_models/plan_pago';

import { map} from 'rxjs/operators';
import * as moment from "moment";
import { ObligacionVerModalComponent } from '../obligacion-ver-modal/obligacion-ver-modal.component';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-cuenta-corriente-component',
  templateUrl: './cuenta-corriente.component.html',
  styleUrls: ['./cuenta-corriente.component.scss']
})
export class CuentaCorrienteComponent implements OnInit {

  @Input('plan_pago') plan_pago:PlanPago;
  dtOptions: DataTables.Settings = {};
  dataSource:Obligacion[];
  
  constructor(
    private planPagoService:PlanPagoService,
    private modalService: BsModalService,
    ) { }

  ngOnInit() {
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
    this.actualizar();
  }

  /**
   * TABLA
   */
  id_ultimo:number = 0 ;
  actualizar(){
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
      this.dataSource = (response);
    });
  }
  ver(item:Obligacion){
    const modal = this.modalService.show(ObligacionVerModalComponent,{class: 'modal-info'});
    (<ObligacionVerModalComponent>modal.content).onShow(item);
    (<ObligacionVerModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        
      }
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

  rearmar(){
    this.planPagoService.rearmar(this.plan_pago.id).subscribe(response=>{
      this.actualizar();
    });
  }
}
