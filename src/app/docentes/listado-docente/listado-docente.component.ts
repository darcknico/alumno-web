import { Component, OnInit, ViewChild } from '@angular/core';
import { DocenteService, FiltroDocente } from '../../_services/docente.service';
import { DataTableDirective } from 'angular-datatables';
import { Docente } from '../../_models/usuario';
import { Sede } from '../../_models/sede';
import { SedeService } from '../../_services/sede.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TipoContrato } from '../../_models/tipo';
import { TipoService } from '../../_services/tipo.service';
import { CarreraService } from '../../_services/carrera.service';
import { Carrera } from '../../_models/carrera';
import { ReporteJobService } from '../../_services/reportejobs.service';
import { DialogConfirmComponent } from '../../_generic/dialog-confirm/dialog-confirm.component';
import { DialogInputComponent } from '../../_generic/dialog-input/dialog-input.component';
import * as moment from 'moment';
import { ReporteJob } from '../../_models/extra';
import { MesaExamenMateriaDocenteService, FiltroMesaExamenMateriaDocente } from '../../_services/mesa_examen_materia_docente.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SedeProvider } from '../../_providers/sede.provider';

@Component({
  selector: 'app-listado-docente',
  templateUrl: './listado-docente.component.html',
  styleUrls: ['./listado-docente.component.scss']
})
export class ListadoDocenteComponent implements OnInit {
  resource:string = 'docentes';
  @ViewChild(DataTableDirective,{static:false})dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  usuarios: Docente[] = [];
  sedes:Sede[]=[];
  tipos:TipoContrato[]=[];
  carreras:Carrera[]=[];

  request = <FiltroDocente>{
    search:"",
    id_sede:0,
    id_tipo_contrato:0,
    id_carrera:0,
    estado:null,
  };

  formulario:FormGroup;
  constructor(
    private usuarioService:DocenteService,
    private carreraService:CarreraService,
    private sedeService:SedeService,
    private sede:SedeProvider,
    private tipoService:TipoService,
    private reportesJobsService:ReporteJobService,
    private mesaExamenMateriaDocenteService:MesaExamenMateriaDocenteService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    ) {
      let hoy = moment();
      this.formulario = this.fb.group({
        fecha_inicial: [hoy.toDate(), Validators.required],
        fecha_final: [hoy.add(7,'day').toDate(), Validators.required],
      });
    }

  suscribe;
  ngOnInit() {
    this.request.id_sede = this.sede.getIdSede();
    this.sedeService.getAll().subscribe(response => {
      this.sedes = response;
    });
    this.tipoService.contratos().subscribe(response=>{
      this.tipos = response;
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
        this.suscribe = this.usuarioService.ajax(that.request).subscribe(resp => {
            that.usuarios = resp.items;

            callback({
              recordsTotal: resp.total_count,
              recordsFiltered: resp.total_count,
              data: []
            });
          });
      },
      columns: [
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
  }

  get f(){
    return this.formulario.controls;
  }

  nuevo(){
    this.router.navigate([this.resource,'nuevo']);
  }

  editar(item:Docente){
    this.router.navigate([this.resource,item.id_usuario,'editar']);
  }

  ver(item:Docente){
    this.router.navigate([this.resource,item.id_usuario,'ver']);
  }

  refrescar(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  continuar(){
    this.reportesJobsService.terminados().subscribe(response=>{
      let restantes = response.total_count;
      if(restantes>0){
        const modal = this.modalService.show(DialogConfirmComponent,{class: 'modal-danger' });
        (<DialogConfirmComponent>modal.content).onShow("ATENCION","Hay reportes en la cola que aun no terminan de generarse ¿Desea continuar de todas maneras?");
        (<DialogConfirmComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            this.acta_masivo_confirmar('modal-danger');
          }
        });
      } else {
        this.acta_masivo_confirmar();
      }
    });
    
  }

  private acta_masivo_confirmar(className:string='modal-info'){
    let nombre = moment().format('DD-MM-YYYY') + '_notificacion_docente_';
    const modal = this.modalService.show(DialogInputComponent,{class:className });
    (<DialogInputComponent>modal.content).onShow(
      "Notificacion de Mesas de Examen",
      "Esta por generar un archivo comprimido con todas las notificaciones enviadas a los docentes, esto puede llevar su tiempo. Puede fijarse en Consultas->Reportes para ver el estado actual del mismo. A continuacion ingrese el nombre por el cual sera identificado.",
      'text',
      nombre);
    (<DialogInputComponent>modal.content).onClose.subscribe(result => {
      if (result.length>0) {
        let registro = <ReporteJob>{};
        registro.nombre = result;
        let filtro = <FiltroMesaExamenMateriaDocente>{};
        filtro.fecha_inicial = moment(this.f.fecha_inicial.value).format('YYYY-MM-DD');
        filtro.fecha_final = moment(this.f.fecha_final.value).format('YYYY-MM-DD');
        this.mesaExamenMateriaDocenteService.reporte_docente_masivo(filtro,registro).subscribe(response=>{
          this.toastr.success('La generacion de reportes esta por comenzar', '');
        });
      }
    });
  }
}
