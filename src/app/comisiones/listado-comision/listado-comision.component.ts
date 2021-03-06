import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { ComisionService, FiltroComision } from '../../_services/comision.service';
import { Comision, ComisionDocente, ComisionAlumno } from '../../_models/comision';
import { DataTableDirective } from 'angular-datatables';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { AuthenticationService } from '../../_services/authentication.service';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Usuario } from '../../_models/usuario';
import { SedeService } from '../../_services/sede.service';
import { ListadoComisionDocenteModalComponent } from '../componente/listado-comision-docente-modal/listado-comision-docente-modal.component';
import { FiltroComisionDocente, ComisionDocenteService } from '../../_services/comision_docente.service';
import { ComisionAlumnoService, FiltroComisionAlumno } from '../../_services/comision_alumno.service';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs';
import dtLanguage from '../../_constants/dtLanguage';
import * as moment from "moment";
import { SedeProvider } from '../../_providers/sede.provider';

@Component({
  selector: 'app-listado-comision',
  templateUrl: './listado-comision.component.html',
  styleUrls: ['./listado-comision.component.scss']
})
export class ListadoComisionComponent implements OnInit {
  usuario:Usuario;
  @ViewChildren(DataTableDirective) dtElements: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtOptionsDocente: DataTables.Settings = {};
  dtOptionsAlumno: DataTables.Settings = {};
  dataSource: Comision[] = [];
  dataSourceDocente: ComisionDocente[]= [];
  dataSourceAlumno: ComisionAlumno[]= [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];
  anios:any[]=[];

  request = <FiltroComision>{
    search:"",
    id_departamento:0,
    id_materia:0,
    id_carrera:0,
  };

  requestDocente = <FiltroComisionDocente>{
    search:"",
  }
  requestAlumno = <FiltroComisionAlumno>{
    search:"",
  }

  //dtTrigger: Subject<any> = new Subject();
  constructor(
    private comisionService:ComisionService,
    private comisionDocenteService:ComisionDocenteService,
    private comisionAlumnoService:ComisionAlumnoService,
    private sedeService:SedeProvider,
    private authenticationService:AuthenticationService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    let hoy = moment();
    this.anios.push({
      'label':'TODOS',
      'value':0,
    })
    for (let index = 2018; index <= hoy.year()+1; index++) {
      this.anios.push({
        'label':index,
        'value':index,
      })
    }
    this.request.anio = hoy.year();
  }

  suscription:Subscription;
  ngOnInit() {
    this.usuario = this.authenticationService.localUsuario();
    let id_sede = this.sedeService.getIdSede();
    this.comisionService.sede(id_sede);
    this.departamentoService.getAll().subscribe(response => {
      this.departamentos = response;
    });
    this.carreraService.getAll().subscribe(response => {
      this.carreras = response;
      let item = <Carrera>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.carreras.push(item);
      this.carreras = this.carreras.reverse();
    });
    const that = this;

    this.dtOptions = {
      order: [[ 0, "desc" ]],
      language: dtLanguage,
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
        that.suscription = this.comisionService.ajax(that.request).subscribe(resp => {
          if(that.suscription){
            that.suscription.unsubscribe();
            that.suscription = null;
          }
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
          data: 'anio',
          width: '5%',
        },
        { data: 'id_carrera' },
        { data: 'id_materia' },
        { data: 'numero' },
        { data: 'alumnos_cantidad'},
      ],
      responsive:true,
    };
    this.dtOptionsDocente = {
      order: [[ 0, "desc" ]],
      language: dtLanguage,
      pagingType: 'full_numbers',
      lengthMenu: [5],
      pageLength: 5,
      serverSide: true,
      processing: true,
      searching:false,
      ajax: (dataTablesParameters: any, callback) => {
        that.requestDocente.start = dataTablesParameters.start;
        that.requestDocente.length = dataTablesParameters.length;
        that.requestDocente.order = dataTablesParameters.order[0].dir;
        that.requestDocente.search = dataTablesParameters.search.value;
        that.requestDocente.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.comisionDocenteService.ajax(that.requestDocente).subscribe(resp => {
            that.dataSourceDocente = resp.items;

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

    this.dtOptionsAlumno = {
      order: [[ 0, "desc" ]],
      language: dtLanguage,
      pagingType: 'full_numbers',
      lengthMenu: [5],
      pageLength: 5,
      serverSide: true,
      processing: true,
      searching:false,
      ajax: (dataTablesParameters: any, callback) => {
        that.requestAlumno.start = dataTablesParameters.start;
        that.requestAlumno.length = dataTablesParameters.length;
        that.requestAlumno.order = dataTablesParameters.order[0].dir;
        that.requestAlumno.search = dataTablesParameters.search.value;
        that.requestAlumno.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.comisionAlumnoService.ajax(that.requestAlumno).subscribe(resp => {
            that.dataSourceAlumno = resp.items;

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

  ver(item:Comision){
    this.router.navigate(['/comisiones/'+item.id+'/ver']);
  }

  asistencias(item:Comision){
    this.router.navigate(['/comisiones/'+item.id+'/asistencias']);
  }

  examenes(item:Comision){
    this.router.navigate(['/comisiones/'+item.id+'/examenes']);
  }

  docentes(item:Comision){
    const modal = this.modalService.show(ListadoComisionDocenteModalComponent,{class: 'modal-info'});
    (<ListadoComisionDocenteModalComponent>modal.content).onShow(item);
    (<ListadoComisionDocenteModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {

      }
    });
  }

  nuevo(){
    this.router.navigate(['/comisiones/nuevo']);
  }
  masivo(){
    this.toastr.warning('EN CONSTRUCCION', 'Ultima actualizacion 13/2/20');
    //this.router.navigate(['/comisiones/nuevo/masivo']);
  }

  editar(item:Comision){
    this.router.navigate(['/comisiones/'+item.id+'/editar']);
  }

  eliminar(item:Comision){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar comision","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.comisionService.delete(item.id).subscribe(response=>{
          this.toastr.success('Comision eliminada', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(): void {
    this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  exportar(){
    let aviso = this.toastr.warning('Preparando archivo de descarga','',{
      timeOut:15000,
    });
    this.comisionService.exportar(this.request).subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      saveAs(data,"alumnos-"+moment().format('DD.MM.YYYY')+".xlsx");
    });
  }

}
