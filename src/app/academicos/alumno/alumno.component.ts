import { Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { Alumno, TipoAlumnoEstado } from '../../_models/alumno';
import { Departamento } from '../../_models/departamento';
import { FiltroAlumno, AlumnoService } from '../../_services/alumno.service';
import { DepartamentoService } from '../../_services/departamento.service';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../_services/authentication.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Usuario } from '../../_models/usuario';

import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { ListadoAlumnoSedeModalComponent } from '../componentes/listado-alumno-sede-modal/listado-alumno-sede-modal.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { AlumnoVerModalComponent } from '../componentes/alumno-ver-modal/alumno-ver-modal.component';
import { SedeService } from '../../_services/sede.service';
import dtLanguage from '../../_constants/dtLanguage';
import { SedeProvider } from '../../_providers/sede.provider';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss']
})
export class AlumnoComponent implements OnInit {
  @ViewChild('alta', {read: DataTableDirective,static:false}) alta: DataTableDirective;
  @ViewChild('baja', {read: DataTableDirective,static:false}) baja: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtOptionsBaja: DataTables.Settings = {};
  dataSource: Alumno[] = [];
  dataSourceBaja: Alumno[] = [];
  departamentos:Departamento[]=[];
  tipos_estado:TipoAlumnoEstado[]=[];
  usuario:Usuario;

  request = <FiltroAlumno>{
    search:"",
    id_departamento:0,
    id_tipo_alumno_estado:0,
    id_carrera:0,
  };

  requestBaja = <FiltroAlumno>{
    search:"",
    estado:0,
  };

  id_sede:number;
  constructor(
    private alumnoService:AlumnoService,
    private authenticationService:AuthenticationService,
    private departamentoService:DepartamentoService,
    private sedeService:SedeProvider,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    
  }

  ajax:Subscription;
  ajaxBaja:Subscription;

  ngOnInit() {
    this.usuario = this.authenticationService.localUsuario();
    this.id_sede = this.sedeService.getIdSede();
    this.departamentoService.getAll().subscribe(response => {
      this.departamentos = response;
    });
    this.alumnoService.tipos_estado().subscribe(response=>{
      this.tipos_estado = response;
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
        if(that.ajax){
          that.ajax.unsubscribe();
        }
        that.request.start = dataTablesParameters.start;
        that.request.length = dataTablesParameters.length;
        that.request.order = dataTablesParameters.order[0].dir;
        that.request.search = dataTablesParameters.search.value;
        that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        that.ajax = this.alumnoService.ajax(that.request).subscribe(resp => {
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
        }, { data: 'nombre' }, { data: 'documento' },{ data: 'id_tipo_alumno_estado'},
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
    this.dtOptionsBaja = {
      order: [[ 0, "desc" ]],
      language: dtLanguage,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        if(that.ajaxBaja){
          that.ajaxBaja.unsubscribe();
        }
        that.requestBaja.start = dataTablesParameters.start;
        that.requestBaja.length = dataTablesParameters.length;
        that.requestBaja.order = dataTablesParameters.order[0].dir;
        that.requestBaja.search = dataTablesParameters.search.value;
        that.requestBaja.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        that.ajaxBaja = this.alumnoService.ajax(that.requestBaja).subscribe(resp => {
            that.dataSourceBaja = resp.items;

            callback({
              recordsTotal: resp.total_count,
              recordsFiltered: resp.total_count,
              data: []
            });
          });
      },
      columns: [
        { 
          data: 'deleted_at',
          width: '10%', 
        }, { data: 'nombre' }, { data: 'documento' },{ data: 'id_usuario_baja'},
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }

  nuevo(){
    this.router.navigate(['/academicos/alumnos/nuevo']);
  }

  editar(item:Alumno){
    this.router.navigate(['/academicos/alumnos/'+item.id+'/editar']);
  }

  eliminar(item:Alumno){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    let mensaje = "Esto eliminara las inscripciones, planes de pago, pagos y movimientos que se hayan generado a partir del alumno \""+item.apellido+" "+item.nombre+"\"";
    (<DialogConfirmComponent>modal.content).onShow("Eliminar alumno","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.alumnoService.delete(item.id).subscribe(response=>{
          this.toastr.success('Alumno eliminado', '');
          this.refrescar();
          this.refrescarBaja();
        });
      }
    });
  }

  recuperar(item:Alumno){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Recuperar alumno","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.alumnoService.delete(item.id).subscribe(response=>{
          this.toastr.success('Alumno recuperado', '');
          this.refrescar();
          this.refrescarBaja();
        });
      }
    });
  }

  ver(item:Alumno){
    this.router.navigate(['/academicos/alumnos/'+item.id+'/ver']);
  }

  inscribir(item:Alumno){
    this.router.navigate(['/academicos/inscripciones/nuevo'],{
      queryParams:{
        id_alumno:item.id,
      }
    });
  }

  exportar(){
    let aviso = this.toastr.warning('Preparando archivo de descarga','',{
      timeOut:15000,
    });
    this.alumnoService.exportar(this.request).subscribe(data => {
      this.toastr.remove(aviso.toastId);
      this.toastr.success('Descarga lista');
      saveAs(data,"alumnos-"+moment().format('DD.MM.YYYY')+".xlsx");
    });
  }

  refrescar(): void {
    this.alta.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
  refrescarBaja(){
    this.baja.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  alumno_sede(alumno:Alumno){
    const modal = this.modalService.show(ListadoAlumnoSedeModalComponent,{class: 'modal-info'});
    (<ListadoAlumnoSedeModalComponent>modal.content).onShow(alumno);
    (<ListadoAlumnoSedeModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        
      }
    });
  }

  alumno_ver(alumno:Alumno){
    const modal = this.modalService.show(AlumnoVerModalComponent,{class: 'modal-info modal-lg'});
    (<AlumnoVerModalComponent>modal.content).onShow(alumno);
    (<AlumnoVerModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.router.navigate(['/academicos/alumnos/'+alumno.id+'/ver']);
      }
    });
  }

  auditorias(){
    this.router.navigate(['alumnos','auditorias']);
  }
}
