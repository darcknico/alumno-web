import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanPagoService, FiltroPlanPago } from '../../_services/plan_pago.service';
import { PlanPago } from '../../_models/plan_pago';
import { DataTableDirective } from 'angular-datatables';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';
import { SedeService } from '../../_services/sede.service';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';
import { MateriaService } from '../../_services/materia.service';
import { TipoMateriaLectivo } from '../../_models/materia';

@Component({
  selector: 'app-listado-plan-pago',
  templateUrl: './listado-plan-pago.component.html',
  styleUrls: ['./listado-plan-pago.component.scss']
})
export class ListadoPlanPagoComponent implements OnInit {
  @ViewChild(DataTableDirective)dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: PlanPago[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];
  tipos:TipoMateriaLectivo[]=[];

  request = <FiltroPlanPago>{
    search:"",
    id_departamento:0,
    id_carrera:0,
    deudores:0,
    id_tipo_materia_lectivo:0,
    anio:null,
  };
  constructor(
    private planPagoService:PlanPagoService,
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
    this.departamentoService.getAll().subscribe(response => {
      this.departamentos = response;
    });
    this.carreraService.getAll().subscribe(response=>{
      this.carreras = response;
      let item = <Carrera>{};
      item.id = 0;
      item.nombre = "TODOS";
      this.carreras.push(item);
      this.carreras = this.carreras.reverse();
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
        this.planPagoService.ajax(that.request).subscribe(resp => {
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
        }, { data: 'alumno' }, { data: 'carrera' },{ data: 'cuota_total'},{ data: 'pagado'},{ data: 'saldo_total'},{ data: 'saldo_hoy'},
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false,
        },
      ],
    };
  }

  ver(item:PlanPago){
    this.router.navigate(['/cuentacorriente/'+item.id+'/ver']);
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  exportar(){
    AuxiliarFunction.descargar(this.toastr,this.planPagoService.exportar(this.request));
  }

  exportar_alumnos(){
    if(this.request.id_carrera == 0 || this.request.id_tipo_materia_lectivo == 0 || this.request.anio == null){
      this.toastr.warning('Debe seleccionar la carrera, el periodo lectivo y año para continuar.');
      return;
    }
    AuxiliarFunction.descargar(this.toastr,this.planPagoService.exportar_alumnos(this.request));
  }
}
