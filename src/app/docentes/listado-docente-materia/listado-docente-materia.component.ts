import { Component, OnInit, ViewChild } from '@angular/core';
import { DocenteMateriaService, FiltroDocenteMateria } from '../../_services/docente_materia.service';
import { DocenteMateria, Docente } from '../../_models/usuario';
import { Sede } from '../../_models/sede';
import { DataTableDirective } from 'angular-datatables';
import { SedeService } from '../../_services/sede.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DepartamentoService } from '../../_services/departamento.service';
import { Departamento } from '../../_models/departamento';
import { PlanEstudio } from '../../_models/plan_estudio';
import { Carrera } from '../../_models/carrera';
import { CarreraService } from '../../_services/carrera.service';
import { PlanService } from '../../_services/plan.service';
import { MateriaService } from '../../_services/materia.service';
import { Materia } from '../../_models/materia';

@Component({
  selector: 'app-listado-docente-materia',
  templateUrl: './listado-docente-materia.component.html',
  styleUrls: ['./listado-docente-materia.component.scss']
})
export class ListadoDocenteMateriaComponent implements OnInit {
  resource:string = 'docentes';
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: DocenteMateria[] = [];
  sedes:Sede[]=[];
  departamentos:Departamento[]=[];
  carreras:Carrera[] = [];
  planes_estudio:PlanEstudio[] = [];
  materias:Materia[] = [];

  request = <FiltroDocenteMateria>{
    search:"",
    id_sede:0,
    id_departamento:0,
    id_carrera:0,
    id_materia:0,
  };
  constructor(
    private service:DocenteMateriaService,
    private carreraService:CarreraService,
    private planService:PlanService,
    private sedeService:SedeService,
    private materiaService:MateriaService,
    private departamentoService:DepartamentoService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  suscribe;
  ngOnInit() {
    this.request.id_sede = this.sedeService.getIdSede();
    this.sedeService.getAll().subscribe(response => {
      this.sedes = response;
    });
    this.departamentoService.getAll().subscribe(response => {
      this.departamentos = response;
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
        }, { data: 'apellido' }, { data: 'titulo' },{ data: 'id_tipo_contrato'},
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
      responsive:true,
    };

    this.request.id_carrera = 0;
    let carrera = <Carrera>{};
    carrera.id = 0;
    carrera.nombre = 'TODOS';
    this.carreras.push(carrera);
    let materia = <Materia>{};
    materia.id = 0;
    materia.nombre = 'TODOS'
    this.materias.push(materia);
    this.carreraService.getAll().subscribe(response => {
      this.carreras = this.carreras.concat(response);
    });
  }

  docente(item:Docente){
    this.router.navigate([this.resource,item.id_usuario,'editar']);
  }

  seleccionar_carrera(carrera:Carrera){
    this.request.id_materia = 0;
    let materia = <Materia>{};
    materia.id = 0;
    materia.nombre = 'TODOS'
    this.materias = [materia];
    this.planService.carrera(carrera.id);
    this.planService.getAll().subscribe(response=>{
      this.planes_estudio = response;
    });
    if(carrera.id_plan_estudio){
      this.request.id_plan_estudio = carrera.id_plan_estudio;
      this.materiaService.planEstudio(carrera.id_plan_estudio).subscribe(response=>{
        this.materias = this.materias.concat(response);
      });
    } else {
      this.request.id_plan_estudio = null;
    }
    this.refrescar();
  }

  seleccionar_plan_estudio(plan:PlanEstudio){
    this.request.id_materia = 0;
    this.request.id_materia = 0;
    let materia = <Materia>{};
    materia.id = 0;
    materia.nombre = 'TODOS'
    this.materias = [materia];
    this.materiaService.planEstudio(plan.id).subscribe(response=>{
      this.materias = this.materias.concat(response);
    });
    this.refrescar();
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
}
