import { Component, OnInit, ViewChild } from '@angular/core';
import { DocenteEstadoService, FiltroDocenteEstado } from '../../_services/docente_estado.service';
import { DocenteEstado } from '../../_models/usuario';
import { TipoDocenteEstado } from '../../_models/tipo';
import { DataTableDirective } from 'angular-datatables';
import { Sede } from '../../_models/sede';
import { DocenteMateriaService } from '../../_services/docente_materia.service';
import { SedeService } from '../../_services/sede.service';
import { SedeProvider } from '../../_providers/sede.provider';
import { TipoService } from '../../_services/tipo.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';

@Component({
  selector: 'app-listado-docente-estado',
  templateUrl: './listado-docente-estado.component.html',
  styleUrls: ['./listado-docente-estado.component.scss']
})
export class ListadoDocenteEstadoComponent implements OnInit {
  resource:string = 'docentes';
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: DocenteEstado[] = [];
  sedes:Sede[]=[];
  estados:TipoDocenteEstado[]=[];

  request = <FiltroDocenteEstado>{
    search:"",
    id_sede:0,
    id_tipo_docente_estado:0,
  };
  consultando:boolean=false;
  constructor(
    private service:DocenteEstadoService,
    private sedeService:SedeService,
    private sede:SedeProvider,
    private tipos:TipoService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  suscribe;
  ngOnInit() {
    this.request.id_sede = this.sede.getIdSede();
    this.sedeService.getAll().subscribe(response => {
      this.sedes = response;
    });

    const that = this;
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
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
        { 
          data: 'cuit',
          width: '5%', 
        }, { data: 'apellido' }, { data: 'id_tipo_docente_estado' },{ data: 'fecha_inicio'},{data:'fecha_inicial'}
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };

    this.tipos.docentes_estados().subscribe(response=>{
      this.estados = response;
      /*
      let cargo = <TipoDocenteEstado>{};
      cargo.id = 0;
      cargo.nombre = 'TODOS';
      this.estados.push(cargo);
      */
    });
  }


  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  archivo(item:DocenteEstado){
    AuxiliarFunction.descargar(this.toastr,this.service.archivo(item));
  }


}
