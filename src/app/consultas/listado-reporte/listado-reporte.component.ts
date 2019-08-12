import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltroReporteJob, ReporteJobService } from '../../_services/reportejobs.service';
import { ReporteJob } from '../../_models/extra';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';

@Component({
  selector: 'app-listado-reporte',
  templateUrl: './listado-reporte.component.html',
  styleUrls: ['./listado-reporte.component.scss']
})
export class ListadoReporteComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: ReporteJob[] = [];

  request = <FiltroReporteJob>{
    search:"",
  };
  constructor(
    private service:ReporteJobService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit() {
    
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
        this.service.ajax(that.request).subscribe(resp => {
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
          data: 'created_at',
        }, 
        { data: 'nombre' }, 
        { data: 'cantidad' }, 
        { data: 'contador' },
        { data: 'terminado' },
      ],
      columnDefs: [ {
        targets: 'no-sort',
          orderable: false,
          width: '5%', 
        },
        {
          targets: 'option',
          width: '5%', 
        }
      ],
    };
  }


  eliminar(item:ReporteJob){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar reporte","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.service.delete(item.id).subscribe(response=>{
          this.toastr.success('Reporte Eliminado', '');
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

  descargar(item:ReporteJob){
    AuxiliarFunction.descargar(this.toastr,this.service.getById(item.id));
  }

}
