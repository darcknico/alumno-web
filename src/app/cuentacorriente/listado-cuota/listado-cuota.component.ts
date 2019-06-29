import { Component, OnInit } from '@angular/core';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Obligacion } from '../../_models/obligacion';

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
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    let id_sede = +localStorage.getItem('id_sede');
    this.planPagoService.sede(id_sede);
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
      this.planPagoService.cuotas(this.id).subscribe(response=>{
        this.dataSource = response;
      });
    });
  }

  volver(){
    this.router.navigate(['/cuentacorriente/'+this.id+'/ver']);
  }

}
