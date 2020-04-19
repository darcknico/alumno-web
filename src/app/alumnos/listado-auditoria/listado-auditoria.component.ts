import { Component, OnInit } from '@angular/core';
import { Auditoria } from '../../_models/extra';
import { Alumno, AlumnoSede } from '../../_models/alumno';
import { FiltroAuditoria, AuditoriaService } from '../../_services/auditoria.service';
import { Router } from '@angular/router';
import { AlumnoSedeService, FiltroAlumnoSede } from '../../_services/alumno_sede.service';
import { SedeService } from '../../_services/sede.service';
import { SedeProvider } from '../../_providers/sede.provider';

@Component({
  selector: 'app-listado-auditoria',
  templateUrl: './listado-auditoria.component.html',
  styleUrls: ['./listado-auditoria.component.scss']
})
export class ListadoAuditoriaComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtOptionsSede: DataTables.Settings = {};
  dataSource: Auditoria<Alumno>[] = [];
  dataSourceSede: AlumnoSede[] = [];

  request = <FiltroAuditoria>{
    search:"",
  };

  requestSede = <FiltroAlumnoSede>{
    search:"",
    id_sede:0,
  };
  constructor(
    private service:AuditoriaService,
    private alumnoSedeService:AlumnoSedeService,
    private sedeService:SedeProvider,
    private router: Router,
  ) { }

  objectKeys = Object.keys;
  suscribe;
  ngOnInit() {
    this.requestSede.id_sede = this.sedeService.getIdSede();
    const that = this;

    this.dtOptions = {
      order:[[0,'desc']],
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
        this.suscribe = this.service.alumnos(that.request).subscribe(resp => {
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
        }, { data: 'event' }, { data: 'old_values' }, { data: 'new_values' }, { data: 'user' },
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };
    this.dtOptionsSede = {
      order:[[0,'desc']],
      language: {
        url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
      },
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      searching:false,
      ajax: (dataTablesParameters: any, callback) => {
        that.requestSede.start = dataTablesParameters.start;
        that.requestSede.length = dataTablesParameters.length;
        that.requestSede.order = dataTablesParameters.order[0].dir;
        that.requestSede.search = dataTablesParameters.search.value;
        that.requestSede.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.alumnoSedeService.ajax(that.requestSede).subscribe(resp => {
            that.dataSourceSede = resp.items;

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
        }, { data: 'id_sede' }, { data: 'id_alumno' }, { data: 'id_usuario' },
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };
  }

  gestionar(item:Alumno){
    this.router.navigate(['academicos','alumnos',item.id,'ver']);
  }
}
