import { Component, OnInit } from '@angular/core';
import { TipoMovimientoService } from '../../_services/tipo_movimiento.service';
import { TipoMovimiento } from '../../_models/movimiento';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { SedeService } from '../../_services/sede.service';
import { SedeProvider } from '../../_providers/sede.provider';

@Component({
  selector: 'app-listado-tipo-movimiento',
  templateUrl: './listado-tipo-movimiento.component.html',
  styleUrls: ['./listado-tipo-movimiento.component.scss']
})
export class ListadoTipoMovimientoComponent implements OnInit {
  
  dtOptions: DataTables.Settings = {};
  dataSource: TipoMovimiento[];

  constructor(
    private tipoMovimientoService:TipoMovimientoService,
    private sedeService:SedeProvider,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    let id_sede = this.sedeService.getIdSede();
    this.tipoMovimientoService.sede(id_sede);

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
    this.refrescar();
  }

  nuevo(){
    this.router.navigate(['/tipos_movimiento/nuevo']);
  }

  editar(item:TipoMovimiento){
    this.router.navigate(['/tipos_movimiento/'+item.id+'/editar']);
  }

  eliminar(item:TipoMovimiento){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar Tipo Movimiento","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.tipoMovimientoService.delete(item.id).subscribe(response=>{
          this.toastr.success('Tipo Movimiento Eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(){
    this.dataSource = null;
    this.tipoMovimientoService.getAll().subscribe(response=>{
      this.dataSource = response;
    });
  }

}
