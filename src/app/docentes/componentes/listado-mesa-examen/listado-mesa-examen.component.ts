import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Docente } from '../../../_models/usuario';
import { MesaExamenMateriaDocenteService, FiltroMesaExamenMateriaDocente } from '../../../_services/mesa_examen_materia_docente.service';
import { MesaExamenMateriaDocente } from '../../../_models/mesa.examen';
import { Subscription } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { AuxiliarFunction } from '../../../_helpers/auxiliar.function';
import { ToastrService } from 'ngx-toastr';
import { BlockUIService,BLOCKUI_DEFAULT } from 'ng-block-ui';

@Component({
  selector: 'app-componente-listado-mesa-examen',
  templateUrl: './listado-mesa-examen.component.html',
  styleUrls: ['./listado-mesa-examen.component.scss']
})
export class ListadoMesaExamenComponent implements OnInit {
  @Input('item') item:Docente=null;
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  consultando:boolean = false;

  dataSource:MesaExamenMateriaDocente[]=[];
  dtOptions: DataTables.Settings = {};
  request = <FiltroMesaExamenMateriaDocente>{
    search:"",
    fecha_inicial:"",
    fecha_final:"",
  };
  constructor(
    private service:MesaExamenMateriaDocenteService,
    private toastr: ToastrService,
    private block:BlockUIService,
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
      this.request.fecha_inicial = "";
    } else {
      this.request.fecha_inicial = moment(event).format('YYYY-MM-DD');
    }
    this.refrescar();
  }

  fecha_fin(event){
    if(event == null){
      this.request.fecha_final = "";
    } else {
      this.request.fecha_final = moment(event).format('YYYY-MM-DD');
    }
    this.refrescar();
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  descargar(){
    if(this.request.fecha_inicial.length == 0 || this.request.fecha_final.length == 0 ){
      this.toastr.warning('Debe seleccionar la fecha inicial y final para continuar.');
      return;
    }
    this.consultando = true;
    this.block.start(BLOCKUI_DEFAULT);
    AuxiliarFunction.descargar(this.toastr,this.service.reporte_docente(this.request)).then(()=>{
      this.consultando = false;
      this.block.stop(BLOCKUI_DEFAULT);
    });
  }
  imprimir(){
    if(this.request.fecha_inicial.length == 0 || this.request.fecha_final.length == 0 ){
      this.toastr.warning('Debe seleccionar la fecha inicial y final para continuar.');
      return;
    }
    this.consultando = true;
    this.block.start(BLOCKUI_DEFAULT);
    AuxiliarFunction.imprimir(this.toastr,this.service.reporte_docente(this.request)).then(()=>{
      this.consultando = false;
      this.block.stop(BLOCKUI_DEFAULT);
    });
  }

}
