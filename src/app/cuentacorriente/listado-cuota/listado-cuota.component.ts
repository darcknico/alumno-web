import { Component, OnInit } from '@angular/core';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Obligacion } from '../../_models/obligacion';
import { ObligacionVerModalComponent } from '../componente/obligacion-ver-modal/obligacion-ver-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-listado-cuota',
  templateUrl: './listado-cuota.component.html',
  styleUrls: ['./listado-cuota.component.scss']
})
export class ListadoCuotaComponent implements OnInit {
  id:number;
  dataSource:Obligacion[];
  dtOptions: DataTables.Settings = {};

  constructor(
    private planPagoService:PlanPagoService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
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

    this.route.params.subscribe(params=>{
      this.id = +params['id_plan_pago'];
      this.actualizar();
    });
  }

  volver(){
    this.router.navigate(['/cuentacorriente/'+this.id+'/ver']);
  }

  actualizar(){
    this.planPagoService.cuotas(this.id).subscribe(response=>{
      this.dataSource = response;
    });
  }

  ver(item:Obligacion){
    const modal = this.modalService.show(ObligacionVerModalComponent,{class: 'modal-lg modal-info'});
    (<ObligacionVerModalComponent>modal.content).onShow(item);
    (<ObligacionVerModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.actualizar();
      }
    });
  }

}
