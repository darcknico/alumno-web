import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { PlanPago } from '../../_models/plan_pago';
import { Departamento } from '../../_models/departamento';
import { Carrera } from '../../_models/carrera';
import { Beca } from '../../_models/beca';
import { TipoMateriaLectivo } from '../../_models/materia';
import { TipoInscripcionEstado } from '../../_models/inscripcion';
import { FiltroPlanPago, PlanPagoService } from '../../_services/plan_pago.service';
import { SedeService } from '../../_services/sede.service';
import { DepartamentoService } from '../../_services/departamento.service';
import { CarreraService } from '../../_services/carrera.service';
import { MateriaService } from '../../_services/materia.service';
import { BecaService } from '../../_services/beca.service';
import { InscripcionService } from '../../_services/inscripcion.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuxiliarFunction } from '../../_helpers/auxiliar.function';
import * as moment from 'moment';

@Component({
  selector: 'app-listado-no-plan-pago',
  templateUrl: './listado-no-plan-pago.component.html',
  styleUrls: ['./listado-no-plan-pago.component.scss']
})
export class ListadoNoPlanPagoComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dataSource: PlanPago[] = [];
  departamentos:Departamento[]=[];
  carreras:Carrera[]=[];
  becas:Beca[]=[];
  tipos:TipoMateriaLectivo[]=[];
  tipos_estado: TipoInscripcionEstado[];
  consultando:boolean = false;

  request = <FiltroPlanPago>{
    search:"",
    id_departamento:0,
    id_carrera:0,
    id_beca:0,
    anio:null,
    id_tipo_inscripcion_estado:[1],
    sin_cobranzas:true,
    fecha_inicial:'',
    fecha_final:'',
  };
  fecha_inicial:Date;
  fecha_final:Date;
  constructor(
    private planPagoService:PlanPagoService,
    private sedeService:SedeService,
    private departamentoService:DepartamentoService,
    private carreraService:CarreraService,
    private materiaService:MateriaService,
    private becaService:BecaService,
    private inscripcionService:InscripcionService,
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
    this.inscripcionService.tipos_estado().subscribe(response=>{
      this.tipos_estado = response;
    });
    let fecha = moment();
    this.fecha_final = fecha.toDate();
    this.request.fecha_final = fecha.format('YYYY-MM-DD');
    this.request.anio = fecha.get('year');
    this.fecha_inicial = fecha.subtract('month',1).toDate();
    this.request.fecha_inicial = fecha.format('YYYY-MM-DD');
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

  fecha_inicio(event){
    if(event == null){
      this.request.fecha_inicial = "";
    } else {
      this.request.fecha_inicial = moment(event).format('YYYY-MM-DD');
      this.refrescar();
    }
  }

  fecha_fin(event){
    if(event == null){
      this.request.fecha_final = "";
    } else {
      this.request.fecha_final = moment(event).format('YYYY-MM-DD');
      this.refrescar();
    }
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
    this.consultando = true;
    AuxiliarFunction.descargar(this.toastr,this.planPagoService.exportar(this.request)).then(()=>{
      this.consultando = false;
    });
  }
}
