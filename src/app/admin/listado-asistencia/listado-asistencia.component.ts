import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltroAppAsistencia, AppAsistenciaService } from '../../_services/app_asistencia.service';
import { AppAsistencia } from '../../_models/app';
import { SedeService } from '../../_services/sede.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-listado-asistencia',
  templateUrl: './listado-asistencia.component.html',
  styleUrls: ['./listado-asistencia.component.scss']
})
export class ListadoAsistenciaComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  
  dataSource:AppAsistencia[];
  request = <FiltroAppAsistencia>{
    search:"",
    id_sede:0,
  };
  constructor(
    private service:AppAsistenciaService,
    private sedeService:SedeService,
  ) { }

  suscribe;
  ngOnInit() {
    this.request.id_sede = this.sedeService.getIdSede();
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
          data: 'fecha',
          width: '5%', 
        }, { data: 'apellido' }
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
