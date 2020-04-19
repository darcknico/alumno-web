import { Component, OnInit } from '@angular/core';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pago } from '../../_models/pago';
import { PagoService } from '../../_services/pago.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listado-pago',
  templateUrl: './listado-pago.component.html',
  styleUrls: ['./listado-pago.component.scss']
})
export class ListadoPagoComponent implements OnInit {
  id:number;
  dataSource:Pago[];
  dtOptions: DataTables.Settings = {};

  constructor(
    private pagoService:PagoService,
    private planPagoService:PlanPagoService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.pagoService.sede(id_sede);
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

    this.route.params.subscribe(params=>{
      this.id = +params['id_plan_pago'];
      this.refrescar();
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
        this.refrescar();
        });
      }
    });
  }

  recibo(item:Pago){
    this.router.navigate(['/cuentacorriente/'+item.id_plan_pago+'/pagos/'+item.id+'/recibo']);
  }

  refrescar(){
    this.planPagoService.pagos(this.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  volver(){
    this.router.navigate(['/cuentacorriente/'+this.id+'/ver']);
  }

  generar_pago(){
    this.router.navigate(['/cuentacorriente/'+this.id+'/pagos/cuotas']);
  }

  generar_pago_bonificado(){
    this.router.navigate(['/cuentacorriente/'+this.id+'/pagos/bonificar']);
  }

  generar_pago_matricula(){
    this.router.navigate(['/cuentacorriente/'+this.id+'/pagos/matricula']);
  }
}
