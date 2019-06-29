import { Component, OnInit, ViewChild } from '@angular/core';
import { MesaExamenMateriaService, FiltroMesaExamenMateria } from '../../_services/mesa_examen_materia.service';
import { MesaExamenMateria } from '../../_models/mesa.examen';
import { DataTableDirective } from 'angular-datatables';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MateriaService } from '../../_services/materia.service';
import { Materia } from '../../_models/materia';
import { SedeService } from '../../_services/sede.service';

@Component({
  selector: 'app-listado-mesa-materia',
  templateUrl: './listado-mesa-materia.component.html',
  styleUrls: ['./listado-mesa-materia.component.scss']
})
export class ListadoMesaMateriaComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: MesaExamenMateria[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];
  materias:Materia[]=[];

  request = <FiltroMesaExamenMateria>{
    search:"",
    id_departamento:0,
    id_carrera:0,
  };

  constructor(
    private mesaExamenMateriaService:MesaExamenMateriaService,
    private sedeService:SedeService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private materiaService:MateriaService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
    
  }

  ngOnInit() {
    let id_sede = this.sedeService.getIdSede();
    this.mesaExamenMateriaService.sede(id_sede);
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
        this.mesaExamenMateriaService.ajax(that.request).subscribe(resp => {
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
        }, { data: 'id_materia' }, { data: 'id_carrera' },{ data: 'alumnos_cantidad' },{ data: 'fecha_check_out'},
      ],
      responsive:true,
    };
  }

  ver(item:MesaExamenMateria){
    this.router.navigate(['/mesas/materias/'+item.id+'/editar']);
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

}
