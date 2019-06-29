import { Component, OnInit, ViewChild } from '@angular/core';
import { Movimiento, FormaPago } from '../../_models/movimiento';
import { MovimientoService, FiltroMovimiento } from '../../_services/movimiento.service';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { MovimientoEditarModalComponent } from '../movimiento-editar-modal/movimiento-editar-modal.component';
import { SedeService } from '../../_services/sede.service';

@Component({
  selector: 'app-listado-movimiento',
  templateUrl: './listado-movimiento.component.html',
  styleUrls: ['./listado-movimiento.component.scss']
})
export class ListadoMovimientoComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Movimiento[] = [];
  formas:FormaPago[]=[];

  request = <FiltroMovimiento>{
    search:"",
    id_forma_pago:0,
    id_tipo_movimiento:0,
    id_tipo_comprobante:0,
    id_tipo_egreso_ingreso:-1,
    fecha_inicio:"",
    fecha_fin:"",
  };
  constructor(
    private movimientoService:MovimientoService,
    private sedeService:SedeService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit() {
    let id_sede = this.sedeService.getIdSede();
    this.movimientoService.sede(id_sede);
    this.movimientoService.formas().subscribe(response=>{
      this.formas = response;
    });
    const that = this;

    this.dtOptions = {
      order: [[ 0, "desc" ]],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.request.start = dataTablesParameters.start;
        that.request.length = dataTablesParameters.length;
        that.request.order = dataTablesParameters.order[0].dir;
        that.request.search = dataTablesParameters.search.value;
        that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.movimientoService.ajax(that.request).subscribe(resp => {
            that.dataSource = resp.items;

            callback({
              recordsTotal: resp.total_count,
              recordsFiltered: resp.total_count,
              data: []
            });
          });
      },
      columns: [
        { 
          data: 'fecha',
          width: '5%', 
        }, { 
          data: 'id_forma_pago',
          width: '15%', 
        }, { data: 'descripcion' },{ data: 'monto'},
        {
          data: 'actions',
          width: '5%',
        }
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }

  fecha_inicio(event){
    if(event == null){
      this.request.fecha_inicio = "";
    } else {
      this.request.fecha_inicio = moment(event).format('YYYY-MM-DD');
    }
    this.refrescar();
  }

  fecha_fin(event){
    if(event == null){
      this.request.fecha_fin = "";
    } else {
      this.request.fecha_fin = moment(event).format('YYYY-MM-DD');
    }
    this.refrescar();
  }

  agregar_ingreso(){
    this.router.navigate(['/movimientos/nuevo',{
        'id_tipo_egreso_ingreso':'1',
        }
    ]);
  }

  agregar_egreso(){
    this.router.navigate(['/movimientos/nuevo',{
        'id_tipo_egreso_ingreso':'0',
        }
    ]);
  }

  editar(item:Movimiento){
    const modal = this.modalService.show(MovimientoEditarModalComponent,{class: 'modal-info modal-lg'});
    (<MovimientoEditarModalComponent>modal.content).onShow(item);
    (<MovimientoEditarModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.refrescar();
      }
    });
  }

  eliminar(item:Movimiento){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar movimiento","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.movimientoService.delete(item.id).subscribe(response=>{
          this.toastr.success('Movimiento eliminado', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  exportar(){
    let aviso = this.toastr.warning('Preparando archivo de descarga.');
    this.movimientoService.exportar(this.request).subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista.');
      saveAs(data,"movimientos-"+moment().format('DD.MM.YYYY')+".xlsx");
    });
  }
}
