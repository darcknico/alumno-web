import { Component, OnInit } from '@angular/core';
import { Obligacion } from '../../_models/obligacion';
import { Pago } from '../../_models/pago';
import { PagoService } from '../../_services/pago.service';
import { PlanPagoService } from '../../_services/plan_pago.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-listado-matricula',
  templateUrl: './listado-matricula.component.html',
  styleUrls: ['./listado-matricula.component.scss']
})
export class ListadoMatriculaComponent implements OnInit {
  id:number;

  matricula:Obligacion;
  dataSource:Pago[];
  dtOptions: DataTables.Settings = {};
  modalService: any;
  toastr: any;
  onClose: any;
  bsModalRef: any;

  constructor(
    private pagoService:PagoService,
    private planPagoService:PlanPagoService,
    private route: ActivatedRoute,
    private router: Router,
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
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Pago","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.pagoService.delete(item.id).subscribe(response=>{
          this.toastr.success('Pago Eliminado', '');
        });
        this.refrescar();
      }
    });
  }

  refrescar(){
    this.planPagoService.pagos(this.id).subscribe(response=>{
      this.dataSource = response.filter(item=>item.id_tipo_pago == 10);
    });
    this.planPagoService.matricula(this.id).subscribe(response=>{
      this.matricula = response;
    })
  }

  volver(){
    this.router.navigate(['/cuentacorriente/'+this.id+'/ver']);
  }

  generar_pago_matricula(){
    this.router.navigate(['/cuentacorriente/'+this.id+'/pagos/matricula']);
  }

}
