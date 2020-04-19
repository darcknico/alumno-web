import { Component, OnInit, ViewChild } from '@angular/core';
import { Inscripcion, TipoInscripcionEstado } from '../../_models/inscripcion';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { FiltroInscripcion, InscripcionService } from '../../_services/inscripcion.service';
import { DataTableDirective } from 'angular-datatables';
import { CarreraService } from '../../_services/carrera.service';
import { DepartamentoService } from '../../_services/departamento.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BecaService } from '../../_services/beca.service';
import { Beca } from '../../_models/beca';

import * as moment from 'moment';
import { SedeService } from '../../_services/sede.service';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';
import { TipoMateriaLectivo } from '../../_models/materia';
import { MateriaService } from '../../_services/materia.service';
import { SedeProvider } from '../../_providers/sede.provider';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: Inscripcion[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];
  becas:Beca[]=[];
  tipos_estado:TipoInscripcionEstado[]=[];
  consultando:boolean = false;
  tipos:TipoMateriaLectivo[]=[];

  request = <FiltroInscripcion>{
    search:"",
    id_departamento:0,
    id_tipo_inscripcion_estado:0,
    id_beca:0,
    id_carrera:0,
    anio_inicial:0,
    anio_final:0,
    id_periodo_lectivo:0,
    porcentaje_aprobados_inicial:0,
    porcentaje_aprobados_final:0,
  };

  constructor(
    private inscripcionService:InscripcionService,
    private sedeService:SedeProvider,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private becaService:BecaService,
    private materiaService:MateriaService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    let id_sede = this.sedeService.getIdSede();
    this.inscripcionService.sede(id_sede);
    this.departamentoService.getAll().subscribe(response => {
      this.departamentos = response;
    });
    this.inscripcionService.tipos_estado().subscribe(response=>{
      this.tipos_estado = response;
    });
    this.carreraService.getAll().subscribe(response => {
      this.carreras = response;
      let item = <Carrera>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.carreras.push(item);
      this.carreras = this.carreras.reverse();
    });
    this.becaService.getAll().subscribe(response => {
      this.becas = response;
      let item = <Beca>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.becas.push(item);
      this.becas = this.becas.reverse();
    });
    this.materiaService.tipos_lectivo().subscribe(response=>{
      this.tipos = response;
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
        this.inscripcionService.ajax(that.request).subscribe(resp => {
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
        }, { data: 'anio' },
        { data: 'id_alumno' },
        { data: 'id_carrera' },
        { data: 'beca_nombre' },
        { data: 'id_tipo_inscripcion_estado'},
        { data: 'porcentaje_aprobados'},
      ],
      responsive:true,
    };
  }

  ver(item:Inscripcion){
    this.router.navigate(['/academicos/inscripciones/'+item.id+'/ver']);
  }

  editar(item:Inscripcion){
    this.router.navigate(['/academicos/inscripciones/'+item.id+'/editar']);
  }

  fecha_inicio(event){
    if(event == null){
      this.request.fecha_inicial = "";
    } else {
      this.request.fecha_inicial = moment(event).format('YYYY-MM-DD');
    }
    this.refrescar();
  }

  fecha_fin(event){
    if(event == null){
      this.request.fecha_final = "";
    } else {
      this.request.fecha_final = moment(event).format('YYYY-MM-DD');
    }
    this.refrescar();
  }

  exportar(){
    this.consultando = true;
    AuxiliarFunction.descargar(this.toastr,this.inscripcionService.exportar(this.request)).then(()=>{
      this.consultando = false;
    });
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  comisiones(item:Inscripcion){
    this.router.navigate(['/academicos/inscripciones/'+item.id+'/comisiones']);
  }

  mesas_examenes(item:Inscripcion){
    this.router.navigate(['/academicos/inscripciones/'+item.id+'/mesas']);
  }

  notas(item:Inscripcion){
    this.router.navigate(['/academicos/inscripciones/'+item.id+'/notas']);
  }

}
