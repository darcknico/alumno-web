import { Component, OnInit } from '@angular/core';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Pago } from '../../_models/pago';
import { Subject } from 'rxjs';
import { PlanPago } from '../../_models/plan_pago';
import { PagoService } from '../../_services/pago.service';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-modal',
  templateUrl: './pago-modal.component.html',
  styleUrls: ['./pago-modal.component.scss']
})
export class PagoModalComponent implements OnInit {

  public onClose: Subject<boolean>;
  dtOptions: DataTables.Settings = {};
  dataSource:Pago[];
  plan_pago:PlanPago;
  id_sede:number;

  constructor(
    private pagoService:PagoService,
    private planPagoService:PlanPagoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
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
  }

  ngOnInit() {
    this.onClose = new Subject();
  }

  onShow(plan_pago:PlanPago,id_sede:number){
    this.plan_pago = plan_pago;
    this.id_sede = id_sede;
    this.pagoService.sede(id_sede);
    this.planPagoService.pagos(this.plan_pago.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  eliminar(item:Pago){
    let mensaje = "Recuperar Pago";
    if(item.estado){
      mensaje = "Eliminar Pago";
    }
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow(mensaje,"");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.pagoService.delete(item.id).subscribe(response=>{
          if(response.estado){
            this.toastr.success('Pago Recuperado', '');
          } else {
            this.toastr.success('Pago Eliminado', '');
          }
        });
        this.onClose.next(true);
        this.bsModalRef.hide();
      }
    });
  }

  recibo(item:Pago){
    this.onClose.next(false);
    this.bsModalRef.hide();
    this.router.navigate(['/cuentacorriente/'+item.id_plan_pago+'/pagos/'+item.id+'/recibo']);
  }

  cancelar(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  estado(item:Pago):string{
    let color="";
    if(!item.estado){
      color = "#F7BECA";
    }
    return color;
  }
}
