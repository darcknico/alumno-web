import { Component, OnInit, ViewChild } from '@angular/core';
import { Alumno, TipoAlumnoEstado } from '../../_models/alumno';
import { Departamento } from '../../_models/departamento';
import { FiltroAlumno, AlumnoService } from '../../_services/alumno.service';
import { DepartamentoService } from '../../_services/departamento.service';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../_services/authentication.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Usuario } from '../../_models/usuario';

import * as moment from 'moment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss']
})
export class AlumnoComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Alumno[] = [];
  departamentos:Departamento[]=[];
  tipos_estado:TipoAlumnoEstado[]=[];
  usuario:Usuario;

  request = <FiltroAlumno>{
    search:"",
    id_departamento:0,
    id_tipo_alumno_estado:0,
    id_carrera:0,
  };
  constructor(
    private alumnoService:AlumnoService,
    private authenticationService:AuthenticationService,
    private departamentoService:DepartamentoService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit() {
    this.usuario = this.authenticationService.localUsuario();
    this.departamentoService.getAll().subscribe(response => {
      this.departamentos = response;
    });
    this.alumnoService.tipos_estado().subscribe(response=>{
      this.tipos_estado = response;
    });
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
        that.request.start = dataTablesParameters.start;
        that.request.length = dataTablesParameters.length;
        that.request.order = dataTablesParameters.order[0].dir;
        that.request.search = dataTablesParameters.search.value;
        that.request.sort = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.alumnoService.ajax(that.request).subscribe(resp => {
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
  }

  nuevo(){
    this.router.navigate(['/academicos/alumnos/nuevo']);
  }

  editar(item:Alumno){
    this.router.navigate(['/academicos/alumnos/'+item.id+'/editar']);
  }

  eliminar(item:Alumno){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar alumno","Esto eliminara las inscripciones, planes de pago, pagos y movimientos que se hayan generado a partir del alumno \""+item.apellido+" "+item.nombre+"\"");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.alumnoService.delete(item.id).subscribe(response=>{
          this.toastr.success('Alumno eliminado', '');
          this.refrescar();
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
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
}
