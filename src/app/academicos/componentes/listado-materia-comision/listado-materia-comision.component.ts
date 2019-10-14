import { Component, OnInit, Input } from '@angular/core';
import { Materia } from '../../../_models/materia';
import { ComisionService, FiltroComision } from '../../../_services/comision.service';
import { Comision } from '../../../_models/comision';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-componente-listado-materia-comision',
  templateUrl: './listado-materia-comision.component.html',
  styleUrls: ['./listado-materia-comision.component.scss']
})
export class ListadoMateriaComisionComponent implements OnInit {
  @Input('item') item:Materia=null;

  dataSource:Comision[]=[];
  dtOptions: DataTables.Settings = {};
  request = <FiltroComision>{
    search:"",
  };
  constructor(
    private service:ComisionService,
  ) { }
  ajax:Subscription;

  ngOnInit() {
    this.request.id_materia = this.item.id;
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
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }


}
