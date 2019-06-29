import { Component, OnInit, ViewChild } from '@angular/core';
import { ComisionService, FiltroComision } from '../../_services/comision.service';
import { Comision } from '../../_models/comision';
import { DataTableDirective } from 'angular-datatables';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { AuthenticationService } from '../../_services/authentication.service';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { Usuario } from '../../_models/usuario';
import { SedeService } from '../../_services/sede.service';

@Component({
  selector: 'app-listado-comision',
  templateUrl: './listado-comision.component.html',
  styleUrls: ['./listado-comision.component.scss']
})
export class ListadoComisionComponent implements OnInit {
  usuario:Usuario;
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Comision[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];

  request = <FiltroComision>{
    search:"",
    id_departamento:0,
    id_materia:0,
    id_carrera:0,
  };

  constructor(
    private comisionService:ComisionService,
    private sedeService:SedeService,
    private authenticationService:AuthenticationService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
  }

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
        this.comisionService.ajax(that.request).subscribe(resp => {
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

  nuevo(){
    this.router.navigate(['/comisiones/nuevo']);
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
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

}
