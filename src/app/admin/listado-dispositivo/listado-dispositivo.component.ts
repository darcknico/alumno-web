import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltroAppDispositivo, AppDispositivoService } from '../../_services/app_dispositivo.service';
import { UsuarioDispositivo } from '../../_models/app';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-listado-dispositivo',
  templateUrl: './listado-dispositivo.component.html',
  styleUrls: ['./listado-dispositivo.component.scss']
})
export class ListadoDispositivoComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  
  dataSource:UsuarioDispositivo[];
  request = <FiltroAppDispositivo>{
    search:"",
  };
  constructor(
    private service:AppDispositivoService,
  ) { }

  suscribe;
  ngOnInit() {
    const that = this;

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching:false,
      ajax: (dataTablesParameters: any, callback) => {
        if(this.suscribe){
          this.suscribe.unsubscribe();
          this.suscribe = null;
        }
        that.request.start = dataTablesParameters.start;
        that.request.length = dataTablesParameters.length;
        that.request.order = dataTablesParameters.order[0].dir;
        that.request.search = dataTablesParameters.search.value;
        that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.suscribe = this.service.ajax(that.request).subscribe(resp => {
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
          width: '5%', 
        },
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
}
