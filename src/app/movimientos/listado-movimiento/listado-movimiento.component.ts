import { Component, OnInit, ViewChild } from '@angular/core';
import { Movimiento, FormaPago, TipoMovimiento } from '../../_models/movimiento';
import { MovimientoService, FiltroMovimiento } from '../../_services/movimiento.service';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';

import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { MovimientoEditarModalComponent } from '../movimiento-editar-modal/movimiento-editar-modal.component';
import { SedeService } from '../../_services/sede.service';
import { TipoMovimientoService } from '../../_services/tipo_movimiento.service';

@Component({
  selector: 'app-listado-movimiento',
  templateUrl: './listado-movimiento.component.html',
  styleUrls: ['./listado-movimiento.component.scss']
})
export class ListadoMovimientoComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Movimiento[] = [];
  formas:FormaPago[]=[];
  tipos_movimientos:TipoMovimiento[]=[];

  total_cheque;
  total_efectivo;
  total_otros;
  total_tarjeta;

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
    private tipoMovimientoService:TipoMovimientoService,
    private sedeService:SedeService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit() {
    this.movimientoService.formas().subscribe(response=>{
      this.formas = response;
    });
    this.tipoMovimientoService.getAll().subscribe(response=>{
      this.tipos_movimientos = response;
      this.tipos_movimientos.forEach(item=>{
        if(item.id_tipo_egreso_ingreso == 1){//INGRESO
          item.nombre = item.nombre + ' (INGRESO)';
        } else { //EGRESO
          item.nombre = item.nombre + ' (EGRESO)';
        }
        return item;
      });
      let item = <TipoMovimiento>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.tipos_movimientos.push(item);
      this.tipos_movimientos = this.tipos_movimientos.reverse();

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
        this.movimientoService.ajax(that.request).subscribe((resp:any) => {
            that.dataSource = resp.items;
            that.total_cheque = resp.total_cheque;
            that.total_efectivo = resp.total_efectivo;
            that.total_otros = resp.total_otros;
            that.total_tarjeta = resp.total_tarjeta;
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
          width: '30px', 
        }, { 
          data: 'id_forma_pago',
          width: '15%', 
        }, { data: 'descripcion' },{ data: 'monto'},
        {
          data: 'actions',
          width: '15px',
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
