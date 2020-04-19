import { Component, OnInit, ViewChild } from '@angular/core';
import { AsistenciaService, FiltroAsistencia } from '../../_services/asistencia.service';
import { DataTableDirective } from 'angular-datatables';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Asistencia } from '../../_models/asistencia';
import { SedeService } from '../../_services/sede.service';
import { SedeProvider } from '../../_providers/sede.provider';

@Component({
  selector: 'app-listado-asistencia',
  templateUrl: './listado-asistencia.component.html',
  styleUrls: ['./listado-asistencia.component.scss']
})
export class ListadoAsistenciaComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Asistencia[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];

  request = <FiltroAsistencia>{
    search:"",
    id_departamento:0,
    id_materia:0,
    id_carrera:0,
  };

  constructor(
    private asistenciaService:AsistenciaService,
    private sedeService:SedeProvider,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    let id_sede = this.sedeService.getIdSede();
    this.asistenciaService.sede(id_sede);
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
        this.asistenciaService.ajax(that.request).subscribe(resp => {
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
        }, 
        { data: 'id_carrera', orderable:false },
        { data: 'id_materia', orderable:false },
        { data: 'comsion_numero', orderable:false },
        { data: 'alumnos_cantidad', orderable:false},
      ],
      responsive:true,
    };
  }

  ver(item:Asistencia){
    this.router.navigate(['/asistencias/'+item.id+'/ver']);
  }

  comision(item:Asistencia){
    this.router.navigate(['/comisiones/'+item.id_comision+'/ver']);
  }

  eliminar(item:Asistencia){
    const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger'});
    (<DialogConfirmComponent>modal.content).onShow("Eliminar asistencia","");
    (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        this.asistenciaService.delete(item.id).subscribe(response=>{
          this.toastr.success('Asistencia eliminada', '');
          this.refrescar();
        });
      }
    });
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

}
