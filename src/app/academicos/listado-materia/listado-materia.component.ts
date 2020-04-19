import { Component, OnInit, ViewChild } from '@angular/core';
import { MateriaService, FiltroMateria } from '../../_services/materia.service';
import { DataTableDirective } from 'angular-datatables';
import { Materia, TipoMateriaRegimen, TipoMateriaLectivo } from '../../_models/materia';
import { Departamento } from '../../_models/departamento';
import { DepartamentoService } from '../../_services/departamento.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CarreraService } from '../../_services/carrera.service';
import { Carrera } from '../../_models/carrera';

@Component({
  selector: 'app-listado-materia',
  templateUrl: './listado-materia.component.html',
  styleUrls: ['./listado-materia.component.scss']
})
export class ListadoMateriaComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Materia[] = [];
  carreras:Carrera[]=[];
  tipos_regimen:TipoMateriaRegimen[]=[];
  tipos_lectivo:TipoMateriaLectivo[]=[];

  departamentos:Departamento[]=[];
  id_sede:number;
  request = <FiltroMateria>{
    search:"",
    id_departamento:0,
    id_carrera:0,
    id_tipo_materia_regimen:0,
    id_tipo_materia_lectivo:0,
  };

  constructor(
    private service:MateriaService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) {
  }

  ngOnInit() {
    this.departamentoService.getAll().subscribe(response=>{
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
    this.service.tipos_regimen().subscribe(response=>{
      this.tipos_regimen = response;
    });
    this.service.tipos_lectivo().subscribe(response=>{
      this.tipos_lectivo = response;
    });
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
          width:'7%',
          data: 'created_at' },
      ]
    };
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  ver(item:Materia){
    this.router.navigate(['academicos/materias',item.id,'ver'],{
      state:{
        item:item,
      },
    });
  }
}
