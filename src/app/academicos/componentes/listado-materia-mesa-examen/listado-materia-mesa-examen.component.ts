import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Materia } from '../../../_models/materia';
import { MesaExamenMateria } from '../../../_models/mesa.examen';
import { MesaExamenMateriaService, FiltroMesaExamenMateria } from '../../../_services/mesa_examen_materia.service';
import { DataTableDirective } from 'angular-datatables';
import { Subscription } from 'rxjs';
import * as moment from "moment";

@Component({
  selector: 'app-componente-listado-materia-mesa-examen',
  templateUrl: './listado-materia-mesa-examen.component.html',
  styleUrls: ['./listado-materia-mesa-examen.component.scss']
})
export class ListadoMateriaMesaExamenComponent implements OnInit {
  @Input('item') item:Materia=null;
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;

  dataSource:MesaExamenMateria[]=[];
  dtOptions: DataTables.Settings = {};
  request = <FiltroMesaExamenMateria>{
    search:"",
  };
  constructor(
    private service:MesaExamenMateriaService,
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
      searching:false,
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

  fecha_inicio(event){
    if(event == null){
      this.request.fecha_ini = "";
    } else {
      this.request.fecha_ini = moment(event).format('YYYY-MM-DD');
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

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
}
