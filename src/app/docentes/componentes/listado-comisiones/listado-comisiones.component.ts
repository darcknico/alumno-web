import { Component, OnInit, Input } from '@angular/core';
import { Docente } from '../../../_models/usuario';
import { ComisionDocenteService, FiltroComisionDocente } from '../../../_services/comision_docente.service';
import { ComisionDocente } from '../../../_models/comision';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-componente-listado-comisiones',
  templateUrl: './listado-comisiones.component.html',
  styleUrls: ['./listado-comisiones.component.scss']
})
export class ListadoComisionesComponent implements OnInit {
  @Input('item') item:Docente=null;

  dataSource:ComisionDocente[]=[];
  dtOptions: DataTables.Settings = {};
  request = <FiltroComisionDocente>{
    search:"",
  };
  constructor(
    private service:ComisionDocenteService,
  ) { }
  ajax:Subscription;

  ngOnInit() {
    this.request.id_usuario = this.item.id_usuario;
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
        if(that.ajax){
          that.ajax.unsubscribe();
        }
        that.request.start = dataTablesParameters.start;
        that.request.length = dataTablesParameters.length;
        that.request.order = dataTablesParameters.order[0].dir;
        that.request.search = dataTablesParameters.search.value;
        that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        that.ajax = this.service.ajax(that.request).subscribe(resp => {
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
          width: '10%', 
        },
        {
          data: 'id_materia',
        },
        {
          data: 'anio',
        },
        {
          data: 'observaciones',
        },
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }

}
