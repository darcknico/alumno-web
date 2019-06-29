import { Component, OnInit, ViewChild } from '@angular/core';
import { ComisionAlumnoService, FiltroComisionAlumno } from '../../_services/comision_alumno.service';
import { Usuario } from '../../_models/usuario';
import { DataTableDirective } from 'angular-datatables';
import { ComisionAlumno } from '../../_models/comision';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { AuthenticationService } from '../../_services/authentication.service';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listado-alumno',
  templateUrl: './listado-alumno.component.html',
  styleUrls: ['./listado-alumno.component.scss']
})
export class ListadoAlumnoComponent implements OnInit {
  usuario:Usuario;
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: ComisionAlumno[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];

  request = <FiltroComisionAlumno>{
    search:"",
    id_departamento:0,
    id_materia:0,
    id_carrera:0,
    id_comision:0,
    anio:0,
  };

  constructor(
    private service:ComisionAlumnoService,
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
        this.service.ajax(that.request).subscribe(resp => {
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
        { data: 'id_comision' },
        { data: 'materia' },
        { data: 'anio' },
        { data: 'id_alumno' },
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };
  }


  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

}
